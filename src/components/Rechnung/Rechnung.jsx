import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import './Rechnung.scss'; // Für professionelles SCSS-Design

// PDF Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 12,
        color: '#333',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#4a4a4a', // angepasste Farbe für Header
    },
    section: {
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: 20,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol: {
        borderStyle: 'solid',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        textAlign: 'center',
        width: '20%', // Breite für die Tabelle anpassen
    },
    total: {
        fontWeight: 'bold',
        marginTop: 10,
        fontSize: 14, // größere Schriftgröße für Gesamtkosten
    },
    rechnungPreview: {
        marginBottom: 20,
        border: '1px solid #ccc',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
});

// Rechnungskomponente
const Rechnung = () => {
    const { id } = useParams(); // Kunden-ID aus den URL-Parametern holen
    const [kunde, setKunde] = useState(null);
    const ladeMeldungen = [
        "Lade Kundendaten...",
        "Bitte warten, Kundendaten werden geladen...",
        "Daten des Kunden werden abgerufen...",
        "Einen Moment bitte, wir bereiten die Kundendaten vor...",
        "Die Kundendaten sind gleich verfügbar..."
    ];

    const [ladeText] = useState(ladeMeldungen[Math.floor(Math.random() * ladeMeldungen.length)]);

    useEffect(() => {
        const fetchKundendaten = async () => {
            const token = localStorage.getItem('token'); // Token aus localStorage abrufen
            if (!token) {
                console.error('Kein Token gefunden. Bitte einloggen.');
                return;
            }

            try {
                const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/kunden/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Token im Authorization-Header setzen
                    }
                });

                // Setzen der Daten aus der API-Antwort
                setKunde(response.data.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Kundendaten:', error);
            }
        };

        fetchKundendaten();
    }, [id]);

    if (!kunde) {
        return <p>{ladeText}</p>; // Dynamisch gewählte Lade-Meldung anzeigen
    }

    // PDF-Dokument definieren
    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Rechnung</Text>
                <View style={styles.section}>
                    <Text>{kunde.firma}</Text>
                    <Text>{kunde.strasseHausnummer}</Text>
                    <Text>{kunde.postleitzahl} {kunde.ort}</Text>
                    <Text>{kunde.land}</Text>
                    <Text>Email: {kunde.email}</Text>
                    <Text>Telefon: {kunde.mobil}</Text>
                </View>
                <View style={styles.section}>
                    <Text>Kundennummer: {kunde.kundennummer}</Text>
                    <Text>Auftragsnummer: {kunde.auftragsnummer}</Text>
                    <Text>Datum: {new Date().toLocaleDateString()}</Text>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>POS</Text>
                        <Text style={styles.tableCol}>Titel</Text>
                        <Text style={styles.tableCol}>Preis (CHF)</Text>
                        <Text style={styles.tableCol}>Gesamtarbeitszeit (Std)</Text>
                        <Text style={styles.tableCol}>Kosten (CHF)</Text>
                    </View>
                    {kunde.dienstleistungen.map((dienstleistung, index) => (
                        <View style={styles.tableRow} key={dienstleistung.id}>
                            <Text style={styles.tableCol}>{index + 1}</Text> {/* Position hinzufügen */}
                            <Text style={styles.tableCol}>{dienstleistung.title}</Text>
                            <Text style={styles.tableCol}>{dienstleistung.preis}</Text>
                            <Text style={styles.tableCol}>{dienstleistung.gesamtArbeitszeit}</Text>
                            <Text style={styles.tableCol}>{dienstleistung.kosten}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.total}>Gesamtkosten (exkl. MWST): CHF {kunde.totalKosten.toFixed(2)}</Text>
                <Text style={styles.total}>Gesamtkosten (inkl. 8.1% MWST): CHF {kunde.totalKostenMitMwst.toFixed(2)}</Text>
            </Page>
        </Document>
    );

    return (
        <div className="rechnung-container">
            <h2>Rechnung für {kunde.vorname} {kunde.nachname}</h2>
            <div className="rechnung-preview">
                <h3>Rechnung Vorschau</h3>
                <div className="rechnung-details">
                    <p><strong>Kundennummer:</strong> {kunde.kundennummer}</p>
                    <p><strong>Auftragsnummer:</strong> {kunde.auftragsnummer}</p>
                    <p><strong>Firma:</strong> {kunde.firma}</p>
                    <p><strong>Adresse:</strong> {kunde.strasseHausnummer}, {kunde.postleitzahl} {kunde.ort}</p>
                    <p><strong>Email:</strong> {kunde.email}</p>
                    <p><strong>Telefon:</strong> {kunde.mobil}</p>
                </div>
                <div className="dienstleistungen-liste">
                    <h4>Dienstleistungen</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>POS</th>
                                <th>Titel</th>
                                <th>Preis (CHF)</th>
                                <th>Gesamtarbeitszeit (Std)</th>
                                <th>Kosten (CHF)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kunde.dienstleistungen.map((dienstleistung, index) => (
                                <tr key={dienstleistung.id}>
                                    <td>{index + 1}</td> {/* Position hinzufügen */}
                                    <td>{dienstleistung.title}</td>
                                    <td>{dienstleistung.preis}</td>
                                    <td>{dienstleistung.gesamtArbeitszeit}</td>
                                    <td>{dienstleistung.kosten}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="gesamt-kosten">
                    <p><strong>Gesamtkosten (exkl. MWST):</strong> CHF {kunde.totalKosten.toFixed(2)}</p>
                    <p><strong>Gesamtkosten (inkl. 8.1% MWST):</strong> CHF {kunde.totalKostenMitMwst.toFixed(2)}</p>
                </div>
            </div>
            <PDFDownloadLink document={<MyDocument />} fileName="rechnung.pdf">
                {({ loading }) => (loading ? 'Lade PDF...' : 'Rechnung als PDF herunterladen')}
            </PDFDownloadLink>
        </div>
    );
};

export default Rechnung;
