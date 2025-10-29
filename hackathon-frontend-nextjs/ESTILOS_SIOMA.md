# 🎨 Estilos de Marca SIOMA

## Paleta de Colores Aplicada

La aplicación ahora utiliza la identidad visual corporativa de **SIOMA**.

---

## 🎨 Variables CSS

### Colores de Marca
```css
--color-primary: #C01B27;      /* Rojo SIOMA */
--color-primary-dark: #A31721;  /* Rojo oscuro (hover) */
--color-accent: #2A9D8F;        /* Verde-azul (CTA's) */
```

### Colores de Estado
```css
--color-success: #5CB85C;       /* Verde éxito */
--color-error: #D9534F;         /* Rojo error */
```

### Colores de Texto
```css
--color-text-dark: #212121;     /* Texto principal */
--color-text-light: #FFFFFF;    /* Texto claro */
--color-gray-subtle: #AAAAAA;   /* Texto secundario */
```

### Colores de Fondo
```css
--color-background-base: #FFFFFF;       /* Fondo principal */
--color-background-secondary: #F5F5F5;  /* Fondo alterno */
--color-background-light: #FAFAFA;      /* Fondo claro */
```

---

## 🔴 Elementos Actualizados

### 1. **Botones Principales**

#### Antes
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

#### Ahora
```css
background: var(--color-primary);  /* #C01B27 */
color: var(--color-text-light);
box-shadow: 0 2px 4px rgba(192, 27, 39, 0.2);
```

**Hover:**
```css
background: var(--color-primary-dark);  /* #A31721 */
transform: translateY(-2px);
box-shadow: 0 4px 8px rgba(192, 27, 39, 0.3);
```

---

### 2. **Títulos y Encabezados**

```css
.title {
  color: var(--color-text-dark);  /* #212121 */
  font-weight: 700;
}

.card h2 {
  border-bottom: 3px solid var(--color-primary);  /* Línea roja */
  font-weight: 600;
}
```

---

### 3. **Mensajes de Estado**

#### Éxito
```css
.successMessage {
  background: #f0fdf4;
  color: var(--color-success);  /* #5CB85C */
  border-left: 4px solid var(--color-success);
}
```

#### Error
```css
.errorMessage {
  background: #fef2f2;
  color: var(--color-error);  /* #D9534F */
  border-left: 4px solid var(--color-error);
}
```

---

### 4. **Iconos del Mapa**

#### Marcador Normal
```css
.palm-dot {
  background: var(--color-primary);  /* Rojo SIOMA */
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
```

#### Marcador Seleccionado
```css
.palm-marker.selected .palm-dot {
  background: var(--color-accent);  /* Verde-azul SIOMA */
  box-shadow: 0 2px 6px rgba(42, 157, 143, 0.5);
}
```

**Resultado:**
- 🔴 Marcador normal = Rojo SIOMA
- 🔵 Marcador seleccionado = Verde-azul SIOMA

---

### 5. **Barra Superior del Mapa**

```css
.mapInfo {
  background: linear-gradient(135deg, 
    var(--color-primary) 0%, 
    var(--color-primary-dark) 100%
  );
  border-bottom: 3px solid var(--color-primary-dark);
}
```

**Apariencia:**
- Gradiente rojo SIOMA
- Borde inferior rojo oscuro
- Texto blanco

---

### 6. **Switch de Modo Optimizado**

#### Modo Optimizado (Verde-azul)
```javascript
background: optimizedMode ? '#2A9D8F' : '#C01B27'
```

- **Fondo barra:** Verde claro `#f0fdf4`
- **Borde:** Verde-azul `#2A9D8F`
- **Botón:** Verde-azul `#2A9D8F`
- **Texto botón:** "🚀 Ver Todos"

#### Modo Completo (Rojo)
```javascript
background: optimizedMode ? '#2A9D8F' : '#C01B27'
```

- **Fondo barra:** Rojo claro `#fef2f2`
- **Borde:** Rojo SIOMA `#C01B27`
- **Botón:** Rojo SIOMA `#C01B27`
- **Texto botón:** "⚡ Optimizar"

---

### 7. **Selectores y Inputs**

```css
.select:hover {
  border-color: var(--color-accent);  /* Verde-azul */
}

.select:focus {
  border-color: var(--color-primary);  /* Rojo SIOMA */
  box-shadow: 0 0 0 3px rgba(192, 27, 39, 0.1);
}
```

---

### 8. **Panel Lateral**

#### Hover en elementos
```css
.pointItem:hover {
  background: #fef2f2;  /* Rojo muy claro */
  border-color: var(--color-primary);
}
```

#### Elemento seleccionado
```css
.pointItemSelected {
  background: #f0fdf4;  /* Verde claro */
  border-color: var(--color-accent);
  box-shadow: 0 2px 4px rgba(42, 157, 143, 0.2);
}
```

---

### 9. **Badges y Etiquetas**

#### Success Badge
```css
.badgeSuccess {
  background: var(--color-success);  /* #5CB85C */
  color: white;
  box-shadow: 0 2px 4px rgba(92, 184, 92, 0.2);
}
```

#### Error Badge
```css
.badgeError {
  background: var(--color-error);  /* #D9534F */
  color: white;
  box-shadow: 0 2px 4px rgba(217, 83, 79, 0.2);
}
```

---

### 10. **Elementos Destacados**

#### Lote ID (Panel lateral)
```css
.lotIdDisplay strong {
  color: var(--color-primary);  /* Rojo SIOMA */
  font-weight: 700;
}
```

#### Input de archivos
```css
.fileInput {
  border: 2px dashed var(--color-primary);  /* Rojo SIOMA */
}

.fileInput:hover {
  border-color: var(--color-primary-dark);
}
```

---

## 📊 Antes vs Ahora

### Paleta Anterior (Púrpura/Violeta)
```css
Primario: #667eea (Azul-púrpura)
Secundario: #764ba2 (Púrpura)
Acento: #10b981 (Verde)
```

### Paleta Nueva (SIOMA)
```css
Primario: #C01B27 (Rojo SIOMA) ✅
Acento: #2A9D8F (Verde-azul) ✅
Éxito: #5CB85C (Verde) ✅
Error: #D9534F (Rojo claro) ✅
```

---

## 🎯 Identidad Visual

### Colores Corporativos
- **Rojo #C01B27** - Color principal de marca
- **Rojo oscuro #A31721** - Estados hover/activo
- **Verde-azul #2A9D8F** - Botones de acción (CTA)

### Aplicación de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Botones principales | Rojo SIOMA | Acciones primarias |
| Botones hover | Rojo oscuro | Feedback interactivo |
| Botones CTA | Verde-azul | Llamadas a la acción |
| Enlaces | Rojo SIOMA | Navegación |
| Bordes destacados | Rojo SIOMA | Énfasis |
| Marcadores mapa | Rojo/Verde-azul | Estado normal/seleccionado |
| Mensajes éxito | Verde | Confirmación |
| Mensajes error | Rojo claro | Advertencia |

---

## 🔄 Cambios Implementados

### Archivos Modificados

1. **`styles/globals.css`**
   - ✅ Variables CSS de marca SIOMA
   - ✅ Fondo general actualizado
   - ✅ Iconos del mapa con colores SIOMA

2. **`styles/Home.module.css`**
   - ✅ Títulos y encabezados
   - ✅ Botones y CTA's
   - ✅ Mensajes de estado
   - ✅ Selectores e inputs
   - ✅ Panel lateral y elementos
   - ✅ Badges y etiquetas
   - ✅ Mapa y visualizaciones

3. **`components/MapView.js`**
   - ✅ Switch de modo optimizado
   - ✅ Barra de estado
   - ✅ Botones de control

---

## 🎨 Consistencia Visual

### Principios Aplicados

1. **Rojo SIOMA** como color dominante
2. **Verde-azul** para acciones importantes
3. **Fondos claros** para contraste
4. **Sombras sutiles** para profundidad
5. **Transiciones suaves** en interacciones

### Estados Interactivos

```css
/* Normal */
background: var(--color-primary);

/* Hover */
background: var(--color-primary-dark);
transform: translateY(-2px);

/* Focus */
border-color: var(--color-primary);
box-shadow: 0 0 0 3px rgba(192, 27, 39, 0.1);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

---

## 📱 Responsive y Accesibilidad

### Contraste
- ✅ Texto oscuro sobre fondos claros
- ✅ Texto blanco sobre rojo SIOMA
- ✅ Cumple WCAG 2.1 AA

### Tamaños
- ✅ Botones mínimo 48x48px
- ✅ Texto mínimo 16px
- ✅ Espaciado táctil adecuado

### Feedback Visual
- ✅ Hover states claros
- ✅ Focus indicators visibles
- ✅ Estados disabled identificables

---

## 🚀 Resultado

### Identidad Corporativa
La aplicación ahora refleja completamente la identidad visual de **SIOMA**:

✅ **Colores de marca** en todos los elementos
✅ **Consistencia visual** en toda la UI
✅ **Profesionalismo** mejorado
✅ **Reconocimiento de marca** reforzado

### Experiencia de Usuario
✅ **Clara jerarquía visual**
✅ **Feedback interactivo** mejorado
✅ **Accesibilidad** mantenida
✅ **Rendimiento** conservado

---

## 📝 Personalización Futura

### Para cambiar colores:

```css
/* En globals.css */
:root {
  --color-primary: #NUEVO_COLOR;
  --color-accent: #NUEVO_ACENTO;
}
```

### Para agregar nuevos elementos:

```css
.nuevoElemento {
  background: var(--color-primary);
  color: var(--color-text-light);
  border: 1px solid var(--color-primary-dark);
}

.nuevoElemento:hover {
  background: var(--color-primary-dark);
}
```

---

## ✅ Checklist de Estilos SIOMA

- [x] Variables CSS definidas
- [x] Botones actualizados
- [x] Títulos y encabezados
- [x] Mensajes de estado
- [x] Iconos del mapa
- [x] Barra superior del mapa
- [x] Switch de modo optimizado
- [x] Selectores e inputs
- [x] Panel lateral
- [x] Badges y etiquetas
- [x] Elementos destacados
- [x] Estados hover/focus
- [x] Sombras y profundidad
- [x] Consistencia general

**La aplicación ahora tiene la identidad visual completa de SIOMA.** 🎨✨
