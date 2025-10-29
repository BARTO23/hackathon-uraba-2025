from flask import Flask
from config import Config
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app) # Abierto a todo por ahora para pruebas

    from app.api import bp as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api/v1')

    @app.route('/health')
    def health():
        return "Backend de Flask está activo!"

    return app