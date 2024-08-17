import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Dienstleistungen from './components/Dienstleistung/Dienstleistungen';
import ServiceDetail from './components/ServiceDetail/ServiceDetail';
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
import PdfMerger from './components/Rechnung/PdfMerger';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  const onLogin = (isAdmin) => {
    localStorage.setItem('isAdmin', isAdmin);
    setIsAdmin(isAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  const kunden = JSON.parse(localStorage.getItem('kunden')) || [];

  return (
    <div className="App">
      <Router>
        <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
        <CookieConsent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kunden/:id" element={<KundenAnzeigen kunden={kunden} />} />
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
          {isAdmin ? (
            <>
              <Route path="/zeiterfassung/:id" element={<TimeTracker />} />
              <Route path="/pdfmerger" element={<PdfMerger />} />

              <Route path="/infos" element={<Infos />} />
              <Route path="/kontoangaben" element={<Kontoangaben />} />
              <Route path="/service-create" element={<CreateService />} />
              <Route path="/rechnung/:id" element={<Rechnung />} />
              <Route path="/vertrag/:id" element={<Vertrag />} />
              <Route path="/auftragsbestaetigung/:id" element={<Auftragsbestaetigung />} />

              <Route path="/mitarbeitererfassen" element={<MitarbeiterErfassen />} />
              <Route path="/mitarbeiter" element={<Mitarbeiter />} />
              <Route path="/mitarbeiteranzeigen/:id" element={<MitarbeiterAnzeigen />} />
            </>
          ) : (
            <Route path="/login" element={<Login onLogin={onLogin} />} />
          )}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
