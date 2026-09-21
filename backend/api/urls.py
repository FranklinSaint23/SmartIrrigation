from django.urls import path
from . import views

urlpatterns = [
    # Auth endpoints
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    
    # Telemetry data
    path('telemetry/latest/', views.get_latest_telemetry, name='telemetry-latest'),
    path('telemetry/history/', views.get_historical_telemetry, name='telemetry-history'),
    
    # User settings
    path('settings/', views.manage_settings, name='settings-manage'),
    
    # Manual pump trigger overrides
    path('control/pump/', views.update_pump_control, name='pump-control'),
    
    # Alerts logs feed
    path('notifications/', views.get_alerts, name='alerts-list'),
    
    # TinyML predictor recommendation
    path('predictions/needs/', views.tinyml_predict_needs, name='predict-needs'),
    
    # ESP32 hardware endpoint upload
    path('esp32/telemetry/', views.esp32_telemetry_upload, name='esp32-telemetry-upload'),

    # Admin Management
    path('admin/farmers/', views.admin_farmers_list, name='admin-farmers-list'),
    path('admin/farmers/<int:pk>/', views.admin_farmer_detail, name='admin-farmer-detail'),
    path('admin/technicians/', views.admin_technicians_list_create, name='admin-technicians-list-create'),
    path('admin/devices/', views.admin_devices_list, name='admin-devices-list'),
    path('admin/statistics/', views.admin_statistics, name='admin-statistics'),

    # Interventions and Breakdowns
    path('interventions/', views.interventions_list_create, name='interventions-list-create'),
    path('interventions/<int:pk>/', views.intervention_detail, name='intervention-detail'),
    path('interventions/<int:pk>/assign/', views.assign_technician, name='assign-technician'),
    path('interventions/<int:pk>/start/', views.start_intervention, name='start-intervention'),
    path('interventions/<int:pk>/close/', views.close_intervention, name='close-intervention'),
]
