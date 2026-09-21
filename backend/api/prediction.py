from .models import TelemetryData
 
# Nombre de mesures récentes utilisées pour estimer la tendance des capteurs
WINDOW_SIZE = 10
 
# Horizon de prédiction (en minutes) : anticiper un passage sous le
# seuil dans les X prochaines minutes
PREDICTION_HORIZON_MINUTES = 30
 
# Si la probabilité de pluie prévue dépasse ce seuil, on n'arrose pas
RAIN_PROBABILITY_OVERRIDE_PERCENT = 60
 
# Si le cumul de pluie attendu (mm) dépasse ce seuil, on n'arrose pas non plus
RAIN_QPF_OVERRIDE_MM = 2.0
 
# Sensibilité du modèle à la température prévue : au-delà de 25°C,
# on suppose que l'évapotranspiration accélère l'assèchement du sol.
# Simplification volontaire pour un prototype de fin d'études — à
# affiner avec une vraie formule d'évapotranspiration (ex: FAO
# Penman-Monteith / Hargreaves) si le temps le permet.
TEMPERATURE_REFERENCE_C = 25.0
TEMPERATURE_SENSITIVITY = 0.05  # +5% de vitesse d'assèchement par °C au-dessus de la référence
 
 
def _linear_regression_slope(x_values, y_values):
    """
    Régression linéaire simple y = a*x + b (moindres carrés).
    Retourne (slope, intercept). Ne nécessite aucune dépendance.
    """
    n = len(x_values)
    if n < 2:
        return 0.0, (y_values[0] if y_values else 0.0)
 
    mean_x = sum(x_values) / n
    mean_y = sum(y_values) / n
 
    numerator = sum((x_values[i] - mean_x) * (y_values[i] - mean_y) for i in range(n))
    denominator = sum((x_values[i] - mean_x) ** 2 for i in range(n))
 
    if denominator == 0:
        return 0.0, mean_y
 
    slope = numerator / denominator
    intercept = mean_y - slope * mean_x
    return slope, intercept
 
 
def predict_irrigation_need(current_soil_humidity, threshold, rain_detected, weather_forecast=None):
    """
    Détermine s'il faut activer la pompe, en combinant la tendance
    des capteurs et, si disponible, la prévision météo.
 
    Args:
        current_soil_humidity: dernière valeur mesurée par le capteur (%)
        threshold: seuil critique configuré (ThresholdSetting)
        rain_detected: pluie détectée EN CE MOMENT par le capteur ESP32
        weather_forecast: résultat de weather_service.get_weather_forecast(),
            ou None si l'appel météo a échoué / n'a pas été fait
 
    Retourne :
        {
            'should_activate': bool,
            'reason': 'predictive' | 'reactive' | 'rain' | 'rain_forecast' | 'insufficient_data',
            'trend_per_minute': float,   # pente estimée (%/min), négative = sol qui s'assèche
            'minutes_until_threshold': float | None,
        }
    """
    # 1. La pluie détectée MAINTENANT prime sur tout le reste
    if rain_detected:
        return {
            'should_activate': False,
            'reason': 'rain',
            'trend_per_minute': 0.0,
            'minutes_until_threshold': None,
        }
 
    # 2. La pluie PRÉVUE prochainement (météo) évite un arrosage inutile
    if weather_forecast is not None:
        if (
            weather_forecast.get('rain_probability_percent', 0) >= RAIN_PROBABILITY_OVERRIDE_PERCENT
            or weather_forecast.get('rain_qpf_mm', 0.0) >= RAIN_QPF_OVERRIDE_MM
        ):
            return {
                'should_activate': False,
                'reason': 'rain_forecast',
                'trend_per_minute': 0.0,
                'minutes_until_threshold': None,
            }
 
    # 3. Tendance des capteurs (historique récent)
    history = list(TelemetryData.objects.order_by('-timestamp')[:WINDOW_SIZE])
    history.reverse()  # ordre chronologique croissant
 
    if len(history) < 3:
        # Pas assez d'historique : comportement réactif de secours
        return {
            'should_activate': current_soil_humidity < threshold,
            'reason': 'insufficient_data',
            'trend_per_minute': 0.0,
            'minutes_until_threshold': None,
        }
 
    t0 = history[0].timestamp
    x_values = [(r.timestamp - t0).total_seconds() / 60.0 for r in history]
    y_values = [float(r.soil_humidity) for r in history]
 
    slope, _ = _linear_regression_slope(x_values, y_values)
 
    # Tendance stable ou en hausse : pas besoin d'anticiper
    if slope >= 0:
        return {
            'should_activate': current_soil_humidity < threshold,
            'reason': 'reactive',
            'trend_per_minute': slope,
            'minutes_until_threshold': None,
        }
 
    # 4. Ajustement de la tendance par la température prévue (évapotranspiration simplifiée)
    effective_slope = slope
    avg_temperature_c = weather_forecast.get('avg_temperature_c') if weather_forecast else None
    if avg_temperature_c is not None and avg_temperature_c > TEMPERATURE_REFERENCE_C:
        acceleration_factor = 1 + (avg_temperature_c - TEMPERATURE_REFERENCE_C) * TEMPERATURE_SENSITIVITY
        effective_slope = slope * acceleration_factor
 
    # 5. Projection : dans combien de minutes le seuil sera-t-il atteint ?
    minutes_until_threshold = (threshold - current_soil_humidity) / effective_slope
    will_breach_soon = 0 <= minutes_until_threshold <= PREDICTION_HORIZON_MINUTES
 
    return {
        'should_activate': will_breach_soon or current_soil_humidity < threshold,
        'reason': 'predictive' if will_breach_soon else 'reactive',
        'trend_per_minute': effective_slope,
        'minutes_until_threshold': max(minutes_until_threshold, 0),
    }
 