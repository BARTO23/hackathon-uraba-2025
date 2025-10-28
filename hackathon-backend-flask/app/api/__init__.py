from flask import Blueprint

# Definir el Blueprint para la API v1
api_v1 = Blueprint('api_v1', __name__)

# Importar rutas después de crear el blueprint para evitar imports circulares
from app.api import routes
