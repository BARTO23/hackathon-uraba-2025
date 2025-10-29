# 🌴 Iconos Personalizados del Mapa

## Descripción

Los marcadores del mapa ahora usan iconos personalizados SVG en lugar de los pins por defecto de Leaflet.

## 🎨 Diseño de Iconos

### Icono Normal (Palma No Seleccionada)
```
🔴 Círculo rojo con icono de palma blanco
- Color base: #ef4444 (rojo)
- Tamaño: 32x32 px
- Sombra: drop-shadow para profundidad
```

### Icono Seleccionado (Palma Activa)
```
🟢 Círculo verde con icono de palma blanco + indicador amarillo
- Color base: #10b981 (verde)
- Indicador: Punto amarillo en esquina superior derecha
- Tamaño: 32x32 px
- Efecto: Escala 1.15x al hover
```

## 🔧 Componentes del Icono

### Estructura SVG
```svg
<svg width="32" height="32">
  <!-- Círculo base (rojo o verde) -->
  <circle r="14" fill="..." stroke="white"/>
  
  <!-- Tronco de palma -->
  <rect width="3" height="8" fill="white"/>
  
  <!-- Hojas de palma (3 capas) -->
  <path d="..." stroke="white"/>  <!-- Hoja superior -->
  <path d="..." stroke="white"/>  <!-- Hoja media -->
  <path d="..." stroke="white"/>  <!-- Hoja inferior -->
</svg>
```

## ✨ Características

### Interactividad
- **Hover**: El icono crece un 15% (`scale(1.15)`)
- **Click**: Cambia a color verde y añade indicador
- **Smooth**: Transiciones suaves (0.2s ease)

### Visual
- **Sombra**: `drop-shadow(0 2px 4px rgba(0,0,0,0.3))`
- **Borde**: Círculo con borde blanco de 2.5px
- **Contraste**: Icono blanco sobre fondo de color

## 📍 Estados del Marcador

### Estado por Defecto
```javascript
{
  color: '#ef4444',      // Rojo
  selected: false,
  indicator: false
}
```

### Estado Seleccionado
```javascript
{
  color: '#10b981',      // Verde
  selected: true,
  indicator: true,       // Punto amarillo visible
  scale: 1.15            // Al hover
}
```

## 🎯 Función de Creación

```javascript
const createPalmIcon = (isSelected) => {
  return L.divIcon({
    html: `...`,                    // SVG personalizado
    className: 'custom-palm-icon',  // Clase CSS
    iconSize: [32, 32],            // Tamaño del icono
    iconAnchor: [16, 16],          // Punto de anclaje (centro)
    popupAnchor: [0, -16]          // Posición del popup
  });
};
```

## 📦 Archivos Modificados

1. **`components/MapView.js`**
   - Importación de `L` (leaflet)
   - Función `createPalmIcon()`
   - Aplicación del icono en cada `<Marker>`

2. **`styles/Home.module.css`**
   - Estilos globales para `.custom-palm-icon`
   - Efectos de hover
   - Transiciones suaves

## 🎨 Paleta de Colores

| Estado | Color Hex | Nombre |
|--------|-----------|--------|
| Normal | `#ef4444` | Rojo (Tailwind red-500) |
| Seleccionado | `#10b981` | Verde (Tailwind green-500) |
| Indicador | `#fbbf24` | Amarillo (Tailwind amber-400) |
| Borde | `#ffffff` | Blanco |

## 🔄 Actualización Dinámica

Los iconos cambian automáticamente cuando:
1. **Usuario hace click** en un punto del mapa
2. **Usuario selecciona** un punto de la lista lateral
3. **Estado `selectedSpot`** cambia

```javascript
{loteData.map((spot, index) => {
  const isSelected = selectedSpot === index;
  return (
    <Marker
      icon={createPalmIcon(isSelected)}
      // ...
    />
  );
})}
```

## 🚀 Ventajas vs Marcadores Por Defecto

### Antes (Leaflet Default)
❌ Pin azul genérico
❌ No representa palmas
❌ No distingue selección
❌ Diseño no personalizado

### Ahora (Iconos Personalizados)
✅ Icono de palma temático
✅ Colores: Rojo (normal) / Verde (seleccionado)
✅ Indicador visual de selección
✅ Efecto hover para feedback
✅ Diseño consistente con la app
✅ SVG escalable sin pérdida de calidad

## 🎭 Ejemplo Visual

```
Mapa con iconos:

    🔴 🔴 🔴 🔴       ← Palmas normales (rojas)
  🔴 🟢* 🔴 🔴 🔴     ← Palma seleccionada (verde con indicador)
    🔴 🔴 🔴 🔴       
      🔴 🔴          

*Indicador amarillo en esquina superior derecha
```

## 📱 Responsive

Los iconos funcionan perfectamente en:
- ✅ Desktop (hover funciona)
- ✅ Tablet (touch funciona)
- ✅ Mobile (touch funciona)

## 🔍 Accesibilidad

- **Contraste**: Icono blanco sobre fondo de color cumple WCAG
- **Tamaño**: 32px suficientemente grande para touch
- **Feedback**: Visual claro al interactuar
- **Cursor**: Cambia a pointer al hover

## 💡 Personalización Futura

Si quieres cambiar los iconos:

### Cambiar Colores
```javascript
// En MapView.js, línea 17
fill="${isSelected ? '#TU_COLOR_VERDE' : '#TU_COLOR_ROJO'}"
```

### Cambiar Tamaño
```javascript
// En MapView.js, línea 32
iconSize: [40, 40],      // Más grande
iconAnchor: [20, 20],    // Ajustar centro
```

### Cambiar Diseño SVG
```javascript
// Edita el contenido del `html` en createPalmIcon()
// Puedes usar cualquier SVG
```

## ✅ Resultado

Los marcadores ahora:
- 🎨 Son visualmente atractivos
- 🌴 Representan claramente palmas
- 🎯 Indican selección con color
- ✨ Tienen animaciones suaves
- 📍 Son fáciles de identificar en el mapa
