import requests
import pandas as pd
import io
from typing import List, Dict, Any
from flask import current_app

def get_sioma_headers(tipo_sujeto: str = None) -> Dict[str, str]:
    """Helper para obtener los headers de autenticación."""
    token = current_app.config['SIOMA_API_TOKEN']
    
    # En la documentación anterior no se usa 'Bearer', lo quitamos para la API vieja.
    headers = {
        "Authorization": token,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    # Los endpoints viejos usan un header especial para filtrar el tipo
    if tipo_sujeto:
        headers["tipo-sujetos"] = f"[{tipo_sujeto}]"
        
    return headers

def get_fincas_from_sioma() -> List[Dict[str, Any]]:
    """Obtiene la lista de Fincas usando la ruta original /4/usuarios/sujetos con tipo-sujetos: [1]."""
    # URL del dominio viejo
    url = f"{current_app.config['SIOMA_GET_BASE_URL']}/4/usuarios/sujetos"
    headers = get_sioma_headers(tipo_sujeto='1')
    
    print(f"--- DEBUG: Intentando GET Fincas: {url} ---")

    try:
        response = requests.get(url, headers=headers, timeout=10.0)
        response.raise_for_status() 
        
        # El parseo de la API vieja
        return [
            {"id": finca["key_value"], "nombre": finca["nombre"]}
            for finca in response.json()
        ]
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error API Sioma (Fincas): {e.response.text if e.response else str(e)}")

def get_all_lotes_from_sioma() -> List[Dict[str, Any]]:
    """Obtiene TODOS los lotes usando la ruta original /4/usuarios/sujetos con tipo-sujetos: [3]."""
    # URL del dominio viejo
    url = f"{current_app.config['SIOMA_GET_BASE_URL']}/4/usuarios/sujetos"
    headers = get_sioma_headers(tipo_sujeto='3')
    
    try:
        response = requests.get(url, headers=headers, timeout=10.0)
        response.raise_for_status()
        
        # El parseo de la API vieja
        return [
            {
                "id": lote["key_value"], 
                "nombre": str(lote["nombre"]).strip(), 
                "finca_id": lote["finca_id"]
            }
            for lote in response.json()
        ]
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error API Sioma (Lotes): {e.response.text if e.response else str(e)}")

def send_data_to_sioma(df_transformed: pd.DataFrame) -> Dict[str, Any]:
    """Envía el DataFrame transformado como un CSV a la NUEVA API de subida."""
    # 1. Crear el CSV en memoria
    csv_buffer = io.StringIO()
    df_transformed.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    
    # 2. Configurar el archivo para multipart/form-data
    files = {
        'file': ('spots_para_sioma.csv', csv_content, 'text/csv')
    }
    
    # 3. Headers para la subida (usamos el token sin 'Bearer')
    headers = {"Authorization": current_app.config['SIOMA_API_TOKEN']}

    # 4. URL de SUBIDA (la nueva URL completa)
    url = current_app.config['SIOMA_POST_UPLOAD_URL']
    
    print(f"--- DEBUG: Intentando POST Subida: {url} ---")
    
    try:
        # Petición POST. Nota: requests maneja el Content-Type multipart/form-data automáticamente
        response = requests.post(url, files=files, headers=headers, timeout=60.0)

        # Mantenemos el debug para ver la respuesta
        print(f"Status Code Recibido de Sioma: {response.status_code}")
        print(f"Respuesta en TEXTO de Sioma: {response.text}")

        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as e:
        # Intentamos parsear el JSON de error de Sioma si existe
        error_text = e.response.json().get('message', e.response.text) if e.response and 'application/json' in e.response.headers.get('Content-Type', '') else e.response.text if e.response else str(e)
        raise Exception(f"Error al enviar datos a Sioma: {error_text}")