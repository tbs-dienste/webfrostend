import React, { useState, useRef } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import './SignComponent.scss'; // Importiere das SCSS

const SignComponent = () => {
    const [code, setCode] = useState('');
    const [codeToken, setCodeToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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

    const handleSignatureUpload = async () => {
        if (!codeToken) {
            setError('Bitte verifizieren Sie zuerst den Code.');
            return;
        }

        try {
            const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
            const response = await axios.post(
                'https://tbsdigitalsolutionsbackend.onrender.com/api/sign/upload-signature',
                { unterschrift: signatureData },
                {
                    headers: {
                        Authorization: `Bearer ${codeToken}`,
                    },
                }
            );

            setSuccess(response.data.message);
            setError('');
            sigCanvas.current.clear(); // Clear the canvas
        } catch (err) {
            setError(err.response.data.error || 'Fehler beim Hochladen der Unterschrift.');
            setSuccess('');
        }
    };

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    const handleSignatureChange = () => {
        // Speichert die Unterschrift automatisch, wenn sich das Canvas ändert
        const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        // Hier könnte man einen Upload der Unterschrift einbauen, wenn erforderlich
    };

    return (
        <div className="sign-component">
            <h2>Code Verifizieren und Unterschrift Hochladen</h2>

            {!codeToken && (
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
            )}

            {success && <p className="message success">{success}</p>}
            {error && <p className="message error">{error}</p>}

            {codeToken && (
                <div className="signature-section">
                    <h3>Unterschrift erstellen</h3>
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                        onEnd={handleSignatureChange} // Speichert die Unterschrift automatisch, wenn das Zeichnen endet
                    />
                    <div className="signature-buttons">
                        <button onClick={clearSignature}>Löschen</button>
                        <button onClick={handleSignatureUpload}>Unterschrift Hochladen</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignComponent;
