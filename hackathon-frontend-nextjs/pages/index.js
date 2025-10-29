import { useState } from "react";
import Head from "next/head";
import FincaSelector from "../components/FincaSelector";
import DataValidator from "../components/DataValidator";
import DataProcessingSummary from "../components/DataProcessingSummary";
import LoteMapViewer from "../components/LoteMapViewer";
import FileUploader from "../components/FileUploader";
import styles from "../styles/Home.module.css";
import { MdAssessment, MdLocationOn } from 'react-icons/md';

export default function HomePage() {
  const [selectedFinca, setSelectedFinca] = useState(null);
  const [selectedFincaData, setSelectedFincaData] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [validation, setValidation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFincaSelect = (fincaId, fincaData) => {
    setSelectedFinca(fincaId);
    setSelectedFincaData(fincaData);
    setValidation(null);
    setShowMap(false);
    setUploadResult(null);
  };

  const handleLotesLoad = (lotesData) => {
    setLotes(lotesData);
  };

  const handleValidationComplete = (validationResult) => {
    setValidation(validationResult);
    if (validationResult.isValid) {
      setShowMap(true);
    }
  };

  const handleFileUploaded = (result) => {
    setUploadResult(result);
    // Reset validation after upload
    setValidation(null);
    setShowMap(false);
  };

  const resetFlow = () => {
    setValidation(null);
    setShowMap(false);
    setUploadResult(null);
  };

  return (
    <>
      <Head>
        <title>Sistema de Gestión de Spots - Sioma</title>
        <meta name="description" content="Interfaz inteligente para gestión de spots de cultivo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>🌱 Sistema de Gestión de Spots</h1>
          <p className={styles.subtitle}>Plataforma inteligente para gestión de cultivos</p>
        </header>

        <main className={styles.main}>
          {/* Paso 1: Selector de Finca y Lotes */}
          <section className={styles.section}>
            <div className={styles.stepHeader}>
              <h3>Paso 1️⃣: Selecciona la Finca</h3>
            </div>
            <FincaSelector
              onFincaSelect={handleFincaSelect}
              onLotesLoad={handleLotesLoad}
            />
          </section>

          {/* Paso 2: Validación de Datos */}
          {selectedFinca && lotes.length > 0 && (
            <section className={styles.section}>
              <div className={styles.stepHeader}>
                <h3>Paso 2️⃣: Carga y Valida los Datos</h3>
              </div>
              <DataValidator
                selectedFinca={selectedFinca}
                lotes={lotes}
                onValidationComplete={handleValidationComplete}
              />
            </section>
          )}

          {/* Resumen de Procesamiento de Datos */}
          {validation && validation.isValid && validation.validData && (
            <section className={styles.section}>
              <DataProcessingSummary
                validData={validation.validData}
                validation={validation}
                lotes={lotes}
              />
            </section>
          )}

          {/* Paso 3: Visualización en Mapa */}
          {showMap && validation && validation.isValid && (
            <section className={styles.section}>
              <div className={styles.stepHeader}>
                <h3>Paso 3️⃣: Visualización por Lote</h3>
              </div>
              <LoteMapViewer
                validData={validation.validData}
                lotes={lotes}
              />
            </section>
          )}

          {/* Paso 4: Envío Final */}
          {showMap && validation && validation.isValid && (
            <section className={styles.section}>
              <div className={styles.stepHeader}>
                <h3>Paso 4️⃣: Enviar Datos Validados</h3>
              </div>
              <FileUploader
                onFileUploaded={handleFileUploaded}
                selectedFinca={selectedFinca}
              />
            </section>
          )}

          {/* Resultados del Upload */}
          {uploadResult && (
            <section className={styles.section}>
              <div className={styles.uploadResult}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MdAssessment style={{ color: 'var(--color-primary)' }} />
                  Resultados del Procesamiento
                </h2>
                <div className={styles.resultGrid}>
                  <div className={styles.resultCard}>
                    <span className={styles.resultLabel}>Spots Insertados:</span>
                    <span className={styles.resultValue}>{uploadResult.spots_inserted}</span>
                  </div>
                  <div className={styles.resultCard}>
                    <span className={styles.resultLabel}>Plantas Insertadas:</span>
                    <span className={styles.resultValue}>{uploadResult.plantas_inserted}</span>
                  </div>
                  <div className={styles.resultCard}>
                    <span className={styles.resultLabel}>Polígonos Generados:</span>
                    <span className={styles.resultValue}>{uploadResult.polygons_generated}</span>
                  </div>
                  <div className={styles.resultCard}>
                    <span className={styles.resultLabel}>Lotes Actualizados:</span>
                    <span className={styles.resultValue}>
                      {uploadResult.lotes_updated ? uploadResult.lotes_updated.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Información de Finca y Lotes Seleccionados */}
          {selectedFincaData && lotes.length > 0 && (
            <section className={styles.section}>
              <div className={styles.infoPanel}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MdLocationOn style={{ color: 'var(--color-primary)' }} />
                  Información de Finca Seleccionada
                </h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <strong>Finca:</strong> {selectedFincaData.nombre}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Grupo:</strong> {selectedFincaData.grupo}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Total de Lotes:</strong> {lotes.length}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        <footer className={styles.footer}>
          <p>Sistema de Gestión de Spots © 2025 - Sioma API Integration</p>
        </footer>
      </div>
    </>
  );
}
