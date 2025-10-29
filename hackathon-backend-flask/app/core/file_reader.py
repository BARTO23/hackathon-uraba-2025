import pandas as pd
import io

EXPECTED_COLUMNS = ['Latitud', 'Longitud', 'Línea palma', 'Posición palma', 'Lote']

def read_spot_file(file_content: bytes, filename: str) -> pd.DataFrame:
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(file_content.decode('utf-8-sig')))
        elif filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(file_content), engine='openpyxl')
        else:
            raise ValueError("Formato de archivo no soportado. Usar .csv o .xlsx")
        
        for col in EXPECTED_COLUMNS:
            if col not in df.columns:
                raise ValueError(f"Columna faltante en el archivo: '{col}'")
        
        df_renamed = df.rename(columns={
            'Latitud': 'lat',
            'Longitud': 'lon',
            'Línea palma': 'linea',
            'Posición palma': 'posicion',
            'Lote': 'lote_nombre'
        })
        
        df_renamed['lote_nombre'] = df_renamed['lote_nombre'].astype(str).str.strip()
        df_renamed['lat'] = pd.to_numeric(df_renamed['lat'], errors='coerce')
        df_renamed['lon'] = pd.to_numeric(df_renamed['lon'], errors='coerce')
        df_renamed['linea'] = pd.to_numeric(df_renamed['linea'], errors='coerce')
        df_renamed['posicion'] = pd.to_numeric(df_renamed['posicion'], errors='coerce')

        df_renamed['fila_original'] = df_renamed.index + 2
        
        return df_renamed
    except Exception as e:
        raise ValueError(f"Error al procesar el archivo: {str(e)}")