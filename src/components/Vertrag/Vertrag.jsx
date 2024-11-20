

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import corbel from "./CORBEL.TTF"; // Import your custom font

// Register the Corbel font
Font.register({
  family: 'Corbel',
  src: corbel, // Adjust path as needed
});

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Corbel',
    backgroundColor: '#f4f4f4',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
    borderBottom: '2px solid #2c3e50',
    paddingBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
    borderBottom: '1px solid #bdc3c7',
    paddingBottom: 5,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
    color: '#34495e',
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 40,
  },
  button: {
    marginTop: 20,
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    fontSize: 16,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    textAlign: 'center',
    width: '200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

// Define the Vertrag document
const Vertrag = () => (
  <Document>
  <Page size="A4" style={styles.page}>
    {/* Präambel */}
    <View style={styles.section}>
      <Text style={styles.header}>Vertrag zwischen TBS Solutions und dem Auftraggeber</Text>
      <Text style={styles.paragraph}>
        Dieser Vertrag regelt die allgemeinen Bedingungen und die Erbringung von Dienstleistungen durch TBS Solutions für den Auftraggeber. TBS Solutions verpflichtet sich, alle vereinbarten Dienstleistungen gemäß den im Vertrag spezifizierten Anforderungen und dem Stand der Technik zu erbringen. Der Auftraggeber beauftragt den Dienstleister mit der Erbringung dieser Dienstleistungen, die den geschäftlichen Anforderungen und Zielen des Auftraggebers entsprechen.
      </Text>
    </View>

    {/* Abschnitt 1 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>1. Gegenstand des Vertrages</Text>
      <Text style={styles.paragraph}>1.1 TBS Solutions verpflichtet sich, dem Auftraggeber die im Vertrag vereinbarten Dienstleistungen zu erbringen. Diese Dienstleistungen umfassen alle Aktivitäten, die zur Erreichung der vereinbarten Ziele notwendig sind, und können sowohl technische, beratende, organisatorische als auch andere spezifizierte Tätigkeiten beinhalten.</Text>
      <Text style={styles.paragraph}>1.2 Der genaue Umfang der Dienstleistungen wird detailliert in einer Leistungsbeschreibung oder einem separat vereinbarten Dokument festgelegt, das als Bestandteil dieses Vertrages gilt.</Text>
      <Text style={styles.paragraph}>1.3 Im Rahmen dieses Vertrages können sowohl einmalige Dienstleistungen als auch wiederkehrende Leistungen oder fortlaufende Beratungs- und Wartungsleistungen vereinbart werden. Details zu den jeweiligen Leistungen sind in den jeweiligen Angeboten oder Aufträgen des Dienstleisters aufgeführt.</Text>
    </View>

    {/* Abschnitt 2 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>2. Leistungsbeschreibung und Umfang</Text>
      <Text style={styles.paragraph}>2.1 Der Dienstleister wird die zu erbringenden Leistungen in der vereinbarten Qualität und innerhalb des definierten Zeitrahmens erbringen. Die genaue Definition der Leistungen wird in der Leistungsbeschreibung oder in den entsprechenden Aufträgen festgehalten.</Text>
      <Text style={styles.paragraph}>2.2 Der Dienstleister verpflichtet sich, alle zur Leistungserbringung notwendigen Ressourcen und Fachkenntnisse bereitzustellen, um die vereinbarten Ergebnisse zu erzielen. Dies umfasst auch die Nutzung aktueller Technologien, Best Practices und die Einhaltung geltender Normen.</Text>
      <Text style={styles.paragraph}>2.3 Der Dienstleister wird in engem Austausch mit dem Auftraggeber arbeiten, um sicherzustellen, dass die erbrachten Dienstleistungen den Anforderungen und Erwartungen entsprechen. Sollte eine Anpassung der Leistungen erforderlich sein, wird diese in einem gemeinsamen Prozess vorgenommen.</Text>
    </View>

    {/* Abschnitt 3 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>3. Pflichten des Auftraggebers</Text>
      <Text style={styles.paragraph}>3.1 Der Auftraggeber stellt sicher, dass alle erforderlichen Informationen, Daten und Ressourcen, die zur Erbringung der Dienstleistung notwendig sind, in ausreichender Menge und Qualität zur Verfügung gestellt werden. Dies umfasst auch den Zugang zu relevanten Systemen, Räumlichkeiten und Mitarbeitern, sofern erforderlich.</Text>
      <Text style={styles.paragraph}>3.2 Der Auftraggeber verpflichtet sich, den Dienstleister zeitnah über etwaige Änderungen in den Anforderungen oder der Zielsetzung zu informieren, die die Dienstleistungen betreffen könnten. Der Dienstleister wird dann gemeinsam mit dem Auftraggeber eine Lösung entwickeln, um die Änderungen zu integrieren.</Text>
    </View>

    {/* Abschnitt 4 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>4. Vergütung und Zahlungsbedingungen</Text>
      <Text style={styles.paragraph}>4.1 Die Vergütung für die erbrachten Dienstleistungen wird im jeweiligen Auftrag oder in der Leistungsbeschreibung festgelegt. Diese kann als Pauschalpreis, nach Aufwand oder in einer anderen Form vereinbart werden.</Text>
      <Text style={styles.paragraph}>4.2 Der Dienstleister stellt dem Auftraggeber nach Abschluss der jeweiligen Leistung eine Rechnung aus. Die Zahlungsbedingungen sind in der Rechnung detailliert angegeben. Die Zahlung ist innerhalb der im Vertrag oder auf der Rechnung angegebenen Frist ohne Abzüge zu leisten.</Text>
    </View>

    {/* Abschnitt 5 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>5. Vertragslaufzeit und Kündigung</Text>
      <Text style={styles.paragraph}>5.1 Der Vertrag tritt mit der Unterzeichnung durch beide Parteien in Kraft und bleibt bis zur vollständigen Erbringung der vereinbarten Leistungen gültig. Die genaue Laufzeit des Vertrages und etwaige Verlängerungsoptionen sind in den jeweiligen Aufträgen festgelegt.</Text>
    </View>

    {/* Abschnitt 6 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>6. Haftung</Text>
      <Text style={styles.paragraph}>6.1 TBS Solutions haftet nur für Schäden, die durch vorsätzliche oder grob fahrlässige Handlungen seinerseits oder seiner Erfüllungsgehilfen verursacht wurden. Eine Haftung für leichte Fahrlässigkeit ist ausgeschlossen.</Text>
    </View>

    {/* Abschnitt 7 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>7. Vertraulichkeit</Text>
      <Text style={styles.paragraph}>7.1 Beide Parteien verpflichten sich, alle im Rahmen dieses Vertrages erhaltenen vertraulichen Informationen geheim zu halten und nur für die Zwecke dieses Vertrages zu verwenden. Dies gilt insbesondere für technische Daten, Geschäftsgeheimnisse und alle anderen Informationen, die ausdrücklich als vertraulich bezeichnet werden.</Text>
    </View>

    {/* Abschnitt 8 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>8. Rechte an Arbeitsergebnissen</Text>
      <Text style={styles.paragraph}>8.1 Alle im Rahmen dieses Vertrages erstellten Arbeitsergebnisse, Software, Dokumentationen und sonstige kreative Leistungen gehören dem Auftraggeber, nachdem die Vergütung vollständig gezahlt wurde. Der Dienstleister räumt dem Auftraggeber alle notwendigen Rechte zur Nutzung, Bearbeitung und Weitergabe dieser Ergebnisse ein.</Text>
    </View>

    {/* Abschnitt 9 */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>9. Gerichtsstand und anwendbares Recht</Text>
      <Text style={styles.paragraph}>9.1 Dieser Vertrag unterliegt dem Recht von [Land des Dienstleisters]. Der Gerichtsstand für alle Streitigkeiten im Zusammenhang mit diesem Vertrag ist [Ort des Dienstleisters].</Text>
    </View>

    {/* Schlussbestimmungen */}
    <View style={styles.section}>
      <Text style={styles.subHeader}>10. Sonstige Bestimmungen</Text>
      <Text style={styles.paragraph}>10.1 Änderungen dieses Vertrages bedürfen der Schriftform und der Zustimmung beider Parteien. Mündliche Vereinbarungen sind nur dann gültig, wenn sie schriftlich bestätigt werden.</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.subHeader}>11. Schlussbestimmungen</Text>
      <Text style={styles.paragraph}>11.1 Beide Parteien bestätigen, dass sie diesen Vertrag nach eingehender Prüfung verstanden haben und freiwillig zustimmen, alle Bedingungen zu erfüllen.</Text>
    </View>
  </Page>
</Document>
);

// Download Button component
const DownloadButton = () => {
  const handleDownload = () => {
    // Create the PDF document using the Vertrag component
    const doc = <Vertrag />;
    
    // Use pdf() to generate the PDF Blob and download
    pdf(doc)
      .toBlob()
      .then((blob) => {
        saveAs(blob, 'vertrag.pdf');
      })
      .catch((error) => console.error('Error generating PDF:', error));
  };

  return (
    <button style={styles.button} onClick={handleDownload}>
      <Text style={styles.buttonText}>Download Vertrag als PDF</Text>
    </button>
  );
};

export default DownloadButton;
