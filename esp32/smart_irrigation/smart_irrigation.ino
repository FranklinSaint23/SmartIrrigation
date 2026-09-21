#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Wi-Fi Credentials
const char* ssid = "VOTRE_SSID_WIFI";
const char* password = "VOTRE_MOT_DE_PASSE_WIFI";

// Django server API endpoints configuration
// Replace with the IP address of your Django host computer
const char* serverUrl = "http://192.168.1.100:8000/api/esp32/telemetry/";

// Pin Mapping definition
const int RELAY_PUMP_PIN = 23;      // GPIO pin connected to the relay control
const int SOIL_MOISTURE_PIN = 34;   // Analog input pin for soil moisture probe
const int DHT_PIN = 22;             // Pin for Temperature & Air Humidity DHT22
const int RAIN_SENSOR_PIN = 35;     // Digital input pin for Rain sensor
const int LIGHT_SENSOR_PIN = 32;    // Analog input pin for photoresistor
const int TANK_TRIG_PIN = 5;        // Trig pin of ultrasonic level sensor
const int TANK_ECHO_PIN = 18;       // Echo pin of ultrasonic level sensor

// Global state variables
bool pumpActive = false;
String wateringMode = "Auto"; // "Auto" / "Manual"
int soilHumidityThreshold = 30; // Default threshold

unsigned long lastUploadTime = 0;
const unsigned long uploadInterval = 10000; // Poll and send telemetry every 10 seconds

void setup() {
  Serial.begin(115200);

  // Pin modes configuration
  pinMode(RELAY_PUMP_PIN, OUTPUT);
  digitalWrite(RELAY_PUMP_PIN, LOW); // Ensure pump is OFF on boot
  
  pinMode(RAIN_SENSOR_PIN, INPUT);
  pinMode(TANK_TRIG_PIN, OUTPUT);
  pinMode(TANK_ECHO_PIN, INPUT);

  // Initialize Wi-Fi connection
  connectToWiFi();
}

void loop() {
  // Auto reconnection if Wi-Fi drops
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  // Periodic Telemetry uploads
  if (millis() - lastUploadTime >= uploadInterval) {
    lastUploadTime = millis();
    performTelemetryCycle();
  }
}

void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 15) {
    delay(1000);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi Connected successfully.");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to Wi-Fi. Operating in local safety fallback mode.");
  }
}

// Read Ultrasonic sensor and calculate tank capacity %
float readWaterLevelPercent() {
  // Ultrasonic pulse trigger
  digitalWrite(TANK_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TANK_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TANK_TRIG_PIN, LOW);

  long duration = pulseIn(TANK_ECHO_PIN, HIGH, 30000); // 30ms timeout
  if (duration == 0) {
    // Return mock value if sensor not wired
    return random(40, 85);
  }
  
  float distanceCm = duration * 0.034 / 2;
  // Let's assume tank height is 100cm, where 10cm distance is 100% full, and 90cm is 0%
  float fullDistance = 10.0;
  float emptyDistance = 90.0;
  float levelPercent = ((emptyDistance - distanceCm) / (emptyDistance - fullDistance)) * 100.0;
  
  return constrain(levelPercent, 0.0, 100.0);
}

void performTelemetryCycle() {
  // 1. Read sensor pins (DHT22, Soil moisture, light photoresistor, rain sensor)
  // Check analog soil moisture percentage
  int soilAnalog = analogRead(SOIL_MOISTURE_PIN);
  float soilMoisture = map(soilAnalog, 4095, 1500, 0, 100);
  soilMoisture = constrain(soilMoisture, 0.0, 100.0);

  // Check rain sensor state (digital low usually means water detected)
  bool rainDetected = (digitalRead(RAIN_SENSOR_PIN) == LOW);
  
  // Read simulated/real DHT sensors
  float temperature = 25.0 + (analogRead(36) % 100) / 10.0; // Mock calculation based on noise pin
  float airHumidity = 50.0 + (analogRead(39) % 300) / 10.0;
  float lightIntensity = map(analogRead(LIGHT_SENSOR_PIN), 0, 4095, 0, 1000);
  float tankLevel = readWaterLevelPercent();

  // Overrides for standalone local tests if pins are floating
  if (soilAnalog == 0 || soilAnalog == 4095) {
    // Floating pin fallbacks
    soilMoisture = 32.0;
    temperature = 28.6;
    airHumidity = 65.0;
    lightIntensity = 720.0;
    rainDetected = false;
  }

  // 2. Local Failsafe Auto Logic Checks
  if (wateringMode == "Auto") {
    if (soilMoisture < soilHumidityThreshold && !rainDetected) {
      pumpActive = true;
    } else if (soilMoisture >= soilHumidityThreshold) {
      pumpActive = false;
    }
  }

  // Apply relay state
  digitalWrite(RELAY_PUMP_PIN, pumpActive ? HIGH : LOW);

  // 3. Serialize inputs as JSON
  StaticJsonDocument<256> doc;
  doc["temperature"] = temperature;
  doc["air_humidity"] = airHumidity;
  doc["soil_humidity"] = soilMoisture;
  doc["light_intensity"] = lightIntensity;
  doc["water_level"] = tankLevel;
  doc["rain_detected"] = rainDetected;
  doc["pump_active"] = pumpActive;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // 4. Send HTTP POST to Django API
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    Serial.print("Sending telemetry: ");
    Serial.println(jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("Server response (");
      Serial.print(httpResponseCode);
      Serial.print("): ");
      Serial.println(response);

      // Parse instructions returned by server view
      StaticJsonDocument<256> respDoc;
      DeserializationError error = deserializeJson(respDoc, response);

      if (!error) {
        String serverMode = respDoc["mode"];
        bool serverPumpState = respDoc["pump_active"];
        int serverThreshold = respDoc["soil_threshold"];

        wateringMode = serverMode;
        soilHumidityThreshold = serverThreshold;

        // Apply commands if in Manual mode
        if (wateringMode == "Manual") {
          pumpActive = serverPumpState;
          digitalWrite(RELAY_PUMP_PIN, pumpActive ? HIGH : LOW);
        }
      }
    } else {
      Serial.print("HTTP Error: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("Wi-Fi disconnected. Cannot sync telemetry.");
  }
}
