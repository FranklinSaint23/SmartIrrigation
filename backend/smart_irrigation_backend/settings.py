import pymysql

# 1. Configurer PyMySQL comme backend MySQL pour Django
pymysql.install_as_MySQLdb()

# 2. Contourner la vérification de version imposée par Django (mysqlclient >= 2.2.1)
pymysql.version_info = (2, 2, 1, 'final', 0)

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-2jw!c+@d@hh#byrq+gg)%ry96k8(q%cmxb5wiwe=%bd$t6)&r$'
DEBUG = True

# Autoriser toutes les IPs et origines pour le dev mobile Expo Go
ALLOWED_HOSTS = ['*']

# Applications enregistrées
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    
    # Local app
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Doit rester en premier
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'smart_irrigation_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'smart_irrigation_backend.wsgi.application'

# Database Configuration avec bascule automatique MySQL -> SQLite
MYSQL_CONFIG = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'smartirrigation',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '127.0.0.1',  # Utilisation de 127.0.0.1 au lieu de localhost
        'PORT': '3306',
        'OPTIONS': {
            'connect_timeout': 3,
        }
    }
}

SQLITE_CONFIG = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

try:
    import pymysql.cursors
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='smartirrigation',
        connect_timeout=2
    )
    conn.close()
    DATABASES = MYSQL_CONFIG
    print("Django: Connected to MySQL database.")
except Exception as e:
    print(f"Django: MySQL server offline or database 'smartirrigation' not found. Falling back to SQLite database.")
    DATABASES = SQLITE_CONFIG

# REST Framework configurations
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

# CORS configuration complète pour requêtes HTTP/HTTPS depuis l'application mobile
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Africa/Douala'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

# Gestion des images et fichiers envoyés par l'application mobile (pannes, profil)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'