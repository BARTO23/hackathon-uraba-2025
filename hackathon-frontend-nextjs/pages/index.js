import { useState, useEffect } from 'react';

export default function HomePage() {
  const [fincas, setFincas] = useState([]);
  const [selectedFinca, setSelectedFinca] = useState('');
  const [lotes, setLotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar Fincas al iniciar
  useEffect(() => {
    const fetchFincas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fincas`);
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        const data = await response.json();
        setFincas(data);
      } catch (err) {
        setError("No se pudo conectar con el backend. ¿Está encendido?");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFincas();
  }, []);

  // Cargar Lotes cuando se selecciona una Finca
  useEffect(() => {
    if (!selectedFinca) {
      setLotes([]);
      return;
    }
    const fetchLotes = async () => {
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lotes/${selectedFinca}`);
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        const data = await response.json();
        setLotes(data);
      } catch (err) {
        setError("No se pudieron cargar los lotes.");
        console.error(err);
      }
    };
    fetchLotes();
  }, [selectedFinca]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Interfaz Inteligente de Spots</h1>
      
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      
      <div>
        <label htmlFor="finca-select">1. Seleccione una Finca:</label>
        <select
          id="finca-select"
          value={selectedFinca}
          onChange={(e) => setSelectedFinca(e.target.value)}
          disabled={isLoading}
        >
          <option value="">{isLoading ? 'Cargando...' : '---'}</option>
          {fincas.map((finca) => (
            <option key={finca.id} value={finca.id}>
              {finca.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedFinca && (
        <div>
          <h3>Lotes para la finca seleccionada:</h3>
          <ul>
            {lotes.length > 0 
              ? lotes.map((lote) => <li key={lote.id}>{lote.nombre}</li>)
              : <p>Cargando lotes...</p>
            }
          </ul>
        </div>
      )}
      
      {/* Aquí irían los demás componentes para subir archivo y ver el mapa */}
    </main>
  );
}