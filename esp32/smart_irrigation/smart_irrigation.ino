#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT11.h>
#include <LiquidCrystal_I2C.h>

// =========================
// BROCHES DES CAPTEURS
// =========================
#define DHT11PIN 17
#define RAINWATERPIN 35
#define LIGHTPIN 34
#define WATERLEVELPIN 33
#define SOILHUMIDITYPIN 32

// =========================
// ACTIONNEURS
// =========================
#define RELAYPIN 25
#define BUZZERPIN 16

// =========================
// WIFI & CONFIGURATION API DJANGO
// =========================
const char* ssid = "JOYCE DE JESUS";
const char* pwd = "joyce de jesus";

// URL du serveur Django (IP du PC hôte)
const char* serverUrl = "http://172.20.10.10:8000/api/esp32/telemetry/";

// =========================
// OBJETS
// =========================
LiquidCrystal_I2C lcd(0x27, 16, 2);
WiFiServer server(80);
DHT11 dht11(DHT11PIN);

// =========================
// VARIABLES GLOBALES
// =========================
String request = "";

// Données capteurs
int Temperature = 0;
int Humidity = 0;
int SoilPct = 0;
int LightPct = 0;
int WaterPct = 0;
int RainPct = 0;

// État du système et contrôle
bool pumpState = false;
String wateringMode = "Auto"; // "Auto" ou "Manual" (synchronisé avec Django/App)
int soilHumidityThreshold = 30; // Seuil dynamique mis à jour par le backend

// =========================
// TIMERS SANS BLOCAGE (millis)
// =========================
unsigned long previousTelemetryMillis = 0;
const long telemetryInterval = 5000; // Envoi télémétrie HTTP toutes les 5s

unsigned long previousLcdMillis = 0;
const long lcdInterval = 3000; // Alternance pages LCD toutes les 3s
int lcdPage = 0;

unsigned long previousSerialMillis = 0;
const long serialInterval = 2000; // Affichage Moniteur Série toutes les 2s

// =========================
// PROTOTYPES
// =========================
int getPercentage(int data);
int getCapacitivePercentage(int data);
void getSensorsData();
void displaySensorsSerial();
void performTelemetryCycle();
void runAutomation();
void setPumpState(bool active);
void updateLCD();
void customTone(int pin, int frequency, int durationMs);


// =========================
// SETUP
// =========================
void setup() {
  Serial.begin(115200);

  Serial.println();
  Serial.println("=================================");
  Serial.println("       SMART IRRIGATION IoT");
  Serial.println("       DEMARRAGE ESP32 GATEWAY");
  Serial.println("=================================");

  // Configuration des broches d'actionneurs
  pinMode(RELAYPIN, OUTPUT);
  pinMode(BUZZERPIN, OUTPUT);
  digitalWrite(RELAYPIN, LOW);
  digitalWrite(BUZZERPIN, LOW);

  // Configuration des broches de capteurs
  pinMode(RAINWATERPIN, INPUT);
  pinMode(LIGHTPIN, INPUT);
  pinMode(SOILHUMIDITYPIN, INPUT);
  pinMode(WATERLEVELPIN, INPUT);

  // Initialisation Écran LCD
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Smart Farm Init");

  // Connexion Wi-Fi
  Serial.print("Connexion au WiFi : ");
  Serial.println(ssid);
  WiFi.begin(ssid, pwd);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✅ Connecté au WiFi avec succès.");
    Serial.print("Adresse IP ESP32 : ");
    Serial.println(WiFi.localIP());

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connecte!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
  } else {
    Serial.println("⚠️ Échec connexion WiFi. Mode autonome activé.");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Echec!");
    lcd.setCursor(0, 1);
    lcd.print("Mode Autonome");
  }

  delay(2000);

  // Démarrage du serveur socket local (Backup)
  server.begin();

  Serial.println("Serveur HTTP/API prêt.");
  Serial.println("Lecture des capteurs activée.");
  Serial.println("=================================");
}


// =========================
// LOOP PRINCIPALE
// =========================
void loop() {
  // 1. Reconnexion automatique au Wi-Fi si déconnecté
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, pwd);
  }

  // 2. Acquérir les données brutes des capteurs
  getSensorsData();

  // 3. Exécuter l'automatisation et règles de sécurité locales
  runAutomation();

  // 4. Mettre à jour l'affichage LCD
  updateLCD();

  // 5. Affichage périodique sur le Moniteur Série
  unsigned long currentMillis = millis();
  if (currentMillis - previousSerialMillis >= serialInterval) {
    previousSerialMillis = currentMillis;
    displaySensorsSerial();
  }

  // 6. Synchronisation HTTP REST périodique avec le Backend Django
  if (currentMillis - previousTelemetryMillis >= telemetryInterval) {
    previousTelemetryMillis = currentMillis;
    performTelemetryCycle();
  }

  // 7. Écoute client Socket / Web direct (Compatibilité)
  WiFiClient client = server.available();
  if (client) {
    Serial.println("Client local connecté via Socket");
    while (client.connected()) {
      getSensorsData();
      runAutomation();
      updateLCD();

      if (client.available()) {
        request = client.readStringUntil('s');
        if (request == "b") {
          // Commande bascule pompe
          setPumpState(!pumpState);
        } else if (request == "e") {
          // Commande Buzzer
          customTone(BUZZERPIN, 1000, 500);
        }
        request = "";
      }

      // Réponse Hexadécimale de compatibilité
      if (millis() - previousWifiMillis >= 2000) {
        previousWifiMillis = millis();
        char hexBuffer[30];
        snprintf(
          hexBuffer,
          sizeof(hexBuffer),
          "%02X%02X%02X%02X%02X%02X",
          Temperature,
          Humidity,
          SoilPct,
          LightPct,
          WaterPct,
          RainPct
        );
        client.print(String(hexBuffer));
      }
    }
  }
}


// =========================
// SYNCHRONISATION API DJANGO
// =========================
void performTelemetryCycle() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  // Construction du JSON conforme aux attentes de views.py (esp32_telemetry_upload)
  StaticJsonDocument<256> doc;
  doc["temperature"] = Temperature;
  doc["air_humidity"] = Humidity;
  doc["soil_humidity"] = SoilPct;
  doc["light_intensity"] = LightPct;
  doc["water_level"] = WaterPct;
  doc["rain_detected"] = (RainPct > 50); // Détection pluie si analogique > 50%
  doc["pump_active"] = pumpState;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.print("📡 Envoi télémétrie HTTP vers Django : ");
  Serial.println(jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("📩 Réponse Backend (");
    Serial.print(httpResponseCode);
    Serial.print("): ");
    Serial.println(response);

    // Parsing de la réponse du backend Django (Contient les instructions IA / Manuel)
    StaticJsonDocument<256> respDoc;
    DeserializationError error = deserializeJson(respDoc, response);

    if (!error) {
      String serverMode = respDoc["mode"];
      bool serverPumpState = respDoc["pump_active"];
      int serverThreshold = respDoc["soil_threshold"];

      if (serverMode.length() > 0) {
        wateringMode = serverMode;
      }
      if (serverThreshold > 0) {
        soilHumidityThreshold = serverThreshold;
      }

      // Appliquer l'état recommandé par l'IA ou la commande manuelle de l'agriculteur
      setPumpState(serverPumpState);
    }
  } else {
    Serial.print("❌ Erreur HTTP POST : ");
    Serial.println(httpResponseCode);
  }

  http.end();
}


// =========================
// CONTRÔLE POMPE & SÉCURITÉ
// =========================
void setPumpState(bool active) {
  // Sécurité absolue : Cuve vide (<= 10%), interdiction d'allumer la pompe
  if (active && WaterPct <= 10) {
    digitalWrite(RELAYPIN, LOW);
    pumpState = false;
    customTone(BUZZERPIN, 1500, 200); // Bip d'alerte cuve vide
    Serial.println("🚨 SÉCURITÉ : Niveau cuve critique (<=10%). Activation pompe refusée.");
    return;
  }

  pumpState = active;
  digitalWrite(RELAYPIN, pumpState ? HIGH : LOW);
}


// =========================
// AUTOMATISATION LOCALE
// =========================
void runAutomation() {
  // Sécurité permanente niveau d'eau
  if (WaterPct <= 10 && pumpState) {
    setPumpState(false);
    return;
  }

  // Si l'application mobile est en mode Manuel, l'ESP32 obéit aux ordres du serveur
  if (wateringMode == "Manual") {
    return;
  }

  // En mode Auto local (si serveur injoignable ou en secours)
  if (SoilPct < soilHumidityThreshold && RainPct <= 50) {
    setPumpState(true);
  } else if (SoilPct >= (soilHumidityThreshold + 15) || RainPct > 50) {
    setPumpState(false);
  }
}


// =========================
// AFFICHAGE LCD (16x2)
// =========================
void updateLCD() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousLcdMillis >= lcdInterval) {
    previousLcdMillis = currentMillis;
    lcdPage = (lcdPage + 1) % 3;

    lcd.clear();

    if (lcdPage == 0) {
      // Page 1: Climat Air
      lcd.setCursor(0, 0);
      lcd.print("Temp: ");
      lcd.print(Temperature);
      lcd.print(" C");

      lcd.setCursor(0, 1);
      lcd.print("Hum Air: ");
      lcd.print(Humidity);
      lcd.print(" %");
    } else if (lcdPage == 1) {
      // Page 2: Sol & Pompe
      lcd.setCursor(0, 0);
      lcd.print("Hum Sol: ");
      lcd.print(SoilPct);
      lcd.print(" %");

      lcd.setCursor(0, 1);
      lcd.print("Pompe: ");
      lcd.print(pumpState ? "ON " : "OFF");
      lcd.print(" ");
      lcd.print(wateringMode);
    } else {
      // Page 3: Niveau d'eau & Pluie
      lcd.setCursor(0, 0);
      lcd.print("Cuve: ");
      lcd.print(WaterPct);
      lcd.print(" %");

      lcd.setCursor(0, 1);
      lcd.print("Pluie: ");
      lcd.print(RainPct > 50 ? "OUI" : "NON");
    }
  }
}


// =========================
// LECTURE DES CAPTEURS
// =========================
void getSensorsData() {
  int val_temp = 0;
  int val_hum = 0;

  // Lecture DHT11
  if (dht11.readTemperatureHumidity(val_temp, val_hum) == 0) {
    Temperature = val_temp;
    Humidity = val_hum;
  }

  // Capteur de Pluie (analogique)
  RainPct = getPercentage(analogRead(RAINWATERPIN));

  // Capteur de Lumière (analogique)
  LightPct = getPercentage(analogRead(LIGHTPIN));

  // Capteur Niveau d'Eau (analogique)
  WaterPct = getPercentage(analogRead(WATERLEVELPIN));

  // Capteur Humidité du Sol (capacitif / analogique)
  SoilPct = getCapacitivePercentage(analogRead(SOILHUMIDITYPIN));
}


// =========================
// MONITEUR SÉRIE
// =========================
void displaySensorsSerial() {
  Serial.println();
  Serial.println("========== TÉLÉMÉTRIE ESP32 ==========");
  Serial.print("Température  : "); Serial.print(Temperature); Serial.println(" °C");
  Serial.print("Humidité air : "); Serial.print(Humidity); Serial.println(" %");
  Serial.print("Humidité sol : "); Serial.print(SoilPct); Serial.println(" %");
  Serial.print("Luminosité   : "); Serial.print(LightPct); Serial.println(" %");
  Serial.print("Niveau eau   : "); Serial.print(WaterPct); Serial.println(" %");
  Serial.print("Pluie        : "); Serial.print(RainPct > 50 ? "OUI" : "NON"); Serial.print(" ("); Serial.print(RainPct); Serial.println("%)");
  Serial.print("État Pompe   : "); Serial.println(pumpState ? "ON" : "OFF");
  Serial.print("Mode Arrosage: "); Serial.println(wateringMode);
  Serial.println("======================================");
}


// =========================
// UTILS: CONVERSIONS
// =========================
int getPercentage(int data) {
  int pct = (data / 4095.0) * 100;
  return constrain(pct, 0, 100);
}

int getCapacitivePercentage(int data) {
  const int VAL_AIR_SEC = 3150;
  const int VAL_DANS_EAU = 1200;

  int pct = map(data, VAL_AIR_SEC, VAL_DANS_EAU, 0, 100);
  return constrain(pct, 0, 100);
}


// =========================
// UTILS: BUZZER
// =========================
void customTone(int pin, int frequency, int durationMs) {
  long periodMicroseconds = 1000000 / frequency;
  long startTime = millis();

  while (millis() - startTime < durationMs) {
    digitalWrite(pin, HIGH);
    delayMicroseconds(periodMicroseconds / 2);
    digitalWrite(pin, LOW);
    delayMicroseconds(periodMicroseconds / 2);
  }
  digitalWrite(pin, LOW);
}
