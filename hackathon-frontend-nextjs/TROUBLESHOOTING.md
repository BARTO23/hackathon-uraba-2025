# 🔧 Guía de Solución de Problemas

## ❌ Error: "Failed to fetch" al cargar fincas

Este error generalmente ocurre por una de estas razones:

### 1. **Archivo .env.local no configurado**

Verifica que existe el archivo `.env.local` en la raíz del proyecto:

```bash
# Crear el archivo si no existe
NEXT_PUBLIC_API_URL=https://api.sioma.dev
```

**Ubicación correcta:**
```
hackathon-frontend-nextjs/
├── .env.local          ← Debe estar aquí
├── package.json
├── pages/
└── ...
```

### 2. **Problema de CORS**

El servidor de la API debe permitir solicitudes desde tu dominio local (`http://localhost:3000`).

**Solución:**
- Contacta al administrador de la API para agregar CORS
- O usa un proxy en desarrollo

### 3. **URL de la API incorrecta**

Verifica la URL en la consola del navegador:
1. Abre las DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca el log: `API URL: ...`
4. Verifica que sea `https://api.sioma.dev`

### 4. **Token incorrecto**

Aunque el token se acepta sin validación, el servidor puede rechazarlo:
- Verifica que el token sea correcto
- Contacta al administrador para obtener un token válido

### 5. **Servidor API no disponible**

Verifica que el servidor esté funcionando:
```bash
# Prueba en el navegador o con curl
curl -X GET "https://api.sioma.dev/4/usuarios/sujetos" \
  -H "Authorization: TU_TOKEN" \
  -H "Content-Type: application/json" \
  -H "tipo-sujetos: [1]"
```

## 🔍 Pasos de Diagnóstico

### 1. Verificar Configuración

Abre la consola del navegador (F12) y busca estos logs:
```
Intentando cargar fincas...
API URL: https://api.sioma.dev
```

### 2. Verificar Network Tab

1. Abre DevTools → Network
2. Recarga la página
3. Busca la petición a `/4/usuarios/sujetos`
4. Revisa:
   - **Status Code**: ¿200, 401, 403, 500?
   - **Headers**: ¿Se envía el token?
   - **Response**: ¿Qué responde el servidor?

### 3. Verificar CORS

Si ves este error en la consola:
```
Access to fetch at '...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solución temporal - Usar proxy:**

Edita `next.config.js`:
```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.sioma.dev/:path*',
      },
    ];
  },
};
```

Luego cambia `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🛠️ Soluciones Rápidas

### Opción A: Reiniciar el servidor de desarrollo

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar
npm run dev
```

### Opción B: Verificar que .env.local existe

```bash
# En la carpeta del proyecto
ls .env.local
# o en Windows
dir .env.local
```

Si no existe:
```bash
echo NEXT_PUBLIC_API_URL=https://api.sioma.dev > .env.local
```

### Opción C: Limpiar caché y reinstalar

```bash
# Limpiar
rm -rf .next
rm -rf node_modules

# Reinstalar
npm install

# Iniciar
npm run dev
```

## 📞 Contacto con el Administrador

Si el problema persiste, proporciona esta información al administrador:

1. **URL que se está usando**: (Ver en consola)
2. **Token que se está enviando**: (Primeros 10 caracteres)
3. **Error exacto**: (Copiar de la consola)
4. **Headers enviados**: (Ver en Network tab)
5. **Response del servidor**: (Ver en Network tab)

## ✅ Checklist de Verificación

- [ ] Archivo `.env.local` existe y tiene `NEXT_PUBLIC_API_URL`
- [ ] Servidor de desarrollo reiniciado después de crear `.env.local`
- [ ] Token configurado en la aplicación
- [ ] Consola muestra la URL correcta
- [ ] Network tab muestra la petición siendo enviada
- [ ] No hay errores de CORS en la consola

## 🔗 Testing Manual con cURL

Prueba la API directamente:

```bash
# Reemplaza TU_TOKEN con tu token real
curl -X GET "https://api.sioma.dev/4/usuarios/sujetos" \
  -H "Authorization: TU_TOKEN" \
  -H "Content-Type: application/json" \
  -H "tipo-sujetos: [1]" \
  -v
```

Si esto funciona pero la app no, el problema es en el frontend.
Si esto no funciona, el problema es con el token o la API.
