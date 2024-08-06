import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import './SignComponent.scss';

const SignComponent = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [showSignatureField, setShowSignatureField] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(''); // State für die Unterschrift
  const signatureRef = useRef(null);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmitCode = async () => {
    try {
      setStatus('Verbindung herstellen...');
      // Überprüfe den Code beim Server
      const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/verify-code', { code });
      
      if (response.data.id) {
        setStatus('Verbunden');
        setTimeout(() => {
          setStatus('');
          setShowSignatureField(true);
        }, 1000); // Zeit für das Verschwindet von "Verbunden"
      } else {
        alert('Falscher Code!');
        setStatus('');
      }
    } catch (error) {
      console.error('Fehler bei der Code-Überprüfung:', error);
      alert('Fehler bei der Code-Überprüfung.');
      setStatus('');
    }
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSignatureSubmit = async () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
      setSignatureDataUrl(dataUrl); // Unterschrift speichern

      // Konvertiere Data URL in Base64-String
      const base64String = dataUrl.replace(/^data:image\/\w+;base64,/, '');

      // Sende die Unterschrift an den Server
      try {
        const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}/upload_signature', {
          unterschrift: base64String // Base64-String senden
        });
        alert('Unterschrift erfolgreich gespeichert!');
        console.log('Server-Antwort:', response.data);
      } catch (error) {
        console.error('Fehler beim Hochladen der Unterschrift:', error);
        alert('Fehler beim Speichern der Unterschrift.');
      }
    }
  };

  return (
    <div className="auth-container">
      {!showSignatureField && (
        <div className="code-wrapper">
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="Geben Sie den Code ein"
          />
          <button onClick={handleSubmitCode}>Code einreichen</button>
        </div>
      )}
      <div className={`status-message ${status === 'Verbindung herstellen...' ? 'connecting' : status === 'Verbunden' ? 'connected' : ''}`}>
        {status}
      </div>
      {showSignatureField && (
        <div className="signature-form">
          <SignatureCanvas
            ref={signatureRef}
            penColor='black'
            canvasProps={{ width: 600, height: 200, className: 'signature-canvas' }}
          />
          <button onClick={handleClearSignature}>Löschen</button>
          <button onClick={handleSignatureSubmit}>Speichern</button>
        </div>
      )}
      {signatureDataUrl && (
        <div className="signature-preview">
          <h3>Unterschrift Vorschau:</h3>
          <img src={signatureDataUrl} alt="Unterschrift Vorschau" />
        </div>
      )}
    </div>
  );
};

export default SignComponent;
