from flask import request, jsonify
from app.api import bp as api_v1
from app.core.file_reader import read_file
from app.core.validator import validate_data, transform_for_sioma
from app.core.sioma_client import get_fincas, get_lotes, submit_to_sioma


@api_v1.route('/', methods=['GET'])
def index():
    return "¡Bienvenido al Backend del Hackathon Urabá 2025!"


@api_v1.route('/fincas', methods=['GET'])
def get_fincas_route():
    """
    Obtener lista de fincas desde la API de Sioma
    """
    try:
        fincas = get_fincas()
        return jsonify(fincas), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_v1.route('/lotes', methods=['GET'])
def get_lotes_route():
    """
    Obtener lista de lotes desde la API de Sioma
    Puede recibir finca_id como query parameter
    """
    try:
        finca_id = request.args.get('finca_id')
        lotes = get_lotes(finca_id)
        return jsonify(lotes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_v1.route('/validate-file', methods=['POST'])
def validate_file_route():
    """
    Validar archivo CSV/Excel cargado
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No se encontró el archivo'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
        
        # Leer el archivo
        df = read_file(file)
        
        # Validar datos
        validation_result = validate_data(df)
        
        if validation_result['valid']:
            return jsonify({
                'valid': True,
                'message': 'Archivo válido',
                'data': df.to_dict(orient='records')
            }), 200
        else:
            return jsonify({
                'valid': False,
                'errors': validation_result['errors']
            }), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_v1.route('/submit', methods=['POST'])
def submit_route():
    """
    Enviar datos transformados a la API de Sioma
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No se recibieron datos'}), 400
        
        # Transformar datos para Sioma
        transformed_data = transform_for_sioma(data)
        
        # Enviar a Sioma
        result = submit_to_sioma(transformed_data)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
