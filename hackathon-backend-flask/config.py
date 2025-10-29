import os
from dotenv import load_dotenv

load_dotenv() # Carga las variables del archivo .env

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'una-llave-secreta-muy-dificil'
    SIOMA_API_BASE_URL = os.environ.get('SIOMA_API_BASE_URL', "https://api.sioma.dev")
    SIOMA_API_TOKEN = os.environ.get('SIOMA_API_TOKEN')
    
    if not SIOMA_API_TOKEN or SIOMA_API_TOKEN == "TU_TOKEN_AQUI":
        raise ValueError("No se encontró SIOMA_API_TOKEN. Asegúrate de crear un .env y poner tu token.")