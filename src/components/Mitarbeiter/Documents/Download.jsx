import React, { useState } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaDownload,
  FaChevronDown,
  FaPalette,
  FaBullhorn,
  FaUsers,
  FaBriefcase,
  FaBuilding,
} from "react-icons/fa";

import Arbeitsvertrag from "./Arbeitsvertrag.docx";
import Unternehmensrichtlinien from "./Unternehmensrichtlinien.pdf";
import Datenschutzrichtlinien from "./Datenschutzrichtlinien.pdf";
import KündigungWord from "./Kündigung.docx";
import Kündigung from "./Kündigung.pdf";

import Besprechungsprotokoll from "./Besprechungsprotokoll_Kundentermin_Professional.docx";
import NotizpapierVorlage from "./Notizpapier.docx";

import LogoDark from "./Logo_black.png";
import LogoLight from "./Logo_white.png";

import "./Download.scss";

function Download() {

  // 🔥 EINZIGER STATE FÜR ALLE DROPDOWNS
  const [openSection, setOpenSection] = useState("docs");

  const toggleSection = (name) => {
    setOpenSection(openSection === name ? "" : name);
  };

  const handleDownload = (url, fileName) => {
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => alert("Fehler beim Download!"));
  };

  const documents = [
    { name: "Arbeitsvertrag", url: Arbeitsvertrag, icon: <FaFileWord />, type: "Word", category: "Mitarbeiter", description: "Offizieller Arbeitsvertrag." },
    { name: "Unternehmensrichtlinien", url: Unternehmensrichtlinien, icon: <FaFilePdf />, type: "PDF", category: "Unternehmen", description: "Interne Richtlinien." },
    { name: "Datenschutzrichtlinien", url: Datenschutzrichtlinien, icon: <FaFilePdf />, type: "PDF", category: "Datenschutz", description: "DSGVO Dokument." },
    { name: "Kündigung Word", url: KündigungWord, icon: <FaFileWord />, type: "Word", category: "HR", description: "Kündigung Word." },
    { name: "Kündigung PDF", url: Kündigung, icon: <FaFilePdf />, type: "PDF", category: "HR", description: "Kündigung PDF." },
  ];

  const adminDocs = [
    { name: "Handelsregisterauszug", url: "/docs/Handelsregisterauszug.pdf", icon: <FaFilePdf />, type: "PDF", category: "Administration", description: "Offiziell." },
    { name: "Steuerunterlagen", url: "/docs/Steuerunterlagen.pdf", icon: <FaFilePdf />, type: "PDF", category: "Administration", description: "Steuern." },
    { name: "Versicherungsnachweis", url: "/docs/Versicherungsnachweis.pdf", icon: <FaFilePdf />, type: "PDF", category: "Administration", description: "Versicherung." },
    { name: "Bankverbindung", url: "/docs/Bankverbindung.docx", icon: <FaFileWord />, type: "Word", category: "Administration", description: "Bankdaten." },
  ];

  const templates = [
    { name: "Besprechungsprotokoll", url: Besprechungsprotokoll, icon: <FaFileWord />, type: "Word", category: "Vorlage", description: "Meeting Vorlage." },
    { name: "Notizpapier Vorlage", url: NotizpapierVorlage, icon: <FaFileWord />, type: "Word", category: "Vorlage", description: "Notizen." },
  ];

  const marketingDocs = [
    { name: "Social Media Guidelines", description: "Instagram & TikTok Regeln." },
    { name: "Brand Voice", description: "Kommunikationsstil." },
    { name: "Marketing Strategie", description: "Strategie." },
    { name: "Pressemappe", description: "PR Inhalte." },
  ];

  const colors = [
    { name: "Primary Blue", hex: "#2563eb" },
    { name: "Dark Navy", hex: "#0f172a" },
    { name: "Accent Purple", hex: "#7c3aed" },
    { name: "Soft Gray", hex: "#e5e7eb" },
    { name: "Success Green", hex: "#16a34a" },
  ];

  const logos = [
    { name: "Dark Logo", image: LogoDark },
    { name: "Light Logo", image: LogoLight },
  ];

  return (
    <div className="download-page">

      {/* HERO */}
      <div className="hero">
        <h1>Startup Brand & Mitarbeiter Center</h1>
        <p>Alle Dokumente zentral an einem Ort.</p>
      </div>

      {/* SECTION */}
      {[
        { key: "docs", title: "Mitarbeiter & Arbeitsalltag", icon: <FaBriefcase />, data: documents },
        { key: "admin", title: "Administrative Dokumente", icon: <FaBuilding />, data: adminDocs },
        { key: "templates", title: "Vorlagen & Notizpapier", icon: <FaFileWord />, data: templates },
      ].map((section) => (
        <div className="dropdown-section" key={section.key}>

          <button
            className="dropdown-header"
            onClick={() => toggleSection(section.key)}
          >
            <span>
              {section.icon} {section.title}
            </span>

            <FaChevronDown className={openSection === section.key ? "rotate" : ""} />
          </button>

          {openSection === section.key && (
            <div className="dropdown-content">

              {section.data.map((doc, i) => (
                <div className="doc-card" key={i}>

                  <div className="doc-icon">{doc.icon}</div>

                  <div className="doc-info">
                    <h3>{doc.name}</h3>
                    <p>{doc.description}</p>
                    <span className="doc-type">
                      {doc.category} • {doc.type}
                    </span>
                  </div>

                  <button
                    className="download-btn"
                    onClick={() => handleDownload(doc.url, doc.name)}
                  >
                    <FaDownload />
                    Download
                  </button>

                </div>
              ))}

            </div>
          )}
        </div>
      ))}

      {/* MARKETING */}
      <div className="dropdown-section">
        <button
          className="dropdown-header"
          onClick={() => toggleSection("marketing")}
        >
          <span><FaBullhorn /> Marketing & Kommunikation</span>
          <FaChevronDown className={openSection === "marketing" ? "rotate" : ""} />
        </button>

        {openSection === "marketing" && (
          <div className="dropdown-content grid">
            {marketingDocs.map((item, i) => (
              <div className="marketing-card" key={i}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COLORS */}
      <div className="dropdown-section">
        <button
          className="dropdown-header"
          onClick={() => toggleSection("colors")}
        >
          <span><FaPalette /> Farben</span>
          <FaChevronDown className={openSection === "colors" ? "rotate" : ""} />
        </button>

        {openSection === "colors" && (
          <div className="colors-grid">
            {colors.map((c, i) => (
              <div className="color-card" key={i}>
                <div className="color-preview" style={{ background: c.hex }} />
                <h4>{c.name}</h4>
                <p>{c.hex}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGOS */}
      <div className="dropdown-section">
        <button
          className="dropdown-header"
          onClick={() => toggleSection("logos")}
        >
          <span><FaUsers /> Logos & Assets</span>
          <FaChevronDown className={openSection === "logos" ? "rotate" : ""} />
        </button>

        {openSection === "logos" && (
          <div className="logo-grid">
            {logos.map((l, i) => (
              <div className="logo-card" key={i}>
                <img src={l.image} alt={l.name} className="logo-image" />
                <h3>{l.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Download;