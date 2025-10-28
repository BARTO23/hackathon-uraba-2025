from flask import Flask
from config import Config
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configurar CORS para aceptar peticiones desde el frontend de Next.js
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000", # URL de desarrollo de Next.js
                # "https://tu-app.vercel.app" # URL de producción
            ]
        }
    })

    # Registrar el Blueprint (nuestra API)
    from app.api import bp as api_blueprint

    @app.route('/')
    def index():
        return "¡Bienvenido al Hackathon Urabá 2025!"

    app.register_blueprint(api_blueprint, url_prefix='/api/v1')

    return app