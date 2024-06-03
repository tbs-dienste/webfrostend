import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';

import './KundenBewertungen.scss';

const KundenBewertungen = () => {
    const [bewertungen, setBewertungen] = useState([]);
    const [durchschnitt, setDurchschnitt] = useState(0);

    useEffect(() => {
        const fetchBewertungen = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen');
                setBewertungen(response.data.data);
                const avgRating = calculateDurchschnitt(response.data.data);
                setDurchschnitt(avgRating);
            } catch (error) {
                console.error('Fehler beim Laden der Bewertungen:', error);
            }
        };

        fetchBewertungen();
    }, []);

    const calculateDurchschnitt = (bewertungen) => {
        if (!bewertungen.length) return 0;
        const total = bewertungen.reduce((sum, bewertung) => sum + parseFloat(bewertung.gesamtrating), 0);
        return (total / bewertungen.length).toFixed(2);
    };

    const handleBewertungClick = (id) => {
        window.location.href = `/bewertung/${id}`;
    };

    return (
        <div className="bewertung-app">
            <h1>Durchschnittliche Bewertung:</h1>
            <div className="durchschnitt-rating">
                <ReactStars
                    count={5}
                    value={parseFloat(durchschnitt)}
                    size={50}
                    color2={'#ffd700'}
                    edit={false}
                />
                <span>{durchschnitt}</span>
            </div>
            <div className="bewertungen-container">
                {bewertungen.map(bewertung => (
                    <div key={bewertung.id} className="bewertung-box" onClick={() => handleBewertungClick(bewertung.id)}>
                        <p>{bewertung.gesamt}</p>
                        <ReactStars
                            count={5}
                            value={parseFloat(bewertung.gesamtrating)}
                            size={24}
                            color2={'#ffd700'}
                            edit={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KundenBewertungen;
