import React, { useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';
import {
    Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image,
} from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import loeb from "./loeb.png";

// Funktion zum Erzeugen eines Barcode-DataURLs
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
                background: null, // <<< Hintergrund transparent setzen
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
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        flexDirection: 'column',
        minHeight: '100%',
        position: 'relative',
    },
    logo: {
        position: 'absolute',
        top: 30,
        right: 40,
        width: 100,
        height: 80,
        objectFit: 'contain',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 30,
    },
    section: {
        marginBottom: 14,
    },
    barcodeImage: {
        width: 70,
        height: 25,
        marginTop: 6,
    },
    artikelHeaderBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#d9d9d9',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 25,
    },
    headerArtikel: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 12,
    },
    headerBeschreibung: {
        flex: 2,
        fontWeight: 'bold',
        fontSize: 12,
        paddingLeft: 10,
    },
    headerMenge: {
        width: 60,
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'right',
    },
    artikelBox: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    artikelInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    artikelLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    artikelnummerText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    mengeText: {
        width: 60,
        fontSize: 12,
        textAlign: 'right',
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
});




// PDF-Komponente bekommt Lieferantennummer als Prop
const UmbuchungPDF = ({
    belegnummer, barcode, artikelnummer, beschreibung, menge, barcodeArtikel,
    vonStandort, nachStandort, lieferantennummer, mdenumber
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image src={loeb} style={styles.logo} />
            <Text style={styles.title}>Umbuchung Filiale an Filiale</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={[{ fontWeight: 'bold', width: 180 }]}>Information</Text>
                <Text style={{ width: 60 }}>Belegnr.</Text>
                <Text style={{ width: 100 }}>{belegnummer}</Text>
                <Image style={styles.barcodeImage} src={barcode} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ fontWeight: 'bold', width: 180 }]}>Buchungsdatum</Text>
                <Text>{new Date(Date.now() - 86400000).toLocaleDateString('de-CH')}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 }}>
                <Text style={[{ fontWeight: 'bold', width: 180 }]}>Betrieb / Beschreibung</Text>
                <View>
                    <Text>von {vonStandort}</Text>
                    <Text>nach {nachStandort}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ fontWeight: 'bold', width: 180 }]}>Lieferantennummer</Text>
                <Text></Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ fontWeight: 'bold', width: 180 }]}></Text>
                <Text>Versand per Post</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ fontWeight: 'bold', width: 180 }]}></Text>
                <Text>{lieferantennummer}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[{ fontWeight: 'bold', width: 180 }]}></Text>
                <Text>Kundenbestellung</Text>
            </View>

            <View style={styles.artikelHeaderBox}>
    <Text style={styles.headerArtikel}>Artikel</Text>
    <Text style={styles.headerBeschreibung}>Beschreibung</Text>
    <Text style={styles.headerMenge}>Menge</Text>
</View>

<View style={styles.artikelBox}>
    <View style={styles.artikelInfoRow}>
        <View style={styles.artikelLeft}>
            <View>
                <Text style={styles.artikelnummerText}>{artikelnummer}</Text>
                <Image style={styles.barcodeImage} src={barcodeArtikel} />
            </View>
            <Text>{beschreibung}</Text>
        </View>
        <Text style={styles.mengeText}>{menge} ST</Text>
    </View>
</View>

{/* Totalzeile separat und mit eigenem Hintergrund */}
<View style={[styles.artikelBox, { backgroundColor: '#e4e4e4', marginTop: -5 }]}>
    <View style={styles.artikelInfoRow}>
        <View style={styles.artikelLeft}>
            <Text style={[styles.artikelnummerText, { fontWeight: 'bold' }]}>Total</Text>
        </View>
        <Text style={[styles.mengeText, { fontWeight: 'bold' }]}>{menge} ST</Text>
    </View>
</View>





            <View style={styles.footer}>
                <Text>Ausgestellt von: {mdenumber}</Text>
                <Text>Unterschrift: ___________________  Datum: ____________</Text>
            </View>
        </Page>
    </Document>
);

export default function UmbuchungPDFWrapper() {
    const [barcodeURL, setBarcodeURL] = useState(null);
    const [artikelBarcodeURL, setArtikelBarcodeURL] = useState(null);
    const [belegnummer] = useState(Math.floor(1000000000 + Math.random() * 9000000000).toString());
    const [lieferantennummer] = useState(Math.floor(10000 + Math.random() * 90000).toString());
    const [mdenumber] = useState(() => {
        const randomDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // z. B. '07'
        return `MDE0${randomDigits}`;
    });

    const today = new Date();
    const formattedDate = today.toLocaleDateString('de-CH'); // Format: TT.MM.JJJJ

    const [artikelnummer, setArtikelnummer] = useState('3082278');
    const [beschreibung, setBeschreibung] = useState('Kenwood kMix Wasserkocher ZJX650WH');
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
                    style={{ width: '100%', marginBottom: 10, padding: 6, fontSize: 14 }}
                >
                    {standorte.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </label>



            <PDFDownloadLink
                document={
                    <UmbuchungPDF
                        belegnummer={belegnummer}
                        barcode={barcodeURL}
                        artikelnummer={artikelnummer}
                        beschreibung={beschreibung}
                        menge={menge}
                        barcodeArtikel={artikelBarcodeURL}
                        vonStandort={vonStandort}
                        nachStandort={nachStandort}
                        lieferantennummer={lieferantennummer}
                        mdenumber={mdenumber}
                    />
                }
                fileName={`umbuchung_${belegnummer}.pdf`}
                style={{
                    margin: '10px 0',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: 4,
                    display: 'inline-block',
                }}
            >
                {({ loading }) => (loading ? 'Lade PDF...' : 'PDF herunterladen')}
            </PDFDownloadLink>



            <PDFViewer width="100%" height={400}>
                <UmbuchungPDF
                    belegnummer={belegnummer}
                    barcode={barcodeURL}
                    artikelnummer={artikelnummer}
                    beschreibung={beschreibung}
                    menge={menge}
                    barcodeArtikel={artikelBarcodeURL}
                    vonStandort={vonStandort}
                    nachStandort={nachStandort}
                    lieferantennummer={lieferantennummer}
                    mdenumber={mdenumber}
                />
            </PDFViewer>
        </div>
    );
}