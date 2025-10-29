import { useState } from 'react';
import { uploadSpots, validateCSV } from '../lib/api';
import styles from '../styles/Home.module.css';

export default function FileUploader({ onFileUploaded, selectedFinca }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationInfo, setValidationInfo] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setValidationInfo(null);

    // Validar el archivo al seleccionarlo
    if (selectedFile) {
      try {
        const info = await validateCSV(selectedFile);
        setValidationInfo(info);
      } catch (err) {
        setError(err.message);
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    try {
      const response = await uploadSpots(file, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      if (response.status === 'success') {
        setSuccess(true);
        setUploadProgress(100);
        
        if (onFileUploaded) {
          onFileUploaded(response.data);
        }

        // Limpiar el archivo después de un upload exitoso
        setTimeout(() => {
          setFile(null);
          setValidationInfo(null);
          setSuccess(false);
          setUploadProgress(0);
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fileUploader}>
      <h2>📤 Cargar Archivo de Spots</h2>
      
      <div className={styles.uploadSection}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className={styles.fileInput}
          disabled={loading}
        />
        
        {file && validationInfo && (
          <div className={styles.fileInfo}>
            <p className={styles.fileName}>
              <strong>📄 {validationInfo.fileName}</strong>
            </p>
            <p className={styles.fileDetails}>
              Filas: {validationInfo.rowCount} | Tamaño: {(validationInfo.fileSize / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {loading && uploadProgress > 0 && (
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file || !validationInfo}
          className={styles.uploadButton}
        >
          {loading ? '⏳ Subiendo...' : '🚀 Subir Spots'}
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          ✅ ¡Archivo procesado exitosamente!
        </div>
      )}

      <div className={styles.uploadHelp}>
        <details>
          <summary>📋 Formato del archivo CSV</summary>
          <div className={styles.helpContent}>
            <p><strong>Columnas obligatorias:</strong></p>
            <ul>
              <li><code>nombre_spot</code> - Identificador del spot</li>
              <li><code>lat</code> - Latitud decimal</li>
              <li><code>lng</code> - Longitud decimal</li>
              <li><code>lote_id</code> - ID del lote</li>
              <li><code>linea</code> - Número de línea</li>
              <li><code>posicion</code> - Posición en la línea</li>
              <li><code>nombre_planta</code> - Nombre de la planta</li>
              <li><code>finca_id</code> - ID de la finca</li>
            </ul>
            <p><strong>Nota:</strong> Todas las filas deben pertenecer a la misma finca.</p>
          </div>
        </details>
      </div>
    </div>
  );
}
