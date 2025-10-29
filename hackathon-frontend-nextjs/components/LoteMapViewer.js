import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { filterByLote, getUniqueLotes } from '../lib/validator';
import styles from '../styles/Home.module.css';

// Importar el componente del mapa sin SSR
const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function LoteMapViewer({ validData, lotes }) {
  const [selectedLote, setSelectedLote] = useState('');
  const [loteData, setLoteData] = useState([]);
  const [lineas, setLineas] = useState({});
  const [selectedSpot, setSelectedSpot] = useState(null);

  // Inicializar con el primer lote disponible
  useEffect(() => {
    if (validData && validData.length > 0 && !selectedLote) {
      const uniqueLotes = getUniqueLotes(validData);
      if (uniqueLotes.length > 0) {
        setSelectedLote(uniqueLotes[0]);
      }
    }
  }, [validData, selectedLote]);

  // Actualizar datos cuando cambia el lote seleccionado
  useEffect(() => {
    if (selectedLote && validData) {
      const filtered = filterByLote(validData, selectedLote);
      setLoteData(filtered);
      
      // Agrupar por línea
      const grouped = {};
      filtered.forEach(spot => {
        const lineaKey = String(spot.linea);
        if (!grouped[lineaKey]) {
          grouped[lineaKey] = [];
        }
        grouped[lineaKey].push(spot);
      });
      
      // Ordenar por posición dentro de cada línea
      Object.keys(grouped).forEach(lineaKey => {
        grouped[lineaKey].sort((a, b) => {
          const posA = parseInt(a.posicion) || 0;
          const posB = parseInt(b.posicion) || 0;
          return posA - posB;
        });
      });
      
      setLineas(grouped);
    }
  }, [selectedLote, validData]);

  // Validaciones
  if (!validData || validData.length === 0) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center', 
        background: 'white', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ fontSize: '1.125rem', color: '#ef4444', marginBottom: '1rem' }}>
          ⚠️ No hay datos válidos para mostrar en el mapa
        </p>
        <p style={{ fontSize: '0.95rem', color: '#666' }}>
          Por favor carga y valida un archivo CSV primero
        </p>
      </div>
    );
  }

  if (!lotes || lotes.length === 0) {
    return (
      <div style={{ 
        padding: '3rem', 
        textAlign: 'center', 
        background: 'white', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ fontSize: '1.125rem', color: '#ef4444', marginBottom: '1rem' }}>
          ⚠️ No hay lotes disponibles
        </p>
        <p style={{ fontSize: '0.95rem', color: '#666' }}>
          Por favor selecciona una finca primero
        </p>
      </div>
    );
  }

  const uniqueLotes = getUniqueLotes(validData);
  
  const getLoteName = (loteId) => {
    const lote = lotes.find(l => String(l.id) === String(loteId));
    return lote ? lote.nombre || lote.sigla || `Lote ${loteId}` : `Lote ${loteId}`;
  };

  const calculateArea = () => {
    if (loteData.length < 3) return 0;
    let area = 0;
    const n = loteData.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += loteData[i].lng * loteData[j].lat;
      area -= loteData[j].lng * loteData[i].lat;
    }
    area = Math.abs(area / 2);
    const hectares = area * 111 * 111 * 100;
    return hectares.toFixed(2);
  };

  return (
    <div className={styles.lotVisualization}>
      <h2 className={styles.visualizationTitle}>🗺️ Visualización de Lote</h2>
      <p className={styles.visualizationSubtitle}>
        Selecciona un lote para visualizar y verificar sus puntos de palma y líneas
      </p>

      <div className={styles.visualizationContainer}>
        {/* Panel Lateral Izquierdo */}
        <div className={styles.sidePanel}>
          {/* Selector de Lote */}
          <div className={styles.lotSelector}>
            <label htmlFor="lote-select" className={styles.selectorLabel}>
              Selecciona un Lote
            </label>
            <select
              id="lote-select"
              value={selectedLote}
              onChange={(e) => setSelectedLote(e.target.value)}
              className={styles.lotDropdown}
            >
              {uniqueLotes.map(loteId => (
                <option key={loteId} value={loteId}>
                  {getLoteName(loteId)}
                </option>
              ))}
            </select>
          </div>

          {/* Información del Lote */}
          <div className={styles.lotInformation}>
            <h3 className={styles.infoTitle}>INFORMACIÓN DEL LOTE</h3>
            <div className={styles.lotIdDisplay}>
              Lote ID: <strong>{getLoteName(selectedLote)}</strong>
            </div>
            <div className={styles.lotMetrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Conteo de Palmas</span>
                <span className={styles.metricValue}>{loteData.length.toLocaleString()}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Área Total</span>
                <span className={styles.metricValue}>{calculateArea()} ha</span>
              </div>
            </div>
          </div>

          {/* Lista de Puntos y Líneas */}
          <div className={styles.pointsAndLines}>
            <h3 className={styles.pointsTitle}>Puntos & Líneas</h3>
            <div className={styles.pointsList}>
              {loteData.slice(0, 20).map((spot, idx) => (
                <div
                  key={idx}
                  className={`${styles.pointItem} ${selectedSpot === idx ? styles.pointItemSelected : ''}`}
                  onClick={() => setSelectedSpot(idx)}
                >
                  <span className={styles.pointIcon}>📍</span>
                  <div className={styles.pointInfo}>
                    <div className={styles.pointId}>
                      Palma ID: {getLoteName(selectedLote)}-{String(spot.posicion).padStart(4, '0')}
                    </div>
                    <div className={styles.pointLine}>Línea ID: {spot.linea}</div>
                  </div>
                  <span className={styles.pointArrow}>›</span>
                </div>
              ))}
              {loteData.length > 20 && (
                <div className={styles.morePoints}>
                  ...y {loteData.length - 20} puntos más
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel del Mapa */}
        <MapView 
          loteData={loteData}
          lineas={lineas}
          selectedSpot={selectedSpot}
          setSelectedSpot={setSelectedSpot}
          getLoteName={getLoteName}
          selectedLote={selectedLote}
        />
      </div>
    </div>
  );
}
