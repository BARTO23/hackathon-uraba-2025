# 🧹 Sistema de Limpieza Automática de Datos

## Descripción

El sistema implementa un proceso automático e inteligente de limpieza de datos que procesa los archivos CSV antes de la validación, garantizando que solo los datos de calidad lleguen al proceso de validación.

## ✨ Características

### 1. **Mapeo Inteligente de Columnas**

El sistema detecta automáticamente múltiples variantes de nombres de columnas:

#### Coordenadas
- **Latitud**: `lat`, `Latitud`, `latitude`, `LAT`, `LATITUD`, `Lat`
- **Longitud**: `lng`, `Longitud`, `longitude`, `LNG`, `LONGITUD`, `Lng`, `lon`

#### Línea
- `linea`, `Linea`, `Línea`, `Línea palma`, `linea_palma`, `LINEA`, `line`

#### Posición
- `posicion`, `Posicion`, `Posición`, `Posición palma`, `posicion_palma`
- `Palma`, `palma`, `POSICION`, `position`, `pos`

#### Lote
- `lote_id`, `Lote`, `lote`, `LOTE`, `Lote ID`, `lot`

### 2. **Limpieza Automática**

El sistema remueve automáticamente:

#### Filas Vacías
- Detecta filas completamente vacías
- Remueve filas con todos los valores nulos o vacíos

#### Valores Inválidos
- **Coordenadas inválidas**: NaN, null, undefined, strings no numéricos
- **Campos faltantes**: Línea, posición o lote vacíos o nulos
- **Espacios en blanco**: Trim automático de todos los valores

#### Duplicados por Coordenadas
- Detecta coordenadas idénticas (hasta 8 decimales)
- Mantiene la primera ocurrencia
- Remueve automáticamente las siguientes

### 3. **Mapeo de Nombres a IDs**

Si tienes lotes con nombres en lugar de IDs, el sistema:
- Busca el nombre del lote en la lista de lotes disponibles
- Mapea automáticamente el nombre al ID correcto
- Mantiene el nombre original para referencia

Ejemplo:
```
Archivo: "67-CASA ROJA"
Sistema: Mapea a ID numérico si existe en la finca
```

### 4. **Normalización de Datos**

Todos los datos son normalizados:
- Coordenadas convertidas a números flotantes
- Líneas y posiciones como strings (preservando formato original)
- Trim de espacios en blanco
- Conversión de tipos consistente

## 🔄 Proceso de Limpieza

```
1. LECTURA DEL ARCHIVO
   ↓
2. DETECCIÓN DE COLUMNAS
   → Mapeo inteligente de nombres
   ↓
3. FILTRADO DE FILAS VACÍAS
   → Remueve filas sin datos
   ↓
4. VALIDACIÓN DE CAMPOS OBLIGATORIOS
   → Remueve filas con campos críticos faltantes
   ↓
5. NORMALIZACIÓN DE DATOS
   → Convierte tipos y limpia espacios
   ↓
6. MAPEO DE NOMBRES DE LOTES
   → Convierte nombres a IDs si es posible
   ↓
7. REMOCIÓN DE DUPLICADOS
   → Elimina coordenadas idénticas
   ↓
8. DATOS LIMPIOS
   → Listos para validación
```

## 📊 Información Mostrada

Después de la limpieza, el sistema muestra:

```
🧹 Limpieza Automática Aplicada

🗑️ X filas removidas (valores nulos o inválidos)
📋 X duplicados removidos (coordenadas idénticas)

ℹ️ La limpieza se aplicó automáticamente. Las filas inválidas y 
   duplicadas fueron removidas antes de la validación.
```

## 🎯 Ejemplo Práctico

### Archivo Original (8 filas)
```csv
Lote,Linea,Palma,Longitud,Latitud
67-CASA ROJA,1,1,-73.642684500000,3.884461687000
67-CASA ROJA,1,9,-73.642718100000,3.885243744000
67-CASA ROJA,1,2,-73.642698100000,3.884589003000
67-CASA ROJA,1,8,-73.642736300000,3.885018690000
67-CASA ROJA,1,6,-73.642734200000,3.884768618000
67-CASA ROJA,1,6,-73.642734200000,3.884825452000  ← DUPLICADO (misma línea, posición)
67-CASA ROJA,1,10,-73.642711300000,3.885339222000
67-CASA ROJA,1,2,-73.642698100000,3.884516255000  ← DUPLICADO (misma línea, posición)
```

### Después de Limpieza Automática (6 filas)
```csv
lote_id,linea,posicion,lng,lat
123,1,1,-73.64268450,3.88446169
123,1,9,-73.64271810,3.88524374
123,1,2,-73.64269810,3.88458900
123,1,8,-73.64273630,3.88501869
123,1,6,-73.64273420,3.88476862
123,1,10,-73.64271130,3.88533922
```

**Resultado**: 
- ✅ 6 filas válidas
- 🗑️ 0 filas removidas por valores inválidos
- 📋 2 duplicados removidos (posiciones repetidas en misma línea)
- 🏷️ Nombre "67-CASA ROJA" mapeado a ID 123

## ⚙️ Configuración

La limpieza automática está **habilitada por defecto** y no requiere configuración.

Para deshabilitarla (no recomendado):
```javascript
// En el código
validateSpots(data, lotes, { autoRemoveDuplicates: false })
```

## 🔒 Garantías

El sistema garantiza:

1. **No pérdida de datos válidos**: Solo se remueven filas inválidas o duplicadas
2. **Trazabilidad**: Todas las filas removidas se registran con su razón
3. **Transparencia**: El usuario ve exactamente qué se limpió
4. **Consistencia**: Todos los datos pasan por el mismo proceso
5. **Preservación de información**: Los datos se normalizan sin pérdida de precisión

## 📝 Notas Importantes

- Las **coordenadas duplicadas** se comparan hasta 8 decimales de precisión
- Las **filas vacías** no generan errores, simplemente se ignoran
- El **mapeo de nombres** solo funciona si el lote existe en la finca seleccionada
- La **limpieza es reversible**: Los datos originales no se modifican
- Los **warnings** informan qué se limpió, pero no impiden el procesamiento

## 🆘 Solución de Problemas

### "Muchas filas fueron removidas"
- **Causa**: El archivo tiene muchos valores nulos o coordenadas inválidas
- **Solución**: Revisa el archivo original y corrige los datos faltantes

### "El lote no se mapea correctamente"
- **Causa**: El nombre del lote no coincide exactamente con ningún lote de la finca
- **Solución**: Asegúrate de que el nombre coincida o usa el ID numérico directamente

### "Se removieron duplicados que no lo son"
- **Causa**: Dos spots tienen exactamente las mismas coordenadas
- **Solución**: Verifica que las coordenadas sean únicas para cada spot
