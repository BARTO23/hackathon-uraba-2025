import { useState } from 'react';
import { uploadValidatedSpots } from '../lib/api';
import styles from '../styles/Home.module.css';
import { MdCloudUpload, MdCheckCircle, MdError, MdOutlineSend } from 'react-icons/md';

export default function FileUploader({ onFileUploaded, selectedFinca, validData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const hasValidData = Array.isArray(validData) && validData.length > 0;

  const handleUpload = async () => {
    if (!selectedFinca) {
      setError('Debes seleccionar una finca antes de enviar los datos');
      return;
    }

    if (!hasValidData) {
      setError('No hay datos validados para enviar');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    try {
      const response = await uploadValidatedSpots(validData, selectedFinca, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      if (response.status === 'success') {
        setSuccess(true);
        setUploadProgress(100);

        if (onFileUploaded) {
          onFileUploaded(response.data);
        }
      } else {
        throw new Error(response.message || 'Error al procesar los datos');
      }
    } catch (err) {
      setError(err.message || 'Error al enviar los datos');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fileUploader}>
      <h2 className={styles.sectionTitle}>
        <MdCloudUpload style={{ color: 'var(--color-primary)' }} />
        Enviar Datos Validados
      </h2>

      <div className={styles.validDataInfo}>
        {hasValidData ? (
          <div className={styles.dataSummary}>
            <div className={styles.dataSummaryItem}>
              <span className={styles.dataSummaryLabel}>Spots listos</span>
              <span className={styles.dataSummaryValue}>{validData.length}</span>
            </div>
            <div className={styles.dataSummaryItem}>
              <span className={styles.dataSummaryLabel}>Finca seleccionada</span>
              <span className={styles.dataSummaryValue}>{selectedFinca || 'Sin seleccionar'}</span>
            </div>
          </div>
        ) : (
          <p className={styles.noDataMessage}>
            <MdError />
            Primero valida un archivo para generar datos limpios.
          </p>
        )}
      </div>

      {loading && (
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
        disabled={loading || !hasValidData || !selectedFinca}
        className={styles.uploadButton}
      >
        <span className={styles.uploadButtonContent}>
          {loading ? (
            <>
              <span className={styles.spinner} /> Cargando...
            </>
          ) : (
            <>
              <MdOutlineSend /> Enviar a SIOMA
            </>
          )}
        </span>
      </button>

      {error && (
        <div className={styles.errorMessage}>
          <MdError />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          <MdCheckCircle /> ¡Datos enviados correctamente!
        </div>
      )}
    </div>
  );
}
