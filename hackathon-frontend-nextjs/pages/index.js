import { useState } from 'react';
import Head from 'next/head';
import FileUploader from '../components/FileUploader';
import FincaSelector from '../components/FincaSelector';
import MapDisplay from '../components/MapDisplay';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [fileData, setFileData] = useState(null);
  const [selectedFinca, setSelectedFinca] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleFileValidated = (data) => {
    setFileData(data);
    console.log('Datos del archivo validados:', data);
    
    // Convertir datos a marcadores si tienen coordenadas
    // TODO: Ajustar según la estructura real de los datos
    const newMarkers = data
      .filter(item => item.lat && item.lng)
      .map(item => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng),
        title: item.nombre || 'Sin nombre',
        description: item.descripcion || ''
      }));
    
    setMarkers(newMarkers);
  };

  const handleFincaSelect = (fincaId) => {
    setSelectedFinca(fincaId);
  };

  const handleLotesLoad = (lotesData) => {
    setLotes(lotesData);
  };

  const handleSubmit = async () => {
    if (!fileData) {
      alert('Por favor carga y valida un archivo primero');
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          finca_id: selectedFinca,
          data: fileData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, message: 'Datos enviados exitosamente' });
      } else {
        setSubmitResult({ success: false, message: result.error || 'Error al enviar datos' });
      }
    } catch (err) {
      setSubmitResult({ success: false, message: 'Error de conexión: ' + err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Hackathon Urabá 2025</title>
        <meta name="description" content="Aplicación del Hackathon Urabá 2025" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hackathon Urabá 2025
        </h1>

        <p className={styles.description}>
          Sistema de gestión de datos agrícolas
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <FileUploader onFileValidated={handleFileValidated} />
          </div>

          <div className={styles.card}>
            <FincaSelector 
              onFincaSelect={handleFincaSelect}
              onLotesLoad={handleLotesLoad}
            />
          </div>
        </div>

        <div className={styles.mapSection}>
          <MapDisplay markers={markers} />
        </div>

        {fileData && (
          <div className={styles.submitSection}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={styles.submitButton}
            >
              {submitting ? 'Enviando...' : 'Enviar a Sioma'}
            </button>

            {submitResult && (
              <div className={submitResult.success ? styles.successMessage : styles.errorMessage}>
                {submitResult.message}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Hackathon Urabá 2025 - Powered by Next.js & Flask</p>
      </footer>
    </div>
  );
}
