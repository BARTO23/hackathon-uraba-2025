# Hackathon Frontend - Next.js

Aplicación web frontend desarrollada con Next.js para el proyecto del Hackathon.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
- El archivo `.env.local` ya está configurado con la URL del backend
- Asegúrate de que el backend esté ejecutándose en `http://localhost:5000`

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Crear build de producción
- `npm start` - Ejecutar en modo producción
- `npm run lint` - Ejecutar linter

## Componentes

### FileUploader
Componente para cargar y validar archivos CSV/Excel.
- Acepta archivos `.csv`, `.xlsx`, `.xls`
- Valida el archivo contra el backend
- Muestra mensajes de error o éxito

### FincaSelector
Componente para seleccionar fincas y ver lotes asociados.
- Carga fincas desde la API
- Permite seleccionar una finca
- Muestra los lotes asociados a la finca seleccionada

### MapDisplay
Componente de mapa interactivo usando Leaflet.
- Muestra ubicaciones en un mapa
- Soporta marcadores personalizados
- Usa React Leaflet para integración con React

## Estructura

```
components/
├── FileUploader.js      # Componente de carga de archivos
├── FincaSelector.js     # Selector de fincas y lotes
└── MapDisplay.js        # Mapa interactivo

pages/
├── _app.js              # Layout global
└── index.js             # Página principal

styles/
├── globals.css          # Estilos globales
└── Home.module.css      # Estilos de la página principal
```

## Tecnologías

- **Next.js 14** - Framework de React
- **React 18** - Biblioteca de UI
- **Leaflet** - Mapas interactivos
- **React Leaflet** - Integración de Leaflet con React
- **PapaParse** - Parser de CSV (para uso futuro)

## Características

- ✅ Interfaz moderna y responsive
- ✅ Integración con API Flask
- ✅ Carga y validación de archivos
- ✅ Visualización de datos en mapa
- ✅ Selector de fincas y lotes
- ✅ Manejo de errores
- ✅ Diseño atractivo con gradientes
