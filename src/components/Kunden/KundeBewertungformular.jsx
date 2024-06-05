import React, { useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import './KundeBewertungformular.scss';

const KundeBewertungformular = () => {
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
            await axios.post('https://tbsdigitalsolutionsbackend.onrender.com/api/bewertungen', formValues);
            alert('Bewertung erfolgreich erstellt.');
            // Hier könnten Sie die Benutzer auf eine andere Seite weiterleiten oder eine Benachrichtigung anzeigen.
            // Beispiel: history.push('/dankesnachricht');
        } catch (error) {
            console.error('Fehler beim Erstellen der Bewertung:', error);
            alert('Fehler beim Erstellen der Bewertung. Bitte versuchen Sie es erneut.');
        }
    };

    return (
        <div className="bewertung-formular">
            <h2>Bewertung abgeben</h2>
            <form onSubmit={handleSubmit}>
                <div className="formular-gruppe">
                    <label htmlFor="arbeitsqualität">Arbeitsqualität:</label>
                    <input
                        type="text"
                        id="arbeitsqualität"
                        name="arbeitsqualität"
                        value={formValues.arbeitsqualität}
                        onChange={handleChange}
                    />
                    <ReactStars
                        count={5}
                        value={formValues.arbeitsqualität_rating}
                        onChange={(newRating) => handleRatingChange(newRating, 'arbeitsqualität_rating')}
                        size={24}
                        color2={'#ffd700'}
                    />
                </div>
                <div className="formular-gruppe">
                    <label htmlFor="tempo">Tempo:</label>
                    <input
                        type="text"
                        id="tempo"
                        name="tempo"
                        value={formValues.tempo}
                        onChange={handleChange}
                    />
                    <ReactStars
                        count={5}
                        value={formValues.tempo_rating}
                        onChange={(newRating) => handleRatingChange(newRating, 'tempo_rating')}
                        size={24}
                        color2={'#ffd700'}
                    />
                </div>
                <div className="formular-gruppe">
                    <label htmlFor="gesamt">Gesamt:</label>
                    <input
                        type="text"
                        id="gesamt"
                        name="gesamt"
                        value={formValues.gesamt}
                        onChange={handleChange}
                    />
                    <ReactStars
                        count={5}
                        value={formValues.gesamt_rating}
                        onChange={(newRating) => handleRatingChange(newRating, 'gesamt_rating')}
                        size={24}
                        color2={'#ffd700'}
                    />
                </div>
                <div className="formular-gruppe">
                    <label htmlFor="team">Team:</label>
                    <input
                        type="text"
                        id="team"
                        name="team"
                        value={formValues.team}
                        onChange={handleChange}
                    />
                    <ReactStars
                        count={5}
                        value={formValues.team_rating}
                        onChange={(newRating) => handleRatingChange(newRating, 'team_rating')}
                        size={24}
                        color2={'#ffd700'}
                    />
                </div>
                <div className="formular-gruppe">
                    <label htmlFor="freundlichkeit">Freundlichkeit:</label>
                    <input
                        type="text"
                        id="freundlichkeit"
                        name="freundlichkeit"
                        value={formValues.freundlichkeit}
                        onChange={handleChange}
                    />
                    <ReactStars
                        count={5}
                        value={formValues.freundlichkeit_rating}
                        onChange={(newRating) => handleRatingChange(newRating, 'freundlichkeit_rating')}
                        size={24}
                        color2={'#ffd700'}
                    />
                </div>
                <div className="formular-gruppe">
                    <label htmlFor="zufriedenheit">Zufriedenheit:</label>
                    <input
                        type="text"
                        id="zufriedenheit"
                        name="zufriedenheit"
                        value={formValues.zufriedenheit}
                        onChange={handleChange}
                    />
                    <ReactStars
                        count={5}
                        value={formValues.zufriedenheit_rating}
                        onChange={(newRating) => handleRatingChange(newRating, 'zufriedenheit_rating')}
                        size={24}
                        color2={'#ffd700'}
                    />
                </div>
                <div className="formular-gruppe">
                    <label htmlFor="preis">Preis:</label>
                    <input
                        type="text"
                        id="preis"
                        name="preis"
                        value={formValues.preis}
                        onChange={handleChange}
                    />
                    <ReactStars
                        count={5}
                        value={formValues.preis_rating}
                        onChange={(newRating) => handleRatingChange(newRating, 'preis_rating')}
                        size={24}
                        color2={'#ffd700'}
                    />
                </div>
                <div className="formular-gruppe">
                    <label htmlFor="gesamttext">Gesamtbewertungstext:</label>
                    <textarea
                        id="gesamttext"
                        name="gesamttext"
                        value={formValues.gesamttext}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit">Bewertung absenden</button>
            </form>
        </div>
 );
};

export default KundeBewertungformular;