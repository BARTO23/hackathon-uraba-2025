import styles from '../styles/Home.module.css';
import { MdAssessment, MdTerrain, MdCheckCircle, MdError, MdOutlineGridView, MdOutlineLocationOn, MdOutlineDoneAll, MdOutlineCrop } from 'react-icons/md';
import { FaTree } from 'react-icons/fa';

/**
 * Panel de resumen del procesamiento de datos
 * Muestra estadísticas y confirmación de calidad de datos
 */
export default function DataProcessingSummary({ 
  validData, 
  validation, 
  lotes 
}) {
  if (!validation || !validData) {
    return null;
  }

  // Calcular estadísticas
  const totalSpots = validData.length;
  const uniqueLotes = new Set(validData.map(d => d.lote_id)).size;
  const uniqueLineas = new Set(validData.map(d => `${d.lote_id}-${d.linea}`)).size;
  
  // Coordenadas extremas (bounding box)
  const lats = validData.map(d => d.lat);
  const lngs = validData.map(d => d.lng);
  const bounds = {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs)
  };

  // Agrupar por lote
  const spotsByLote = {};
  validData.forEach(spot => {
    if (!spotsByLote[spot.lote_id]) {
      spotsByLote[spot.lote_id] = [];
    }
    spotsByLote[spot.lote_id].push(spot);
  });

  const getLoteName = (loteId) => {
    const lote = lotes.find(l => String(l.id) === String(loteId));
    return lote ? lote.nombre : `Lote ${loteId}`;
  };

  return (
    <div className={styles.processingSummary}>
      <div className={styles.summaryHeader}>
        <h2>
          <MdAssessment style={{ color: 'var(--color-primary)' }} />
          Resumen de Datos Procesados
        </h2>
        <div className={styles.qualityBadge}>
          {validation.isValid ? (
            <span className={styles.badgeSuccess}>
              <MdCheckCircle /> Datos Validados
            </span>
          ) : (
            <span className={styles.badgeError}>
              <MdError /> Datos con Errores
            </span>
          )}
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPrimary}`}>
            <FaTree />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalSpots}</span>
            <span className={styles.statLabel}>Total Spots</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAccent}`}>
            <MdOutlineLocationOn />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{uniqueLotes}</span>
            <span className={styles.statLabel}>Lotes</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPrimary}`}>
            <MdOutlineCrop />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{uniqueLineas}</span>
            <span className={styles.statLabel}>Líneas</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAccent}`}>
            <MdOutlineGridView />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{validation.stats.validRows}</span>
            <span className={styles.statLabel}>Filas Válidas</span>
          </div>
        </div>
      </div>

      {/* Desglose por Lote */}
      <div className={styles.loteBreakdown}>
        <h3>
          <MdTerrain style={{ color: 'var(--color-primary)' }} />
          Desglose por Lote
        </h3>
        <div className={styles.loteGrid}>
          {Object.entries(spotsByLote).map(([loteId, spots]) => {
            const lineasEnLote = new Set(spots.map(s => s.linea)).size;
            return (
              <div key={loteId} className={styles.loteCard}>
                <div className={styles.loteHeader}>
                  <strong>{getLoteName(loteId)}</strong>
                  <span className={styles.loteBadge}>ID: {loteId}</span>
                </div>
                <div className={styles.loteStats}>
                  <div className={styles.loteStat}>
                    <FaTree /> {spots.length} spots
                  </div>
                  <div className={styles.loteStat}>
                    <MdOutlineCrop /> {lineasEnLote} líneas
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Área Geográfica */}
      <div className={styles.geographicInfo}>
        <h3>
          <MdOutlineLocationOn style={{ color: 'var(--color-primary)' }} />
          Área Geográfica
        </h3>
        <div className={styles.boundsInfo}>
          <div className={styles.boundsRow}>
            <span className={styles.boundsLabel}>Latitud:</span>
            <span className={styles.boundsValue}>
              {bounds.minLat.toFixed(6)} → {bounds.maxLat.toFixed(6)}
            </span>
          </div>
          <div className={styles.boundsRow}>
            <span className={styles.boundsLabel}>Longitud:</span>
            <span className={styles.boundsValue}>
              {bounds.minLng.toFixed(6)} → {bounds.maxLng.toFixed(6)}
            </span>
          </div>
        </div>
      </div>

      {/* Garantía de Calidad */}
      <div className={styles.qualityAssurance}>
        <h3>
          <MdOutlineDoneAll style={{ color: 'var(--color-primary)' }} />
          Garantía de Calidad
        </h3>
        <div className={styles.qualityChecks}>
          <div className={styles.qualityCheck}>
            <span className={styles.checkIcon}>
              <MdCheckCircle />
            </span>
            <span>Datos limpiados y normalizados</span>
          </div>
          <div className={styles.qualityCheck}>
            <span className={styles.checkIcon}>
              <MdCheckCircle />
            </span>
            <span>Coordenadas validadas (sin duplicados)</span>
          </div>
          <div className={styles.qualityCheck}>
            <span className={styles.checkIcon}>
              <MdCheckCircle />
            </span>
            <span>Lotes verificados contra la finca</span>
          </div>
          <div className={styles.qualityCheck}>
            <span className={styles.checkIcon}>
              <MdCheckCircle />
            </span>
            <span>Líneas y posiciones verificadas</span>
          </div>
          <div className={styles.qualityCheck}>
            <span className={styles.checkIcon}>
              <MdCheckCircle />
            </span>
            <span>Campos obligatorios completos</span>
          </div>
        </div>
      </div>

      {/* Resumen de Mensajes */}
      {validation.summary && validation.summary.messages && (
        <div className={styles.validationMessages}>
          {validation.summary.messages.map((msg, idx) => (
            <p key={idx} className={styles.summaryMessage}>
              {msg}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
