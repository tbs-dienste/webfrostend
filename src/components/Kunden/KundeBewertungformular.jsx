import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import './KundeBewertungformular.scss';

const BewertungFelder = [
    'arbeitsqualität',
    'tempo',
    'freundlichkeit',
    'zufriedenheit',
    'kommunikation',
    'zuverlässigkeit',
    'professionalität',
    'gesamt'
];

const KundeBewertungformular = () => {
    const { kundennummer } = useParams();

    const [formValues, setFormValues] = useState(() => {
        const initial = {};
        BewertungFelder.forEach(feld => {
            initial[feld] = '';
            initial[`${feld}_rating`] = 0;
        });
        return initial;
    });

    const [bewertungVorhanden, setBewertungVorhanden] = useState(false);
    const [fehler, setFehler] = useState('');

    useEffect(() => {
        const checkBewertung = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen');
                const bewertungen = response.data.data;
                const existingBewertung = bewertungen.find(b => b.kundennummer === kundennummer);
                if (existingBewertung) {
                    setBewertungVorhanden(true);
                }
            } catch (error) {
                setFehler('Fehler beim Abrufen der Bewertungen. Bitte versuchen Sie es später erneut.');
            }
        };
        checkBewertung();
    }, [kundennummer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (newRating, name) => {
        setFormValues(prev => ({ ...prev, [name]: newRating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bewertungVorhanden) {
            try {
                await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${kundennummer}`, formValues);
                alert('Bewertung erfolgreich erstellt.');
                setBewertungVorhanden(true);
            } catch (error) {
                console.error(error);
                setFehler('Fehler beim Erstellen der Bewertung. Bitte versuchen Sie es erneut.');
            }
        } else {
            alert('Eine Bewertung für diesen Kunden ist bereits vorhanden.');
        }
    };

    return (
        <div className="bewertung-container">
            <h2>Ihre Bewertung</h2>
            {bewertungVorhanden ? (
                <div className="danke-box">
                    <h3>Vielen Dank für Ihre Bewertung!</h3>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bewertung-form">
                    {BewertungFelder.map((feld) => (
                        <div className="bewertung-feld" key={feld}>
                            <div className="label-und-rating">
                                <label htmlFor={feld}>{capitalizeFirstLetter(feld)}:</label>
                                <ReactStars
                                    count={5}
                                    value={formValues[`${feld}_rating`]}
                                    onChange={(newRating) => handleRatingChange(newRating, `${feld}_rating`)}
                                    size={30}
                                    activeColor="#ffca2c"
                                    isHalf={true}
                                    classNames="bewertung-sterne"
                                />
                            </div>
                            <textarea
                                id={feld}
                                name={feld}
                                value={formValues[feld]}
                                onChange={handleChange}
                                placeholder={`Ihre Bewertung zu ${capitalizeFirstLetter(feld)}`}
                                className="bewertung-input capitalized-input"
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="submit-button">Absenden</button>
                    {fehler && <div className="fehler-nachricht">{fehler}</div>}
                </form>
            )}
        </div>
    );
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default KundeBewertungformular;
