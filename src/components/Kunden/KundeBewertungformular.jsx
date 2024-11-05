import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import './KundeBewertungformular.scss';

const KundeBewertungformular = () => {
    const { kundennummer } = useParams(); // Kundennummer aus den URL-Parametern lesen
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

                // Überprüfen, ob die Bewertung für die gegebene Kundennummer vorhanden ist
                const existingBewertung = bewertungen.find(bewertung => bewertung.kundennummer === kundennummer);
                if (existingBewertung) {
                    setBewertungVorhanden(true);
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Bewertungen:', error);
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

        // Hier könnte eine tatsächliche Überprüfung des Kundenstatus stehen.
        const isCustomerCompleted = true; // Setze dies auf die tatsächliche Logik, um den Status zu überprüfen

        if (!isCustomerCompleted) {
            alert('Dieser Kunde ist nicht abgeschlossen. Eine Bewertung ist nicht möglich.');
            return;
        }

        try {
            // POST-Anfrage nur, wenn keine Bewertung vorhanden ist
            if (!bewertungVorhanden) {
                await axios.post(`https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen/${kundennummer}`, formValues);
                alert('Bewertung erfolgreich erstellt.');
                setBewertungVorhanden(true); // Setze auf true, damit die Dankesnachricht angezeigt wird
            } else {
                alert('Eine Bewertung für diesen Kunden ist bereits vorhanden.');
            }
        } catch (error) {
            if (error.response) {
                console.error('Fehler vom Server:', error.response.data);
                setFehler(`Fehler: ${error.response.data.error || 'Unbekannter Fehler'}`);
            } else {
                console.error('Fehler:', error.message);
                setFehler('Fehler beim Erstellen der Bewertung. Bitte versuchen Sie es erneut.');
            }
        }
    };

    return (
        <div className="bewertung-formular">
            <h2>Bewertung abgeben</h2>
            {bewertungVorhanden ? (
                <div className="danke-nachricht">
                    <h3>Danke für Ihre Bewertung! Sie können keine weitere Bewertung abgeben.</h3>
                </div>
            ) : (
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
                    {fehler && <div className="error-message">{fehler}</div>}
                </form>
            )}
        </div>
    );
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default KundeBewertungformular;
