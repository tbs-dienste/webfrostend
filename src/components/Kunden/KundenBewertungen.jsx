import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { Link } from 'react-router-dom';
import './KundenBewertungen.scss';

const KundenBewertungen = () => {
    const [bewertungen, setBewertungen] = useState([]);
    const [durchschnitt, setDurchschnitt] = useState(0);

    useEffect(() => {
        const fetchBewertungen = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen');
                if (response.data.data.length > 0) {
                    setBewertungen(response.data.data);
                    const avgRating = calculateDurchschnitt(response.data.data);
                    setDurchschnitt(avgRating);
                } else {
                    setBewertungen(dummyBewertungen);
                    const avgRating = calculateDurchschnitt(dummyBewertungen);
                    setDurchschnitt(avgRating);
                }
            } catch (error) {
                console.error('Fehler beim Laden der Bewertungen:', error);
                setBewertungen(dummyBewertungen);
                const avgRating = calculateDurchschnitt(dummyBewertungen);
                setDurchschnitt(avgRating);
            }
        };

        fetchBewertungen();
    }, []);

    const calculateDurchschnitt = (bewertungen) => {
        if (!bewertungen.length) return 0;
        const total = bewertungen.reduce((sum, bewertung) => sum + parseFloat(bewertung.gesamtrating), 0);
        return (total / bewertungen.length).toFixed(2);
    };

    const dummyBewertungen = [
       
        {
            id: 1,
            gesamt: "Sehr gut",
            gesamtrating: 4.5
        }
    ];

    return (
        <div className="bewertung-app">
            <h1>Durchschnittliche Bewertung:</h1>
            <div className="durchschnitt-rating">
                <span>
                    <ReactStars
                        count={5}
                        value={parseFloat(durchschnitt)}
                        size={50}
                        color2={'#ffd700'}
                        edit={false}
                    />
                    {durchschnitt}
                </span>
            </div>
            <div className="bewertungen-container">
                {bewertungen.map(bewertung => (
                    <Link to={`/bewertung/${bewertung.id}`} key={bewertung.id} className="bewertung-box">
                        <p>{bewertung.gesamt}</p>
                        <ReactStars
                            count={5}
                            value={parseFloat(bewertung.gesamtrating)}
                            size={24}
                            color2={'#ffd700'}
                            edit={false}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default KundenBewertungen;
