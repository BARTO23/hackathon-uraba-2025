import requests
import pandas as pd
import io
from typing import List, Dict, Any
from flask import current_app # Importa 'current_app' para acceder a la config

def get_sioma_headers() -> Dict[str, str]:
    """Helper para obtener los headers de autenticación."""
    token = current_app.config['SIOMA_API_TOKEN']
    return {
        "Authorization": token,
        "Content-Type": "application/json"
    }

def get_fincas_from_sioma() -> List[Dict[str, Any]]:
    """Obtiene la lista de Fincas (tipo-sujeto 1)."""
    headers = get_sioma_headers()
    headers["tipo-sujetos"] = "[1]" 
    url = f"{current_app.config['SIOMA_API_BASE_URL']}/4/usuarios/sujetos"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() 
        return [
            {"id": finca["key_value"], "nombre": finca["nombre"]}
            for finca in response.json()
        ]
    except requests.exceptions.RequestException as e:
        print(f"Error en get_fincas_from_sioma: {e}")
        raise Exception(f"Error API Sioma (Fincas): {str(e)}")

def get_all_lotes_from_sioma() -> List[Dict[str, Any]]:
    """Obtiene TODOS los lotes (tipo-sujeto 3)."""
    headers = get_sioma_headers()
    headers["tipo-sujetos"] = "[3]"
    url = f"{current_app.config['SIOMA_API_BASE_URL']}/4/usuarios/sujetos"

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return [
            {
                "id": lote["key_value"], 
                "nombre": str(lote["nombre"]).strip(), 
                "finca_id": lote["finca_id"]
            }
            for lote in response.json()
        ]
    except requests.exceptions.RequestException as e:
        print(f"Error en get_all_lotes_from_sioma: {e}")
        raise Exception(f"Error API Sioma (Lotes): {str(e)}")

def send_data_to_sioma(df_transformed: pd.DataFrame) -> Dict[str, Any]:
    """Envía el DataFrame transformado como un CSV a Sioma."""
    csv_buffer = io.StringIO()
    df_transformed.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    
    files = {
        'file': ('spots_para_sioma.csv', csv_content, 'text/csv')
    }
    
    headers = {"Authorization": current_app.config['SIOMA_API_TOKEN']}
    url = f"{current_app.config['SIOMA_API_BASE_URL']}/api/v1/spots/upload"

    try:
        response = requests.post(url, files=files, headers=headers, timeout=60.0)

        # --- LÍNEAS DE DEPURACIÓN IMPORTANTES ---
        print("\n--- INICIO DEBUG (send_data_to_sioma) ---")
        print(f"Status Code Recibido de Sioma: {response.status_code}")
        print(f"Respuesta en TEXTO de Sioma: {response.text}")
        print("--- FIN DEBUG ---\n")
        # --- FIN DE LÍNEAS DE DEPURACIÓN ---

        # Ahora, si la respuesta no es 200 OK, lanzamos un error ANTES de intentar leer JSON
        if response.status_code != 200:
             raise Exception(f"Sioma devolvió un error: {response.status_code} - {response.text}")

        # Si llegamos aquí, el status es 200, pero aún puede ser un error de 'status'
        response_json = response.json() 
        
        if response_json.get("status") == "error":
            raise Exception(f"Error de validación de Sioma: {response_json.get('message')}")
        
        return response_json
        
    except requests.exceptions.JSONDecodeError as json_err:
        # Esto captura el error 'Expecting value: line 1 column 1 (char 0)'
        raise Exception(f"Error al decodificar JSON de Sioma. Respuesta recibida (no JSON): {response.text}")
    except Exception as e:
        # Esto captura la excepción que nosotros mismos lanzamos arriba
        raise Exception(f"Error al enviar datos a Sioma: {str(e)}")