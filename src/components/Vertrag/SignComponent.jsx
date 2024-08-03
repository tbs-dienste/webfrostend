import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './SignComponent.scss';

const FIXED_CODE = '123456'; // Der feste Code

const SignComponent = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [showSignatureField, setShowSignatureField] = useState(false);
  const signatureRef = useRef(null);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmitCode = () => {
    if (code === FIXED_CODE) {
      setStatus('Verbinden…');
      setTimeout(() => {
        setStatus('Verbunden');
        setShowSignatureField(true);
      }, 2000); // Zeit für die Verbindung
    } else {
      alert('Falscher Code!');
    }
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleSignatureSubmit = () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
      alert('Unterschrift gesendet!');
      console.log('Unterschrift:', dataUrl); // Hier kannst du den Code hinzufügen, um die Unterschrift zu speichern oder zu senden
    }
  };

  return (
    <div className="auth-container">
      <div className="code-wrapper">
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="Geben Sie den Code ein"
        />
        <button onClick={handleSubmitCode}>Code einreichen</button>
      </div>
      <div className={`status-message ${status === 'Verbinden…' ? 'connecting' : status === 'Verbunden' ? 'connected' : ''}`}>
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
          <button onClick={handleSignatureSubmit}>Senden</button>
        </div>
      )}
    </div>
  );
};

export default SignComponent;
