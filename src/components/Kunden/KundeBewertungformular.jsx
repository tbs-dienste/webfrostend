import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import './KundeBewertungformular.scss';

const KundeBewertungformular = () => {
    const { kundennummer } = useParams();
    const [formValues, setFormValues] = useState({
        arbeitsqualität: '',
        arbeitsqualität_rating: 0,
        tempo: '',
        tempo_rating: 0,
        gesamt: '',
        gesamt_rating: 0,
        freundlichkeit: '',
        freundlichkeit_rating: 0,
        zufriedenheit: '',
        zufriedenheit_rating: 0,
        gesamttext: ''
    });
    const [bewertungVorhanden, setBewertungVorhanden] = useState(false);
    const [fehler, setFehler] = useState('');

    useEffect(() => {
        const checkBewertung = async () => {
            try {
                const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen');
                const bewertungen = response.data.data;
                const existingBewertung = bewertungen.find(bewertung => bewertung.kundennummer === kundennummer);
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
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleRatingChange = (newRating, name) => {
        setFormValues({
            ...formValues,
            [name]: newRating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bewertungVorhanden) {
            try {
                await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${kundennummer}`, formValues);
                alert('Bewertung erfolgreich erstellt.');
                setBewertungVorhanden(true);
            } catch (error) {
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
                    {Object.keys(formValues).map((key) => {
                        if (key.includes('_rating')) {
                            const name = key.replace('_rating', '');
                            return (
                                <div className="bewertung-feld" key={key}>
                                    <div className="label-und-rating">
                                        <label htmlFor={name}>{capitalizeFirstLetter(name)}:</label>
                                        <ReactStars
                                            count={5}
                                            value={formValues[key]}
                                            onChange={(newRating) => handleRatingChange(newRating, key)}
                                            size={30}
                                            activeColor="#ffca2c"
                                            classNames="bewertung-sterne"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        id={name}
                                        name={name}
                                        value={formValues[name]}
                                        onChange={handleChange}
                                        placeholder={`Ihre Bewertung zu ${name}`}
                                        className="bewertung-input capitalized-input"
                                    />
                                </div>
                            );
                        }
                        return null;
                    })}
                    <div className="bewertung-feld">
                        <label htmlFor="gesamttext">Gesamtbewertung:</label>
                        <textarea
                            id="gesamttext"
                            name="gesamttext"
                            value={formValues.gesamttext}
                            onChange={handleChange}
                            placeholder="Ihre Kommentare hier..."
                            className="capitalized-input"
                        ></textarea>
                    </div>
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
