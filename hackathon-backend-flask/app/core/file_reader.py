import pandas as pd
import io

# Columnas base esperadas en el archivo del usuario
EXPECTED_COLUMNS = ['Latitud', 'Longitud', 'Línea palma', 'Posición palma', 'Lote']

def read_spot_file(file_content: bytes, filename: str) -> pd.DataFrame:
    """
    Lee el contenido de un archivo CSV o Excel y lo convierte a un DataFrame de Pandas.
    """
    try:
        if filename.endswith('.csv'):
            # Decodificar bytes a string para read_csv (usando utf-8-sig por si acaso)
            df = pd.read_csv(io.StringIO(file_content.decode('utf-8-sig')))
        elif filename.endswith(('.xls', '.xlsx')):
            # BytesIO funciona directamente con read_excel
            df = pd.read_excel(io.BytesIO(file_content), engine='openpyxl')
        else:
            raise ValueError("Formato de archivo no soportado. Usar .csv o .xlsx")
        
        # 1. Validar que las columnas existan
        for col in EXPECTED_COLUMNS:
            if col not in df.columns:
                raise ValueError(f"Columna faltante en el archivo: '{col}'")
        
        # 2. Renombrar columnas para consistencia interna
        df_renamed = df.rename(columns={
            'Latitud': 'lat',
            'Longitud': 'lon',
            'Línea palma': 'linea',
            'Posición palma': 'posicion',
            'Lote': 'lote_nombre'
        })
        
        # 3. Limpieza básica
        df_renamed['lote_nombre'] = df_renamed['lote_nombre'].astype(str).str.strip()
        df_renamed['lat'] = pd.to_numeric(df_renamed['lat'], errors='coerce')
        df_renamed['lon'] = pd.to_numeric(df_renamed['lon'], errors='coerce')
        df_renamed['linea'] = pd.to_numeric(df_renamed['linea'], errors='coerce')
        df_renamed['posicion'] = pd.to_numeric(df_renamed['posicion'], errors='coerce')

        # 4. Añadir la fila original para reportar errores
        df_renamed['fila_original'] = df_renamed.index + 2
        
        return df_renamed

    except Exception as e:
        raise ValueError(f"Error al procesar el archivo: {str(e)}")