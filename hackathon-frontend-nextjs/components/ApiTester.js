import { useState } from 'react';
import { getAuthToken } from '../lib/api';
import styles from '../styles/Home.module.css';
import { MdScience, MdAutorenew, MdCheckCircle, MdCancel, MdAssessment, MdInfo, MdSearch } from 'react-icons/md';
import { IoRocketSharp } from 'react-icons/io5';

export default function ApiTester() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('bearer');
  const [autoTestResults, setAutoTestResults] = useState(null);

  const testFormats = {
    'direct': (token) => token,
    'bearer': (token) => `Bearer ${token}`,
    'basic': (token) => `Basic ${token}`,
    'token': (token) => `Token ${token}`,
    'apikey': (token) => token, // pero usa X-API-Key header
  };

  const testAPI = async () => {
    const token = getAuthToken();
    if (!token) {
      setResult({ error: 'No hay token configurado' });
      return;
    }

    setLoading(true);
    setResult(null);

    const authHeader = testFormats[selectedFormat](token);
    const url = 'https://api.sioma.dev/4/usuarios/sujetos';

    try {
      console.log('Testing API...');
      console.log('Format:', selectedFormat);
      
      // Construir headers según el formato
      const headers = {
        'Content-Type': 'application/json',
        'tipo-sujetos': '[1]',
      };

      if (selectedFormat === 'apikey') {
        headers['X-API-Key'] = token;
        console.log('Using X-API-Key header');
      } else {
        headers['Authorization'] = authHeader;
        console.log('Authorization Header:', authHeader.substring(0, 30) + '...');
      }

      console.log('All Headers:', headers);

      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: headers,
      });

      console.log('Status:', response.status);
      
      const responseText = await response.text();
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          setResult({ 
            success: true, 
            status: response.status,
            data: data,
            format: selectedFormat
          });
        } catch (e) {
          setResult({ 
            success: true, 
            status: response.status,
            raw: responseText,
            format: selectedFormat
          });
        }
      } else {
        setResult({ 
          error: true, 
          status: response.status,
          message: responseText,
          format: selectedFormat
        });
      }
    } catch (error) {
      setResult({ 
        error: true, 
        message: error.message,
        format: selectedFormat
      });
    } finally {
      setLoading(false);
    }
  };

  const testAllFormats = async () => {
    const token = getAuthToken();
    if (!token) {
      setAutoTestResults({ error: 'No hay token configurado' });
      return;
    }

    setLoading(true);
    setAutoTestResults(null);
    setResult(null);

    const results = [];
    const url = 'https://api.sioma.dev/4/usuarios/sujetos';

    console.log('Probando todos los formatos automáticamente...');

    for (const [formatName, formatFunc] of Object.entries(testFormats)) {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'tipo-sujetos': '[1]',
        };

        if (formatName === 'apikey') {
          headers['X-API-Key'] = token;
        } else {
          headers['Authorization'] = formatFunc(token);
        }

        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: headers,
        });

        console.log(`${formatName}: ${response.status}`);

        results.push({
          format: formatName,
          status: response.status,
          success: response.ok
        });

        // Si encontramos uno exitoso, detener
        if (response.ok) {
          const data = await response.json();
          setAutoTestResults({
            success: true,
            correctFormat: formatName,
            results: results,
            data: data
          });
          setLoading(false);
          return;
        }
      } catch (error) {
        results.push({
          format: formatName,
          error: error.message
        });
      }
    }

    setAutoTestResults({
      success: false,
      results: results
    });
    setLoading(false);
  };

  return (
    <div className={styles.authConfig}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MdScience /> Probador de API
      </h3>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        Prueba diferentes formatos de autorización para encontrar el correcto
      </p>
      
      <div style={{ 
        background: '#fffbea', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginTop: '1rem',
        border: '1px solid #f59e0b'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MdInfo /> <strong>Recomendación:</strong> Prueba primero el formato "Bearer" o haz clic en "Probar Todos" para encontrar automáticamente el formato correcto.
        </p>
      </div>

      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Formato de Autorización:
        </label>
        <select 
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className={styles.select}
          disabled={loading}
        >
          <option value="direct">Token directo: {'{token}'}</option>
          <option value="bearer">Bearer: Bearer {'{token}'}</option>
          <option value="basic">Basic: Basic {'{token}'}</option>
          <option value="token">Token: Token {'{token}'}</option>
          <option value="apikey">API Key: X-API-Key header</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={testAPI}
          disabled={loading}
          className={styles.uploadButton}
          style={{ flex: 1 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <MdAutorenew className="spin" /> Probando...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <IoRocketSharp /> Probar Formato
            </span>
          )}
        </button>
        
        <button
          onClick={testAllFormats}
          disabled={loading}
          className={styles.saveButton}
          style={{ flex: 1 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <MdAutorenew className="spin" /> Probando...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <MdAutorenew /> Probar Todos
            </span>
          )}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '1.5rem' }}>
          {result.success ? (
            <div className={styles.successMessage}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MdCheckCircle /> ¡Éxito! (Status: {result.status})
                </span>
              </h4>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Formato correcto:</strong> {result.format}
              </p>
              {result.data && (
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                    Ver datos ({result.data.length} items)
                  </summary>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '300px',
                    fontSize: '0.85rem'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div className={styles.errorMessage}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MdCancel /> Error {result.status ? `(Status: ${result.status})` : ''}
                </span>
              </h4>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Formato probado:</strong> {result.format}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Mensaje:</strong> {result.message}
              </p>
              <p style={{ margin: '1rem 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                Sugerencia: Prueba otro formato o verifica tu token con el administrador
              </p>
            </div>
          )}
        </div>
      )}

      {autoTestResults && (
        <div style={{ marginTop: '1.5rem' }}>
          {autoTestResults.success ? (
            <div className={styles.successMessage}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MdCheckCircle /> ¡Formato Encontrado!
                </span>
              </h4>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                <strong>Formato correcto: "{autoTestResults.correctFormat}"</strong>
              </p>
              <p style={{ margin: '0.5rem 0', color: '#059669' }}>
                Este es el formato que debes usar para todas las peticiones a la API.
              </p>
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MdAssessment /> Resultados de pruebas:
                </p>
                {autoTestResults.results.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span>{r.success ? <MdCheckCircle color="#10b981" /> : <MdCancel color="#ef4444" />}</span>
                    <span style={{ fontFamily: 'monospace' }}>{r.format}</span>
                    <span style={{ color: '#666' }}>- Status: {r.status}</span>
                  </div>
                ))}
              </div>
              
              {autoTestResults.data && (
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                    Ver datos ({autoTestResults.data.length} fincas)
                  </summary>
                  <pre style={{ 
                    background: '#f5f5f5', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '200px',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem'
                  }}>
                    {JSON.stringify(autoTestResults.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div className={styles.errorMessage}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MdCancel /> Ningún formato funcionó
                </span>
              </h4>
              <p style={{ margin: '0.5rem 0' }}>
                Se probaron todos los formatos disponibles y ninguno fue aceptado por la API.
              </p>
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.3)', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: '600' }}>📊 Resultados:</p>
                {autoTestResults.results.map((r, i) => (
                  <div key={i} style={{ marginBottom: '0.25rem' }}>
                    <span>❌ </span>
                    <span style={{ fontFamily: 'monospace' }}>{r.format}</span>
                    <span style={{ opacity: 0.8 }}> - {r.error || `Status: ${r.status}`}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', borderRadius: '6px', color: '#856404' }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MdSearch /> Posibles causas:
                </p>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  <li>El token es inválido o ha expirado</li>
                  <li>El token no tiene permisos para este endpoint</li>
                  <li>La API usa un formato de autenticación diferente</li>
                  <li>Hay un problema de CORS</li>
                </ul>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                  Sugerencia: Contacta al administrador de la API con esta información.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#667eea', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MdInfo /> Información de debugging
          </summary>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            <p><strong>Token actual:</strong> {getAuthToken() ? getAuthToken().substring(0, 20) + '...' : 'No configurado'}</p>
            <p><strong>Endpoint:</strong> https://api.sioma.dev/4/usuarios/sujetos</p>
            <p><strong>Header tipo-sujetos:</strong> [1]</p>
          </div>
        </details>
      </div>
    </div>
  );
}
