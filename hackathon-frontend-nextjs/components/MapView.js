import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from '../styles/Home.module.css';

// Iconos ultra-ligeros para mejor rendimiento
const createPalmIcon = (isSelected) => {
  return L.divIcon({
    html: `
      <div class="palm-marker ${isSelected ? 'selected' : ''}">
        <div class="palm-dot"></div>
      </div>
    `,
    className: 'custom-palm-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });
};

// Componente para ajustar bounds del mapa
function MapBounds({ bounds }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

export default function MapView({ loteData, lineas, selectedSpot, setSelectedSpot, getLoteName, selectedLote }) {
  // Estado para controlar modo optimizado
  const [optimizedMode, setOptimizedMode] = useState(true);
  
  // Optimización: Limitar cantidad de marcadores si hay demasiados
  const MAX_MARKERS = 500; // Máximo de marcadores a mostrar
  const displayData = (optimizedMode && loteData.length > MAX_MARKERS)
    ? loteData.slice(0, MAX_MARKERS)
    : loteData;
  
  const showingAll = loteData.length === displayData.length;
  const canOptimize = loteData.length > MAX_MARKERS;
  
  // Calcular el centro y bounds
  const defaultCenter = displayData.length > 0 
    ? [displayData[0].lat, displayData[0].lng]
    : [7.8939, -76.6411];

  // Calcular perímetro del lote
  const getPerimetro = () => {
    if (loteData.length < 3) return null;
    
    const centroLat = loteData.reduce((sum, s) => sum + s.lat, 0) / loteData.length;
    const centroLng = loteData.reduce((sum, s) => sum + s.lng, 0) / loteData.length;
    
    const sorted = [...loteData].sort((a, b) => {
      const angleA = Math.atan2(a.lat - centroLat, a.lng - centroLng);
      const angleB = Math.atan2(b.lat - centroLat, b.lng - centroLng);
      return angleA - angleB;
    });
    
    return sorted.map(s => [s.lat, s.lng]);
  };

  const perimetro = getPerimetro();

  // Calcular bounds
  let bounds = null;
  if (loteData.length > 0) {
    const lats = loteData.map(s => s.lat);
    const lngs = loteData.map(s => s.lng);
    bounds = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ];
  }

  return (
    <div className={styles.mapPanel}>
      <div className={styles.mapInfo}>
        <span className={styles.mapBadge}>
          📍 Ubicaciones GPS Reales
          {!showingAll && ` (${displayData.length} de ${loteData.length})`}
        </span>
        <span className={styles.mapCoords}>
          Centro: {defaultCenter[0].toFixed(6)}, {defaultCenter[1].toFixed(6)}
        </span>
      </div>
      {canOptimize && (
        <div style={{
          background: optimizedMode ? '#fef3c7' : '#dbeafe',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          borderBottom: optimizedMode ? '1px solid #fbbf24' : '1px solid #3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <span style={{ color: optimizedMode ? '#92400e' : '#1e40af' }}>
              {optimizedMode 
                ? `⚡ Modo Optimizado: ${displayData.length} marcadores (Rápido)` 
                : `🗺️ Modo Completo: ${loteData.length} marcadores (Puede ser lento)`
              }
            </span>
          </div>
          <button
            onClick={() => setOptimizedMode(!optimizedMode)}
            style={{
              padding: '0.5rem 1rem',
              background: optimizedMode ? '#10b981' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {optimizedMode ? '🚀 Ver Todos' : '⚡ Optimizar'}
          </button>
        </div>
      )}
      <div className={styles.mapContainer}>
        <MapContainer
          center={defaultCenter}
          zoom={18}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          {/* Control de Capas */}
          <LayersControl position="topright">
            {/* Vista Satélite */}
            <LayersControl.BaseLayer checked name="🛰️ Vista Satélite">
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>

            {/* Vista de Calles */}
            <LayersControl.BaseLayer name="🗺️ Vista de Calles">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Ajustar vista */}
          {bounds && <MapBounds bounds={bounds} />}

          {/* Perímetro del lote - REMOVIDO para mejor visualización */}
          {/* Las líneas de colores de cultivo son más útiles */}

          {/* Líneas de palmas por línea de cultivo */}
          {Object.entries(lineas).map(([lineaKey, spots]) => {
            const positions = spots.map(s => [s.lat, s.lng]);
            const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
            const colorIndex = parseInt(lineaKey) % colors.length;
            
            return (
              <Polyline
                key={lineaKey}
                positions={positions}
                pathOptions={{
                  color: colors[colorIndex],
                  weight: 2,
                  opacity: 0.6
                }}
              />
            );
          })}

          {/* Marcadores - Optimizado */}
          {displayData.map((spot, index) => {
            const isSelected = selectedSpot === index;
            return (
              <Marker
                key={`marker-${index}-${spot.lat}-${spot.lng}`}
                position={[spot.lat, spot.lng]}
                icon={createPalmIcon(isSelected)}
                eventHandlers={{
                  click: () => setSelectedSpot(index)
                }}
              >
              <Popup maxWidth={300}>
                <div style={{ padding: '0.5rem' }}>
                  <h3 style={{ 
                    margin: '0 0 0.75rem 0', 
                    color: '#10b981',
                    fontSize: '1.125rem',
                    borderBottom: '2px solid #10b981',
                    paddingBottom: '0.5rem'
                  }}>
                    🌴 Palma {getLoteName(selectedLote)}-{String(spot.posicion).padStart(4, '0')}
                  </h3>
                  
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ margin: '0.375rem 0', fontSize: '0.9rem' }}>
                      <strong style={{ color: '#666' }}>Línea:</strong> {spot.linea}
                    </p>
                    <p style={{ margin: '0.375rem 0', fontSize: '0.9rem' }}>
                      <strong style={{ color: '#666' }}>Posición:</strong> {spot.posicion}
                    </p>
                    <p style={{ margin: '0.375rem 0', fontSize: '0.9rem' }}>
                      <strong style={{ color: '#666' }}>Lote:</strong> {getLoteName(selectedLote)}
                    </p>
                  </div>

                  <div style={{ 
                    background: '#f0f9ff', 
                    padding: '0.75rem', 
                    borderRadius: '6px',
                    border: '1px solid #3b82f6'
                  }}>
                    <p style={{ 
                      margin: '0 0 0.5rem 0', 
                      fontSize: '0.875rem', 
                      fontWeight: '600',
                      color: '#1e40af'
                    }}>
                      📍 Coordenadas GPS Reales:
                    </p>
                    <p style={{ 
                      margin: '0.25rem 0', 
                      fontFamily: 'monospace', 
                      fontSize: '0.875rem',
                      color: '#333'
                    }}>
                      <strong>Lat:</strong> {spot.lat.toFixed(8)}°
                    </p>
                    <p style={{ 
                      margin: '0.25rem 0', 
                      fontFamily: 'monospace', 
                      fontSize: '0.875rem',
                      color: '#333'
                    }}>
                      <strong>Lng:</strong> {spot.lng.toFixed(8)}°
                    </p>
                  </div>

                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                    <a
                      href={`https://www.google.com/maps?q=${spot.lat},${spot.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: '#10b981',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      🌍 Ver en Google Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
