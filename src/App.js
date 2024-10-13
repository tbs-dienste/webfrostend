import React, { useState, useEffect } from 'react';
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

const App = () => {
  
  const [isAdmin, setIsAdmin] = useState(false);

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

  


  return (
    <div className="App">
      <Router>
        <Navbar />
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/rechnungform" element={<RechnungForm />} />
          <Route path="/arbeitsvertrag" element={<Arbeitsvertrag />} />
          <Route path="/kunden/:id" element={<KundenAnzeigen />} />
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
          <Route path="/kundenbewertungen" element={<KundenBewertungen />} />
          <Route path="/bewertung/:id" element={<BewertungDetail />} />
          <Route path="/videocall" element={<VideoCall />} />
          <Route path="/kundenbewertung" element={<KundeBewertungformular />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/verification" element={<VerificationCode />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/audiosettings" element={<AudioSettings />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/lizenzen" element={<Lizenzen />} />
          <Route path="/bewerbungformular" element={<BewerbungForm />} />
        
            
              <Route path="/zeiterfassung/:id" element={<TimeTracker />} />
              <Route path="/pdfmerger" element={<PdfMerger />} />
              <Route path="/datenbankpaketerstellen" element={<CreateDatenbankPaket />} />
              <Route path="/backendpaketerstellen" element={<CreateBackendPaket />} />
              <Route path="/createfaq" element={<CreateFaq />} />
              <Route path="/infos" element={<Infos />} />
              <Route path="/kontoangaben" element={<Kontoangaben />} />
              <Route path="/service-create" element={<CreateService />} />
              <Route path="/rechnung/:id" element={<Rechnung />} />
              <Route path="/vertrag/:id" element={<Vertrag />} />
              <Route path="/auftragsbestaetigung/:id" element={<Auftragsbestaetigung />} />
              <Route path="/mitarbeitererfassen" element={<MitarbeiterErfassen />} />
              <Route path="/mitarbeiter" element={<Mitarbeiter />} />
              <Route path="/mitarbeiteranzeigen/:id" element={<MitarbeiterAnzeigen />} />
           
    
            <Route path="/login" element={<Login />} />
     
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
