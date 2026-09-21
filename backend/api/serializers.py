from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FarmerProfile, TechnicianProfile, ESP32Device, BreakdownReport, TelemetryData, ThresholdSetting, PumpControlState, SystemAlert

class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='profile.phone_number', read_only=True)
    language = serializers.CharField(source='profile.language', read_only=True)
    theme = serializers.CharField(source='profile.theme', read_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'language', 'theme', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'name', 'phone_number']

    def create(self, validated_data):
        password = validated_data.pop('password')
        name = validated_data.pop('name')
        phone_number = validated_data.pop('phone_number')
        
        # User username maps to email in frontend auth schema
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=name,
            password=password
        )
        # Create user FarmerProfile linked 1-to-1
        FarmerProfile.objects.create(
            user=user,
            phone_number=phone_number,
            role='Agriculteur' # Par défaut lors de l'enregistrement de l'agriculteur
        )
        return user

class TechnicianProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = TechnicianProfile
        fields = ['id', 'username', 'email', 'name', 'phone_number', 'city', 'specialty', 'status']

class ESP32DeviceSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.first_name', read_only=True)

    class Meta:
        model = ESP32Device
        fields = '__all__'

class BreakdownReportSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.first_name', read_only=True)
    farmer_phone = serializers.CharField(source='farmer.profile.phone_number', read_only=True)
    technician_name = serializers.CharField(source='technician.first_name', read_only=True)

    class Meta:
        model = BreakdownReport
        fields = '__all__'

class TelemetryDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelemetryData
        fields = '__all__'

class ThresholdSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThresholdSetting
        fields = '__all__'

class PumpControlStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PumpControlState
        fields = '__all__'

class SystemAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemAlert
        fields = '__all__'
