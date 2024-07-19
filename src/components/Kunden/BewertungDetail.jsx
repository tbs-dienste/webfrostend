import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { Link, useParams } from 'react-router-dom';
import './BewertungDetail.scss';

const BewertungDetail = () => {
    const { id } = useParams();
    const [bewertung, setBewertung] = useState(null);

    useEffect(() => {
        const fetchBewertung = async () => {
            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${id}`);
                if (response.data.data.length > 0) {
                    setBewertung(response.data.data[0]);
                } else {
                    setBewertung(null);
                }
            } catch (error) {
                console.error('Fehler beim Laden der Bewertung:', error);
                setBewertung(null);
            }
        };

        fetchBewertung();
    }, [id]);

    const dummyBewertung = {
        arbeitsqualität: "Sehr gut",
        arbeitsqualität_rating: 5,
        tempo: "Schnell",
        tempo_rating: 4,
        gesamt: "Ausgezeichnet",
        gesamt_rating: 5,
        team: "Professionell",
        team_rating: 5,
        freundlichkeit: "Sehr freundlich",
        freundlichkeit_rating: 5,
        zufriedenheit: "Hoch",
        zufriedenheit_rating: 5,
        preis: "Angemessen",
        preis_rating: 4,
        gesamttext: "Das Team hat hervorragende Arbeit geleistet und war sehr freundlich. Ich bin sehr zufrieden."
    };

    const displayBewertung = bewertung || dummyBewertung;

    return (
        <div className="bewertung-detail">
            <Link to="/kundenbewertungen" className="back-button">Zurück</Link>
            <h2>Detailansicht</h2>
            <div className="bewertung-container">
                <p><strong>Arbeitsqualität:</strong> {displayBewertung.arbeitsqualität}</p>
                <ReactStars
                    count={5}
                    value={parseFloat(displayBewertung.arbeitsqualität_rating)}
                    size={24}
                    color2={'#ffd700'}
                    edit={false}
                />
                <p><strong>Tempo:</strong> {displayBewertung.tempo}</p>
                <ReactStars
                    count={5}
                    value={parseFloat(displayBewertung.tempo_rating)}
                    size={24}
                    color2={'#ffd700'}
                    edit={false}
                />
                <p><strong>Gesamt:</strong> {displayBewertung.gesamt}</p>
                <ReactStars
                    count={5}
                    value={parseFloat(displayBewertung.gesamt_rating)}
                    size={24}
                    color2={'#ffd700'}
                    edit={false}
                />
                <p><strong>Team:</strong> {displayBewertung.team}</p>
                <ReactStars
                    count={5}
                    value={parseFloat(displayBewertung.team_rating)}
                    size={24}
                    color2={'#ffd700'}
                    edit={false}
                />
                <p><strong>Freundlichkeit:</strong> {displayBewertung.freundlichkeit}</p>
                <ReactStars
                    count={5}
                    value={parseFloat(displayBewertung.freundlichkeit_rating)}
                    size={24}
                    color2={'#ffd700'}
                    edit={false}
                />
                <p><strong>Zufriedenheit:</strong> {displayBewertung.zufriedenheit}</p>
                <ReactStars
                    count={5}
                    value={parseFloat(displayBewertung.zufriedenheit_rating)}
                    size={24}
                    color2={'#ffd700'}
                    edit={false}
                />
                <p><strong>Preis:</strong> {displayBewertung.preis}</p>
                <ReactStars
                    count={5}
                    value={parseFloat(displayBewertung.preis_rating)}
                    size={24}
                    color2={'#ffd700'}
                    edit={false}
                />
                <p><strong>Kommentar:</strong> {displayBewertung.gesamttext}</p>
            </div>
        </div>
    );
};

export default BewertungDetail;
