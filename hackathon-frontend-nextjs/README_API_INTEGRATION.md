# 🌱 Integración con API de Sioma - Documentación

## 📋 Descripción

Sistema completo de gestión de spots integrado con la API de Sioma. Permite obtener fincas, lotes y subir archivos CSV de spots con procesamiento automático.

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_API_URL=https://api.sioma.dev
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Autenticación

### Configurar Token

1. Al abrir la aplicación, verás la sección **"Configuración de Autenticación"**
2. Ingresa tu token de autenticación de Sioma
3. Haz clic en **"Guardar y Conectar"**
4. El sistema verificará automáticamente la conexión con la API

El token se guarda en el `localStorage` del navegador de forma segura.

### Obtener Token

Contacta con el administrador del sistema Sioma para obtener tu token de autenticación.

## 📡 Endpoints Integrados

### 1. Obtener Fincas

**Endpoint:** `GET /4/usuarios/sujetos`

**Headers:**
- `Authorization: {token}`
- `Content-Type: application/json`
- `tipo-sujetos: [1]`

**Respuesta:**
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

### 2. Obtener Lotes

**Endpoint:** `GET /4/usuarios/sujetos`

**Headers:**
- `Authorization: {token}`
- `Content-Type: application/json`
- `tipo-sujetos: [3]`

**Respuesta:**
```json
[
  {
    "key": "lote_id",
    "key_value": 33958,
    "nombre": "84-MANCHIS",
    "grupo": "1 - Palmita",
    "sigla": "1-PLM",
    "finca_id": 2362,
    "tipo_sujeto_id": 3,
    "tipo_cultivo_id": 2
  }
]
```

### 3. Subir Spots

**Endpoint:** `POST /api/v1/spots/upload`

**Headers:**
- `Authorization: {token}`
- `Content-Type: multipart/form-data`

**Body:**
- `file`: Archivo CSV con spots

**Respuesta Exitosa:**
```json
{
  "status": "success",
  "message": "Procesamiento completado: 2056 spots insertados...",
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

## 🎯 Flujo de Uso

### 1. Configurar Autenticación
```
Usuario ingresa token → Sistema verifica → Conexión establecida
```

### 2. Seleccionar Finca
```
Cargar fincas → Usuario selecciona finca → Cargar lotes de la finca
```

### 3. Subir Archivo de Spots
```
Seleccionar archivo CSV → Validación automática → Subir → Procesamiento
```

### 4. Ver Resultados
```
Spots insertados → Plantas creadas → Polígonos generados → Lotes actualizados
```

## 🛠️ Funciones de API Disponibles

### Librería: `lib/api.js`

```javascript
import { 
  getFincas, 
  getLotes, 
  uploadSpots, 
  validateCSV,
  setAuthToken,
  getAuthToken
} from '../lib/api';

// Obtener fincas
const fincas = await getFincas();

// Obtener lotes (filtrados por finca)
const lotes = await getLotes(fincaId);

// Subir spots con progreso
const result = await uploadSpots(file, (progress) => {
  console.log(`Progreso: ${progress}%`);
});

// Validar CSV antes de subir
const validation = await validateCSV(file);
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
