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
                setBewertung(response.data.data[0]);
            } catch (error) {
                console.error('Fehler beim Laden der Bewertung:', error);
            }
        };

        fetchBewertung();
    }, [id]);

    if (!bewertung) return <p>Lädt...</p>;

    return (
        <div className="bewertung-detail">
            <Link to="/kundenbewertungen" className="back-button">Zurück</Link>
            <h2>Detailansicht</h2>
            <p><strong>Arbeitsqualität:</strong> {bewertung.arbeitsqualität}</p>
            <ReactStars
                count={5}
                value={parseFloat(bewertung.arbeitsqualität_rating)}
                size={24}
                color2={'#ffd700'}
                edit={false}
            />
            <p><strong>Tempo:</strong> {bewertung.tempo}</p>
            <ReactStars
                count={5}
                value={parseFloat(bewertung.tempo_rating)}
                size={24}
                color2={'#ffd700'}
                edit={false}
            />
            <p><strong>Gesamt:</strong> {bewertung.gesamt}</p>
            <ReactStars
                count={5}
                value={parseFloat(bewertung.gesamt_rating)}
                size={24}
                color2={'#ffd700'}
                edit={false}
            />
            <p><strong>Team:</strong> {bewertung.team}</p>
            <ReactStars
                count={5}
                value={parseFloat(bewertung.team_rating)}
                size={24}
                color2={'#ffd700'}
                edit={false}
            />
            <p><strong>Freundlichkeit:</strong> {bewertung.freundlichkeit}</p>
            <ReactStars
                count={5}
                value={parseFloat(bewertung.freundlichkeit_rating)}
                size={24}
                color2={'#ffd700'}
                edit={false}
            />
            <p><strong>Zufriedenheit:</strong> {bewertung.zufriedenheit}</p>
            <ReactStars
                count={5}
                value={parseFloat(bewertung.zufriedenheit_rating)}
                size={24}
                color2={'#ffd700'}
                edit={false}
            />
            <p><strong>Preis:</strong> {bewertung.preis}</p>
            <ReactStars
                count={5}
                value={parseFloat(bewertung.preis_rating)}
                size={24}
                color2={'#ffd700'}
                edit={false}
            />
            <p><strong>Kommentar:</strong> {bewertung.gesamttext}</p>
        </div>
    );
};

export default BewertungDetail;
