import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import { useParams } from 'react-router-dom'; // Für Kundennummer aus URL
import './SignComponent.scss';

const SignComponent = () => {
    const { kundennummer } = useParams(); // Kundennummer aus URL
    const sigCanvas = useRef({});
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token'); // Token aus LocalStorage

    const handleSignatureUpload = async () => {
        if (!token) {
            setError('Kein gültiger Token vorhanden.');
            return;
        }

        try {
            const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');

            const response = await axios.post(
                `https://tbsdigitalsolutionsbackend.onrender.com/api/sign/upload-signature/${kundennummer}`,
                { unterschrift: signatureData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(response.data.message);
            setError('');
            sigCanvas.current.clear();
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Hochladen der Unterschrift.');
            setSuccess('');
        }
    };

    const clearSignature = () => sigCanvas.current.clear();

    return (
        <div className="sign-component">
            <h2>Unterschrift erstellen</h2>

            {success && <p className="message success">{success}</p>}
            {error && <p className="message error">{error}</p>}

            <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
            />

            <div className="signature-buttons">
                <button onClick={clearSignature}>Löschen</button>
                <button onClick={handleSignatureUpload}>Unterschrift Hochladen</button>
            </div>
        </div>
    );
};

export default SignComponent;
