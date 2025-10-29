import { useState, useEffect } from 'react';
import { getFincas, getLotes } from '../lib/api';
import styles from '../styles/Home.module.css';

export default function FincaSelector({ onFincaSelect, onLotesLoad }) {
  const [fincas, setFincas] = useState([]);
  const [selectedFinca, setSelectedFinca] = useState('');
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFincas();
  }, []);

  const loadFincas = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Intentando cargar fincas...');
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'https://api.sioma.dev');
      const data = await getFincas();
      console.log('Fincas cargadas:', data);
      setFincas(data);
    } catch (err) {
      setError('Error al cargar fincas: ' + err.message);
      console.error('Error completo cargando fincas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFincaChange = async (e) => {
    const fincaId = e.target.value;
    setSelectedFinca(fincaId);
    
    if (onFincaSelect) {
      const selectedFincaData = fincas.find(f => f.id === parseInt(fincaId));
      onFincaSelect(fincaId, selectedFincaData);
    }

    if (fincaId) {
      await loadLotes(fincaId);
    } else {
      setLotes([]);
    }
  };

  const loadLotes = async (fincaId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getLotes(fincaId);
      setLotes(data);
      
      if (onLotesLoad) {
        onLotesLoad(data);
      }
    } catch (err) {
      setError('Error al cargar lotes: ' + err.message);
      console.error('Error cargando lotes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fincaSelector}>
      <h2>Seleccionar Finca</h2>
      
      {loading && <p className={styles.loading}>⏳ Cargando fincas...</p>}
      
      {error && (
        <div className={styles.errorMessage}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {!loading && !error && fincas.length > 0 && (
        <div className={styles.successMessage}>
          ✅ {fincas.length} finca{fincas.length !== 1 ? 's' : ''} cargada{fincas.length !== 1 ? 's' : ''} exitosamente
        </div>
      )}
      
      <div className={styles.selectContainer}>
        <select
          value={selectedFinca}
          onChange={handleFincaChange}
          className={styles.select}
          disabled={loading}
        >
          <option value="">-- Selecciona una finca --</option>
          {fincas.map((finca) => (
            <option key={finca.id} value={finca.id}>
              {finca.nombre} {finca.grupo ? `(${finca.grupo})` : ''}
            </option>
          ))}
        </select>
      </div>

      {lotes.length > 0 && (
        <div className={styles.lotesInfo}>
          <h3>Lotes disponibles: {lotes.length}</h3>
          <ul className={styles.lotesList}>
            {lotes.slice(0, 5).map((lote) => (
              <li key={lote.id}>{lote.nombre}</li>
            ))}
            {lotes.length > 5 && <li>...y {lotes.length - 5} más</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
