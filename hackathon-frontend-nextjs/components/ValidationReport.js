import { useState } from 'react';
import { downloadErrorReport } from '../lib/validator';
import styles from '../styles/Home.module.css';

export default function ValidationReport({ validation, onContinue, onDownloadReport }) {
  const [expandedType, setExpandedType] = useState(null);
  const [showAllErrors, setShowAllErrors] = useState(false);

  if (!validation) return null;

  const { isValid, hasWarnings, errors, warnings, summary, stats } = validation;

  const handleDownload = () => {
    const success = downloadErrorReport(errors, warnings);
    if (success && onDownloadReport) {
      onDownloadReport();
    }
  };

  const toggleType = (type) => {
    setExpandedType(expandedType === type ? null : type);
  };

  const allIssues = [...errors, ...warnings];
  const displayedIssues = showAllErrors ? allIssues : allIssues.slice(0, 10);

  return (
    <div className={styles.validationReport}>
      <h2>📊 Reporte de Validación</h2>

      {/* Resumen General */}
      <div className={styles.summaryCards}>
        <div className={`${styles.summaryCard} ${isValid ? styles.success : styles.error}`}>
          <div className={styles.summaryIcon}>
            {isValid ? '✅' : '❌'}
          </div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryLabel}>Estado</div>
            <div className={styles.summaryValue}>
              {isValid ? 'Válido' : 'Con Errores'}
            </div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>📝</div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryLabel}>Total Filas</div>
            <div className={styles.summaryValue}>{stats.totalRows}</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>✔️</div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryLabel}>Filas Válidas</div>
            <div className={styles.summaryValue}>{stats.validRows}</div>
          </div>
        </div>

        {stats.errorRows > 0 && (
          <div className={`${styles.summaryCard} ${styles.error}`}>
            <div className={styles.summaryIcon}>❌</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryLabel}>Errores</div>
              <div className={styles.summaryValue}>{errors.length}</div>
            </div>
          </div>
        )}

        {stats.warningRows > 0 && (
          <div className={`${styles.summaryCard} ${styles.warning}`}>
            <div className={styles.summaryIcon}>⚠️</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryLabel}>Advertencias</div>
              <div className={styles.summaryValue}>{warnings.length}</div>
            </div>
          </div>
        )}
      </div>

      {/* Mensajes de Resumen */}
      <div className={styles.summaryMessages}>
        {summary.messages.map((msg, index) => (
          <div key={index} className={styles.summaryMessage}>
            {msg}
          </div>
        ))}
      </div>

      {/* Errores por Tipo */}
      {Object.keys(summary.byType).length > 0 && (
        <div className={styles.errorsByType}>
          <h3>Desglose por Tipo de Problema</h3>
          {Object.entries(summary.byType).map(([type, data]) => (
            <div 
              key={type} 
              className={`${styles.errorTypeCard} ${data.severity === 'error' ? styles.errorType : styles.warningType}`}
            >
              <div 
                className={styles.errorTypeHeader}
                onClick={() => toggleType(type)}
              >
                <div className={styles.errorTypeTitle}>
                  <span className={styles.errorTypeIcon}>
                    {data.severity === 'error' ? '❌' : '⚠️'}
                  </span>
                  <span className={styles.errorTypeName}>
                    {type.replace(/_/g, ' ')}
                  </span>
                  <span className={styles.errorTypeCount}>
                    ({data.count})
                  </span>
                </div>
                <span className={styles.expandIcon}>
                  {expandedType === type ? '▼' : '▶'}
                </span>
              </div>
              
              {expandedType === type && (
                <div className={styles.errorTypeDetails}>
                  <p className={styles.affectedRows}>
                    <strong>Filas afectadas:</strong> {data.rows.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lista Detallada de Errores */}
      {allIssues.length > 0 && (
        <div className={styles.errorDetailsList}>
          <h3>Detalle de Problemas</h3>
          <div className={styles.errorTable}>
            <div className={styles.errorTableHeader}>
              <div className={styles.errorCol1}>Fila</div>
              <div className={styles.errorCol2}>Tipo</div>
              <div className={styles.errorCol3}>Mensaje</div>
            </div>
            {displayedIssues.map((issue, index) => (
              <div 
                key={index} 
                className={`${styles.errorTableRow} ${issue.severity === 'error' ? styles.errorRow : styles.warningRow}`}
              >
                <div className={styles.errorCol1}>
                  <span className={styles.rowNumber}>{issue.row}</span>
                </div>
                <div className={styles.errorCol2}>
                  <span className={styles.issueType}>
                    {issue.severity === 'error' ? '❌' : '⚠️'}
                    {issue.field}
                  </span>
                </div>
                <div className={styles.errorCol3}>
                  <span className={styles.issueMessage}>{issue.message}</span>
                </div>
              </div>
            ))}
          </div>
          
          {allIssues.length > 10 && (
            <button
              onClick={() => setShowAllErrors(!showAllErrors)}
              className={styles.toggleButton}
            >
              {showAllErrors 
                ? 'Mostrar menos' 
                : `Mostrar todos (${allIssues.length - 10} más)`
              }
            </button>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className={styles.reportActions}>
        {!isValid && (
          <div className={styles.correctionNotice}>
            <h4>⚠️ Corrección Requerida</h4>
            <p>
              Los datos contienen errores que deben ser corregidos antes de continuar.
              Descarga el reporte, corrige los errores en tu archivo y vuelve a subirlo.
            </p>
          </div>
        )}

        {(errors.length > 0 || warnings.length > 0) && (
          <button
            onClick={handleDownload}
            className={styles.downloadButton}
          >
            📥 Descargar Reporte de Errores
          </button>
        )}

        {isValid && onContinue && (
          <button
            onClick={onContinue}
            className={styles.continueButton}
          >
            ✅ Continuar con Visualización
          </button>
        )}
      </div>

      {/* Instrucciones de Corrección */}
      {!isValid && (
        <div className={styles.correctionInstructions}>
          <details>
            <summary>💡 Cómo corregir los errores</summary>
            <div className={styles.instructionsContent}>
              <ol>
                <li>Descarga el reporte de errores (botón arriba)</li>
                <li>Abre tu archivo original (.csv o .xlsx)</li>
                <li>Corrige cada error según el reporte:
                  <ul>
                    <li><strong>Coordenadas duplicadas:</strong> Elimina filas duplicadas o verifica si son correctas</li>
                    <li><strong>Líneas repetidas:</strong> Verifica que cada línea aparezca solo una vez por lote</li>
                    <li><strong>Posiciones repetidas:</strong> Asegúrate de que cada posición sea única dentro de su línea</li>
                    <li><strong>Lotes inválidos:</strong> Verifica que el ID de lote corresponda a la finca seleccionada</li>
                  </ul>
                </li>
                <li>Guarda el archivo corregido</li>
                <li>Vuelve a subir el archivo corregido</li>
              </ol>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
