# 🔐 Solución al Error 401 Unauthorized

## 🎯 Problema Actual

Estás recibiendo el error:
```
Error 401: Unauthorized
```

Esto significa que la API está rechazando tu token de autenticación.

## 🧪 Probador de API Integrado

He agregado un **Probador de API** en la interfaz que te permite probar diferentes formatos de autenticación.

### Cómo usar el Probador:

1. **Guarda tu token** en el componente de Autenticación
2. Verás aparecer una nueva sección: **"🧪 Probador de API"**
3. **Selecciona un formato** del menú desplegable:
   - **Token directo**: Envía el token tal cual (formato actual)
   - **Bearer**: Envía `Bearer {token}` (formato común en APIs REST)
   - **Basic**: Envía `Basic {token}` (formato HTTP Basic Auth)
4. Haz clic en **"🚀 Probar Conexión"**
5. Verás el resultado:
   - ✅ **Verde** = Formato correcto, usa ese formato
   - ❌ **Rojo** = Formato incorrecto, prueba otro

## 📋 Formatos Comunes de Autorización

### Formato 1: Token Directo (Actual)
```
Authorization: PHkRgdWVNhsDjLScW/9zWw==
```

### Formato 2: Bearer Token (Común)
```
Authorization: Bearer PHkRgdWVNhsDjLScW/9zWw==
```

### Formato 3: Basic Auth
```
Authorization: Basic PHkRgdWVNhsDjLScW/9zWw==
```

## 🔍 Causas Posibles del Error 401

### 1. **Token Inválido o Expirado**
- El token puede haber expirado
- El token fue revocado
- **Solución**: Solicita un nuevo token al administrador

### 2. **Formato de Header Incorrecto**
- La API espera un formato específico (Bearer, Basic, etc.)
- **Solución**: Usa el Probador de API para encontrar el formato correcto

### 3. **Token Mal Copiado**
- Espacios extras al inicio o final
- Caracteres especiales no copiados correctamente
- **Solución**: Vuelve a copiar el token con cuidado

### 4. **Permisos Insuficientes**
- El token no tiene permisos para acceder a fincas
- **Solución**: Contacta al administrador para verificar permisos

### 5. **Encoding Incorrecto**
- El token tiene caracteres especiales que necesitan encoding
- **Solución**: El sistema maneja esto automáticamente

## 🛠️ Pasos para Resolver

### Paso 1: Verificar el Token
```bash
# Verifica que tu token sea exactamente:
PHkRgdWVNhsDjLScW/9zWw==

# Sin espacios adicionales
# Sin comillas
# Sin caracteres extra
```

### Paso 2: Usar el Probador de API
1. Abre la aplicación en el navegador
2. Configura tu token
3. Usa el **Probador de API**
4. Prueba los 3 formatos disponibles
5. Encuentra cuál funciona (respuesta verde ✅)

### Paso 3: Verificar en la Consola
Abre las DevTools (F12) y busca estos logs:
```
🔍 Request Debug Info:
URL: https://api.sioma.dev/4/usuarios/sujetos
Token (primeros 20 chars): PHkRgdWVNhsDjLScW...
Headers: {Authorization: "...", Content-Type: "...", tipo-sujetos: "[1]"}
Response Status: 401
Response OK: false
```

### Paso 4: Probar con cURL (Verificación Manual)

Prueba directamente con cURL para verificar:

```bash
# Formato 1: Token directo
curl -X GET "https://api.sioma.dev/4/usuarios/sujetos" \
  -H "Authorization: PHkRgdWVNhsDjLScW/9zWw==" \
  -H "Content-Type: application/json" \
  -H "tipo-sujetos: [1]" \
  -v

# Formato 2: Bearer
curl -X GET "https://api.sioma.dev/4/usuarios/sujetos" \
  -H "Authorization: Bearer PHkRgdWVNhsDjLScW/9zWw==" \
  -H "Content-Type: application/json" \
  -H "tipo-sujetos: [1]" \
  -v
```

Si alguno funciona con cURL, ese es el formato correcto.

## 🔄 Actualizar el Código con el Formato Correcto

Una vez que encuentres el formato correcto usando el Probador, puedes actualizar el código:

### Si el formato correcto es "Bearer":

Edita `lib/api.js` línea 76:
```javascript
// Cambiar de:
'Authorization': token,

// A:
'Authorization': `Bearer ${token}`,
```

### Si el formato correcto es "Basic":

Edita `lib/api.js` línea 76:
```javascript
// Cambiar de:
'Authorization': token,

// A:
'Authorization': `Basic ${token}`,
```

## 📞 Contactar al Administrador

Si ningún formato funciona, proporciona esta información al administrador:

```
Token usado: PHkRgdWVNhsDjLScW/9zWw==
Endpoint: GET https://api.sioma.dev/4/usuarios/sujetos
Headers enviados:
  - Authorization: {token}
  - Content-Type: application/json
  - tipo-sujetos: [1]
Error recibido: 401 Unauthorized

Formatos probados:
  ✗ Token directo
  ✗ Bearer {token}
  ✗ Basic {token}

Por favor verifica:
1. ¿El token es válido?
2. ¿Qué formato de Authorization espera la API?
3. ¿El token tiene permisos para ver fincas?
```

## ✅ Checklist de Verificación

- [ ] Token copiado correctamente (sin espacios extra)
- [ ] Token configurado en la aplicación
- [ ] Servidor de desarrollo reiniciado
- [ ] Probador de API ejecutado con los 3 formatos
- [ ] Consola del navegador revisada (F12)
- [ ] Probado manualmente con cURL (opcional)
- [ ] Contactado al administrador si nada funciona

## 🎯 Resultado Esperado

Cuando uses el formato correcto, deberías ver:

```json
[
  {
    "key": "finca_id",
    "grupo": "Prueba_Fincas",
    "sigla": "PRB_F",
    "moneda": "COP",
    "nombre": "1 - Palmita",
    "pago_dia": 47450,
    "key_value": 2362,
    "tipo_sujeto_id": 1,
    "tipo_cultivo_id": 2
  }
]
```

## 💡 Nota Importante

El **Probador de API** se agregó específicamente para ayudarte a encontrar el formato correcto de autorización sin tener que modificar código. Una vez que encuentres el formato que funciona, puedes actualizar el código permanentemente o simplemente usar ese conocimiento para verificar futuras integraciones.
