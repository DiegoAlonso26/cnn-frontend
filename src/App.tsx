import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setPrediction(null);
      setConfidence(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post('https://historic-audrye-1diegoalonso-c2294400.koyeb.app/predict', formData, {
      });

      setPrediction(response.data.prediccion);
      setConfidence(response.data.confianza);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al procesar la imagen. Por favor, intenta nuevamente.');
      setPrediction(null);
      setConfidence(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    setConfidence(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Background decorative elements */}
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>
      <div className="bg-decoration bg-decoration-3"></div>
      
      <div className="app-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-icon">
            <svg className="camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <h1 className="title">Reconocimiento Facial</h1>
          <p className="subtitle">Tecnología CNN de última generación</p>
        </div>

        {/* Main Content - Single Card Layout */}
        <div className="main-card">
          <div className="content-grid">
            {/* Left Side - Upload Section */}
            <div className="section upload-section">
              <h2 className="section-title">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                Subir Imagen
              </h2>

              {!preview ? (
                <label className="upload-area">
                  <div className="upload-content">
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <p className="upload-text">Arrastra una imagen aquí</p>
                    <p className="upload-text-or">o</p>
                    <p className="upload-subtext">Haz clic para seleccionar</p>
                    <div className="upload-formats">PNG, JPG, JPEG hasta 10MB</div>
                  </div>
                  <input
                    type="file"
                    onChange={onFileChange}
                    accept="image/*"
                    className="file-input"
                  />
                </label>
              ) : (
                <div className="preview-container">
                  <img src={preview} alt="Preview" className="preview-image" />
                  <button onClick={resetForm} className="reset-button" title="Eliminar imagen">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {file && !prediction && !error && (
                <button
                  onClick={onFileUpload}
                  disabled={loading}
                  className="analyze-button"
                >
                  {loading ? (
                    <span className="loading-content">
                      <div className="spinner"></div>
                      Analizando imagen...
                    </span>
                  ) : (
                    <>
                      <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analizar Imagen
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="divider"></div>

            {/* Right Side - Results Section */}
            <div className="section results-section">
              <h2 className="section-title">
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resultados del Análisis
              </h2>

              {!prediction && !error && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="empty-text">Esperando análisis</p>
                  <p className="empty-subtext">Los resultados aparecerán aquí después de procesar la imagen</p>
                </div>
              )}

              {loading && (
                <div className="loading-state">
                  <div className="loading-spinner-large"></div>
                  <p className="loading-text">Procesando imagen...</p>
                  <p className="loading-subtext">Esto puede tomar unos segundos</p>
                </div>
              )}

              {error && (
                <div className="error-container">
                  <div className="error-icon-large">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="error-title">Error en el análisis</h3>
                  <p className="error-text">{error}</p>
                  <button onClick={resetForm} className="retry-button">
                    <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Intentar de nuevo
                  </button>
                </div>
              )}

              {prediction && (
                <div className="success-container">
                  <div className="success-header">
                    <div className="success-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="success-title">Análisis Completado</h3>
                      <p className="success-subtitle">Resultados del reconocimiento facial</p>
                    </div>
                  </div>
                  
                  <div className="results-grid">
                    <div className="result-card">
                      <div className="result-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="result-content">
                        <div className="result-label">Predicción</div>
                        <div className="result-value prediction-value">{prediction}</div>
                      </div>
                    </div>

                    <div className="result-card">
                      <div className="result-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="result-content">
                        <div className="result-label">Nivel de Confianza</div>
                        <div className="confidence-display">
                          <div className="confidence-bar-container">
                            <div 
                              className="confidence-bar" 
                              style={{ width: `${(confidence || 0) * 100}%` }}
                            >
                              <span className="confidence-label">
                                {confidence ? (confidence * 100).toFixed(2) : '0.00'}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={resetForm} className="new-analysis-button">
                    <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Realizar Nuevo Análisis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="footer-info">
          <div className="info-card">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <div className="info-title">Procesamiento Rápido</div>
              <div className="info-text">Análisis en segundos</div>
            </div>
          </div>
          <div className="info-card">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <div className="info-title">Alta Precisión</div>
              <div className="info-text">Tecnología CNN avanzada</div>
            </div>
          </div>
          <div className="info-card">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <div className="info-title">Seguro y Privado</div>
              <div className="info-text">Tus datos protegidos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
