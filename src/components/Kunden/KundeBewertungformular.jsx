import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactStars from 'react-stars';
import './KundeBewertungformular.scss';

const KundeBewertungformular = () => {
    const { kundennummer } = useParams(); // Kundennummer aus den URL-Parametern auslesen
    const [formValues, setFormValues] = useState({
        arbeitsqualität: '',
        arbeitsqualität_rating: 0,
        tempo: '',
        tempo_rating: 0,
        gesamt: '',
        gesamt_rating: 0,
        team: '',
        team_rating: 0,
        freundlichkeit: '',
        freundlichkeit_rating: 0,
        zufriedenheit: '',
        zufriedenheit_rating: 0,
        preis: '',
        preis_rating: 0,
        gesamttext: ''
    });
    const [bereitsBewertet, setBereitsBewertet] = useState(false);

    useEffect(() => {
        // Überprüfen, ob für diesen Kunden bereits eine Bewertung existiert
        const checkExistingReview = async () => {
            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${kundennummer}`);
                if (response.data && response.data.exists) {
                    setBereitsBewertet(true); // Falls Bewertung existiert, setze den Status auf true
                }
            } catch (error) {
                console.error('Fehler beim Überprüfen der vorhandenen Bewertung:', error);
            }
        };
        checkExistingReview();
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
        try {
            await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${kundennummer}`, formValues);
            alert('Bewertung erfolgreich erstellt.');
        } catch (error) {
            console.error('Fehler beim Erstellen der Bewertung:', error);
            alert('Fehler beim Erstellen der Bewertung. Bitte versuchen Sie es erneut.');
        }
    };

    // Falls bereits bewertet, "Danke"-Nachricht anzeigen
    if (bereitsBewertet) {
        return (
            <div className="bewertung-danke">
                <h2>Vielen Dank für Ihre Bewertung!</h2>
                <p>Wir freuen uns, dass Sie uns Feedback gegeben haben.</p>
            </div>
        );
    }

    return (
        <div className="bewertung-formular">
            <h2>Bewertung abgeben</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formValues).map((key) => {
                    if (key.includes('_rating')) {
                        const name = key.replace('_rating', '');
                        return (
                            <div className="formular-gruppe" key={key}>
                                <label htmlFor={name}>{capitalizeFirstLetter(name)}:</label>
                                <input
                                    type="text"
                                    id={name}
                                    name={name}
                                    value={formValues[name]}
                                    onChange={handleChange}
                                    placeholder={`Bewertung für ${name}`}
                                />
                                <ReactStars
                                    count={5}
                                    value={formValues[key]}
                                    onChange={(newRating) => handleRatingChange(newRating, key)}
                                    size={24}
                                    color2={'#FFD700'}
                                />
                            </div>
                        );
                    }
                    return null;
                })}
                <div className="formular-gruppe">
                    <label htmlFor="gesamttext">Gesamtbewertungstext:</label>
                    <textarea
                        id="gesamttext"
                        name="gesamttext"
                        value={formValues.gesamttext}
                        onChange={handleChange}
                        placeholder="Zusätzliche Kommentare oder Details hier eingeben..."
                    ></textarea>
                </div>
                <button type="submit">Bewertung absenden</button>
            </form>
        </div>
    );
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default KundeBewertungformular;
