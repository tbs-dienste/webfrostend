import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import axios from "axios";
import { useParams } from "react-router-dom";
import './DownloadZusammenfassung.scss';

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
    summary: { marginTop: 20, fontSize: 14, fontWeight: "bold" },
    bold: { fontWeight: "bold" },
});

const PDFDocument = ({ data }) => {
    if (!data || !data.kunde) return null;
    const { kunde } = data;
    return (
        <Document>
            <Page size="A4" style={styles.page} className="invoice-page">
                <View style={styles.section} className="customer-details">
                    <Text className="customer-title">Kunde</Text>
                    <Text className="customer-name">Vorname: {kunde.vorname}</Text>
                    <Text className="customer-name">Name: {kunde.nachname}</Text>
                    <Text className="customer-id">Kundennummer: {kunde.kundennummer}</Text>
                </View>

                {kunde.dienstleistungen.map((dienstleistung) => (
                    <View style={styles.section} key={dienstleistung.dienstleistung_id} className="service-section">
                        <Text className="service-title">{dienstleistung.dienstleistung}</Text>
                        <Text className="service-price">Preis pro Einheit: {dienstleistung.dienstleistungsPreis} CHF</Text>
                        <Text className="service-time">Gesamtarbeitszeit: {dienstleistung.gesamtArbeitszeit?.toFixed(2)} Stunden</Text>
                        <View style={styles.table} className="employee-table">
                            <View style={styles.tableRow} className="table-header">
                                <Text style={styles.tableCell} className="table-cell">Mitarbeiter</Text>
                                <Text style={styles.tableCell} className="table-cell">Arbeitszeit (Stunden)</Text>
                                <Text style={styles.tableCell} className="table-cell">Betrag (CHF)</Text>
                            </View>
                            {dienstleistung.mitarbeiter.map((mitarbeiter) => (
                                <View style={styles.tableRow} key={mitarbeiter.mitarbeiter_id} className="employee-row">
                                    <Text style={styles.tableCell} className="employee-name">{mitarbeiter.vorname} {mitarbeiter.nachname}</Text>
                                    <Text style={styles.tableCell} className="employee-time">{mitarbeiter.arbeitszeit}</Text>
                                    <Text style={styles.tableCell} className="employee-amount">{mitarbeiter.betrag}</Text>
                                </View>
                            ))}
                            <View style={styles.tableRow} className="total-row">
                                <Text style={styles.tableCell} className="total-label">Gesamt</Text>
                                <Text style={styles.tableCell} className="total-time">{dienstleistung.gesamtArbeitszeit?.toFixed(2)} Stunden</Text>
                                <Text style={styles.tableCell} className="total-amount">
                                    {
                                        dienstleistung.mitarbeiter
                                            .reduce((sum, mitarbeiter) => sum + (Number(mitarbeiter.betrag) || 0), 0)
                                            .toFixed(2)
                                    } CHF
                                </Text>
                            </View>

                        </View>
                    </View>
                ))}
                <View style={styles.summary} className="summary-section">
                    <Text className="summary-text">Gesamtpreis: {kunde.zusammenfassung?.gesamtPreis} CHF</Text>
                    <Text className="summary-text">Gesamtarbeitszeit: {kunde.zusammenfassung?.gesamtArbeitszeit} Stunden</Text>
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
                {data.kunde.dienstleistungen.map((dienstleistung) => (
                    <div key={dienstleistung.dienstleistung_id} className="service-item">
                        <h4 className="service-name">{dienstleistung.dienstleistung}</h4>
                        <p className="service-price">Preis pro Einheit: {dienstleistung.dienstleistungsPreis} CHF</p>
                        <p className="service-time">Gesamtarbeitszeit: {dienstleistung.gesamtArbeitszeit?.toFixed(2)} Stunden</p>
                        <table className="service-table">
                            <thead>
                                <tr>
                                    <th className="table-header-cell">Mitarbeiter</th>
                                    <th className="table-header-cell">Arbeitszeit (Stunden)</th>
                                    <th className="table-header-cell">Betrag (CHF)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dienstleistung.mitarbeiter.map((mitarbeiter) => (
                                    <tr key={mitarbeiter.mitarbeiter_id} className="employee-row">
                                        <td className="table-cell">{mitarbeiter.vorname} {mitarbeiter.nachname}</td>
                                        <td className="table-cell">{mitarbeiter.arbeitszeit}</td>
                                        <td className="table-cell">{mitarbeiter.betrag}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <div className="summary-container">
                <h3 className="summary-header">Zusammenfassung:</h3>
                <p className="summary-text">Gesamtpreis: {data.kunde.zusammenfassung?.gesamtPreis} CHF</p>
                <p className="summary-text">Gesamtarbeitszeit: {data.kunde.zusammenfassung?.gesamtArbeitszeit} Stunden</p>
            </div>
            <PDFDownloadLink document={<PDFDocument data={data} />} fileName="uebersicht.pdf">
                {({ loading }) => (loading ? "Lädt..." : "Übersicht als PDF herunterladen")}
            </PDFDownloadLink>
        </div>
    );
};

export default DownloadZusammenfassung;
