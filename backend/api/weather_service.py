import os
import requests

GOOGLE_WEATHER_API_KEY = os.getenv("GOOGLE_WEATHER_API_KEY", "TA_CLE_API_GOOGLE_WEATHER")
FORECAST_HOURS_URL = "https://weather.googleapis.com/v1/forecast/hours:lookup"
 
# Nombre d'heures de prévision récupérées pour la décision d'irrigation
FORECAST_WINDOW_HOURS = 6
 
 
def get_weather_forecast(latitude, longitude):
    """
    Interroge forecast.hours et retourne un résumé exploitable :
 
        {
            'rain_probability_percent': int,    # probabilité max de pluie sur la fenêtre
            'rain_qpf_mm': float,                # cumul de pluie attendu (mm, liquid water equivalent)
            'avg_temperature_c': float | None,   # température moyenne prévue (°C)
        }
 
    Retourne None si l'appel échoue (réseau, clé invalide, quota...) :
    le module de prédiction doit alors se rabattre sur les seules
    données des capteurs (voir prediction.py, paramètre weather_forecast=None).
    """
    params = {
        "key": GOOGLE_WEATHER_API_KEY,
        "location.latitude": latitude,
        "location.longitude": longitude,
        "hours": FORECAST_WINDOW_HOURS,
        "pageSize": FORECAST_WINDOW_HOURS,
        "unitsSystem": "METRIC",
    }
 
    try:
        response = requests.get(FORECAST_HOURS_URL, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as error:
        print(f"weather_service: appel Google Weather API échoué ({error})")
        return None
 
    forecast_hours = data.get("forecastHours", [])
    if not forecast_hours:
        return None
 
    rain_probabilities = []
    rain_qpf_total = 0.0
    temperatures = []
 
    for hour in forecast_hours:
        precipitation = hour.get("precipitation", {})
        probability = precipitation.get("probability", {}).get("percent", 0)
        qpf = precipitation.get("qpf", {}).get("quantity", 0.0)
        temperature = hour.get("temperature", {}).get("degrees")
 
        rain_probabilities.append(probability)
        rain_qpf_total += qpf
        if temperature is not None:
            temperatures.append(temperature)
 
    return {
        "rain_probability_percent": max(rain_probabilities, default=0),
        "rain_qpf_mm": rain_qpf_total,
        "avg_temperature_c": (sum(temperatures) / len(temperatures)) if temperatures else None,
    }
 