# 🌱 Interfaz Inteligente de Spots - Hackathon Urabá 2025

Aplicación web completa para validar, visualizar y enviar datos georreferenciados de cultivos de palma. Desarrollada con Next.js para el Hackathon Urabá 2025.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
```
Edita `.env.local` y configura tu token de autenticación:
```bash
NEXT_PUBLIC_API_URL=https://api.sioma.dev
NEXT_PUBLIC_AUTH_TOKEN=tu_token_de_sioma_aqui
```
**⚠️ IMPORTANTE**: Reemplaza `tu_token_de_sioma_aqui` con tu token real de autenticación.

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🚀 Inicio Rápido

1. **Configura tu token** en `.env.local` (ver sección de Instalación)
2. **Inicia la aplicación** con `npm run dev`
3. **La aplicación cargará automáticamente** todas las fincas disponibles
   - ✅ Verás un mensaje de éxito si todo funciona
   - ❌ Verás el error específico si hay problemas
4. **Selecciona una finca** desde el dropdown
5. **Carga tu archivo CSV** con los datos de spots
6. **Valida los datos** - el sistema detectará errores automáticamente
7. **Visualiza en el mapa** los spots por lote
8. **Envía los datos** a la API de Sioma

## Scripts

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Crear build de producción
- `npm start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter

## 📦 Componentes Principales

### Autenticación
Sistema de autenticación automática con la API.
- Token configurado mediante variables de entorno (`.env.local`)
- Detección automática del token al iniciar
- No requiere intervención manual del usuario
- Ver `CONFIGURACION_TOKEN.md` para instrucciones detalladas

### FincaSelector
Selector de fincas con carga automática de lotes.
- **Carga automática** de fincas al iniciar la aplicación
- **Muestra todos los datos** traídos exitosamente
- **Muestra errores claramente** si hay problemas de conexión o autenticación
- Carga lotes asociados a cada finca seleccionada
- Contador de fincas y lotes disponibles

### DataValidator
Sistema completo de validación de datos.
- **Parse automático de CSV/Excel** con PapaParse
- **5 tipos de validaciones:**
  - ❌ Coordenadas duplicadas
  - ❌ Campos faltantes
  - ❌ Lotes inválidos
  - ❌ Líneas repetidas en lote
  - ❌ Posiciones repetidas en línea
- **Reporte detallado de errores** por fila
- **Descarga de CSV con errores** para corrección
- Instrucciones claras de cómo corregir

### ValidationReport
Visualización completa del reporte de validación.
- Tarjetas resumen con estadísticas
- Desglose por tipo de error
- Lista detallada de problemas
- Opciones para descargar reporte
- Indicaciones de qué hacer siguiente

### LoteMapViewer
Visualización avanzada de mapa por lote.
- **Selección de lote individual** (evita sobrecarga)
- **Perímetro del lote** (polígono automático)
- **Líneas de palmas** con colores diferentes
- **Marcadores de spots** con info detallada
- **Ajuste automático de zoom** a los bounds
- **Leyenda interactiva**
- **Lista de líneas** con estadísticas

### FileUploader
Upload de archivos validados a la API.
- Envío a endpoint `/api/v1/spots/upload`
- Barra de progreso en tiempo real
- Resultados del procesamiento
- Manejo robusto de errores

## 📁 Estructura del Proyecto

```
hackathon-frontend-nextjs/
├── components/
│   ├── AuthConfig.js          # Sistema de autenticación
│   ├── ApiTester.js           # Probador interactivo de API
│   ├── FincaSelector.js       # Selector de fincas y lotes
│   ├── DataValidator.js       # Validación de archivos CSV
│   ├── ValidationReport.js    # Reporte de validación
│   ├── LoteMapViewer.js       # Mapa avanzado por lote
│   └── FileUploader.js        # Upload a API
├── lib/
│   ├── api.js                 # Funciones de API (getFincas, getLotes, uploadSpots)
│   └── validator.js           # Sistema de validaciones
├── pages/
│   ├── _app.js                # Layout global
│   └── index.js               # Flujo principal (4 pasos)
├── styles/
│   ├── globals.css            # Estilos globales
│   └── Home.module.css        # Estilos completos (1200+ líneas)
├── .env.example               # Template de variables
└── README.md                  # Este archivo
```

## 🔧 Tecnologías

- **Next.js 14.0.4** - Framework de React con SSR
- **React 18.2.0** - Biblioteca de UI
- **Leaflet 1.9.4** - Mapas interactivos
- **React Leaflet 4.2.1** - Integración de Leaflet con React
- **PapaParse 5.4.1** - Parser de CSV/Excel

## ✨ Características Completas

### 🔐 Autenticación
- ✅ Configuración de token sin verificación (acepta cualquier token)
- ✅ Almacenamiento en localStorage
- ✅ Probador de API con 5 formatos diferentes
- ✅ Auto-test para encontrar formato correcto

### 📋 Validación de Datos
- ✅ **5 validaciones implementadas:**
  1. Coordenadas duplicadas
  2. Campos faltantes (lat, lng, línea, posición, lote)
  3. Lotes inválidos (vs finca seleccionada)
  4. Líneas repetidas dentro del mismo lote
  5. Posiciones repetidas dentro de la misma línea
- ✅ Reporte detallado con número de fila
- ✅ Descarga de CSV con errores
- ✅ Instrucciones de corrección
- ✅ Detección automática de nombres de columnas

### 🗺️ Visualización Geográfica
- ✅ **Mapa por lote individual** (no toda la finca)
- ✅ Perímetro automático del lote (convex hull)
- ✅ Líneas de palmas con colores diferentes
- ✅ Marcadores con popups informativos
- ✅ Zoom automático a bounds
- ✅ Leyenda interactiva
- ✅ Estadísticas por lote

### 📤 Envío de Datos
- ✅ Upload a `/api/v1/spots/upload`
- ✅ Validación previa antes de envío
- ✅ Barra de progreso en tiempo real
- ✅ Resultados detallados del procesamiento
- ✅ Manejo robusto de errores

### 🎨 Interfaz de Usuario
- ✅ Diseño moderno y responsive
- ✅ Flujo de 4 pasos claramente definido
- ✅ Gradientes y animaciones
- ✅ Tarjetas informativas
- ✅ Mobile-friendly
- ✅ Feedback visual constante

## 🔄 Flujo de Usuario

### Paso 1️⃣: Autenticación
1. Ingresar token de Sioma
2. (Opcional) Probar formato con ApiTester
3. Token se guarda en localStorage

### Paso 2️⃣: Selección de Finca
1. Sistema obtiene fincas desde API
2. Usuario selecciona finca del dropdown
3. Sistema carga lotes asociados automáticamente

### Paso 3️⃣: Validación de Datos
1. Usuario carga archivo CSV/Excel
2. Sistema parsea automáticamente
3. Ejecuta 5 tipos de validaciones
4. Muestra reporte detallado
5. Si hay errores:
   - Usuario descarga reporte
   - Corrige archivo
   - Vuelve a cargar
6. Si es válido: Continúa a visualización

### Paso 4️⃣: Visualización
1. Usuario selecciona lote del dropdown
2. Mapa muestra:
   - Perímetro del lote
   - Líneas de palmas (colores por línea)
   - Spots individuales con info
3. Usuario verifica visualmente coherencia

### Paso 5️⃣: Envío Final
1. Usuario confirma envío
2. Sistema sube archivo a `/api/v1/spots/upload`
3. Muestra progreso en tiempo real
4. Presenta resultados:
   - Spots insertados
   - Plantas insertadas
   - Polígonos generados
   - Lotes actualizados

## 📋 Formato de Archivo CSV

### Columnas Obligatorias
```csv
Latitud,Longitud,Línea palma,Posición palma,Lote
7.336576854,-76.72322992,1,1,1
7.336536382,-76.72316139,1,2,1
```

El sistema detecta automáticamente variaciones de nombres:
- `Latitud` o `lat` o `latitude`
- `Longitud` o `lng` o `longitude`
- `Línea palma` o `linea` o `linea_palma`
- `Posición palma` o `posicion` o `posicion_palma`
- `Lote` o `lote_id`

## 🐛 Troubleshooting

### Error 401 Unauthorized
1. Usa el **ApiTester** para encontrar el formato correcto
2. Haz clic en "Probar Todos" para auto-detectar
3. O prueba manualmente: direct, bearer, basic, token, apikey
4. Contacta al administrador de Sioma si nada funciona

### Validaciones Fallan
- Verifica que las columnas tengan los nombres esperados
- Revisa que no haya espacios extras
- Asegúrate de que sea UTF-8 o Latin-1

### Mapa No Carga
- Verifica que Leaflet esté instalado: `npm install leaflet react-leaflet`
- Reinicia el servidor de desarrollo

## 📚 Documentación Adicional

- `README_API_INTEGRATION.md` - Documentación completa de la API
- `TROUBLESHOOTING.md` - Guía de solución de problemas
- `ERROR_401_SOLUTION.md` - Solución específica para error 401

## 🎯 Criterios de Hackathon Cumplidos

| Criterio | Peso | Estado |
|----------|------|--------|
| Integración técnica (archivo + API) | 30% | ✅ Completo |
| Validación de datos | 25% | ✅ 5 validaciones implementadas |
| Visualización correcta | 20% | ✅ Mapa por lote con líneas y perímetro |
| UX/UI y flujo de usuario | 15% | ✅ Flujo de 4 pasos intuitivo |
| Código y documentación | 10% | ✅ Código organizado + README completo |

## 👥 Equipo

Desarrollado para el Hackathon Urabá 2025

## 📝 Licencia

Proyecto del Hackathon - Todos los derechos reservados
