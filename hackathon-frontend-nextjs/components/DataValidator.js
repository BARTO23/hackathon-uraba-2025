import { useState } from 'react';
import Papa from 'papaparse';
import { validateSpots } from '../lib/validator';
import ValidationReport from './ValidationReport';
import styles from '../styles/Home.module.css';

export default function DataValidator({ selectedFinca, lotes, onValidationComplete }) {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setParsedData(null);
    setValidation(null);
  };

  const parseFile = () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    if (!selectedFinca) {
      setError('Por favor selecciona una finca primero');
      return;
    }

    setParsing(true);
    setError(null);

    // Parsear CSV con Papa Parse
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Mantener todo como string inicialmente
      complete: (results) => {
        console.log('Archivo parseado:', results);
        
        if (results.errors.length > 0) {
          console.error('Errores de parsing:', results.errors);
          setError(`Error al parsear el archivo: ${results.errors[0].message}`);
          setParsing(false);
          return;
        }

        if (results.data.length === 0) {
          setError('El archivo está vacío o no tiene datos válidos');
          setParsing(false);
          return;
        }

        setParsedData(results.data);
        setParsing(false);
        
        // Validar automáticamente
        performValidation(results.data);
      },
      error: (error) => {
        console.error('Error de Papa Parse:', error);
        setError(`Error al leer el archivo: ${error.message}`);
        setParsing(false);
      }
    });
  };

  const performValidation = (data) => {
    console.log('Iniciando validación...', { 
      rows: data.length, 
      lotes: lotes.length 
    });

    const validationResult = validateSpots(data, lotes);
    
    console.log('Resultado de validación:', validationResult);
    
    setValidation(validationResult);
    
    if (onValidationComplete) {
      onValidationComplete(validationResult);
    }
  };

  const handleContinue = () => {
    if (onValidationComplete && validation) {
      onValidationComplete(validation);
    }
  };

  const revalidate = () => {
    if (parsedData) {
      performValidation(parsedData);
    }
  };

  return (
    <div className={styles.dataValidator}>
      <h2>📋 Validación de Datos</h2>

      {/* Instrucciones */}
      <div className={styles.validatorInstructions}>
        <p>
          <strong>Paso 1:</strong> Selecciona tu archivo CSV o Excel con los datos de spots
        </p>
        <p>
          <strong>Paso 2:</strong> Haz clic en "Validar Datos" para verificar la información
        </p>
        <p>
          <strong>Paso 3:</strong> Si hay errores, descarga el reporte, corrige y vuelve a subir
        </p>
      </div>

      {/* Selector de Archivo */}
      <div className={styles.fileSection}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className={styles.fileInput}
          disabled={parsing}
          id="data-file"
        />
        <label htmlFor="data-file" className={styles.fileLabel}>
          {file ? `📄 ${file.name}` : '📁 Seleccionar Archivo'}
        </label>

        {file && (
          <div className={styles.fileInfo}>
            <p><strong>Archivo:</strong> {file.name}</p>
            <p><strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Tipo:</strong> {file.type || 'text/csv'}</p>
          </div>
        )}
      </div>

      {/* Botón de Validación */}
      {file && !validation && (
        <button
          onClick={parseFile}
          disabled={parsing || !selectedFinca}
          className={styles.validateButton}
        >
          {parsing ? '⏳ Parseando...' : '🔍 Validar Datos'}
        </button>
      )}

      {!selectedFinca && file && (
        <div className={styles.warningMessage}>
          ⚠️ Debes seleccionar una finca antes de validar
        </div>
      )}

      {/* Error */}
      {error && (
        <div className={styles.errorMessage}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Información de Parsing */}
      {parsedData && !validation && (
        <div className={styles.parsingInfo}>
          <p>✅ Archivo parseado correctamente</p>
          <p><strong>Total de filas:</strong> {parsedData.length}</p>
        </div>
      )}

      {/* Información de Limpieza y Corrección Automática */}
      {validation && validation.cleaningInfo && validation.cleaningInfo.autoCorrected && (
        <div className={styles.successInfo}>
          <h3>✅ Datos Procesados y Validados Automáticamente</h3>
          <div className={styles.successMessage}>
            <p className={styles.successText}>
              <strong>🎉 ¡Listo para usar!</strong> El sistema procesó y corrigió automáticamente tu archivo.
            </p>
            <p className={styles.successSubtext}>
              <strong>{validation.stats.validRows}</strong> ubicaciones GPS válidas están listas para visualizar en el mapa.
            </p>
          </div>
          
          {validation.stats.cleaningStats.correctedIssues > 0 && (
            <div className={styles.cleaningStats}>
              <h4 className={styles.statsTitle}>📊 Correcciones Automáticas Aplicadas:</h4>
              {validation.stats.cleaningStats.rowsRemoved > 0 && (
                <div className={styles.cleaningStat}>
                  <span className={styles.cleaningIcon}>🗑️</span>
                  <span className={styles.cleaningText}>
                    {validation.stats.cleaningStats.rowsRemoved} fila{validation.stats.cleaningStats.rowsRemoved > 1 ? 's' : ''} con valores nulos o inválidos (removida{validation.stats.cleaningStats.rowsRemoved > 1 ? 's' : ''})
                  </span>
                </div>
              )}
              {validation.stats.cleaningStats.duplicatesRemoved > 0 && (
                <div className={styles.cleaningStat}>
                  <span className={styles.cleaningIcon}>📋</span>
                  <span className={styles.cleaningText}>
                    {validation.stats.cleaningStats.duplicatesRemoved} duplicado{validation.stats.cleaningStats.duplicatesRemoved > 1 ? 's' : ''} de coordenadas (removido{validation.stats.cleaningStats.duplicatesRemoved > 1 ? 's' : ''})
                  </span>
                </div>
              )}
              {validation.stats.cleaningStats.correctedIssues === 0 && (
                <div className={styles.cleaningStat}>
                  <span className={styles.cleaningIcon}>✨</span>
                  <span className={styles.cleaningText}>
                    No se requirieron correcciones - Archivo perfecto
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className={styles.autoNote}>
            <p>
              ✨ <strong>Todo listo automáticamente:</strong> El sistema limpió, normalizó y validó tus datos. 
              Puedes ver las ubicaciones GPS en el mapa a continuación.
            </p>
          </div>
        </div>
      )}

      {/* Reporte de Validación */}
      {validation && (
        <>
          <ValidationReport
            validation={validation}
            onContinue={handleContinue}
          />

          {/* Botón para revalidar */}
          {!validation.isValid && (
            <div className={styles.revalidateSection}>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                ¿Ya corregiste los errores? Sube el archivo corregido y valida nuevamente.
              </p>
              <button
                onClick={() => {
                  setFile(null);
                  setParsedData(null);
                  setValidation(null);
                }}
                className={styles.resetButton}
              >
                🔄 Cargar Nuevo Archivo
              </button>
            </div>
          )}
        </>
      )}

      {/* Información de Columnas Esperadas */}
      <div className={styles.expectedColumns}>
        <details>
          <summary>📋 Columnas esperadas en el archivo</summary>
          <div className={styles.columnsInfo}>
            <h4>Columnas Obligatorias:</h4>
            <ul>
              <li><code>Latitud</code> o <code>lat</code> - Coordenada latitud</li>
              <li><code>Longitud</code> o <code>lng</code> - Coordenada longitud</li>
              <li><code>Línea palma</code> o <code>linea</code> - Número de línea</li>
              <li><code>Posición palma</code> o <code>posicion</code> - Posición en la línea</li>
              <li><code>Lote</code> o <code>lote_id</code> - ID del lote</li>
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              El sistema detecta automáticamente diferentes variantes de nombres de columnas.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
