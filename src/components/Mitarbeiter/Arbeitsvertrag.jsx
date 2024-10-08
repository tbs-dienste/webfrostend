import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import './Arbeitsvertrag.scss'; // Importiere die SCSS-Datei

// PDF-Stile
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  unterschriften: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 50,
    padding: 10,
  },
});

// Dokumentenkomponente
const MyDocument = ({ formData }) => {
  return (
    <Document>
      <Page style={pdfStyles.page}>
        <Text style={pdfStyles.title}>Arbeitsvertrag</Text>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>
            Dieser Arbeitsvertrag wird geschlossen zwischen dem Unternehmen {formData.unternehmensname} mit der Adresse {formData.adresseUnternehmen} (nachfolgend "Arbeitgeber" genannt) und dem Arbeitnehmer {formData.nameArbeitnehmer} mit der Adresse {formData.adresseArbeitnehmer} (nachfolgend "Arbeitnehmer" genannt).
          </Text>
        </View>

        {/* Abschnitt Arbeitsverhältnis */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>1. Arbeitsverhältnis</Text>
          <Text style={pdfStyles.text}>
            Der Arbeitnehmer wird in der Position {formData.positionArbeitnehmer} ab dem {formData.startdatum} für eine wöchentliche Arbeitszeit von {formData.arbeitsstundenProWoche} Stunden beschäftigt. 
            Der Arbeitsvertrag wird unbefristet geschlossen, kann aber beiderseits unter Einhaltung der Kündigungsfristen beendet werden.
          </Text>
        </View>

        {/* Abschnitt Vergütung */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>2. Vergütung</Text>
          <Text style={pdfStyles.text}>
            Der Arbeitnehmer wird für jede erbrachte Dienstleistung entsprechend dem festgelegten Stundenpreis der jeweiligen Dienstleistung vergütet. Für die ersten 10 Kunden werden 90% des Stundenpreises ausgezahlt, während 10% in die Firmenkasse fließen. Nach den ersten 10 Kunden erhält der Arbeitnehmer den vollen Stundenpreis (100%) für jede weitere erbrachte Dienstleistung.
          </Text>
        </View>

        {/* Abschnitt Arbeitszeitstempelung */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>3. Stempelung der Arbeitszeit</Text>
          <Text style={pdfStyles.text}>
            Der Arbeitnehmer ist verpflichtet, jede Arbeitsstunde zu stempeln. Nicht gestempelte Stunden werden nicht vergütet. Falls der Arbeitnehmer das Stempeln vergisst, muss dies dem Vorgesetzten sofort gemeldet werden, damit die Stunden nachgetragen werden können.
          </Text>
        </View>

        {/* Abschnitt Geheimhaltung */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>4. Geheimhaltung</Text>
          <Text style={pdfStyles.text}>
            Der Arbeitnehmer verpflichtet sich, alle Betriebs- und Geschäftsgeheimnisse des Arbeitgebers vertraulich zu behandeln. Diese Verpflichtung gilt auch nach Beendigung des Arbeitsverhältnisses. Der Arbeitnehmer darf keine Informationen über Kunden, Mitarbeiter oder Geschäftstätigkeiten ohne ausdrückliche Genehmigung des Arbeitgebers weitergeben.
          </Text>
        </View>

        {/* Abschnitt Arbeitszeitregelung */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>5. Arbeitszeitregelung</Text>
          <Text style={pdfStyles.text}>
            Der Arbeitnehmer ist verpflichtet, seine Arbeitszeit regelmäßig zu stempeln. Bei einer nicht erfolgten Meldung innerhalb von 24 Stunden wird die Arbeitszeit nicht vergütet. Bei verspäteter Meldung wird nur die Hälfte der vergessenen Arbeitszeit ausbezahlt. Der Arbeitgeber behält sich das Recht vor, Arbeitszeiten zu überprüfen und gegebenenfalls Anpassungen vorzunehmen.
          </Text>
        </View>

        {/* Abschnitt Homeoffice */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>6. Homeoffice</Text>
          <Text style={pdfStyles.text}>
            Der Arbeitnehmer hat die Möglichkeit, im Homeoffice zu arbeiten. Die Entscheidung über Homeoffice-Tage obliegt dem Arbeitgeber und muss im Voraus genehmigt werden. Der Arbeitnehmer verpflichtet sich, während der Arbeitszeit im Homeoffice die gleichen Standards wie im Büro einzuhalten.
          </Text>
        </View>

        {/* Abschnitt Urlaub */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>7. Urlaub</Text>
          <Text style={pdfStyles.text}>
            Der Arbeitnehmer hat Anspruch auf {formData.urlaubstage} Urlaubstage pro Jahr. Urlaubsanträge sind mindestens vier Wochen im Voraus beim Arbeitgeber einzureichen. Nicht genommener Urlaub kann nicht ins nächste Jahr übertragen werden.
          </Text>
        </View>

        {/* Abschnitt Kündigungsfristen */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>8. Kündigungsfristen</Text>
          <Text style={pdfStyles.text}>
            Die Kündigungsfrist beträgt für beide Parteien einen Monat zum Monatsende. Eine Kündigung muss schriftlich erfolgen und wird mit dem Eingang bei der anderen Partei wirksam.
          </Text>
        </View>

        {/* Abschnitt Datenschutz */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>9. Datenschutz</Text>
          <Text style={pdfStyles.text}>
            Der Arbeitgeber verpflichtet sich, die Datenschutzrichtlinien gemäß der geltenden Gesetze einzuhalten. Der Arbeitnehmer stimmt zu, dass seine personenbezogenen Daten für die Dauer des Arbeitsverhältnisses gespeichert und verarbeitet werden dürfen.
          </Text>
        </View>

        {/* Abschnitt Krankheit */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.text}>10. Krankheit</Text>
          <Text style={pdfStyles.text}>
            Im Krankheitsfall hat der Arbeitnehmer unverzüglich den Arbeitgeber zu informieren und ein ärztliches Attest vorzulegen, wenn die Abwesenheit länger als drei Tage andauert. Der Arbeitnehmer erhält während der Krankheit bis zu sechs Wochen Gehalt, abhängig von der Betriebszugehörigkeit.
          </Text>
        </View>

        {/* Unterschriften */}
        <View style={pdfStyles.unterschriften}>
          <Text style={pdfStyles.text}>_____________________</Text>
          <Text style={pdfStyles.text}>Timo Blumer, Arbeitgeber</Text>
          <Text style={pdfStyles.text}>_____________________</Text>
          <Text style={pdfStyles.text}>Arbeitnehmer</Text>
        </View>
      </Page>
    </Document>
  );
};

// Hauptkomponente
const Arbeitsvertrag = () => {
  const [formData, setFormData] = useState({
    nameArbeitnehmer: '',
    unternehmensname: 'TBS Solutions', // Standardwert

    positionArbeitnehmer: '',
    startdatum: '',
    arbeitsstundenProWoche: '',
    urlaubstage: 24, // Beispielwert für Urlaubstage
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="arbeitsvertrag">
      <h1>Arbeitsvertrag erstellen</h1>
      <form>
        <input type="text" name="nameArbeitnehmer" placeholder="Name des Arbeitnehmers" onChange={handleChange} />
       

        <input type="text" name="positionArbeitnehmer" placeholder="Position des Arbeitnehmers" onChange={handleChange} />
        <input type="date" name="startdatum" placeholder="Startdatum" onChange={handleChange} />
        <input type="number" name="arbeitsstundenProWoche" placeholder="Arbeitsstunden pro Woche" onChange={handleChange} />
        <input type="number" name="urlaubstage" placeholder="Urlaubstage" onChange={handleChange} />
      </form>
      <PDFDownloadLink
        document={<MyDocument formData={formData} />}
        fileName="arbeitsvertrag.pdf"
        className="download-link"
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Lädt...' : 'Arbeitsvertrag herunterladen'
        }
      </PDFDownloadLink>
    </div>
  );
};

export default Arbeitsvertrag;
