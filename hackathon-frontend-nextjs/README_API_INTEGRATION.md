# 🌱 Integración con API de Sioma - Documentación

## 📋 Descripción

Sistema completo de gestión de spots integrado con la API de Sioma. Permite obtener fincas, lotes y subir archivos CSV de spots con procesamiento automático.

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crea (o actualiza) el archivo `.env.local` en la raíz del proyecto con los valores del entorno que te entregue SIOMA:

```bash
NEXT_PUBLIC_API_URL=https://api.sioma.dev
NEXT_PUBLIC_SPOTS_API_URL=https://plantizador.sioma.dev/api/v1
NEXT_PUBLIC_AUTH_TOKEN=PHkRgdWVNhsDjLScW/9zWw==
```

> ℹ️ `NEXT_PUBLIC_API_URL` apunta a los catálogos generales (fincas, lotes). `NEXT_PUBLIC_SPOTS_API_URL` es el dominio especializado para la carga de spots.

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` y leerá las variables cada vez que reinicies el servidor.



## 📡 Endpoints Integrados

| Nombre | Método | Dominio base | Ruta | Headers clave | Descripción |
|--------|--------|--------------|------|---------------|-------------|
| Obtener Fincas | `GET` | `NEXT_PUBLIC_API_URL` (`https://api.sioma.dev`) | `/4/usuarios/sujetos` | `Authorization`, `Content-Type: application/json`, `tipo-sujetos: [1]` | Devuelve todas las fincas asociadas al token |
| Obtener Lotes | `GET` | `NEXT_PUBLIC_API_URL` (`https://api.sioma.dev`) | `/4/usuarios/sujetos` | `Authorization`, `Content-Type: application/json`, `tipo-sujetos: [3]` | Devuelve los lotes; se filtran por `finca_id` en el frontend |
| Subir Spots | `POST` | `NEXT_PUBLIC_SPOTS_API_URL` (`https://plantizador.sioma.dev/api/v1`) | `/spots/upload` | `Authorization`, `Content-Type: multipart/form-data` | Recibe un CSV, lo procesa y devuelve estadísticas |

### Ejemplos de Respuesta

**Fincas / Lotes**
```json
[
  {
    "key": "finca_id",
    "key_value": 2362,
    "nombre": "1 - Palmita",
    "grupo": "Prueba_Fincas",
    "sigla": "PRB_F",
    "moneda": "COP",
    "pago_dia": 47450,
    "tipo_sujeto_id": 1,
    "tipo_cultivo_id": 2
  }
]
```

**Subir Spots (éxito)**
```json
{
  "status": "success",
  "message": "Procesamiento completado: 2056 spots insertados, 2056 polígonos generados para finca 2208",
  "data": {
    "spots_inserted": 2056,
    "plantas_inserted": 2056,
    "lotes_updated": [29347, 29348, 29349],
    "polygons_generated": 2056,
    "lineas_triggered": true,
    "finca_id": 2208
  }
}
```

**Subir Spots (error de validación)**
```json
{
  "status": "error",
  "message": "Faltan columnas obligatorias en el CSV: lat, lng",
  "codigo": "ERROR_MISSING_COLUMNS"
}
```

## 📄 Formato del Archivo CSV

### Columnas Obligatorias

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `nombre_spot` | Identificador del spot | `L29347L50S1` |
| `lat` | Latitud decimal | `1.572736379` |
| `lng` | Longitud decimal | `-78.66915108` |
| `lote_id` | ID del lote | `29347` |
| `linea` | Número de línea | `50` |
| `posicion` | Posición en la línea | `54` |
| `nombre_planta` | Nombre de la planta | `L29347L50P54` |
| `finca_id` | ID de la finca | `2208` |

### Formato de nombre_planta

```
L{lote_id}L{linea}P{posicion}

Ejemplo: L29347L50P54
- L29347 → Lote 29347
- L50 → Línea 50
- P54 → Planta/Posición 54
```

### Ejemplo de CSV

```csv
nombre_spot,lat,lng,lote_id,linea,posicion,nombre_planta,finca_id
L29347L50S1,1.572736379,-78.66915108,29347,50,54,L29347L50P54,2208
L29347L50S2,1.572843921,-78.66912547,29347,50,55,L29347L50P55,2208
```

### Columnas Opcionales

| Columna | Valor por Defecto |
|---------|-------------------|
| `tipo_poligono_id` | 1 |
| `distancia` | 9 |
| `fecha_siembra` | 2006-01-01 |
| `tipo_variedad_id` | 5 |

### ⚠️ Restricciones

- **Una finca por archivo**: Todas las filas deben tener el mismo `finca_id`
- **Límite recomendado**: 10,000 spots por archivo
- **Formato**: Solo archivos `.csv` (UTF-8 o Latin-1)

## 🎯 Flujo de Uso End-to-End

1. **Configuración / Autenticación**
   - `AuthConfig` lee o solicita el token.
   - `setAuthToken(token)` guarda el valor y las llamadas posteriores usan `getAuthToken()`.
   - Al guardarse, se disparan `getFincas()` y `getLotes()` para precargar información.

2. **Selección de Finca y Lotes**
   - `FincaSelector` consume `getFincas()`.
   - Al elegir una finca, se vuelve a invocar `getLotes(fincaId)` para filtrar los lotes disponibles.

3. **Carga y Validación de CSV (Paso 2/3)**
   - `DataValidator` usa `validateCSV(file)` para inspeccionar columnas, duplicados y consistencia.
   - El resultado se presenta en `ValidationReport` y se guarda en `validation.validData`.
   - `LoteMapViewer` utiliza `validData` para representar geográficamente los spots.

4. **Envío Automático a SIOMA (Paso 4)**
   - `FileUploader` recibe `validData` y `selectedFinca`.
   - Al pulsar **Enviar a SIOMA** se ejecuta `uploadValidatedSpots(validData, selectedFinca, onProgress)`.
     - La función genera un CSV temporal respetando el formato oficial.
     - Usa `uploadSpots` para emitir un `POST` multipart/form-data al endpoint de SIOMA.
     - Se reporta progreso en tiempo real y se muestran errores del API si ocurren.

5. **Resultados y Seguimiento**
   - `handleFileUploaded` persiste el payload devuelto (`spots_inserted`, `polygons_generated`, etc.).
   - La sección “Resultados del Procesamiento” resume la respuesta y sirve como comprobante.

## 🛠️ Funciones de API Disponibles

### Librería: `lib/api.js`

| Función | Descripción | Endpoint utilizado |
|---------|-------------|--------------------|
| `setAuthToken(token)` / `removeAuthToken()` | Persiste el token en `localStorage` | N/A |
| `getAuthToken()` | Recupera el token almacenado | N/A |
| `getFincas()` | Obtiene fincas activas del usuario | `GET ${NEXT_PUBLIC_API_URL}/4/usuarios/sujetos` (`tipo-sujetos: [1]`) |
| `getLotes(fincaId?)` | Obtiene lotes y los filtra opcionalmente por finca | `GET ${NEXT_PUBLIC_API_URL}/4/usuarios/sujetos` (`tipo-sujetos: [3]`) |
| `validateCSV(file)` | Valida un CSV local asegurando columnas requeridas | Cliente (FileReader) |
| `uploadSpots(file, onProgress?)` | Envía un archivo CSV a SIOMA | `POST ${NEXT_PUBLIC_SPOTS_API_URL}/spots/upload` |
| `uploadValidatedSpots(validData, fincaId, onProgress?)` | Genera un CSV temporal desde datos limpios y lo sube | `POST ${NEXT_PUBLIC_SPOTS_API_URL}/spots/upload` |

### Ejemplo de uso integrado

```javascript
import { getFincas, getLotes, uploadValidatedSpots } from '../lib/api';

const fincas = await getFincas();
const lotes = await getLotes(fincas[0].id);
const result = await uploadValidatedSpots(validData, fincas[0].id, (progress) => {
  console.log(`Progreso: ${progress}%`);
});
```
## 🔄 Procesamiento del Backend

Cuando se sube un archivo CSV, el backend realiza:

1. **Validación** → Verifica CSV y columnas obligatorias
2. **Inserción** → Guarda spots y plantas en base de datos
3. **Actualización** → Marca lotes con `on_agp=1`
4. **Polígonos** → Genera hexágonos con `radio = distancia/2` metros
5. **Líneas** → Dispara generación de líneas (API externa)

⏱️ **Tiempo de procesamiento**: 10-30 segundos para 2,000 spots

## 🎨 Componentes Principales

### `<AuthConfig />`
Componente de autenticación con verificación de token.

### `<FincaSelector />`
Selector de fincas con carga automática de lotes.

### `<FileUploader />`
Upload de archivos CSV con validación y progreso en tiempo real.

## 🐛 Manejo de Errores

### Errores Comunes

| Código | Descripción | Solución |
|--------|-------------|----------|
| `ERROR_FILE_TYPE` | Archivo no es CSV | Usar archivo .csv |
| `ERROR_MISSING_COLUMNS` | Faltan columnas | Verificar formato |
| `ERROR_MULTIPLE_FINCAS` | Múltiples fincas en CSV | Un archivo por finca |
| `401 Unauthorized` | Token inválido | Revisar token |

### Mensajes de Error en UI

- ❌ **Autenticación**: "No hay token de autenticación"
- ❌ **Validación**: "Faltan columnas obligatorias: lat, lng"
- ❌ **Upload**: "Error al procesar el archivo"
- ❌ **Conexión**: "Error de conexión con el servidor"

## 📱 Responsive Design

La aplicación es completamente responsive y funciona en:
- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (<768px)

## 🔒 Seguridad

- Token almacenado en `localStorage` (solo cliente)
- No se guarda el token en variables de entorno
- Validación de archivos antes de upload
- Headers de autorización en todas las peticiones

## 📚 Recursos Adicionales

- **API Base URL**: `https://api.sioma.dev`
- **Documentación API**: Consultar con el equipo de Sioma
- **Soporte**: Contactar al administrador del sistema

## 🚀 Producción

### Build

```bash
npm run build
```

### Start

```bash
npm start
```

La aplicación se ejecutará en el puerto 3000 por defecto.

## 📝 Notas Importantes

- ✅ Validación automática de CSV al seleccionar archivo
- ✅ Barra de progreso durante el upload
- ✅ Resultados detallados del procesamiento
- ✅ Filtrado automático de lotes por finca
- ✅ Manejo robusto de errores
- ✅ UI moderna y responsive

## 🤝 Contribución

Para agregar nuevas funcionalidades:

1. Agregar función en `lib/api.js`
2. Actualizar componentes necesarios
3. Actualizar estilos en `styles/Home.module.css`
4. Documentar cambios en este README

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0  
**API Version**: v1
