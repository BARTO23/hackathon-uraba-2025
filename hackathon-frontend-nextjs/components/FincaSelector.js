import { useState, useEffect } from 'react';
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fincas`);
      
      if (!response.ok) {
        throw new Error('Error al cargar las fincas');
      }

      const data = await response.json();
      setFincas(data);
    } catch (err) {
      setError('Error al cargar fincas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFincaChange = async (e) => {
    const fincaId = e.target.value;
    setSelectedFinca(fincaId);
    
    if (onFincaSelect) {
      onFincaSelect(fincaId);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lotes?finca_id=${fincaId}`
      );
      
      if (!response.ok) {
        throw new Error('Error al cargar los lotes');
      }

      const data = await response.json();
      setLotes(data);
      
      if (onLotesLoad) {
        onLotesLoad(data);
      }
    } catch (err) {
      setError('Error al cargar lotes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fincaSelector}>
      <h2>Seleccionar Finca</h2>
      
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
              {finca.nombre}
            </option>
          ))}
        </select>

        {loading && <p className={styles.loading}>Cargando...</p>}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

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
