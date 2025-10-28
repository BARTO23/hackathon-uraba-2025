import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Configuración base"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SIOMA_API_TOKEN = os.environ.get('SIOMA_API_TOKEN') or 'your-sioma-api-token'
    SIOMA_API_BASE_URL = os.environ.get('SIOMA_API_BASE_URL') or 'https://api.sioma.example.com/v1'


class DevelopmentConfig(Config):
    """Configuración de desarrollo"""
    DEBUG = True


class ProductionConfig(Config):
    """Configuración de producción"""
    DEBUG = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
