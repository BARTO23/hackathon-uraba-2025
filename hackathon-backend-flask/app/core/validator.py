import pandas as pd


def validate_data(df):
    """
    Validar datos del DataFrame según las reglas del Hackathon
    
    Args:
        df: DataFrame de pandas con los datos a validar
        
    Returns:
        Diccionario con el resultado de la validación
    """
    errors = []
    
    # Ejemplo de validaciones básicas
    # TODO: Implementar las validaciones específicas del hackathon
    
    # Verificar que el DataFrame no esté vacío
    if df.empty:
        errors.append('El archivo está vacío')
        return {'valid': False, 'errors': errors}
    
    # Verificar columnas requeridas (ejemplo)
    required_columns = []  # TODO: Definir columnas requeridas
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        errors.append(f'Faltan columnas requeridas: {", ".join(missing_columns)}')
    
    # Verificar valores nulos en columnas críticas
    # TODO: Implementar validación de valores nulos
    
    # Verificar tipos de datos
    # TODO: Implementar validación de tipos de datos
    
    if errors:
        return {'valid': False, 'errors': errors}
    
    return {'valid': True, 'errors': []}


def transform_for_sioma(data):
    """
    Transformar datos al formato requerido por la API de Sioma
    
    Args:
        data: Diccionario con los datos a transformar
        
    Returns:
        Diccionario con los datos transformados
    """
    # TODO: Implementar la transformación específica para Sioma
    
    transformed = {
        'data': data,
        # Agregar campos adicionales según la API de Sioma
    }
    
    return transformed
