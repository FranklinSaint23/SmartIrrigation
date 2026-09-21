from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random
 
from .models import (
    FarmerProfile, TechnicianProfile, ESP32Device, BreakdownReport, 
    TelemetryData, ThresholdSetting, PumpControlState, SystemAlert
)
from .serializers import (
    UserSerializer, RegisterSerializer, TelemetryDataSerializer, 
    ThresholdSettingSerializer, PumpControlStateSerializer, SystemAlertSerializer,
    TechnicianProfileSerializer, ESP32DeviceSerializer, BreakdownReportSerializer
)
from .prediction import predict_irrigation_need
from .weather_service import get_weather_forecast
 
# Coordonnées de la ferme utilisées pour interroger la météo.
# Simplification pour un système à une seule ferme/exploitation.
# Pour plusieurs fermes, ajoute latitude/longitude sur ESP32Device
# et récupère-les depuis le device concerné au lieu de cette constante.
FARM_LATITUDE = 3.8480
FARM_LONGITUDE = 11.5021
 
 
# Fonction utilitaire pour récupérer le rôle de manière sécurisée sans faire planter l'API
def get_user_role(user):
    if user.is_superuser:
        return 'Administrateur'
    profile = getattr(user, 'profile', None) or getattr(user, 'farmerprofile', None)
    if profile:
        return getattr(profile, 'role', 'Agriculteur')
    return 'Agriculteur'
 
 
# --- AUTHENTICATION ---
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data})
    return Response({'error': 'Identifiants de connexion invalides'}, status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    if hasattr(request.user, 'auth_token'):
        request.user.auth_token.delete()
    return Response({'success': 'Déconnecté avec succès'}, status=status.HTTP_200_OK)
 
 
# --- DASHBOARD & TELEMETRY ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_latest_telemetry(request):
    control, _ = PumpControlState.objects.get_or_create(pk=1)
    setting, _ = ThresholdSetting.objects.get_or_create(pk=1)
 
    latest = TelemetryData.objects.order_by('-timestamp').first()
    if not latest:
        latest = TelemetryData.objects.create(
            temperature=28.60,
            air_humidity=65.00,
            soil_humidity=32.00,
            light_intensity=720.00,
            water_level=68.00,
            rain_detected=False,
            pump_active=control.pump_active
        )
    
    latest.pump_active = control.pump_active
    latest.save()
 
    # Prédiction affichée au tableau de bord (à titre informatif pour l'agriculteur)
    weather_forecast = get_weather_forecast(FARM_LATITUDE, FARM_LONGITUDE)
    prediction = predict_irrigation_need(
        current_soil_humidity=float(latest.soil_humidity),
        threshold=setting.soil_humidity_threshold,
        rain_detected=latest.rain_detected,
        weather_forecast=weather_forecast,
    )
 
    return Response({
        'temperature': latest.temperature,
        'air_humidity': latest.air_humidity,
        'soil_humidity': latest.soil_humidity,
        'light_intensity': latest.light_intensity,
        'water_level': latest.water_level,
        'rain_detected': latest.rain_detected,
        'pump_active': control.pump_active,
        'mode': control.mode,
        'timestamp': latest.timestamp,
        'prediction': {
            'trend_per_minute': prediction['trend_per_minute'],
            'minutes_until_threshold': prediction['minutes_until_threshold'],
            'reason': prediction['reason'],
        },
        'weather': weather_forecast,  # None si l'appel météo a échoué
    })
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_historical_telemetry(request):
    period = request.query_params.get('filter', 'week')
    now = timezone.now()
    
    if period == 'day':
        cutoff = now - timedelta(days=1)
        data = TelemetryData.objects.filter(timestamp__gte=cutoff).order_by('timestamp')[:12]
    elif period == 'month':
        cutoff = now - timedelta(days=30)
        data = TelemetryData.objects.filter(timestamp__gte=cutoff).order_by('timestamp')[:15]
    else:
        cutoff = now - timedelta(days=7)
        data = TelemetryData.objects.filter(timestamp__gte=cutoff).order_by('timestamp')[:7]
 
    serializer = TelemetryDataSerializer(data, many=True)
    return Response(serializer.data)
 
 
# --- THRESHOLDS SETTINGS ---
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def manage_settings(request):
    setting, _ = ThresholdSetting.objects.get_or_create(pk=1)
    
    if request.method == 'GET':
        serializer = ThresholdSettingSerializer(setting)
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        serializer = ThresholdSettingSerializer(setting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
# --- PUMP CONTROL ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_pump_control(request):
    control, _ = PumpControlState.objects.get_or_create(pk=1)
    
    pump_active = request.data.get('pump_active')
    mode = request.data.get('mode')
    
    if pump_active is not None:
        control.pump_active = bool(pump_active)
        SystemAlert.objects.create(
            title="Pompe activée" if control.pump_active else "Pompe arrêtée",
            message="L'irrigation a été démarrée manuellement." if control.pump_active else "L'irrigation a été arrêtée manuellement.",
            type="success" if control.pump_active else "info"
        )
 
    if mode is not None:
        control.mode = mode
        
    control.save()
    return Response({
        'pump_active': control.pump_active,
        'mode': control.mode
    })
 
 
# --- ALERTS & NOTIFICATIONS ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_alerts(request):
    alerts = SystemAlert.objects.all().order_by('-timestamp')[:15]
    
    if not alerts.exists():
        SystemAlert.objects.create(
            title="Sol trop sec",
            message="L'humidité du sol est descendue en dessous du seuil (20%).",
            type="warning"
        )
        SystemAlert.objects.create(
            title="Pluie détectée",
            message="Pluie détectée ! L'arrosage automatique est suspendu.",
            type="info"
        )
        alerts = SystemAlert.objects.all().order_by('-timestamp')[:15]
 
    serializer = SystemAlertSerializer(alerts, many=True)
    return Response(serializer.data)
 
 
# --- ESP32 GATEWAY LINK ---
@api_view(['POST'])
@permission_classes([AllowAny])
def esp32_telemetry_upload(request):
    temperature = request.data.get('temperature', 25.0)
    air_humidity = request.data.get('air_humidity', 60.0)
    soil_humidity = request.data.get('soil_humidity', 30.0)
    light_intensity = request.data.get('light_intensity', 500.0)
    water_level = request.data.get('water_level', 50.0)
    rain_detected = request.data.get('rain_detected', False)
    hardware_pump_state = request.data.get('pump_active', False)
 
    TelemetryData.objects.create(
        temperature=temperature,
        air_humidity=air_humidity,
        soil_humidity=soil_humidity,
        light_intensity=light_intensity,
        water_level=water_level,
        rain_detected=rain_detected,
        pump_active=hardware_pump_state
    )
 
    control, _ = PumpControlState.objects.get_or_create(pk=1)
    setting, _ = ThresholdSetting.objects.get_or_create(pk=1)
 
    if control.mode == 'Auto':
        # La météo est optionnelle : si l'appel échoue (réseau, quota,
        # clé absente), get_weather_forecast renvoie None et
        # predict_irrigation_need se rabat sur les seuls capteurs.
        weather_forecast = get_weather_forecast(FARM_LATITUDE, FARM_LONGITUDE)
 
        prediction = predict_irrigation_need(
            current_soil_humidity=float(soil_humidity),
            threshold=setting.soil_humidity_threshold,
            rain_detected=rain_detected,
            weather_forecast=weather_forecast,
        )
 
        if prediction['should_activate'] and not control.pump_active:
            control.pump_active = True
            control.save()
 
            if prediction['reason'] == 'predictive':
                SystemAlert.objects.create(
                    title="Irrigation anticipée",
                    message=(
                        f"Le sol devrait passer sous le seuil dans "
                        f"~{prediction['minutes_until_threshold']:.0f} min "
                        f"(tendance capteurs + météo). Pompe activée par anticipation."
                    ),
                    type="info",
                )
            else:
                SystemAlert.objects.create(
                    title="Pompe activée (Auto)",
                    message=f"Humidité du sol ({soil_humidity}%) basse. Irrigation déclenchée.",
                    type="success",
                )
 
        elif not prediction['should_activate'] and control.pump_active:
            control.pump_active = False
            control.save()
 
            if prediction['reason'] == 'rain_forecast':
                message = "Pluie prévue prochainement : arrosage suspendu par anticipation."
            else:
                message = f"Humidité cible atteinte ({soil_humidity}%). Pompe coupée."
 
            SystemAlert.objects.create(
                title="Pompe arrêtée (Auto)",
                message=message,
                type="info",
            )
 
    return Response({
        'pump_active': control.pump_active,
        'mode': control.mode,
        'soil_threshold': setting.soil_humidity_threshold
    })
 
 
# --- ESTIMATION DES BESOINS EN EAU (tendance capteurs + météo) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tinyml_predict_needs(request):
    """
    Estime le besoin en eau des cultures à partir de la tendance
    récente des capteurs (régression sur l'historique TelemetryData)
    combinée aux prévisions météo (Google Weather API).
 
    Remplace l'ancienne version qui comparait juste
    `humidity < threshold` sans tenir compte ni de la tendance,
    ni de la météo à venir — ce n'était pas une prédiction.
    """
    latest = TelemetryData.objects.order_by('-timestamp').first()
    setting, _ = ThresholdSetting.objects.get_or_create(pk=1)
 
    if not latest:
        return Response({'need': 'Moyen', 'recommendation': 'En attente de relevés capteurs.'})
 
    weather_forecast = get_weather_forecast(FARM_LATITUDE, FARM_LONGITUDE)
    prediction = predict_irrigation_need(
        current_soil_humidity=float(latest.soil_humidity),
        threshold=setting.soil_humidity_threshold,
        rain_detected=latest.rain_detected,
        weather_forecast=weather_forecast,
    )
 
    if prediction['reason'] in ('rain', 'rain_forecast'):
        need = 'Faible'
        recommendation = "Pluie détectée ou prévue prochainement : aucun arrosage nécessaire."
    elif prediction['reason'] == 'predictive':
        need = 'Élevé'
        minutes = prediction['minutes_until_threshold']
        recommendation = (
            f"Le sol devrait s'assécher sous le seuil dans ~{minutes:.0f} min "
            f"au rythme actuel. Irrigation anticipée recommandée."
        )
    elif prediction['should_activate']:
        need = 'Élevé'
        recommendation = "Seuil d'humidité déjà atteint. Déclencher l'irrigation immédiatement."
    else:
        need = 'Faible'
        recommendation = "Humidité satisfaisante, aucune tendance à la baisse préoccupante détectée."
 
    return Response({
        'need': need,
        'recommendation': recommendation,
        'soil_humidity': float(latest.soil_humidity),
        'threshold': setting.soil_humidity_threshold,
        'trend_per_minute': prediction['trend_per_minute'],
        'minutes_until_threshold': prediction['minutes_until_threshold'],
        'reason': prediction['reason'],
    })
 
 
# --- ADMINISTRATOR: FARMERS, TECHNICIANS, DEVICES & STATS ---
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_farmers_list(request):
    if get_user_role(request.user) != 'Administrateur':
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    farmers = User.objects.filter(farmerprofile__role='Agriculteur')
    serializer = UserSerializer(farmers, many=True)
    return Response(serializer.data)
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_farmer_detail(request, pk):
    if get_user_role(request.user) != 'Administrateur':
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    try:
        farmer = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'Agriculteur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(farmer)
    return Response(serializer.data)
 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_technicians_list_create(request):
    if get_user_role(request.user) != 'Administrateur':
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method == 'GET':
        techs = TechnicianProfile.objects.all()
        serializer = TechnicianProfileSerializer(techs, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        email = request.data.get('email')
        phone = request.data.get('phone_number')
        name = request.data.get('name')
        city = request.data.get('city')
        specialty = request.data.get('specialty')
        password = request.data.get('password')
        
        if not email or not password or not name:
            return Response({'error': 'Informations manquantes'}, status=status.HTTP_400_BAD_REQUEST)
            
        if User.objects.filter(username=email).exists():
            return Response({'error': 'Un utilisateur avec cet email existe déjà'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=name,
            password=password
        )
        profile, _ = FarmerProfile.objects.get_or_create(user=user)
        profile.role = 'Technicien'
        profile.phone_number = phone
        profile.save()
        
        tech_profile = TechnicianProfile.objects.create(
            user=user,
            phone_number=phone,
            city=city,
            specialty=specialty,
            status='Disponible'
        )
        
        return Response(TechnicianProfileSerializer(tech_profile).data, status=status.HTTP_201_CREATED)
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_devices_list(request):
    if get_user_role(request.user) != 'Administrateur':
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    
    if not ESP32Device.objects.exists():
        farmer = User.objects.first()
        if farmer:
            ESP32Device.objects.create(
                name="ESP32-IRR-01",
                device_id="ESP32_DEV_A1",
                ip_address="192.168.1.150",
                farmer=farmer,
                farm_name="Ferme Principale",
                is_online=True,
                wifi_signal="Bon"
            )
            
    devices = ESP32Device.objects.all()
    serializer = ESP32DeviceSerializer(devices, many=True)
    return Response(serializer.data)
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_statistics(request):
    if get_user_role(request.user) != 'Administrateur':
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
    num_farmers = User.objects.count()
    num_techs = TechnicianProfile.objects.count()
    num_devices = ESP32Device.objects.count()
    num_pannes_attente = BreakdownReport.objects.filter(status='En attente').count()
    num_pannes_cours = BreakdownReport.objects.filter(status='En cours').count()
    num_pannes_resolues = BreakdownReport.objects.filter(status='Résolue').count()
    
    return Response({
        'num_farmers': num_farmers,
        'num_techs': num_techs,
        'num_devices': num_devices,
        'num_pannes_attente': num_pannes_attente,
        'num_pannes_cours': num_pannes_cours,
        'num_pannes_resolues': num_pannes_resolues,
        'avg_resolution_time': "2.4 heures",
        'water_consumption': "1420 L"
    })
 
 
# --- BREAKDOWN REPORTS & INTERVENTIONS ---
 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def interventions_list_create(request):
    role = get_user_role(request.user)
    
    if request.method == 'GET':
        if role == 'Administrateur':
            reports = BreakdownReport.objects.all().order_by('-created_at')
        elif role == 'Technicien':
            reports = BreakdownReport.objects.filter(technician=request.user).order_by('-created_at')
        else:
            reports = BreakdownReport.objects.filter(farmer=request.user).order_by('-created_at')
            
        serializer = BreakdownReportSerializer(reports, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        breakdown_type = request.data.get('breakdown_type')
        description = request.data.get('description')
        photo_url = request.data.get('photo_url')
        
        if not breakdown_type or not description:
            return Response({'error': 'Informations manquantes'}, status=status.HTTP_400_BAD_REQUEST)
            
        report = BreakdownReport.objects.create(
            farmer=request.user,
            breakdown_type=breakdown_type,
            description=description,
            photo_url=photo_url,
            status='En attente'
        )
        
        SystemAlert.objects.create(
            title="Nouvelle panne signalée",
            message=f"L'agriculteur {request.user.first_name or request.user.username} a signalé un problème : {breakdown_type}.",
            type="warning"
        )
        
        return Response(BreakdownReportSerializer(report).data, status=status.HTTP_201_CREATED)
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def intervention_detail(request, pk):
    try:
        report = BreakdownReport.objects.get(pk=pk)
    except BreakdownReport.DoesNotExist:
        return Response({'error': 'Signalement introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
    role = get_user_role(request.user)
    if role == 'Agriculteur' and report.farmer != request.user:
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    if role == 'Technicien' and report.technician != request.user:
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
    serializer = BreakdownReportSerializer(report)
    return Response(serializer.data)
 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_technician(request, pk):
    if get_user_role(request.user) != 'Administrateur':
        return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
    try:
        report = BreakdownReport.objects.get(pk=pk)
    except BreakdownReport.DoesNotExist:
        return Response({'error': 'Signalement introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
    tech_id = request.data.get('technician_id')
    if not tech_id:
        return Response({'error': 'ID du technicien manquant'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        tech_user = User.objects.get(pk=tech_id)
    except User.DoesNotExist:
        return Response({'error': 'Technicien introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
    report.technician = tech_user
    report.status = 'En cours'
    report.save()
    
    tech_profile = getattr(tech_user, 'technicianprofile', None)
    if tech_profile:
        tech_profile.status = 'Occupé'
        tech_profile.save()
        
    SystemAlert.objects.create(
        title="Intervention assignée",
        message=f"Le technicien {tech_user.first_name or tech_user.username} a été affecté.",
        type="info"
    )
    
    return Response(BreakdownReportSerializer(report).data)
 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_intervention(request, pk):
    try:
        report = BreakdownReport.objects.get(pk=pk)
    except BreakdownReport.DoesNotExist:
        return Response({'error': 'Signalement introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
    if report.technician != request.user:
        return Response({'error': 'Ce signalement ne vous est pas assigné'}, status=status.HTTP_403_FORBIDDEN)
        
    report.status = 'En cours'
    report.save()
    
    return Response(BreakdownReportSerializer(report).data)
 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def close_intervention(request, pk):
    try:
        report = BreakdownReport.objects.get(pk=pk)
    except BreakdownReport.DoesNotExist:
        return Response({'error': 'Signalement introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
    if report.technician != request.user:
        return Response({'error': 'Ce signalement ne vous est pas assigné'}, status=status.HTTP_403_FORBIDDEN)
        
    resolution_notes = request.data.get('resolution_notes')
    checks_completed = request.data.get('checks_completed', '{}')
    
    report.status = 'Résolue'
    report.resolution_notes = resolution_notes
    report.checks_completed = checks_completed
    report.save()
    
    tech_profile = getattr(request.user, 'technicianprofile', None)
    if tech_profile:
        tech_profile.status = 'Disponible'
        tech_profile.save()
        
    SystemAlert.objects.create(
        title="Intervention terminée",
        message=f"Panne résolue par {request.user.first_name or request.user.username}.",
        type="success"
    )
    
    return Response(BreakdownReportSerializer(report).data)
 