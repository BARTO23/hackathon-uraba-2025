import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function FileUploader({ onFileValidated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate-file`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setSuccess(true);
        if (onFileValidated) {
          onFileValidated(data.data);
        }
      } else {
        setError(data.errors ? data.errors.join(', ') : 'Error al validar el archivo');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fileUploader}>
      <h2>Cargar Archivo</h2>
      
      <div className={styles.uploadSection}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        
        {file && (
          <p className={styles.fileName}>
            Archivo seleccionado: <strong>{file.name}</strong>
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={styles.uploadButton}
        >
          {loading ? 'Validando...' : 'Validar y Cargar'}
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          ¡Archivo validado exitosamente!
        </div>
      )}
    </div>
  );
}
