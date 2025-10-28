from flask import Flask
from flask_cors import CORS
from config import config


def create_app(config_name='development'):
    """
    Fábrica de la aplicación Flask
    """
    app = Flask(__name__)
    
    # Cargar configuración
    app.config.from_object(config[config_name])
    
    # Habilitar CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Registrar blueprints
    from app.api import api_v1
    app.register_blueprint(api_v1, url_prefix='/api/v1')
    
    return app
