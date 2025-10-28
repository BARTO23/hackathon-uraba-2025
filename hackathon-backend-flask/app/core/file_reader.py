import pandas as pd
from io import BytesIO


def read_file(file):
    """
    Leer archivo CSV o Excel usando Pandas
    
    Args:
        file: FileStorage object de Flask
        
    Returns:
        DataFrame de pandas con los datos del archivo
    """
    filename = file.filename.lower()
    
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            raise ValueError('Formato de archivo no soportado. Use CSV o Excel.')
        
        return df
        
    except Exception as e:
        raise Exception(f'Error al leer el archivo: {str(e)}')
