/**
 * Servicio de API para comunicación con el backend de Sioma
 * Documentación: https://api.sioma.dev
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sioma.dev';

/**
 * Obtiene el token de autenticación de las variables de entorno
 * @returns {string|null} Token de autenticación
 */
export const getAuthToken = () => {
  return process.env.NEXT_PUBLIC_AUTH_TOKEN || null;
};

/**
 * Guarda el token de autenticación (no utilizado, el token viene de variables de entorno)
 * @param {string} token - Token de autenticación
 * @deprecated El token ahora se configura mediante variables de entorno
 */
export const setAuthToken = (token) => {
  console.warn('setAuthToken está deprecado. El token se configura mediante NEXT_PUBLIC_AUTH_TOKEN en .env.local');
};

/**
 * Elimina el token de autenticación (no utilizado, el token viene de variables de entorno)
 * @deprecated El token ahora se configura mediante variables de entorno
 */
export const removeAuthToken = () => {
  console.warn('removeAuthToken está deprecado. El token se configura mediante NEXT_PUBLIC_AUTH_TOKEN en .env.local');
};

/**
 * Obtiene el ID de usuario del localStorage
 * @returns {string|null} ID de usuario
 */
export const getUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id');
  }
  return null;
};

/**
 * Guarda el ID de usuario en localStorage
 * @param {string} userId - ID de usuario
 */
export const setUserId = (userId) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_id', userId);
  }
};

/**
 * Obtiene todas las fincas activas del usuario
 * Endpoint: GET /4/usuarios/sujetos
 * @returns {Promise<Array>} Lista de fincas
 */
export const getFincas = async () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor configura tu token.');
  }

  try {
    const url = `${API_BASE_URL}/4/usuarios/sujetos`;
    const headers = {
      'Authorization': token,
      'Content-Type': 'application/json',
      'tipo-sujetos': '[1]', // 1 = Fincas
    };
    
    console.log('🔍 Request Debug Info:');
    console.log('URL:', url);
    console.log('Token (primeros 20 chars):', token.substring(0, 20) + '...');
    console.log('Headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: headers,
    });

    console.log('Response Status:', response.status);
    console.log('Response OK:', response.ok);

    if (!response.ok) {
      const error = await response.text();
      console.error('Error Response:', error);
      throw new Error(`Error ${response.status}: ${error || response.statusText}`);
    }

    const data = await response.json();
    
    // Transformar la respuesta al formato esperado por el frontend
    return data.map(finca => ({
      id: finca.key_value,
      nombre: finca.nombre,
      grupo: finca.grupo,
      sigla: finca.sigla,
      moneda: finca.moneda,
      pago_dia: finca.pago_dia,
      tipo_sujeto_id: finca.tipo_sujeto_id,
      tipo_cultivo_id: finca.tipo_cultivo_id
    }));
  } catch (error) {
    // Si es un error de red o CORS
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con la API. Verifica que la URL sea correcta y que el servidor permita solicitudes CORS.');
    }
    throw error;
  }
};

/**
 * Obtiene todos los lotes
 * Endpoint: GET /4/usuarios/sujetos
 * @param {number} fincaId - ID de la finca para filtrar (opcional)
 * @returns {Promise<Array>} Lista de lotes
 */
export const getLotes = async (fincaId = null) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor configura tu token.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/4/usuarios/sujetos`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
        'tipo-sujetos': '[3]', // 3 = Lotes
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error ${response.status}: ${error || response.statusText}`);
    }

    let data = await response.json();
    
    // Filtrar por finca_id si se proporciona
    if (fincaId) {
      data = data.filter(lote => lote.finca_id === parseInt(fincaId));
    }
    
    // Transformar la respuesta al formato esperado por el frontend
    return data.map(lote => ({
      id: lote.key_value,
      nombre: lote.nombre,
      grupo: lote.grupo,
      sigla: lote.sigla,
      finca_id: lote.finca_id,
      tipo_sujeto_id: lote.tipo_sujeto_id,
      tipo_cultivo_id: lote.tipo_cultivo_id
    }));
  } catch (error) {
    // Si es un error de red o CORS
    if (error.message === 'Failed to fetch') {
      throw new Error('No se pudo conectar con la API. Verifica que la URL sea correcta y que el servidor permita solicitudes CORS.');
    }
    throw error;
  }
};

/**
 * Sube un archivo CSV de spots al servidor
 * Endpoint: POST /api/v1/spots/upload
 * @param {File} file - Archivo CSV de spots
 * @param {Function} onProgress - Callback de progreso (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const uploadSpots = async (file, onProgress = null) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor configura tu token.');
  }

  if (!file) {
    throw new Error('No se ha seleccionado ningún archivo');
  }

  // Validar que sea un archivo CSV
  if (!file.name.endsWith('.csv')) {
    throw new Error('El archivo debe ser un CSV (.csv)');
  }

  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    // Manejar progreso de carga
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    // Manejar respuesta
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          
          if (response.status === 'success') {
            resolve(response);
          } else {
            reject(new Error(response.message || 'Error al procesar el archivo'));
          }
        } catch (e) {
          reject(new Error('Error al parsear la respuesta del servidor'));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || `Error ${xhr.status}: ${xhr.statusText}`));
        } catch (e) {
          reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
        }
      }
    });

    // Manejar errores
    xhr.addEventListener('error', () => {
      reject(new Error('Error de conexión con el servidor'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Carga cancelada'));
    });

    // Configurar y enviar la petición
    xhr.open('POST', `${API_BASE_URL}/api/v1/spots/upload`);
    xhr.setRequestHeader('Authorization', token);
    xhr.send(formData);
  });
};

/**
 * Valida un archivo CSV antes de subirlo
 * @param {File} file - Archivo a validar
 * @returns {Promise<Object>} Información de validación
 */
export const validateCSV = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No se ha seleccionado ningún archivo'));
      return;
    }

    if (!file.name.endsWith('.csv')) {
      reject(new Error('El archivo debe ser un CSV (.csv)'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('El archivo está vacío o no tiene datos'));
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const requiredColumns = [
          'nombre_spot',
          'lat',
          'lng',
          'lote_id',
          'linea',
          'posicion',
          'nombre_planta',
          'finca_id'
        ];

        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          reject(new Error(`Faltan columnas obligatorias: ${missingColumns.join(', ')}`));
          return;
        }

        // Validar que haya al menos una fila de datos
        const dataRows = lines.length - 1;
        
        resolve({
          valid: true,
          headers,
          rowCount: dataRows,
          fileSize: file.size,
          fileName: file.name
        });
      } catch (error) {
        reject(new Error('Error al leer el archivo: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsText(file);
  });
};

/**
 * Verifica la conexión con la API
 * @returns {Promise<boolean>} true si la conexión es exitosa
 */
export const checkConnection = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return false;
    }

    // Intentar obtener fincas como test de conexión
    await getFincas();
    return true;
  } catch (error) {
    console.error('Error de conexión:', error);
    return false;
  }
};

export default {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserId,
  setUserId,
  getFincas,
  getLotes,
  uploadSpots,
  validateCSV,
  checkConnection
};
