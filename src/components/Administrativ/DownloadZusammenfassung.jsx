import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from "@react-pdf/renderer";
import axios from "axios";
import { useParams } from "react-router-dom";
import './DownloadZusammenfassung.scss';
import Logo from './black.png'; // Hier den Pfad zu deinem Logo angeben

const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: 'Helvetica', fontSize: 12 },
    section: { marginBottom: 10 },
    table: { display: "table", width: "100%", marginTop: 10 },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        padding: 5
    },
    tableCell: {
        flex: 1,
        textAlign: "center",
        padding: 5,
        borderRightWidth: 0,  // Entfernt die vertikale Trennung
    },
    header: {
        flexDirection: 'row',  // Logo und Titel in einer Zeile
        alignItems: 'center',  // Vertikale Zentrierung der Elemente
        width: '100%',  // Stellt sicher, dass der Header die gesamte Breite des Dokuments einnimmt
        marginBottom: 20,  // Abstand unter dem Header
    },
    logo: {
        width: 100,  // Breite des Logos
        height: 100, // Höhe des Logos
        marginRight: 10,  // Abstand zwischen Logo und Text
        objectFit: 'contain', // Damit das Logo gut skaliert wird
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    summary: { marginTop: 20, fontSize: 14, fontWeight: "bold" },
    bold: { fontWeight: "bold" },
});

// PDFDocument-Komponente anpassen
const PDFDocument = ({ data }) => {
    if (!data || !data.kunde) return null;
    const { kunde } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page} className="invoice-page">
                <View style={styles.header}>
                    <Image src={Logo} style={styles.logo} />
                    <Text style={styles.title}>Übersicht</Text>
                </View>
                {/* Der Rest des Inhalts bleibt unverändert */}
                <View style={styles.section} className="customer-details">
                    <Text className="customer-title">Kunde</Text>
                    <Text className="customer-name">Vorname: {kunde.vorname}</Text>
                    <Text className="customer-name">Name: {kunde.nachname}</Text>
                    <Text className="customer-id">Kundennummer: {kunde.kundennummer}</Text>
                </View>

                {kunde.dienstleistungen.map((dienstleistung) => {
                    const gesamtArbeitszeit = Number(dienstleistung.gesamtArbeitszeit) || 0;
                    const gesamtBetrag = Number(dienstleistung.gesamtBetrag) || 0;

                    return (
                        <View style={styles.section} key={dienstleistung.dienstleistung_id} className="service-section">
                            <Text className="service-title">{dienstleistung.dienstleistung_name}</Text>
                            <View style={styles.table} className="employee-table">
                                <View style={styles.tableRow} className="table-header">
                                    <Text style={styles.tableCell} className="table-cell">Mitarbeiter</Text>
                                    <Text style={styles.tableCell} className="table-cell">Arbeitszeit (Stunden)</Text>
                                    <Text style={styles.tableCell} className="table-cell">Betrag (CHF)</Text>
                                </View>
                                {dienstleistung.mitarbeiter.map((mitarbeiter) => {
                                    const arbeitszeit = Number(mitarbeiter.arbeitszeit) || 0;
                                    const betrag = Number(mitarbeiter.betrag) || 0;

                                    return (
                                        <View style={styles.tableRow} key={mitarbeiter.mitarbeiter_id} className="employee-row">
                                            <Text style={styles.tableCell} className="employee-name">{mitarbeiter.vorname} {mitarbeiter.nachname}</Text>
                                            <Text style={styles.tableCell} className="employee-time">{arbeitszeit.toFixed(2)}</Text>
                                            <Text style={styles.tableCell} className="employee-amount">{betrag.toFixed(2)}</Text>
                                        </View>
                                    );
                                })}
                                <View style={styles.tableRow} className="total-row">
                                    <Text style={styles.tableCell} className="total-label">Gesamt</Text>
                                    <Text style={styles.tableCell} className="total-time">{gesamtArbeitszeit.toFixed(2)} Stunden</Text>
                                    <Text style={styles.tableCell} className="total-amount">{gesamtBetrag.toFixed(2)} CHF</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </Page>
            {/* Zusammenfassungsseite */}
            <Page size="A4" style={styles.page} className="summary-page">
                <View style={styles.header}>
                    <Image src={Logo} style={styles.logo} />
                    <Text style={styles.title}>Zusammenfassung</Text> {/* Ändere den Titel hier */}
                </View>

                {/* Der Rest des Inhalts bleibt unverändert */}
                <View style={styles.section} className="customer-details">
                    <Text className="customer-title">Kunde</Text>
                    <Text className="customer-name">Vorname: {kunde.vorname}</Text>
                    <Text className="customer-name">Name: {kunde.nachname}</Text>
                    <Text className="customer-id">Kundennummer: {kunde.kundennummer}</Text>
                </View>

                <View style={styles.summary} className="summary-section">
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Dienstleistung</Text>
                            <Text style={styles.tableCell}>Gesamtarbeitszeit (Stunden)</Text>
                            <Text style={styles.tableCell}>Gesamtbetrag (CHF)</Text>
                        </View>
                        {data.kunde.zusammenfassung.map((zusammenfassung) => {
                            const gesamtArbeitszeit = Number(zusammenfassung.gesamtArbeitszeit) || 0;
                            const gesamtBetrag = Number(zusammenfassung.gesamtBetrag) || 0;

                            return (
                                <View key={zusammenfassung.dienstleistung_id} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{zusammenfassung.dienstleistung}</Text>
                                    <Text style={styles.tableCell}>{gesamtArbeitszeit.toFixed(2)}</Text>
                                    <Text style={styles.tableCell}>{gesamtBetrag.toFixed(2)}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </Page>
        </Document>
    );
};



const DownloadZusammenfassung = ({ kundenId }) => {
    const [data, setData] = useState(null);
    const token = localStorage.getItem("token");
    const { kundenId: urlKundenId } = useParams();

    useEffect(() => {
        const id = kundenId || urlKundenId;
        if (!id) {
            console.error("Fehlende Kunden-ID!");
            return;
        }
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://tbsdigitalsolutionsbackend.onrender.com/api/arbeitszeit/total/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setData(response.data);
            } catch (error) {
                console.error("Fehler beim Abrufen der Kundendaten:", error);
            }
        };
        fetchData();
    }, [kundenId, urlKundenId, token]);

    if (!data) return <p>Lädt Kundendaten...</p>;

    return (
        <div className="download-summary">
            <h2 className="invoice-header">Arbeitsübersicht für {data.kunde.vorname} {data.kunde.nachname}</h2>
            <div className="services-list">
                <h3 className="services-title">Dienstleistungen:</h3>
                {data.kunde.dienstleistungen.map((dienstleistung) => {
                    const gesamtArbeitszeit = Number(dienstleistung.gesamtArbeitszeit) || 0;
                    const gesamtBetrag = Number(dienstleistung.gesamtBetrag) || 0;

                    return (
                        <div key={dienstleistung.dienstleistung_id} className="service-item">
                            <h4 className="service-name">{dienstleistung.dienstleistung_name}</h4>
                            <p className="service-price">Preis pro Einheit: {gesamtBetrag.toFixed(2)} CHF</p>
                            <p className="service-time">Gesamtarbeitszeit: {gesamtArbeitszeit.toFixed(2)} Stunden</p>
                            <table className="service-table">
                                <thead>
                                    <tr>
                                        <th className="table-header-cell">Mitarbeiter</th>
                                        <th className="table-header-cell">Arbeitszeit (Stunden)</th>
                                        <th className="table-header-cell">Betrag (CHF)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dienstleistung.mitarbeiter.map((mitarbeiter) => {
                                        const arbeitszeit = Number(mitarbeiter.arbeitszeit) || 0;
                                        const betrag = Number(mitarbeiter.betrag) || 0;

                                        return (
                                            <tr key={mitarbeiter.mitarbeiter_id} className="employee-row">
                                                <td className="table-cell">{mitarbeiter.vorname} {mitarbeiter.nachname}</td>
                                                <td className="table-cell">{arbeitszeit.toFixed(2)}</td>
                                                <td className="table-cell">{betrag.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
            <div className="summary-container">
                <h3 className="summary-header">Zusammenfassung:</h3>
                <p className="summary-text">Gesamtpreis: {data.kunde.zusammenfassung.reduce((total, item) => total + Number(item.gesamtBetrag), 0).toFixed(2)} CHF</p>
                <p className="summary-text">Gesamtarbeitszeit: {data.kunde.zusammenfassung.reduce((total, item) => total + Number(item.gesamtArbeitszeit), 0).toFixed(2)} Stunden</p>
            </div>

            <PDFDownloadLink document={<PDFDocument data={data} />} fileName="Arbeitsübersicht.pdf">
                {({ loading }) => (loading ? "Lädt PDF..." : "PDF herunterladen")}
            </PDFDownloadLink>
        </div>
    );
};

export default DownloadZusammenfassung;
