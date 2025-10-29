import pandas as pd
from typing import List, Dict, Any

def run_validations_and_transform(
    df: pd.DataFrame, 
    finca_id_seleccionada: int, 
    lotes_data_api: List[Dict[str, Any]]
) -> Dict[str, Any]:
    errors = []
    
    lotes_de_la_finca = [
        lote for lote in lotes_data_api 
        if lote["finca_id"] == finca_id_seleccionada
    ]
    
    if not lotes_de_la_finca:
        return {
            "status": "error",
            "errors": [{"tipo": "CONFIG_ERROR", "mensaje": f"La finca ID {finca_id_seleccionada} no tiene lotes asociados en Sioma."}],
            "data_for_map": None, "data_for_submit": None
        }

    lotes_validos_set = set(lote["nombre"] for lote in lotes_de_la_finca)
    lote_name_to_id_map = {lote["nombre"]: lote["id"] for lote in lotes_de_la_finca}

    df_validado = df.copy()

    # Validación 1: Lotes Inválidos
    mask_lotes_invalidos = ~df_validado['lote_nombre'].isin(lotes_validos_set)
    if mask_lotes_invalidos.any():
        lotes_malos = df_validado[mask_lotes_invalidos]['lote_nombre'].unique().tolist()
        errors.append({
            "tipo": "LOTE_INVALIDO",
            "mensaje": f"Estos lotes no pertenecen a la finca: {lotes_malos}",
            "filas": df_validado[mask_lotes_invalidos]['fila_original'].tolist()
        })

    # Validación 2: Coordenadas Duplicadas
    mask_coords_duplicadas = df_validado.duplicated(subset=['lat', 'lon'], keep=False)
    if mask_coords_duplicadas.any():
        errors.append({
            "tipo": "COORDENADA_DUPLICADA",
            "mensaje": f"Se encontraron {mask_coords_duplicadas.sum()} registros con Lat/Lon repetidas.",
            "filas": df_validado[mask_coords_duplicadas]['fila_original'].tolist()
        })

    # Validación 3: Spot Duplicado
    mask_spot_duplicado = df_validado.duplicated(subset=['lote_nombre', 'linea', 'posicion'], keep=False)
    if mask_spot_duplicado.any():
        errors.append({
            "tipo": "SPOT_DUPLICADO",
            "mensaje": f"Se encontraron {mask_spot_duplicado.sum()} registros con (Lote, Línea, Posición) repetidos.",
            "filas": df_validado[mask_spot_duplicado]['fila_original'].tolist()
        })
        
    # Validación 4: Coordenadas Nulas
    mask_coords_nulas = df_validado['lat'].isna() | df_validado['lon'].isna()
    if mask_coords_nulas.any():
        errors.append({
            "tipo": "COORDENADA_NULA",
            "mensaje": f"Se encontraron {mask_coords_nulas.sum()} registros con coordenadas vacías o inválidas.",
            "filas": df_validado[mask_coords_nulas]['fila_original'].tolist()
        })

    if errors:
        return {
            "status": "error", "errors": errors,
            "data_for_map": None, "data_for_submit": None
        }

    # --- ÉXITO: Fase de Transformación ---
    df_transformado = pd.DataFrame()
    df_transformado['lote_id'] = df_validado['lote_nombre'].map(lote_name_to_id_map)
    df_transformado['lat'] = df_validado['lat']
    df_transformado['lng'] = df_validado['lon']
    df_transformado['linea'] = df_validado['linea']
    df_transformado['posicion'] = df_validado['posicion']
    df_transformado['finca_id'] = finca_id_seleccionada
    df_transformado['nombre_planta'] = (
        "L" + df_transformado['lote_id'].astype(str) +
        "L" + df_transformado['linea'].astype(str) +
        "P" + df_transformado['posicion'].astype(str)
    )
    df_transformado['nombre_spot'] = df_transformado['nombre_planta']

    columnas_sioma = [
        'nombre_spot', 'lat', 'lng', 'lote_id', 'linea', 
        'posicion', 'nombre_planta', 'finca_id'
    ]
    df_final_sioma = df_transformado[columnas_sioma]
    
    return {
        "status": "success", "errors": [],
        "data_for_map": df_validado.to_dict('records'),
        "data_for_submit": df_final_sioma.to_dict('records')
    }