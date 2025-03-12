import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Importiere jwt-decode
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Dienstleistungen from './components/Dienstleistung/Dienstleistungen';
import ServiceDetail from './components/Dienstleistung/ServiceDetail';
import TimeTracker from './components/Zeiterfassung/TimeTracker';
import KundeErfassen from './components/Kunden/KundeErfassen';
import Rechnung from './components/Rechnung/Rechnung';
import Kunden from './components/Kunden/Kunden';
import Dankesnachricht from './components/Kunden/Dankesnachricht';
import MitarbeiterErfassen from './components/Mitarbeiter/MitarbeiterErfassen';
import MitarbeiterAnzeigen from './components/Mitarbeiter/MitarbeiterAnzeigen';
import WarumWerbungMachen from './components/Werbung/WarumWerbung';
import KundenAnzeigen from './components/Kunden/Kundenanzeigen';
import KursListe from './components/Kurse/KursListe';
import KundenScanner from './components/Kunden/KundenScanner';
import Warenkorb from './components/Warenkorb/Warenkorb';
import GutscheinErstellung from './components/Gutschein/GutscheinErstellung';
import AlleGutscheine from './components/Gutschein/AlleGutscheine';
import Flyer from './components/Flyer/Flyer';
import Team from './components/Team/Team';
import KundenBewertungen from './components/Kunden/KundenBewertungen';
import BewertungDetail from './components/Kunden/BewertungDetail';
import KundeBewertungformular from './components/Kunden/KundeBewertungformular';
import Mitarbeiter from './components/Mitarbeiter/Mitarbeiter';
import GutscheinScanner from './components/Gutschein/GutscheinScanner';
import FAQ from './components/FAQ/FaqComponent';
import NotFound from './components/Error/NotFound';
import Preisinformationen from './components/Preise/Preisinformationen';
import VerificationCode from './components/Login/Verifikation/VerificationCode';
import Vertrag from './components/Vertrag/Vertrag';
import SignComponent from './components/Vertrag/SignComponent';
import Infos from './components/Administrativ/Infos';
import VideoCall from './components/VideoChat/VideoCall';
import CookieConsent from './components/Cookies/CookieConsent';
import CreateService from './components/Dienstleistung/CreateService';
import Auftragsbestaetigung from './components/Auftragsbestaetigung/Auftragsbestaetigung';
import Kontoangaben from './components/Rechnung/Kontoangaben';
import PdfMerger from './components/Rechnung/Pdfgenerator';
import CreateDatenbankPaket from './components/Preise/CreateDatenbankPaket';
import CreateBackendPaket from './components/Preise/CreateBackendPaket';
import CreateFaq from './components/FAQ/CreateFaq';
import AudioSettings from './components/VideoChat/AudioSettings';
import Lizenzen from './components/Lizenz/Lizenzen';
import Footer from './components/Content/Footer';
import Impressum from './components/Content/Impressum';
import BewerbungForm from './components/Mitarbeiter/BewerbungForm';
import Arbeitsvertrag from './components/Mitarbeiter/Arbeitsvertrag';
import AGB from './components/AGB';
import RechnungForm from './components/Rechnung/RechnungForm';
import FaqEditComponent from './components/FAQ/FaqEditComponent';
import ResetPassword from './components/Mitarbeiter/ResetPassword';
import ArbeitszeitErfassen from './components/Mitarbeiter/ArbeitszeitErfassen';
import ArbeitszeitDetails from './components/Mitarbeiter/ArbeitszeitDetails';
import RechnungDetail from './components/Rechnung/RechnungDetails';
import RechnungDetails from './components/Rechnung/RechnungDetails';
import AufgabenList from './components/Kunden/Aufgaben/AufgabenList';
import AufgabenDetail from './components/Kunden/Aufgaben/AufgabenDetail';
import CreateUnteraufgabe from './components/Kunden/Aufgaben/CreateUnteraufgabe';
import CreateAufgabe from './components/Kunden/Aufgaben/CreateAufgaben';
import AntragStellen from './components/Mitarbeiter/AntragStellen';
import AlleAntraege from './components/Mitarbeiter/AlleAntraege';
import AntragDetail from './components/Mitarbeiter/AntragDetail';
import Download from './components/Mitarbeiter/Documents/Download';
import CreateKrankmeldung from './components/Mitarbeiter/CreateKrankmeldung';
import Statistik from './components/Administrativ/Statistik';
import Profile from './components/Mitarbeiter/Profile';
import GutscheinBestellung from './components/Gutschein/GutscheinBestellung';
import Kasse from './components/Administrativ/Kasse';
import Kassenlogin from './components/Administrativ/Kassenlogin';
import KassenUebersicht from './components/Administrativ/KassenUebersicht';
import IncomeExpenseForm from './components/Administrativ/IncomeExpenseForm';
import Receipts from './components/Administrativ/Reciepts';
import LastReceiptViewer from './components/Administrativ/LatestReciepts';
import ÜberUns from './components/Content/ÜberUns';
import GSKarteAbfrage from './components/Administrativ/GSKarteAbfrage';
import ProductBarcodes from './components/Administrativ/ProductBarcodes';
import DownloadZusammenfassung from './components/Administrativ/DownloadZusammenfassung';
import GSKarteDetails from './components/Administrativ/GSKarteDetails';
import ArtikelDetail from './components/Administrativ/ArtikelDetail';
import VoucherBarcodes from './components/Administrativ/VouchersBarcodes';

const App = () => {
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [timer, setTimer] = useState(null); 


  const [isKassenModus, setIsKassenModus] = useState(false);

  const toggleKassenModus = (status) => {
    setIsKassenModus(status);
  };

  

  useEffect(() => {
    const token = localStorage.getItem('token'); // Hole den Token aus localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.isAdmin); // Überprüfe die Admin-Rolle aus dem Token
      } catch (error) {
        console.error('Token konnte nicht dekodiert werden:', error);
        setIsAdmin(false); // Setze auf false, wenn der Token ungültig ist
      }
    }
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      // Lösche den vorherigen Timer, wenn der Benutzer aktiv ist
      if (timer) {
        clearTimeout(timer);
      }

      // Setze neuen Timer auf 10 Minuten
      const newTimer = setTimeout(() => {
        updateStatusOnBackend(); // Sende Anfrage an Backend, um Status zu ändern
      }, 10 * 60 * 1000); // 10 Minuten Inaktivität
      setTimer(newTimer);
    };

    const updateStatusOnBackend = async () => {
      try {
        // Sende die Anfrage zum Backend, um den Status zu aktualisieren
        await axios.post('/api/update-status', { status: 'abwesend' });
      } catch (error) {
        console.error('Fehler beim Senden der Anfrage:', error);
      }
    };

    // Überwache Mausbewegung, Tastatureingaben und Klicks
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    // Aufräumen bei Komponentendemontage
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (timer) {
        clearTimeout(timer); // Lösche den Timer bei der Demontage
      }
    };
  }, [timer]);

  


  return (
    <div className="App">
      <Router>
      {!isKassenModus && <Navbar />}
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/antrag" element={<AntragStellen />} />
          <Route path="/antragdetail/:wunschId" element={<AntragDetail />} />
          <Route path="/statistiken" element={<Statistik />} />
          <Route path="/gutscheinbestellung" element={<GutscheinBestellung />} />
          <Route path="/alleAntraege" element={<AlleAntraege />} />
          <Route path="/last" element={<LastReceiptViewer />} />

          <Route path="/receipts" element={<Receipts />} />
          <Route path="/gs-karte" element={<GSKarteAbfrage />} />
          <Route path="/barcode" element={<ProductBarcodes />} />
          <Route path="/barcode-gutschein" element={<VoucherBarcodes />} />


          <Route
            path="/kasse"
            element={<Kasse onKassenModusChange={toggleKassenModus} />}
          />
          <Route path="/kassenlogin"   element={<Kassenlogin onKassenModusChange={toggleKassenModus}/>} />
          <Route path="/kassenuebersicht" element={<KassenUebersicht onKassenModusChange={toggleKassenModus} />} />
          <Route path="/einnahmeausgabe" element={<IncomeExpenseForm onKassenModusChange={toggleKassenModus}/>} />

          <Route path="/download" element={<Download />} />
          <Route path="/arbeitszeit-erfassen/:kundenId/:dienstleistungId" element={<ArbeitszeitErfassen />} />
          <Route path="/artikel-detail/:article_number" element={<ArtikelDetail onKassenModusChange={toggleKassenModus}/>} />

          <Route path="/ueber-uns" element={<ÜberUns />} />
          <Route path="/aufgaben/:aufgabenId/unteraufgabe/create" element={<CreateUnteraufgabe />} />
          <Route path="/aufgaben/erstellen/:kundenId/:dienstleistungId" element={<CreateAufgabe />} /> {/* Neue Route für CreateAufgabe */}
          <Route path="/agb" element={<AGB />} />
          <Route path="/rechnungform" element={<RechnungForm />} />
          <Route path="/download/:kundenId" element={<DownloadZusammenfassung />} />
          <Route path="/arbeitsvertrag" element={<Arbeitsvertrag />} />
          <Route path="/kunden/:id" element={<KundenAnzeigen />} />
          <Route path="/aufgaben/:kundenId" element={<AufgabenList />} />
          <Route path="/unteraufgabe/:unteraufgabenId" element={<AufgabenDetail />}/>
          <Route path="/kunden" element={<Kunden />} />
          <Route path="/dankesnachricht" element={<Dankesnachricht />} />
          <Route path="/kurse" element={<KursListe />} />
          <Route path="/preisinformationen" element={<Preisinformationen />} />
          <Route path="/kontakt" element={<KundeErfassen />} />
          <Route path="/dienstleistungen" element={<Dienstleistungen isAdmin={isAdmin} />} />
          <Route path="/werbung" element={<WarumWerbungMachen />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/kundenscanner" element={<KundenScanner />} />
          <Route path="/gutscheinscanner" element={<GutscheinScanner />} />
          <Route path="/warenkorb" element={<Warenkorb />} />
          <Route path="/gutscheine-liste" element={<AlleGutscheine />} />
          <Route path="/gutschein" element={<GutscheinErstellung />} />
          <Route path="/flyer" element={<Flyer />} />
          <Route path="/sign" element={<SignComponent />} />
          <Route path="/team" element={<Team />} />
          <Route path="/bewertungen" element={<KundenBewertungen />} />
          <Route path="/bewertung/:id" element={<BewertungDetail />} />
          <Route path="/videocall" element={<VideoCall />} />
          <Route path="/kundenbewertung/:kundennummer" element={<KundeBewertungformular />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/verification" element={<VerificationCode />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/faq-edit/:id" element={<FaqEditComponent />} />
          <Route path="/audiosettings" element={<AudioSettings />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/lizenzen" element={<Lizenzen />} />
          <Route path="/bewerbungformular" element={<BewerbungForm />} />
          <Route path="/createkrankmeldung" element={<CreateKrankmeldung />}  />
          <Route path="/profile" element={<Profile />}  />

          <Route path="/rechnungen/:id" element={<RechnungDetails />}  />

              <Route path="/zeiterfassung/:id" element={<TimeTracker />} />
              <Route path="/pdfmerger" element={<PdfMerger />} />
              <Route path="/datenbankpaketerstellen" element={<CreateDatenbankPaket />} />
              <Route path="/backendpaketerstellen" element={<CreateBackendPaket />} />
              <Route path="/createfaq" element={<CreateFaq />} />
              <Route path="/infos" element={<Infos />} />
              <Route path="/kontoangaben" element={<Kontoangaben />} />
              <Route path="/service-create" element={<CreateService />} />
              <Route path="/rechnungen" element={<Rechnung />} />
              <Route path="/vertrag/:id" element={<Vertrag />} />
              <Route path="/auftragsbestaetigung/:id" element={<Auftragsbestaetigung />} />
              <Route path="/mitarbeitererfassen" element={<MitarbeiterErfassen />} />
              <Route path="/mitarbeiter" element={<Mitarbeiter />} />
              <Route path="/mitarbeiteranzeigen/:id" element={<MitarbeiterAnzeigen />} />
              <Route path="/mitarbeiter/:id/reset-password" element={<ResetPassword />} />
              <Route path="/arbeitszeiten/:id" element={<ArbeitszeitDetails />} />
              <Route path="/gskarte-details" element={<GSKarteDetails />} /> {/* Neue Route für GSKarteDetails */}
            <Route path="/login" element={<Login />} />
     
        </Routes>
        {!isKassenModus && <Footer />}
      </Router>
    </div>
  );
};

export default App;
