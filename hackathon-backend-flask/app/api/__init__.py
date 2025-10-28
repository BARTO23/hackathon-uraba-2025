from flask import Blueprint

bp = Blueprint('api_v1', __name__)

# Importamos las rutas al final para evitar importaciones circulares
from app.api import routes