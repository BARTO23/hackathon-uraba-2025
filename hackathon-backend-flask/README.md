# Hackathon Backend - Flask API

API REST desarrollada con Flask para el proyecto del Hackathon.

## Instalación

1. Crear un entorno virtual:
```bash
python -m venv venv
```

2. Activar el entorno virtual:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno:
- Copiar `.env.example` a `.env`
- Actualizar las variables con tus credenciales

5. Ejecutar la aplicación:
```bash
python run.py
```

O usando Flask CLI:
```bash
flask run
```

## Endpoints

### GET /api/v1/fincas
Obtiene la lista de fincas desde la API de Sioma.

### GET /api/v1/lotes
Obtiene la lista de lotes. Acepta `finca_id` como query parameter.

### POST /api/v1/validate-file
Valida un archivo CSV/Excel.
- Body: form-data con key `file`

### POST /api/v1/submit
Envía datos transformados a la API de Sioma.
- Body: JSON con los datos a enviar

## Estructura

```
app/
├── __init__.py          # Fábrica de la app y configuración de CORS
├── api/                 # Endpoints de la API
│   ├── __init__.py
│   └── routes.py
└── core/                # Lógica de negocio
    ├── file_reader.py   # Lectura de archivos con Pandas
    ├── sioma_client.py  # Cliente para la API de Sioma
    └── validator.py     # Validación y transformación de datos
```

## Pruebas

```bash
python -m pytest tests/
```
