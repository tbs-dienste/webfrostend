import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RechnungForm.scss';

const RechnungForm = () => {

    const [kundenSuche, setKundenSuche] = useState('');
    const [kundenId, setKundenId] = useState(null);
    const [kunden, setKunden] = useState([]);
    const [kundenVorschlaege, setKundenVorschlaege] = useState([]);

    const [dienstleistungen, setDienstleistungen] = useState([
        { title: '', anzahl: 1, preisProEinheit: 0 }
    ]);

    const [backendPakete, setBackendPakete] = useState([]);
    const [backendPaketId, setBackendPaketId] = useState('');

    const [mehrwertsteuerStatus, setMehrwertsteuerStatus] = useState('inkl');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchKunden();
        fetchBackendPakete();
    }, []);

    useEffect(() => {
        if (kundenSuche.length > 2) {
            const vorschlaege = kunden.filter(k =>
                `${k.vorname} ${k.nachname}`
                    .toLowerCase()
                    .includes(kundenSuche.toLowerCase())
            );
            setKundenVorschlaege(vorschlaege);
        } else {
            setKundenVorschlaege([]);
        }
    }, [kundenSuche, kunden]);

    useEffect(() => {
        if (!kundenId) return;
        fetchDienstleistungenFürKunde(kundenId);
    }, [kundenId]);


    const fetchBackendPakete = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await axios.get(
                'https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBackendPakete(res.data);
        } catch (err) {
            console.error('Fehler beim Laden der Backend-Pakete:', err);
        }
    };


    const fetchKunden = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await axios.get(
                'https://tbsdigitalsolutionsbackend.onrender.com/api/kunden',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setKunden(res.data.data);
        } catch (error) {
            console.error('Fehler beim Laden der Kunden:', error);
        }
    };


    const fetchDienstleistungenFürKunde = async (id) => {
        try {
            const token = localStorage.getItem('token');

            const res = await axios.get(
                `https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen/arbeitszeiten/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const serverDienstleistungen = res.data.dienstleistungen || [];

            if (serverDienstleistungen.length === 0) return;

            const umgewandelt = serverDienstleistungen.map(d => ({
                title: d.dienstleistung,
                anzahl: parseFloat(d.gesamtArbeitszeit).toFixed(2),
                preisProEinheit: parseFloat(d.preisProStunde).toFixed(2)
            }));

            setDienstleistungen(prev => [...prev, ...umgewandelt]);

        } catch (err) {
            console.error('Fehler beim Laden der Arbeitszeiten:', err);
        }
    };


    const handleAddDienstleistung = () => {
        setDienstleistungen([
            ...dienstleistungen,
            { title: '', anzahl: 1, preisProEinheit: 0 }
        ]);
    };


    const handleUpdateDienstleistung = (index, field, value) => {
        const updated = [...dienstleistungen];
        updated[index][field] = value;
        setDienstleistungen(updated);
    };


    const handleRemoveDienstleistung = (index) => {
        const updated = dienstleistungen.filter((_, i) => i !== index);
        setDienstleistungen(updated);
    };


    const calculateTotal = () => {
        return dienstleistungen.reduce(
            (sum, d) =>
                sum +
                (parseFloat(d.anzahl || 0) *
                    parseFloat(d.preisProEinheit || 0)),
            0
        );
    };


    const calculateVAT = () => {
        const netto = calculateTotal();
        return mehrwertsteuerStatus === 'exkl' ? netto * 0.081 : 0;
    };


    const calculateGesamt = () => {
        return (calculateTotal() + calculateVAT()).toFixed(2);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (dienstleistungen.length === 0) {
            setMessage('Bitte mindestens eine Dienstleistung hinzufügen.');
            return;
        }

        const data = {
            kundenId: kundenId || null,
            benutzerdefinierteDienstleistungen: dienstleistungen,
            backendPaketId: backendPaketId || null,
            mehrwertsteuerStatus
        };

        try {
            const token = localStorage.getItem('token');

            await axios.post(
                'https://tbsdigitalsolutionsbackend.onrender.com/api/rechnungen',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            window.location.href = '/rechnungen';
        } catch (err) {
            console.error('Fehler beim Erstellen der Rechnung:', err);
            setMessage('Fehler beim Erstellen der Rechnung.');
        }
    };


    return (
        <div className="rechnung-form">
            <h2>Rechnung erstellen</h2>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Kunde (optional)</label>

                    <input
                        type="text"
                        value={kundenSuche}
                        onChange={(e) => setKundenSuche(e.target.value)}
                        placeholder="Vor- oder Nachname eingeben"
                    />

                    {kundenVorschlaege.length > 0 && (
                        <ul className="vorschlaege">
                            {kundenVorschlaege.map(kunde => (
                                <li
                                    key={kunde.id}
                                    onClick={() => {
                                        setKundenId(kunde.id);
                                        setKundenSuche(`${kunde.vorname} ${kunde.nachname}`);
                                        setKundenVorschlaege([]);
                                    }}
                                >
                                    {kunde.vorname} {kunde.nachname}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                {kundenId && (
                    <div className="kunden-info">
                        {(() => {
                            const k = kunden.find(k => k.id === kundenId);
                            if (!k) return null;

                            return (
                                <>
                                    <p><strong>{k.vorname} {k.nachname}</strong></p>
                                    <p>{k.strasseHausnummer}</p>
                                    <p>{k.postleitzahl} {k.ort}</p>
                                </>
                            );
                        })()}
                    </div>
                )}


                {backendPakete.length > 0 && (
                    <div className="form-group">
                        <label>Backend-Paket (optional)</label>

                        <select
                            value={backendPaketId}
                            onChange={(e) => setBackendPaketId(e.target.value)}
                        >
                            <option value="">Kein Paket</option>

                            {backendPakete.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} – {p.vk_preis} CHF
                                </option>
                            ))}
                        </select>
                    </div>
                )}


                <div className="form-group">
                    <label>Mehrwertsteuer</label>

                    <select
                        value={mehrwertsteuerStatus}
                        onChange={e => setMehrwertsteuerStatus(e.target.value)}
                    >
                        <option value="inkl">Inkl. MwSt.</option>
                        <option value="exkl">Exkl. MwSt. (8.1%)</option>
                    </select>
                </div>


                <h3>Dienstleistungen</h3>

                <table className="dienstleistungen">
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Bezeichnung</th>
                            <th>Menge</th>
                            <th>Einzelpreis</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {dienstleistungen.map((dienst, index) => (
                            <tr key={index}>

                                <td>{index + 1}</td>

                                <td>
                                    <input
                                        type="text"
                                        value={dienst.title}
                                        placeholder="z.B. Website Design"
                                        onChange={e =>
                                            handleUpdateDienstleistung(
                                                index,
                                                'title',
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={dienst.anzahl}
                                        onChange={e =>
                                            handleUpdateDienstleistung(
                                                index,
                                                'anzahl',
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        step="0.05"
                                        value={dienst.preisProEinheit}
                                        onChange={e =>
                                            handleUpdateDienstleistung(
                                                index,
                                                'preisProEinheit',
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>

                                <td>
                                    {(dienst.anzahl * dienst.preisProEinheit).toFixed(2)} CHF
                                </td>

                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDienstleistung(index)}
                                    >
                                        ✖
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>


                <button
                    type="button"
                    onClick={handleAddDienstleistung}
                    className="add-btn"
                >
                    + Dienstleistung hinzufügen
                </button>


                <div className="summe">

                    <p>
                        Zwischensumme: <strong>{calculateTotal().toFixed(2)} CHF</strong>
                    </p>

                    <p>
                        Mehrwertsteuer: <strong>{calculateVAT().toFixed(2)} CHF</strong>
                    </p>

                    <p className="gesamt">
                        Gesamt: <strong>{calculateGesamt()} CHF</strong>
                    </p>

                </div>


                <button
                    type="submit"
                    className="submit-btn"
                >
                    Rechnung speichern
                </button>


                {message && (
                    <p className="error-msg">
                        {message}
                    </p>
                )}

            </form>
        </div>
    );
};

export default RechnungForm;
