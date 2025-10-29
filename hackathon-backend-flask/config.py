import os
from dotenv import load_dotenv

load_dotenv() # Carga las variables del archivo .env

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'una-llave-secreta-muy-dificil'
    
    # URL Base para OBTENER DATOS (Fincas/Lotes) - Dominio original
    SIOMA_GET_BASE_URL = os.environ.get('SIOMA_GET_BASE_URL', "https://api.sioma.dev")
    
    # URL para SUBIR DATOS (Upload) - Nuevo dominio completo
    SIOMA_POST_UPLOAD_URL = os.environ.get('SIOMA_POST_UPLOAD_URL', "https://plantizador.sioma.dev/api/v1/spots/upload")

    SIOMA_API_TOKEN = os.environ.get('SIOMA_API_TOKEN')
    
    if not SIOMA_API_TOKEN:
        raise ValueError("No se encontró SIOMA_API_TOKEN. Asegúrate de crear un .env y poner tu token.")