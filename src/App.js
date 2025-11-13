import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Content/Footer';

// **ALLE COMPONENT IMPORTS**
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
import KundenBewertungen from './components/Bewertungen/KundenBewertungen';
import BewertungDetail from './components/Bewertungen/BewertungDetail';
import KundeBewertungformular from './components/Bewertungen/KundeBewertungformular';
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
import Impressum from './components/Content/Impressum';
import BewerbungForm from './components/Mitarbeiter/BewerbungForm';
import Arbeitsvertrag from './components/Mitarbeiter/Arbeitsvertrag';
import AGB from './components/AGB';
import RechnungForm from './components/Rechnung/RechnungForm';
import FaqEditComponent from './components/FAQ/FaqEditComponent';
import ResetPassword from './components/Mitarbeiter/ResetPassword';
import ArbeitszeitErfassen from './components/Mitarbeiter/ArbeitszeitErfassen';
import ArbeitszeitDetails from './components/Mitarbeiter/ArbeitszeitDetails';
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
import Receipts from './components/Administrativ/Receipts';
import LastReceiptViewer from './components/Administrativ/LatestReciepts';
import ÜberUns from './components/Content/ÜberUns';
import GSKarteAbfrage from './components/Administrativ/GSKarteAbfrage';
import ProductBarcodes from './components/Administrativ/ProductBarcodes';
import DownloadZusammenfassung from './components/Administrativ/DownloadZusammenfassung';
import GSKarteDetails from './components/Administrativ/GSKarteDetails';
import ArtikelDetail from './components/Administrativ/ArtikelDetail';
import VoucherBarcodes from './components/Administrativ/VouchersBarcodes';
import CustomerCards from './components/Administrativ/Kundenkarten/CustomerCards';
import AddPoints from './components/Administrativ/Kundenkarten/AddPoints';
import CreateCustomerCard from './components/Administrativ/Kundenkarten/CreateCustomerCard';
import KundenkarteDruck from './components/Administrativ/Kundenkarten/KundenkarteDruck';
import KundenSuche from './components/Administrativ/KundenSuche';
import CreateStellenBeschreibung from './components/Administrativ/Stellenbeschreibung/CreateStellenBeschreibung';
import StellenausschreibungDetail from './components/Administrativ/Stellenbeschreibung/StellenausschreibungDetail';
import Stellenanzeigen from './components/Administrativ/Stellenbeschreibung/Stellenanzeigen';
import AllBewerbungen from './components/Administrativ/Applications/AllBewerbungen';
import AllProducts from './components/Administrativ/AllProducts';
import ArtikelSuche from './components/Administrativ/ArtikelSuche';
import CreateProductForm from './components/Administrativ/CreateProductForm';
import SpinWheel from './components/Event/SpinWheel';
import ProductDetails from './components/Administrativ/ProductDetails';
import AddToBestandForm from './components/Administrativ/AddToBestandForm';
import UmbuchungPDFExport from './components/Umbuchung/UmbuchungPDFExport';
import Bilanz from './components/Administrativ/Bilanz';
import DienstleistungsBewertungen from './components/Bewertungen/DienstleistungsBewertungen';
import AktionenListe from './components/Aktionen/AktionenListe';
import AktionDetails from './components/Aktionen/AktionDetails';
import AktionErstellen from './components/Aktionen/AktionErstellen';
import HausverbotForm from './components/Hausverbot/HausverbotForm';
import HausverbotListe from './components/Hausverbot/HausverbotListe';
import HausverbotDetail from './components/Hausverbot/HausverbotDetail';
import StrafantragForm from './components/Administrativ/Straftat/StrafantragForm';
import NewsletterSubscribeForm from './components/Content/NewsletterSubscribeForm';
import NewsletterAbonnenten from './components/Content/Newsletter/NewsletterAbonnenten';
import InventurErstellen from './components/Administrativ/Inventur/InventurErstellen';
import InventurScan from './components/Administrativ/Inventur/InventurScan';
import InventurStartForm from './components/Administrativ/Inventur/InventurStartForm';

import "./App.css";
import XboxPracticeGame from './components/Administrativ/Applications/XboxPracticeGame';
import VertragsVorlageForm from './components/Kunden/VertragsVorlageForm';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [timer, setTimer] = useState(null); 
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [isKassenModus, setIsKassenModus] = useState(false);

  const toggleKassenModus = (status) => setIsKassenModus(status);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.isAdmin);
      } catch (error) {
        console.error('Token konnte nicht dekodiert werden:', error);
        setIsAdmin(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      if (timer) clearTimeout(timer);
      const newTimer = setTimeout(() => updateStatusOnBackend(), 10 * 60 * 1000);
      setTimer(newTimer);
    };

    const updateStatusOnBackend = async () => {
      try {
        await axios.post('/api/update-status', { status: 'abwesend' });
      } catch (error) {
        console.error('Fehler beim Senden der Anfrage:', error);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  const hostname = window.location.hostname;
  const isKassenSubdomain = hostname.startsWith('kasse.');
  return (
    <div className="App">
      <Router>
        {!fullscreenMode && !isKassenModus && !isKassenSubdomain && <Navbar />}
  
        <Routes>
          {isKassenSubdomain ? (
            <>
              {/* Kassen-Subdomain Routen */}
              <Route path="/" element={<Kassenlogin onKassenModusChange={toggleKassenModus} />} />
              <Route path="/kasse" element={<Kasse onKassenModusChange={toggleKassenModus} />} />
              <Route path="/kassenlogin" element={<Kassenlogin onKassenModusChange={toggleKassenModus} />} />
              <Route path="/kassenuebersicht" element={<KassenUebersicht onKassenModusChange={toggleKassenModus} />} />
              <Route path="/einnahmeausgabe" element={<IncomeExpenseForm onKassenModusChange={toggleKassenModus} />} />
              <Route path="*" element={<Kassenlogin onKassenModusChange={toggleKassenModus} />} />
            </>
          ) : (
            <>
              {/* Hauptdomain Routen */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/game" element={<XboxPracticeGame />} />              <Route path="/antrag" element={<AntragStellen />} />

              <Route path="/antragdetail/:wunschId" element={<AntragDetail />} />
              <Route path="/statistiken" element={<Statistik />} />
              <Route path="/gutscheinbestellung" element={<GutscheinBestellung />} />
              <Route path="/alleAntraege" element={<AlleAntraege />} />
              <Route path="/last" element={<LastReceiptViewer />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/newsletter" element={<NewsletterSubscribeForm />} />
              <Route path="/newsletter-subscribers" element={<NewsletterAbonnenten />} />
              <Route path="/receipts" element={<Receipts />} />
              <Route path="/gs-karte" element={<GSKarteAbfrage />} />
              <Route path="/barcode" element={<ProductBarcodes />} />
              <Route path="/barcode-gutschein" element={<VoucherBarcodes />} />
              <Route path="/kundenkarten" element={<CustomerCards />} />
              <Route path="/add-points" element={<AddPoints />} />
              <Route path="/createKundenkarte" element={<CreateCustomerCard />} />
              <Route path="/printKundenkarte" element={<KundenkarteDruck />} />
              <Route path="/spin-wheel" element={<SpinWheel onKassenModusChange={toggleKassenModus} />} />
              <Route path="/createProduct" element={<CreateProductForm />} />
              <Route path="/hausverbotform" element={<HausverbotForm />} />
              <Route path="/hausverbote" element={<HausverbotListe />} />
              <Route path="/hausverbot/:id" element={<HausverbotDetail />} />
              <Route path="/createstellenbeschreibung" element={<CreateStellenBeschreibung />} />
              <Route path="/stellen-detail/:stellenId" element={<StellenausschreibungDetail />} />
              <Route path="/stellen" element={<Stellenanzeigen />} />
              <Route path="/allbewerbungen" element={<AllBewerbungen />} />
              <Route path="/bilanz" element={<Bilanz />} />
              <Route path="/kundensuche" element={<KundenSuche onKassenModusChange={toggleKassenModus} />} />
              <Route path="/artikelsuche" element={<ArtikelSuche onKassenModusChange={toggleKassenModus} />} />
              <Route path="/strafantragform" element={<StrafantragForm />} />
              <Route path="/kasse" element={<Kasse onKassenModusChange={toggleKassenModus} />} />
              <Route path="/kassenlogin" element={<Kassenlogin onKassenModusChange={toggleKassenModus} />} />
              <Route path="/kassenuebersicht" element={<KassenUebersicht onKassenModusChange={toggleKassenModus} />} />
              <Route path="/einnahmeausgabe" element={<IncomeExpenseForm onKassenModusChange={toggleKassenModus} />} />
              <Route path="/umbuchung" element={<UmbuchungPDFExport />} />
              <Route path="/download" element={<Download />} />
              <Route path="/arbeitszeit-erfassen/:kundenId/:dienstleistungId" element={<ArbeitszeitErfassen />} />
              <Route path="/artikel-detail/:article_number" element={<ArtikelDetail onKassenModusChange={toggleKassenModus} />} />
              <Route path="/ueber-uns" element={<ÜberUns />} />
              <Route path="/aufgaben/:aufgabenId/unteraufgabe/create" element={<CreateUnteraufgabe />} />
              <Route path="/aufgaben/erstellen/:kundenId/:dienstleistungId" element={<CreateAufgabe />} />
              <Route path="/agb" element={<AGB />} />
              <Route path="/rechnungform" element={<RechnungForm />} />
              <Route path="/download/:kundenId" element={<DownloadZusammenfassung />} />
              <Route path="/arbeitsvertrag" element={<Arbeitsvertrag />} />
              <Route path="/kunden/:id" element={<KundenAnzeigen />} />
              <Route path="/product/:article_number" element={<ProductDetails />} />
              <Route path="/bestand-erhöhen" element={<AddToBestandForm onKassenModusChange={toggleKassenModus} />} />
              <Route path="/aufgaben/:kundenId" element={<AufgabenList />} />
              <Route path="/unteraufgabe/:unteraufgabenId" element={<AufgabenDetail />} />
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
              <Route path="/videocall" element={<VideoCall />} />
              <Route path="/aktionen" element={<AktionenListe />} />
              <Route path="/aktionen/:id" element={<AktionDetails />} />
              <Route path="/aktion-erstellen" element={<AktionErstellen />} />
              <Route path="/kundenbewertung/:kundennummer" element={<KundeBewertungformular />} />
              <Route path="/bewertungen" element={<KundenBewertungen />} />
              <Route path="/dienstleistung/:dienstleistungId" element={<DienstleistungsBewertungen />} />
              <Route path="/bewertungen/:id" element={<BewertungDetail />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/verification" element={<VerificationCode />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/faq-edit/:id" element={<FaqEditComponent />} />
              <Route path="/audiosettings" element={<AudioSettings />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/lizenzen" element={<Lizenzen />} />
              <Route path="/bewerbungformular" element={<BewerbungForm />} />
              <Route path="/createkrankmeldung" element={<CreateKrankmeldung />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rechnungen/:id" element={<RechnungDetails />} />
              <Route path="/zeiterfassung/:id" element={<TimeTracker />} />
              <Route path="/pdfmerger" element={<PdfMerger />} />
              <Route path="/vertragsvorlage-create" element={<VertragsVorlageForm />} />

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
              <Route path="/gskarte-details" element={<GSKarteDetails />} />
            </>
          )}
        </Routes>
  
        {!isKassenSubdomain && !isKassenModus && <Footer />}
      </Router>
    </div>
  );
          };  
export default App;
