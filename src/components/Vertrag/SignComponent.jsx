import React, { useState, useRef } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import './SignComponent.scss'; // Importiere das SCSS

const SignComponent = () => {
    const [code, setCode] = useState('');
    const [codeToken, setCodeToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [signature, setSignature] = useState('');
    const sigCanvas = useRef({});

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/sign/verify-code', { code });
            setCodeToken(response.data.codeToken);
            setSuccess('Code erfolgreich verifiziert.');
            setError('');
        } catch (err) {
            setError(err.response.data.error || 'Fehler bei der Code-Überprüfung.');
            setSuccess('');
        }
    };

    const handleSignatureUpload = async (e) => {
        e.preventDefault();
        if (!codeToken) {
            setError('Bitte verifizieren Sie zuerst den Code.');
            return;
        }

        try {
            const response = await axios.post(
                'https://tbsdigitalsolutionsbackend.onrender.com/api/sign/upload-signature',
                { unterschrift: signature },
                {
                    headers: {
                        Authorization: `Bearer ${codeToken}`,
                    },
                }
            );

            setSuccess(response.data.message);
            setError('');
            setSignature(''); // Reset the signature input
            sigCanvas.current.clear(); // Clear the canvas
        } catch (err) {
            setError(err.response.data.error || 'Fehler beim Hochladen der Unterschrift.');
            setSuccess('');
        }
    };

    const clearSignature = () => {
        sigCanvas.current.clear();
        setSignature('');
    };

    const saveSignature = () => {
        setSignature(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
    };

    return (
        <div className="sign-component">
            <h2>Code Verifizieren und Unterschrift Hochladen</h2>

            <form className="code-form" onSubmit={handleCodeSubmit}>
                <label htmlFor="code">Code:</label>
                <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Code Verifizieren</button>
            </form>

            {success && <p className="message success">{success}</p>}
            {error && <p className="message error">{error}</p>}

            {codeToken && (
                <div className="signature-section">
                    <h3>Unterschrift erstellen</h3>
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                    />
                    <div className="signature-buttons">
                        <button onClick={saveSignature}>Unterschrift speichern</button>
                        <button onClick={clearSignature}>Löschen</button>
                    </div>

                    {signature && (
                        <div className="signature-preview">
                            <h4>Vorschau der Unterschrift:</h4>
                            <img src={signature} alt="Unterschrift" width="200" />
                        </div>
                    )}
                    <button onClick={handleSignatureUpload}>Unterschrift Hochladen</button>
                </div>
            )}
        </div>
    );
};

export default SignComponent;
