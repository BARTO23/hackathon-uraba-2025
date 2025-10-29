from flask import request, jsonify
from app.api import bp
from app.core import file_reader, validator, sioma_client
import pandas as pd

@bp.route('/fincas', methods=['GET'])
def get_fincas():
    try:
        fincas = sioma_client.get_fincas_from_sioma()
        return jsonify(fincas), 200
    except Exception as e:
        print(f"Error en /fincas: {str(e)}")
        return jsonify({"error": str(e)}), 502 

@bp.route('/validate-file', methods=['POST'])
def validate_file_endpoint():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se encontró el archivo"}), 400
        if 'finca_id' not in request.form:
            return jsonify({"error": "No se especificó la finca_id"}), 400

        file = request.files['file']
        finca_id = int(request.form['finca_id'])
        
        # Esta llamada ahora fallará si la ruta de lotes es incorrecta
        all_lotes_data = sioma_client.get_all_lotes_from_sioma()
        
        file_content = file.read()
        df_usuario = file_reader.read_spot_file(file_content, file.filename)
        
        validation_result = validator.run_validations_and_transform(
            df_usuario, finca_id, all_lotes_data
        )

        if validation_result["status"] == "error":
            return jsonify({"errors": validation_result["errors"]}), 400
        
        return jsonify(validation_result), 200

    except Exception as e:
        print(f"Error en /validate-file: {str(e)}")
        return jsonify({"error": f"Error interno: {str(e)}"}), 500

@bp.route('/submit-validated-data', methods=['POST'])
def submit_validated_data():
    try:
        data_for_submit = request.get_json()
        if not data_for_submit:
            return jsonify({"error": "No se recibieron datos"}), 400
            
        df_transformed = pd.DataFrame(data_for_submit)
        
        sioma_response = sioma_client.send_data_to_sioma(df_transformed)
        
        return jsonify({
            "status": "enviado",
            "message": "Datos enviados exitosamente a Sioma.",
            "response_sioma": sioma_response
        }), 200
    except Exception as e:
        print(f"Error en /submit-validated-data: {str(e)}")
        return jsonify({"error": f"Error al enviar a Sioma: {str(e)}"}), 502