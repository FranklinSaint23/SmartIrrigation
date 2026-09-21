from django.db import models
from django.contrib.auth.models import User

class FarmerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True)
    language = models.CharField(max_length=20, default='Français')
    theme = models.CharField(max_length=20, default='Clair')
    role = models.CharField(max_length=20, default='Agriculteur') # 'Agriculteur', 'Administrateur', 'Technicien'

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class TechnicianProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tech_profile')
    phone_number = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=50, blank=True)
    specialty = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, default='Disponible') # 'Disponible', 'Occupé'

    def __str__(self):
        return f"Tech: {self.user.username} - {self.specialty}"

class ESP32Device(models.Model):
    name = models.CharField(max_length=50)
    device_id = models.CharField(max_length=50, unique=True)
    ip_address = models.CharField(max_length=50, blank=True)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    farm_name = models.CharField(max_length=100, blank=True)
    is_online = models.BooleanField(default=True)
    last_connection = models.DateTimeField(auto_now=True)
    wifi_signal = models.CharField(max_length=20, default='Bon') # 'Bon', 'Moyen', 'Faible'

    def __str__(self):
        return f"{self.name} ({self.device_id})"

class BreakdownReport(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_breakdowns')
    breakdown_type = models.CharField(max_length=50)
    description = models.TextField()
    photo_url = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, default='En attente') # 'En attente', 'En cours', 'Résolue', 'Annulée'
    technician = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_interventions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolution_notes = models.TextField(blank=True, null=True)
    checks_completed = models.TextField(default='{}') # Stockage JSON des checklists

    def __str__(self):
        return f"Panne {self.breakdown_type} - {self.farmer.username} ({self.status})"

class TelemetryData(models.Model):
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    air_humidity = models.DecimalField(max_digits=5, decimal_places=2)
    soil_humidity = models.DecimalField(max_digits=5, decimal_places=2)
    light_intensity = models.DecimalField(max_digits=6, decimal_places=2)
    water_level = models.DecimalField(max_digits=5, decimal_places=2)
    rain_detected = models.BooleanField(default=False)
    pump_active = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp} - HumSol: {self.soil_humidity}%"

class ThresholdSetting(models.Model):
    soil_humidity_threshold = models.IntegerField(default=30)
    max_watering_duration = models.IntegerField(default=20)
    sensor_read_interval = models.IntegerField(default=5)
    tank_capacity = models.IntegerField(default=1000)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Thresholds (Hum: {self.soil_humidity_threshold}%)"

class PumpControlState(models.Model):
    pump_active = models.BooleanField(default=False)
    mode = models.CharField(max_length=10, default='Auto') # 'Auto' ou 'Manual'
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Control (Mode: {self.mode}, Pump: {self.pump_active})"

class SystemAlert(models.Model):
    title = models.CharField(max_length=100)
    message = models.TextField()
    type = models.CharField(max_length=20, default='info') # 'info', 'success', 'warning'
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return self.title

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        FarmerProfile.objects.get_or_create(user=instance)
