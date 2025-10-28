import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

// Importar Leaflet dinámicamente para evitar problemas con SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function MapDisplay({ markers = [] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Coordenadas por defecto (Colombia - Urabá)
  const defaultCenter = [7.8939, -76.6411];
  const defaultZoom = 10;

  if (!isMounted) {
    return <div className={styles.mapPlaceholder}>Cargando mapa...</div>;
  }

  return (
    <div className={styles.mapContainer}>
      <h2>Mapa de Ubicaciones</h2>
      
      <div className={styles.map}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]}>
              <Popup>
                <div>
                  <strong>{marker.title || `Ubicación ${index + 1}`}</strong>
                  {marker.description && <p>{marker.description}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {markers.length === 0 && (
        <p className={styles.noMarkers}>
          No hay ubicaciones para mostrar en el mapa
        </p>
      )}
    </div>
  );
}
