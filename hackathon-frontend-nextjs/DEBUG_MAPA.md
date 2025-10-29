# 🔍 Guía de Debugging para LoteMapViewer

## Problema
El componente `LoteMapViewer` no se está mostrando en la aplicación.

## ✅ Correcciones Aplicadas

1. **Importación de `useMap`** - Ahora se importa dinámicamente dentro de MapBounds
2. **Mensajes de debugging** - Console.logs para rastrear el flujo
3. **Validaciones mejoradas** - Mensajes claros para cada caso

## 🔍 Cómo Verificar

### Paso 1: Abrir la Consola del Navegador
1. Presiona `F12` en tu navegador
2. Ve a la pestaña **Console**
3. Busca estos mensajes:

```
🗺️ LoteMapViewer montado
Datos válidos recibidos: X
Lotes recibidos: X
📊 validData cambió: X filas
```

### Paso 2: Verificar el Flujo Completo

#### A. Seleccionar Finca
- Deberías ver: `✅ X fincas cargadas exitosamente`
- Selecciona una finca del dropdown

#### B. Cargar Archivo CSV
- Click en "Seleccionar Archivo"
- Elige tu CSV con coordenadas
- Click en "🔍 Validar Datos"

#### C. Verificar Validación
Deberías ver uno de estos paneles:

**Si hay errores:**
```
🧹 Limpieza Automática Aplicada
🗑️ X filas removidas
📋 X duplicados removidos
```

**Si validación es exitosa:**
```
✅ Todos los datos son válidos
```

#### D. Ver el Mapa
- Solo aparece si la validación es exitosa
- Busca la sección: "Paso 3️⃣: Visualización por Lote"

### Paso 3: Mensajes Posibles

#### ⏳ "Cargando mapa interactivo..."
- El mapa se está iniciando
- Espera 1-2 segundos

#### ⚠️ "No hay datos válidos para mostrar en el mapa"
- **Causa**: La validación encontró errores o no hay datos
- **Solución**: Revisa el reporte de validación y corrige el archivo

#### ⚠️ "No hay lotes disponibles"
- **Causa**: No seleccionaste una finca
- **Solución**: Ve al Paso 1 y selecciona una finca

#### ✅ Mapa visible con datos
- Panel lateral con información del lote
- Mapa satelital con puntos rojos
- ¡Todo funcionando correctamente!

## 🐛 Problemas Comunes

### 1. El mapa no aparece después de validar

**Verifica en la consola:**
```javascript
🗺️ LoteMapViewer montado
```

Si NO ves este mensaje, significa que el componente no se está renderizando porque:
- La validación tiene errores
- `showMap` es false

**Solución:**
- Revisa que el CSV no tenga errores
- Asegúrate de que la validación sea exitosa (✅)

### 2. Error "useMap is not a function"

**Ya corregido** - El componente MapBounds ahora importa useMap correctamente.

### 3. Mapa se ve en blanco

**Verifica:**
```javascript
Datos válidos recibidos: 0  ← Problema aquí
```

Si es 0, significa que:
- No hay datos válidos después de la limpieza
- Todos fueron removidos como duplicados o inválidos

**Solución:**
- Revisa el panel de limpieza automática
- Verifica que el CSV tenga coordenadas válidas

### 4. Error de Leaflet o react-leaflet

**Síntomas:**
- Consola muestra errores de importación
- "window is not defined"

**Solución:**
- Ya está configurado con `dynamic import` y `ssr: false`
- Reinicia el servidor: `Ctrl+C` → `npm run dev`

## 📊 Flujo Esperado

```
1. Usuario abre app
   ↓
2. Selecciona finca
   ✅ Lotes cargados
   ↓
3. Carga archivo CSV
   ↓
4. Sistema valida automáticamente
   🧹 Limpieza aplicada
   ↓
5. Si validación exitosa:
   ✅ showMap = true
   📊 validation.isValid = true
   📦 validation.validData tiene datos
   ↓
6. Renderiza LoteMapViewer
   🗺️ LoteMapViewer montado
   ↓
7. Mapa visible con datos GPS
```

## 🔧 Comandos de Debugging

### En la consola del navegador:
```javascript
// Verificar estado de validación
console.log(validation)

// Verificar datos válidos
console.log(validation?.validData?.length)

// Verificar si showMap está activo
console.log(showMap)
```

### Si nada funciona:

1. **Limpia caché del navegador**
   - `Ctrl + Shift + Delete`
   - Borra caché y cookies

2. **Reinicia el servidor**
   ```bash
   Ctrl + C
   npm run dev
   ```

3. **Verifica que leaflet esté instalado**
   ```bash
   npm list leaflet react-leaflet
   ```

## ✅ Checklist de Verificación

- [ ] Servidor corriendo en http://localhost:3000 o 3001
- [ ] Finca seleccionada
- [ ] Archivo CSV cargado
- [ ] Validación completada sin errores
- [ ] Consola muestra "🗺️ LoteMapViewer montado"
- [ ] Consola muestra "Datos válidos recibidos: X" (X > 0)
- [ ] Sección "Paso 3️⃣" visible
- [ ] Mapa satelital renderizado
- [ ] Puntos rojos visibles

Si todos los checks pasan, el mapa debería estar visible y funcional.

## 📞 Información de Debug

Copia esta información si necesitas ayuda adicional:

```
- Navegador: [Chrome/Firefox/Edge]
- Sistema: Windows
- Node Version: [ejecuta: node -v]
- Next.js: 14.0.4
- React: 18.2.0
- Leaflet: 1.9.4
- React-Leaflet: 4.2.1
```
