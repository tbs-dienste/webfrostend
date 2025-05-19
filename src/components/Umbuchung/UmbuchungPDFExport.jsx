import React, { useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';
import {
    Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image,
} from '@react-pdf/renderer';

const generateJsBarcodeDataURL = (text) => {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, text, {
                format: 'code128',
                displayValue: false,
                height: 25,
                width: 1,
                margin: 0,
            });
            const dataUrl = canvas.toDataURL('image/png');
            resolve(dataUrl);
        } catch (error) {
            reject(error);
        }
    });
};

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: 'Helvetica',
        flexDirection: 'column',
        minHeight: '100%',
        position: 'relative',
    },
    logo: {
        position: 'absolute',
        top: 30,
        right: 30,
        width: 100,
        height: 40,
        objectFit: 'contain',
    },
    infoTable: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'column',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    infoLabel: {
        fontWeight: 'bold',
    },
    lieferantenNummer: {
        marginTop: 8,
        fontWeight: 'bold',
    },
    barcodeImage: {
        width: 140,
        height: 25,
        marginTop: 6,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
    },
    artikelBox: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    infoRowFlex: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    infoItem: {
        flex: 1,
        fontSize: 11,
        marginRight: 10,
    },
    infoItemLast: {
        flex: 1,
        fontSize: 11,
    },
});

const UmbuchungPDF = ({
    belegnummer, barcode, artikelnummer, beschreibung, menge, barcodeArtikel,
    vonStandort, nachStandort,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image src="/logo.png" style={styles.logo} />
            <View style={styles.infoTable}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Information</Text>
                    <View>
                        <Text>Belegnr.: {belegnummer}</Text>
                        <Image style={styles.barcodeImage} src={barcode} />
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Buchungsdatum</Text>
                    <Text>{new Date().toLocaleDateString()}</Text>
                </View>
                <View style={{ marginBottom: 6 }}>
                    <Text style={styles.infoLabel}>Betrieb / Beschreibung</Text>
                    <Text>von {vonStandort}</Text>
                    <Text>nach {nachStandort}</Text>
                    <Text>Versand per Post</Text>
                    <Text>Kundenbestellung</Text>
                </View>
                <Text style={styles.lieferantenNummer}>Lieferantennummer: 30018</Text>
            </View>
            <View style={{ marginTop: 20, marginBottom: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{artikelnummer}</Text>
                <Image style={styles.barcodeImage} src={barcodeArtikel} />
            </View>
            <View style={styles.artikelBox}>
                <Text style={styles.infoItem}>{beschreibung}</Text>
                <Text style={styles.infoItemLast}>{menge} ST</Text>
            </View>
            <View style={styles.infoRowFlex}>
                <Text style={styles.infoItem}>Info 1: Wert 1</Text>
                <Text style={styles.infoItem}>Info 2: Wert 2</Text>
                <Text style={styles.infoItemLast}>Info 3: Wert 3</Text>
            </View>
            <View style={styles.footer}>
                <Text>Ausgestellt von: MDE028</Text>
                <Text>Unterschrift: ___________________  Datum: ____________</Text>
            </View>
        </Page>
    </Document>
);

export default function UmbuchungPDFWrapper() {
    const [barcodeURL, setBarcodeURL] = useState(null);
    const [artikelBarcodeURL, setArtikelBarcodeURL] = useState(null);
    const [belegnummer] = useState(Math.floor(1000000000 + Math.random() * 9000000000).toString());

    const [artikelnummer, setArtikelnummer] = useState('3599843003');
    const [beschreibung, setBeschreibung] = useState('linen shirt jacket,34616 silv ecru ch,L');
    const [menge, setMenge] = useState(Math.floor(Math.random() * 3) + 1);

    const standorte = [
        '2050 / LOEB Thun Bälliz 39, 3600 Thun',
        '2000 / LOEB Bern Spitalgasse 47-51, 3001 Bern',
        '2070 / LOEB Biel Nidaugasse 50, 2502 Biel/Bienne',
    ];

    const [vonStandort, setVonStandort] = useState(standorte[0]);
    const [nachStandort, setNachStandort] = useState(standorte[2]);

    useEffect(() => {
        generateJsBarcodeDataURL(belegnummer).then(setBarcodeURL);
    }, [belegnummer]);

    useEffect(() => {
        if (artikelnummer) {
            generateJsBarcodeDataURL(artikelnummer).then(setArtikelBarcodeURL);
        }
    }, [artikelnummer]);

    if (!barcodeURL || !artikelBarcodeURL) return <div>Lade...</div>;

    return (
        <div style={{ maxWidth: 400, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <h2>Artikel Daten eingeben</h2>

            <label>
                Artikelnummer:
                <input
                    type="text"
                    value={artikelnummer}
                    onChange={(e) => setArtikelnummer(e.target.value)}
                    style={{ width: '100%', marginBottom: 10, padding: 6, fontSize: 14 }}
                />
            </label>

            <label>
                Beschreibung:
                <input
                    type="text"
                    value={beschreibung}
                    onChange={(e) => setBeschreibung(e.target.value)}
                    style={{ width: '100%', marginBottom: 10, padding: 6, fontSize: 14 }}
                />
            </label>

            <label>
                Menge (wird zufällig generiert):
                <input
                    type="number"
                    min="1"
                    max="3"
                    value={menge}
                    onChange={(e) => setMenge(Number(e.target.value))}
                    style={{ width: '100%', marginBottom: 10, padding: 6, fontSize: 14 }}
                />
            </label>

            <label>
                Von Standort:
                <select
                    value={vonStandort}
                    onChange={(e) => setVonStandort(e.target.value)}
                    style={{ width: '100%', marginBottom: 10, padding: 6, fontSize: 14 }}
                >
                    {standorte.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </label>

            <label>
                Nach Standort:
                <select
                    value={nachStandort}
                    onChange={(e) => setNachStandort(e.target.value)}
                    style={{ width: '100%', marginBottom: 20, padding: 6, fontSize: 14 }}
                >
                    {standorte.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </label>

            <PDFDownloadLink
                document={(
                    <UmbuchungPDF
                        belegnummer={belegnummer}
                        barcode={barcodeURL}
                        artikelnummer={artikelnummer}
                        beschreibung={beschreibung}
                        menge={menge}
                        barcodeArtikel={artikelBarcodeURL}
                        vonStandort={vonStandort}
                        nachStandort={nachStandort}
                    />
                )}
                fileName="umbuchung.pdf"
                style={{
                    textDecoration: 'none',
                    padding: '10px 15px',
                    color: 'white',
                    backgroundColor: '#007bff',
                    borderRadius: 5,
                    fontWeight: 'bold',
                    display: 'inline-block',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                {({ loading }) => (loading ? 'Generiere PDF...' : 'PDF herunterladen')}
            </PDFDownloadLink>
        </div>
    );
}
