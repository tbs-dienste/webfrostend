import React, { useEffect, useState } from "react";
import axios from "axios";

const VertragErstellen = () => {

    const token = localStorage.getItem("token");

    const [backendPakete, setBackendPakete] = useState([]);
    const [dbPakete, setDbPakete] = useState([]);
    const [mitarbeiter, setMitarbeiter] = useState([]);

    const [form, setForm] = useState({

        vertragsnummer: "",
        vertragsdatum: "",

        anbieter_firma: "",
        anbieter_adresse: "",
        anbieter_plz_ort: "",

        kunde_firma: "",
        kunde_name: "",
        kunde_vorname: "",
        kunde_adresse: "",
        kunde_plz_ort: "",
        kunde_email: "",
        kunde_telefon: "",

        backend_paket_id: "",
        db_paket_id: "",

        zahlungsintervall: "monatlich",
        vertragslaufzeit: "",
        laufzeit_typ: "monate",
        vertragsbeginn: "",

        mitarbeiter_id: "",

        monatlicherPreis: "",
        jaehrlicherPreis: "",
        vertragsende: ""
    });

    // =========================
    // DATEN LADEN
    // =========================
    useEffect(() => {
        loadPakete();
        loadMitarbeiter();
    }, []);

    const loadPakete = async () => {
        try {
            const backendRes = await axios.get(
                "https://tbsdigitalsolutionsbackend.onrender.com/api/backendpakete",
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            const dbRes = await axios.get(
                "https://tbsdigitalsolutionsbackend.onrender.com/api/datenbankpakete",
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Backend Pakete prüfen
            if (Array.isArray(backendRes.data)) {
                setBackendPakete(backendRes.data);
            } else if (backendRes.data.backendpakete && Array.isArray(backendRes.data.backendpakete)) {
                setBackendPakete(backendRes.data.backendpakete);
            } else {
                console.error("Backend Pakete ungültig", backendRes.data);
                setBackendPakete([]);
            }
    
            // DB Pakete prüfen
            if (Array.isArray(dbRes.data)) {
                setDbPakete(dbRes.data);
            } else if (dbRes.data.datenbankpakete && Array.isArray(dbRes.data.datenbankpakete)) {
                setDbPakete(dbRes.data.datenbankpakete);
            } else {
                console.error("DB Pakete ungültig", dbRes.data);
                setDbPakete([]);
            }
    
        } catch (err) {
            console.error(err);
            setBackendPakete([]);
            setDbPakete([]);
        }
    };

    const loadMitarbeiter = async () => {
        try {
            const res = await axios.get(
                "https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter",
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Prüfen, ob res.data Array ist
            if (Array.isArray(res.data)) {
                setMitarbeiter(res.data);
            } else if (res.data.mitarbeiter && Array.isArray(res.data.mitarbeiter)) {
                setMitarbeiter(res.data.mitarbeiter);
            } else {
                console.error("Mitarbeiter Daten ungültig", res.data);
                setMitarbeiter([]);
            }
        } catch (err) {
            console.error(err);
            setMitarbeiter([]);
        }
    };
    // =========================
    // INPUT
    // =========================
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // LIVE BERECHNUNG
    // =========================
    useEffect(() => {

        if (
            form.backend_paket_id &&
            form.db_paket_id &&
            form.vertragsbeginn &&
            form.vertragslaufzeit
        ) {
            calculatePreview();
        }

    }, [
        form.backend_paket_id,
        form.db_paket_id,
        form.vertragsbeginn,
        form.vertragslaufzeit,
        form.laufzeit_typ,
        form.zahlungsintervall
    ]);

    const calculatePreview = async () => {

        try {

            const res = await axios.post(
                "http://localhost:5000/api/vertrag/preview",
                {
                    backend_paket_id: form.backend_paket_id,
                    db_paket_id: form.db_paket_id,
                    zahlungsintervall: form.zahlungsintervall,
                    vertragslaufzeit: form.vertragslaufzeit,
                    laufzeit_typ: form.laufzeit_typ,
                    vertragsbeginn: form.vertragsbeginn
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setForm(prev => ({
                ...prev,
                monatlicherPreis: res.data.monatlicherPreis,
                jaehrlicherPreis: res.data.jaehrlicherPreis,
                vertragsende: res.data.vertragsende
            }));

        } catch (err) {
            console.log(err);
        }
    };

    // =========================
    // SPEICHERN
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:5000/api/vertrag",
                form,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert("Vertrag gespeichert");

        } catch (err) {
            alert("Fehler beim Speichern");
        }
    };

    return (

        <div style={{ padding: 30 }}>

            <h2>Vertrag erstellen</h2>

            <form onSubmit={handleSubmit}>

                <h3>Vertragsdaten</h3>

                <input name="vertragsnummer" placeholder="Vertragsnummer" onChange={handleChange} />
                <input type="date" name="vertragsdatum" onChange={handleChange} />

                <h3>Pakete</h3>

                <select name="backend_paket_id" onChange={handleChange}>
                    <option>Backend Paket</option>
                    {backendPakete.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <select name="db_paket_id" onChange={handleChange}>
                    <option>DB Paket</option>
                    {dbPakete.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <h3>Mitarbeiter</h3>

                <select name="mitarbeiter_id" onChange={handleChange}>
                    <option>Mitarbeiter wählen</option>
                    {mitarbeiter.map(m => (
                        <option key={m.id} value={m.id}>
                            {m.vorname} {m.nachname}
                        </option>
                    ))}
                </select>

                <h3>Laufzeit</h3>

                <input name="vertragslaufzeit" placeholder="Laufzeit" onChange={handleChange} />

                <select name="laufzeit_typ" onChange={handleChange}>
                    <option value="monate">Monate</option>
                    <option value="jahre">Jahre</option>
                </select>

                <input type="date" name="vertragsbeginn" onChange={handleChange} />

                <h3>Vorschau (Live)</h3>

                <input
                    value={form.monatlicherPreis}
                    readOnly
                    placeholder="Monatlicher Preis"
                />

                <input
                    value={form.jaehrlicherPreis}
                    readOnly
                    placeholder="Jährlicher Preis"
                />

                <input
                    value={form.vertragsende}
                    readOnly
                    placeholder="Vertragsende"
                />

                <br /><br />

                <button type="submit">
                    Vertrag erstellen
                </button>

            </form>

        </div>
    );
};

export default VertragErstellen;