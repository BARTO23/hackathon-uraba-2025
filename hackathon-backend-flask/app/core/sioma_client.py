import requests
from flask import current_app


def get_fincas():
    """
    Obtener lista de fincas desde la API de Sioma
    
    Returns:
        Lista de fincas
    """
    api_url = current_app.config['SIOMA_API_BASE_URL']
    token = current_app.config['SIOMA_API_TOKEN']
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f'{api_url}/fincas', headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f'Error al obtener fincas: {str(e)}')


def get_lotes(finca_id=None):
    """
    Obtener lista de lotes desde la API de Sioma
    
    Args:
        finca_id: ID de la finca (opcional)
        
    Returns:
        Lista de lotes
    """
    api_url = current_app.config['SIOMA_API_BASE_URL']
    token = current_app.config['SIOMA_API_TOKEN']
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    url = f'{api_url}/lotes'
    params = {}
    if finca_id:
        params['finca_id'] = finca_id
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f'Error al obtener lotes: {str(e)}')


def submit_to_sioma(data):
    """
    Enviar datos a la API de Sioma
    
    Args:
        data: Diccionario con los datos a enviar
        
    Returns:
        Respuesta de la API
    """
    api_url = current_app.config['SIOMA_API_BASE_URL']
    token = current_app.config['SIOMA_API_TOKEN']
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(f'{api_url}/submit', json=data, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f'Error al enviar datos a Sioma: {str(e)}')
