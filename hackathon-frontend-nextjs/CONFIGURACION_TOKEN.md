# Configuración del Token de Autenticación

## Pasos para Configurar el Token Automático

Ahora el sistema detecta el token de autenticación automáticamente desde las variables de entorno. Ya no es necesario que el usuario ingrese el token manualmente en la interfaz.

### 1. Crear el archivo `.env.local`

En la raíz del proyecto `hackathon-frontend-nextjs`, crea un archivo llamado `.env.local` (si no existe).

### 2. Agregar el Token

Agrega las siguientes líneas al archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.sioma.dev
NEXT_PUBLIC_AUTH_TOKEN=tu_token_de_autenticacion_aqui
```

### 3. Reemplazar el Token

Reemplaza `tu_token_de_autenticacion_aqui` con tu token real de autenticación de Sioma.

### 4. Reiniciar el Servidor de Desarrollo

Si el servidor de desarrollo está corriendo, debes reiniciarlo para que cargue las nuevas variables de entorno:

```bash
# Detén el servidor con Ctrl+C y luego ejecuta:
npm run dev
```

## Verificación

Una vez configurado:
1. La aplicación cargará automáticamente los datos sin solicitar el token
2. El selector de fincas se cargará inmediatamente al abrir la aplicación
3. No verás la sección de "Configuración de Autenticación"

## Notas de Seguridad

- ⚠️ **IMPORTANTE**: El archivo `.env.local` está en `.gitignore` y NO debe ser subido a Git
- No compartas tu token con nadie
- No lo incluyas en capturas de pantalla o logs públicos
- Si el token se compromete, solicita uno nuevo al administrador

## Solución de Problemas

### El token no funciona
1. Verifica que el archivo se llame exactamente `.env.local`
2. Verifica que la línea comience con `NEXT_PUBLIC_AUTH_TOKEN=`
3. No debe haber espacios alrededor del `=`
4. Reinicia el servidor de desarrollo

### Error 401 - No autorizado
1. Verifica que el token sea válido
2. Contacta al administrador para obtener un nuevo token
3. Revisa que el token esté copiado completamente sin espacios extras

## Cambios Realizados

- ✅ El token ahora se configura en `.env.local`
- ✅ Eliminada la interfaz de ingreso manual de token
- ✅ Los datos se cargan automáticamente al iniciar la aplicación
- ✅ No se requiere autenticación manual del usuario
