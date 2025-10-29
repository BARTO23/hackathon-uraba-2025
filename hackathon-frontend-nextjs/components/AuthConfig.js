import { useState, useEffect } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '../lib/api';
import styles from '../styles/Home.module.css';

export default function AuthConfig({ onAuthChange }) {
  const [token, setTokenState] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const savedToken = getAuthToken();
    if (savedToken) {
      setTokenState(savedToken);
      setIsConfigured(true);
      if (onAuthChange) {
        onAuthChange(true);
      }
    } else {
      setShowConfig(true);
    }
  }, []);

  const handleSaveToken = () => {
    if (!token.trim()) {
      setError('Por favor ingresa un token válido');
      return;
    }

    setError(null);

    // Guardar el token directamente sin verificación
    setAuthToken(token);
    setIsConfigured(true);
    setShowConfig(false);
    
    if (onAuthChange) {
      onAuthChange(true);
    }
  };

  const handleRemoveToken = () => {
    removeAuthToken();
    setTokenState('');
    setIsConfigured(false);
    setShowConfig(true);
    if (onAuthChange) {
      onAuthChange(false);
    }
  };

  const toggleConfig = () => {
    setShowConfig(!showConfig);
    setError(null);
  };

  return (
    <div className={styles.authConfig}>
      <div className={styles.authHeader}>
        <h3>🔐 Configuración de Autenticación</h3>
        {isConfigured && (
          <div className={styles.authStatus}>
            <span className={styles.statusConnected}>● Token Configurado</span>
            <button onClick={toggleConfig} className={styles.configButton}>
              {showConfig ? 'Ocultar' : 'Cambiar Token'}
            </button>
          </div>
        )}
      </div>

      {(!isConfigured || showConfig) && (
        <div className={styles.authForm}>
          <p className={styles.authDescription}>
            Ingresa tu token de autenticación para usar la aplicación. El token se guardará en tu navegador.
          </p>

          <div className={styles.inputGroup}>
            <label htmlFor="auth-token">Token de Autenticación:</label>
            <input
              id="auth-token"
              type="password"
              value={token}
              onChange={(e) => setTokenState(e.target.value)}
              placeholder="Ingresa tu token aquí"
              className={styles.tokenInput}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className={styles.authActions}>
            <button
              onClick={handleSaveToken}
              disabled={!token.trim()}
              className={styles.saveButton}
            >
              Guardar Token
            </button>

            {isConfigured && (
              <button
                onClick={handleRemoveToken}
                className={styles.removeButton}
              >
                Eliminar Token
              </button>
            )}
          </div>

          <div className={styles.authHelp}>
            <details>
              <summary>¿Dónde obtengo mi token?</summary>
              <p>
                El token de autenticación lo obtienes de tu cuenta de Sioma.
                Contacta con el administrador del sistema si no tienes acceso.
              </p>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
