import React, { useState, useRef } from 'react';
import axios from 'axios';
import SignaturePad from 'react-signature-canvas';
import './StrafantragForm.scss';

import jsPDF from 'jspdf';


export const generatePDF = (data) => {
  const doc = new jsPDF();
  const line = (y) => doc.line(15, y, 195, y);
  const bold = () => doc.setFont('helvetica', 'bold');
  const normal = () => doc.setFont('helvetica', 'normal');

  doc.setFontSize(14);
  bold();
  doc.text('Erklärung Ladendiebstahl', 105, 20, null, null, 'center');
  line(22);

  normal();
  doc.setFontSize(11);
  let y = 30;
  const gap = 6;

  // Personen- & Adressdaten
  doc.text(`Vorname: ${data.vorname || ''}`, 15, y);
  doc.text(`Heimatort: ${data.heimatort || ''}`, 110, y);
  y += gap;
  doc.text(`Geburtsdatum: ${data.geburtsdatum || ''}`, 15, y);
  doc.text(`Geburtsort: ${data.geburtsort || ''}`, 110, y);
  y += gap;
  doc.text(`Strasse Nr: ${data.strasse || ''} ${data.hausnummer || ''}`, 15, y);
  doc.text(`Nationalität: ${data.nationalitaet || ''}`, 110, y);
  y += gap;
  doc.text(`Land: ${data.land || ''}`, 15, y);
  doc.text(`PLZ/Wohnort: ${data.plz || ''} ${data.ort || ''}`, 110, y);
  y += gap;
  doc.text(`Telefon: ${data.telefon || ''}`, 15, y);
  doc.text(`Mobiltelefon: ${data.mobiltelefon || ''}`, 110, y);
  y += gap;
  doc.text(`Identität überprüft anhand: ${data.identitaet || ''}`, 15, y);
  y += gap * 2;

  // Geschäft & Zeit
  doc.text(`Ich bestätige hiermit, im Geschäft/Filiale: ${data.geschaeft || ''}`, 15, y);
  y += gap;
  const dateObj = new Date(data.am);
  const datum = !isNaN(dateObj) ? dateObj.toLocaleDateString('de-CH') : '-';
  const uhrzeit = !isNaN(dateObj) ? dateObj.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }) : '-';
  doc.text(`Am ${datum} um ${uhrzeit} Uhr`, 15, y);
  y += gap * 2;

  // Artikelüberschrift
  doc.text('folgende Artikel ohne Bezahlung mitgenommen zu haben:', 15, y);
  y += gap;
  bold();
  doc.text('Genaue Bezeichnung der Ware', 15, y);
  doc.text('Anzahl', 110, y);
  doc.text('Preis', 140, y);
  doc.text('Total', 170, y);
  y += gap;
  normal();

  // Tabelle für Artikelliste
  const rowsToShow = 11;
  const xPositions = [15, 110, 140, 170];
  const colWidths = [95, 30, 30, 30]; // ca. Spaltenbreiten
  const yStart = y - gap; // obere Linie der Tabellenüberschrift
  const rowHeight = gap;

  // obere und untere Linien Header
  doc.line(xPositions[0], yStart, xPositions[3] + colWidths[3], yStart);
  doc.line(xPositions[0], yStart + rowHeight, xPositions[3] + colWidths[3], yStart + rowHeight);

  // vertikale Linien Header
  for (let i = 0; i <= xPositions.length; i++) {
    const x = i < xPositions.length ? xPositions[i] : xPositions[xPositions.length -1] + colWidths[colWidths.length -1];
    doc.line(x, yStart, x, yStart + rowHeight);
  }

  // Zeilen + Linien für Artikelliste
  for (let i = 0; i < rowsToShow; i++) {
    const item = data.artikelListe[i] || {};

    const currentY = yStart + rowHeight * (i + 1);

    // Texte mit etwas Abstand zur Spaltenkante
    doc.text(item.bezeichnung || '', xPositions[0] + 2, currentY + rowHeight - 3);
    doc.text(String(item.anzahl || ''), xPositions[1] + 10, currentY + rowHeight - 3);
    doc.text(item.preis !== undefined ? item.preis.toFixed(2) : '', xPositions[2] + 10, currentY + rowHeight - 3);
    doc.text(item.total !== undefined ? item.total.toFixed(2) : '', xPositions[3] + 10, currentY + rowHeight - 3);

    // horizontale Linie unter der Zeile
    doc.line(xPositions[0], currentY + rowHeight, xPositions[3] + colWidths[3], currentY + rowHeight);

    // vertikale Linien Spalten
    for (let j = 0; j <= xPositions.length; j++) {
      const x = j < xPositions.length ? xPositions[j] : xPositions[xPositions.length -1] + colWidths[colWidths.length -1];
      doc.line(x, currentY, x, currentY + rowHeight);
    }
  }

  y = yStart + rowHeight * (rowsToShow + 1) + gap;

  bold();
  doc.text('Bemerkungen (Sachverhalt):', 15, y);
  y += gap;
  normal();
  const sachverhaltText = doc.splitTextToSize(data.sachverhalt || '', 180);
  doc.text(sachverhaltText, 15, y);
  y += sachverhaltText.length * gap + 6;

  // Unterschrift Kunde
  doc.text('Unterschrift des Kunden:', 15, y);
  if (data.unterschrift_kunde) {
    doc.addImage(data.unterschrift_kunde, 'PNG', 65, y - 6, 60, 20);
  }
  y += 30;

  // Checkboxen Firma
  bold();
  doc.text('Erklärungen der Firma: (Zutreffendes ankreuzen)', 15, y);
  y += gap;
  normal();

  const boxes = [
    ['Waren bezahlt', data.waren_bezahlt],
    ['Waren zurückgenommen', data.waren_zurueckgenommen],
    ['Hausverbot erteilt', data.hausverbot_erteilt],
    ['Hausverbot missachtet', data.hausverbot_missachtet],
    ['Polizei beigezogen', data.polizei_beigezogen],
    ['Eltern informiert', data.eltern_informiert],
    ['Umtriebsentschädigung bezahlt', data.umtriebsentschaedigung_bezahlt],
  ];

  boxes.forEach(([label, checked]) => {
    doc.rect(15, y - 4, 4, 4);
    if (checked) {
      doc.setLineWidth(0.5);
      doc.line(15, y - 4, 19, y);
      doc.line(15, y, 19, y - 4);
    }
    doc.text(label, 22, y);
    y += gap;
  });

  y += gap;
  doc.text('Stempel/Unterschrift Geschäft/Filiale:', 15, y);
  if (data.unterschrift_filiale) {
    doc.addImage(data.unterschrift_filiale, 'PNG', 80, y - 6, 60, 20);
  }
  y += 30;

  doc.save(`Strafantrag_${data.vorname || ''}_${data.familienname || ''}.pdf`);
};



export default function StrafantragForm() {
  const [formData, setFormData] = useState({
    familienname: '',
    vorname: '',
    geburtsdatum: '',
    geburtsort: '',
    heimatort: '',
    nationalitaet: '',
    geschlecht: '',
    strasse: '',
    hausnummer: '',
    plz: '',
    ort: '',
    land: '',
    telefon: '',
    mobiltelefon: '',
    identitaet: '',
    geschaeft: '',
    am: '',
    sachverhalt: '',
    waren_bezahlt: false,
    waren_zurueckgenommen: false,
    hausverbot_erteilt: false,
    hausverbot_missachtet: false,
    polizei_beigezogen: false,
    eltern_informiert: false,
    umtriebsentschaedigung_bezahlt: false,
    artikelListe: [{ bezeichnung: '', anzahl: 1, preis: 0, total: 0 }],
    unterschrift_kunde: '',
    unterschrift_filiale: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const sigPadKunde = useRef(null);
  const sigPadFiliale = useRef(null);

  // Artikel hinzufügen
  const addArtikel = () => {
    setFormData(prev => ({
      ...prev,
      artikelListe: [...prev.artikelListe, { bezeichnung: '', anzahl: 1, preis: 0, total: 0 }],
    }));
  };

  // Artikel entfernen (mindestens 1 muss bleiben)
  const removeArtikel = (index) => {
    setFormData(prev => ({
      ...prev,
      artikelListe: prev.artikelListe.length > 1
        ? prev.artikelListe.filter((_, i) => i !== index)
        : prev.artikelListe,
    }));
  };

  // Artikel aktualisieren + Total neu berechnen
  const updateArtikel = (index, field, value) => {
    setFormData(prev => {
      const newArtikelListe = [...prev.artikelListe];
      if (field === 'bezeichnung') {
        newArtikelListe[index][field] = value;
      } else {
        const numberValue = Number(value);
        newArtikelListe[index][field] = isNaN(numberValue) ? 0 : numberValue;
      }
      newArtikelListe[index].total = newArtikelListe[index].anzahl * newArtikelListe[index].preis;
      return { ...prev, artikelListe: newArtikelListe };
    });
  };

  // Unterschrift speichern als DataURL
  const saveUnterschrift = (type) => {
    if (type === 'kunde' && sigPadKunde.current) {
      if (!sigPadKunde.current.isEmpty()) {
        const dataURL = sigPadKunde.current.getTrimmedCanvas().toDataURL('image/png');
        setFormData(prev => ({ ...prev, unterschrift_kunde: dataURL }));
      }
    }
    if (type === 'filiale' && sigPadFiliale.current) {
      if (!sigPadFiliale.current.isEmpty()) {
        const dataURL = sigPadFiliale.current.getTrimmedCanvas().toDataURL('image/png');
        setFormData(prev => ({ ...prev, unterschrift_filiale: dataURL }));
      }
    }
  };

  // Unterschrift löschen
  const clearUnterschrift = (type) => {
    if (type === 'kunde' && sigPadKunde.current) {
      sigPadKunde.current.clear();
      setFormData(prev => ({ ...prev, unterschrift_kunde: '' }));
    }
    if (type === 'filiale' && sigPadFiliale.current) {
      sigPadFiliale.current.clear();
      setFormData(prev => ({ ...prev, unterschrift_filiale: '' }));
    }
  };

// Formular absenden
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: 'Kein Auth-Token gefunden. Bitte einloggen.' });
      setLoading(false);
      return;
    }

    const response = await axios.post(
      'https://tbsdigitalsolutionsbackend.onrender.com/api/strafantraege',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setMessage({ type: 'success', text: response.data.message || 'Erfolgreich gespeichert.' });

    // ✅ PDF automatisch erzeugen und herunterladen
    generatePDF(formData);

    // Optional: Formular zurücksetzen
    // setFormData(initialState);
  } catch (error) {
    console.error(error);
    setMessage({
      type: 'error',
      text:
        error.response?.data?.error ||
        error.message ||
        'Fehler beim Speichern des Strafantrags.',
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="strafantrag-form">
      <h2>Strafantrag erstellen</h2>

      {/* Personendaten */}
      <fieldset>
        <legend>Personendaten</legend>
        <input
          required
          placeholder="Familienname"
          value={formData.familienname}
          onChange={e => setFormData({ ...formData, familienname: e.target.value })}
        />
        <input
          required
          placeholder="Vorname"
          value={formData.vorname}
          onChange={e => setFormData({ ...formData, vorname: e.target.value })}
        />
        <input
          required
          type="date"
          placeholder="Geburtsdatum"
          value={formData.geburtsdatum}
          onChange={e => setFormData({ ...formData, geburtsdatum: e.target.value })}
        />
        <input
          placeholder="Geburtsort"
          value={formData.geburtsort}
          onChange={e => setFormData({ ...formData, geburtsort: e.target.value })}
        />
        <input
          placeholder="Heimatort"
          value={formData.heimatort}
          onChange={e => setFormData({ ...formData, heimatort: e.target.value })}
        />
        <input
          placeholder="Nationalität"
          value={formData.nationalitaet}
          onChange={e => setFormData({ ...formData, nationalitaet: e.target.value })}
        />
        <input
          placeholder="Geschlecht"
          value={formData.geschlecht}
          onChange={e => setFormData({ ...formData, geschlecht: e.target.value })}
        />
        <input
          placeholder="Strasse"
          value={formData.strasse}
          onChange={e => setFormData({ ...formData, strasse: e.target.value })}
        />
        <input
          placeholder="Hausnummer"
          value={formData.hausnummer}
          onChange={e => setFormData({ ...formData, hausnummer: e.target.value })}
        />
        <input
          placeholder="PLZ"
          value={formData.plz}
          onChange={e => setFormData({ ...formData, plz: e.target.value })}
        />
        <input
          placeholder="Ort"
          value={formData.ort}
          onChange={e => setFormData({ ...formData, ort: e.target.value })}
        />
        <input
          placeholder="Land"
          value={formData.land}
          onChange={e => setFormData({ ...formData, land: e.target.value })}
        />
        <input
          placeholder="Telefon"
          value={formData.telefon}
          onChange={e => setFormData({ ...formData, telefon: e.target.value })}
        />
        <input
          placeholder="Mobiltelefon"
          value={formData.mobiltelefon}
          onChange={e => setFormData({ ...formData, mobiltelefon: e.target.value })}
        />
        <input
          placeholder="Identität geprüft anhand"
          value={formData.identitaet}
          onChange={e => setFormData({ ...formData, identitaet: e.target.value })}
        />
      </fieldset>

      {/* Tatort & Zeit */}
      <fieldset>
        <legend>Tatort & Zeit</legend>
        <input
          placeholder="Geschäft"
          value={formData.geschaeft}
          onChange={e => setFormData({ ...formData, geschaeft: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="Datum & Uhrzeit"
          value={formData.am}
          onChange={e => setFormData({ ...formData, am: e.target.value })}
        />
      </fieldset>

      {/* Sachverhalt */}
      <fieldset>
        <legend>Sachverhalt</legend>
        <textarea
          placeholder="Sachverhalt"
          value={formData.sachverhalt}
          onChange={e => setFormData({ ...formData, sachverhalt: e.target.value })}
        />
      </fieldset>

      {/* Business Statements */}
      <fieldset>
        <legend>Business Statements</legend>
        {[
          { key: 'waren_bezahlt', label: 'Waren bezahlt' },
          { key: 'waren_zurueckgenommen', label: 'Waren zurückgenommen' },
          { key: 'hausverbot_erteilt', label: 'Hausverbot erteilt' },
          { key: 'hausverbot_missachtet', label: 'Hausverbot missachtet' },
          { key: 'polizei_beigezogen', label: 'Polizei beigezogen' },
          { key: 'eltern_informiert', label: 'Eltern informiert' },
          { key: 'umtriebsentschaedigung_bezahlt', label: 'Umtriebsentschädigung bezahlt' },
        ].map(({ key, label }) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={formData[key]}
              onChange={e => setFormData({ ...formData, [key]: e.target.checked })}
            />
            {label}
          </label>
        ))}
      </fieldset>

      {/* Artikel Liste */}
      <fieldset>
        <legend>Artikel / Waren</legend>
        {formData.artikelListe.map((artikel, i) => (
          <div key={i} className="artikel-row">
            <input
              required
              placeholder="Bezeichnung"
              value={artikel.bezeichnung}
              onChange={e => updateArtikel(i, 'bezeichnung', e.target.value)}
            />
            <input
              required
              type="number"
              min="1"
              placeholder="Anzahl"
              value={artikel.anzahl}
              onChange={e => updateArtikel(i, 'anzahl', e.target.value)}
            />
            <input
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="Preis"
              value={artikel.preis}
              onChange={e => updateArtikel(i, 'preis', e.target.value)}
            />
            <input
              readOnly
              type="number"
              placeholder="Total"
              value={artikel.total.toFixed(2)}
            />
            <button type="button" onClick={() => removeArtikel(i)} disabled={formData.artikelListe.length <= 1}>
              Entfernen
            </button>
          </div>
        ))}
        <button type="button" onClick={addArtikel}>Neuen Artikel hinzufügen</button>
      </fieldset>

      {/* Unterschriften */}
      <fieldset>
        <legend>Unterschrift Kunde</legend>
        <SignaturePad
          ref={sigPadKunde}
          canvasProps={{ className: 'signatureCanvas' }}
          backgroundColor="white"
          penColor="black"
          onEnd={() => saveUnterschrift('kunde')}
          clearOnResize={false}
        />
        <button type="button" onClick={() => clearUnterschrift('kunde')}>Unterschrift löschen</button>
      </fieldset>

      <fieldset>
        <legend>Unterschrift Filiale</legend>
        <SignaturePad
          ref={sigPadFiliale}
          canvasProps={{ className: 'signatureCanvas' }}
          backgroundColor="white"
          penColor="black"
          onEnd={() => saveUnterschrift('filiale')}
          clearOnResize={false}
        />
        <button type="button" onClick={() => clearUnterschrift('filiale')}>Unterschrift löschen</button>
      </fieldset>

      {/* Statusmeldungen */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading}>
        {loading ? 'Speichern...' : 'Strafantrag absenden'}
      </button>
    </form>
  );
}
