import React from 'react';
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
import GutscheinBestellung from './components/Gutschein/GutscheinBestellen';
import AlleGutscheine from './components/Gutschein/AlleGutscheine';
import Flyer from './components/Flyer/Flyer';
import Team from './components/Team/Team';


const isAdmin = localStorage.getItem('isAdmin');

function App() {
  const kunden = JSON.parse(localStorage.getItem('kunden')) || [];

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kunden/:id" element={<KundenAnzeigen kunden={kunden} />} />
          <Route path="/dankesnachricht" element={<Dankesnachricht />} />
          <Route path="/kurse" element={<KursListe />} />
          <Route path="/dienstleistungen" element={<Dienstleistungen />} />
          <Route path="/werbung" element={<WarumWerbungMachen />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/kundenscanner" element={<KundenScanner />} />
          <Route path="/warenkorb" element={<Warenkorb />} />
          <Route path="/gutscheine-liste" element={<AlleGutscheine />} />
          <Route path="/gutschein" element={<GutscheinBestellung />} />
          <Route path="/flyer" element={<Flyer />} />
          <Route path="/team" element={<Team />} />
         
          {isAdmin ? (
            <>
              <Route path="/zeiterfassung/:id" element={<TimeTracker />} />
              <Route path="/rechnung/:id" element={<Rechnung />} />
              <Route path="/kunden" element={<Kunden />} />
              <Route path="/kundeerfassen" element={<KundeErfassen />} />
              <Route path="/mitarbeitererfassen" element={<MitarbeiterErfassen />} />
              <Route path="/mitarbeiter" element={<MitarbeiterAnzeigen />} />
            </>
          ) : (
            <Route path="/login" element={<Login />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
