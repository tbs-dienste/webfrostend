import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import './HausverbotDetail.scss';
import corbel from '../../assets/fonts/CORBEL.TTF';

Font.register({
  family: 'Corbel',
  src: corbel,  // corbel ist hier der String-Pfad zur Schriftdatei
});


const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Corbel', // Nutze Corbel hier
    fontSize: 12,
    padding: 40,
    lineHeight: 1.6,
  },
  bold: {
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  signatureBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  line: {
    width: '45%',
    textAlign: 'center',
    borderTop: '1px solid black',
    paddingTop: 5,
  },
});

const HausverbotPDF = ({ data }) => {
  const { vorname, nachname, anschrift, plz, ort, geburtsdatum, grund, datum, geschaeft } = data;
  const datumFormatted = datum ? new Date(datum).toLocaleDateString('de-DE') : '';

  return (
    <Document>
      <Page style={pdfStyles.page}>
        <View style={pdfStyles.section}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Hausverbot – Offizielle Mitteilung
          </Text>
          <Text>
            Die nachstehend aufgeführte Person wird hiermit durch die verantwortlichen Vertreter des Unternehmens
            <Text style={pdfStyles.bold}> "{geschaeft || '–'}"</Text> mit sofortiger Wirkung von den Geschäftsräumlichkeiten ausgeschlossen:
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text><Text style={pdfStyles.bold}>Name:</Text> {vorname || '–'} {nachname || '–'}</Text>
          <Text><Text style={pdfStyles.bold}>Geburtsdatum:</Text> {geburtsdatum || '–'}</Text>
          <Text><Text style={pdfStyles.bold}>Adresse:</Text> {anschrift || '–'}, {plz || '–'} {ort || '–'}</Text>
          <Text><Text style={pdfStyles.bold}>Grund des Hausverbots:</Text> {grund || '–'}</Text>
          <Text><Text style={pdfStyles.bold}>Ausgestellt am:</Text> {datumFormatted || '–'}</Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.bold}>Rechtsgrundlage und Geltungsbereich:</Text>
          <Text>
            Das Unternehmen <Text style={pdfStyles.bold}>"{geschaeft || '–'}"</Text> macht von seinem Hausrecht Gebrauch und spricht gegen die oben genannte Person ein
            <Text style={pdfStyles.bold}> unbefristetes Hausverbot </Text> aus.
          </Text>
          <Text>
            Dieses Hausverbot tritt per <Text style={pdfStyles.bold}>{datumFormatted || '–'}</Text> in Kraft und gilt bis auf Widerruf durch die Geschäftsleitung.
          </Text>
          <Text>
            <Text style={pdfStyles.bold}>Wichtiger Hinweis:</Text> Ein Verstoß gegen dieses Verbot kann gemäss <Text style={pdfStyles.bold}>Art. 186 StGB (Hausfriedensbruch)</Text> strafrechtlich verfolgt werden.
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.bold}>Vermerk:</Text>
          <Text>Der betroffenen Person wurde dieses Schreiben persönlich ausgehändigt.</Text>
          <Text style={{ marginTop: 10 }}><Text style={pdfStyles.bold}>Ort, Datum:</Text> {ort || '–'}, {datumFormatted || '–'}</Text>
        </View>

        <View style={pdfStyles.signatureBox}>
          <Text style={pdfStyles.line}>Unterschrift verantwortliche Person</Text>
          <Text style={pdfStyles.line}>Unterschrift betroffene Person</Text>
        </View>
      </Page>
    </Document>
  );
};

const HausverbotDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fallbackData = {
    vorname: 'Max',
    nachname: 'Mustermann',
    anschrift: 'Musterstraße 1',
    plz: '12345',
    ort: 'Musterstadt',
    geburtsdatum: '1990-01-01',
    grund: 'Unbekannt',
    datum: new Date().toISOString(),
    geschaeft: 'Muster GmbH',
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Kein Zugriffstoken gefunden.');
      setData(fallbackData);
      return;
    }

    axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/hausverbot/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setData(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Fehler beim Laden:', err);
        setError('Daten konnten nicht geladen werden. Zeige Fallback-Daten.');
        setData(fallbackData);
      });
  }, [id]);

  if (!data) return <div className="loading">Lade Hausverbot...</div>;

  const { vorname, nachname, anschrift, plz, ort, geburtsdatum, grund, datum, geschaeft } = data;
  const datumFormatted = datum ? new Date(datum).toLocaleDateString('de-DE') : '';

  return (
    <div className="hausverbot-detail-container">
      <h1>🛑 Hausverbot – Detailansicht</h1>

      {error && <div className="error">{error}</div>}

      <div className="detail-section">
        <h2>👤 Personendaten</h2>
        <p><strong>Name:</strong> {vorname} {nachname}</p>
        <p><strong>Geburtsdatum:</strong> {geburtsdatum}</p>
      </div>

      <div className="detail-section">
        <h2>🏠 Anschrift</h2>
        <p><strong>Straße:</strong> {anschrift}</p>
        <p><strong>PLZ / Ort:</strong> {plz} {ort}</p>
      </div>

      <div className="detail-section">
        <h2>🚫 Hausverbot</h2>
        <p><strong>Grund:</strong> {grund}</p>
        <p><strong>Ausgestellt am:</strong> {datumFormatted}</p>
        <p><strong>Geschäft:</strong> {geschaeft}</p>
      </div>

      <div className="pdf-download">
        <PDFDownloadLink
          document={<HausverbotPDF data={data} />}
          fileName={`Hausverbot_${nachname || 'unknown'}.pdf`}
        >
          {({ loading }) => (loading ? 'Erstelle PDF...' : '📄 Offizielle Mitteilung als PDF herunterladen')}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default HausverbotDetail;
