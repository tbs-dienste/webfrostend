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
  FaFolderOpen,
  FaCheck,
  FaBalanceScale,
  FaCalculator,
  FaFileAlt,
  FaPenNib,
} from "react-icons/fa";

import Arbeitsvertrag from "./Arbeitsvertrag.docx";
import Unternehmensrichtlinien from "./Unternehmensrichtlinien.pdf";
import Datenschutzrichtlinien from "./Datenschutzrichtlinien.pdf";
import KündigungWord from "./Kündigung.docx";
import Kündigung from "./Kündigung.pdf";

import Besprechungsprotokoll from "./Besprechungsprotokoll_Kundentermin_Professional.docx";
import NotizpapierVorlage from "./Notizpapier.docx";

import Einnahmebeleg from "./Einnahmebeleg.pdf";
import EinnahmebelegWord from "./Einnahmebeleg.docx";

import Ausgabebeleg from "./Einnahmebeleg.pdf";
import AusgabebelegWord from "./Einnahmebeleg.docx";

import Spesenformular from "./Spesenformular.pdf";
import SpesenformularWord from "./Spesenformular.docx";

import Weiterbildungsantrag from "./Einnahmebeleg.pdf";
import WeiterbildungsantragWord from "./Einnahmebeleg.docx";

import LogoDark from "./Logo_black.png";
import LogoLight from "./Logo_white.png";

import "./Download.scss";

const Download = () => {
  const [openSection, setOpenSection] = useState("company");

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section ? "" : section
    );
  };

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Download fehlgeschlagen");
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("Fehler beim Download:", error);
      alert("Der Download konnte nicht durchgeführt werden.");
    }
  };

  const documentSections = [
    {
      key: "company",
      number: "01",
      title: "Unternehmen & Recht",
      description:
        "Grundlegende Unternehmensunterlagen, Richtlinien und rechtliche Dokumente.",
      icon: <FaBuilding />,
      documents: [
        {
          name: "Unternehmensrichtlinien",
          url: Unternehmensrichtlinien,
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Unternehmen",
          description:
            "Interne Richtlinien und verbindliche Grundlagen für TBS Solutions.",
        },
        {
          name: "Datenschutzrichtlinien",
          url: Datenschutzrichtlinien,
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Datenschutz",
          description:
            "Dokumentation der internen Datenschutzgrundlagen.",
        },
        {
          name: "Handelsregisterauszug",
          url: "/docs/Handelsregisterauszug.pdf",
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Recht",
          description:
            "Offizieller Auszug aus dem Handelsregister.",
        },
        {
          name: "Versicherungsnachweis",
          url: "/docs/Versicherungsnachweis.pdf",
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Recht",
          description:
            "Nachweis der relevanten Unternehmensversicherungen.",
        },
        {
          name: "Bankverbindung",
          url: "/docs/Bankverbindung.docx",
          icon: <FaFileWord />,
          type: "Word",
          category: "Unternehmen",
          description:
            "Dokument mit den hinterlegten Unternehmensdaten.",
        },
      ],
    },

    {
      key: "hr",
      number: "02",
      title: "Personal & HR",
      description:
        "Unterlagen rund um Arbeitsverhältnisse, Personalverwaltung und Mitarbeitende.",
      icon: <FaUsers />,
      documents: [
        {
          name: "Arbeitsvertrag",
          url: Arbeitsvertrag,
          icon: <FaFileWord />,
          type: "Word",
          category: "Arbeitsverhältnis",
          description:
            "Vorlage für die vertragliche Regelung eines Arbeitsverhältnisses.",
        },
        {
          name: "Kündigung Word",
          url: KündigungWord,
          icon: <FaFileWord />,
          type: "Word",
          category: "Personal",
          description:
            "Kündigungsvorlage zur Bearbeitung in Word.",
        },
        {
          name: "Kündigung PDF",
          url: Kündigung,
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Personal",
          description:
            "Kündigungsvorlage im PDF-Format.",
        },
        {
          name: "Spesenformular",
          url: Spesenformular,
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Mitarbeitende",
          description:
            "Formular zur Erfassung und Abrechnung von Spesen.",
        },
        {
          name: "Spesenformular Word",
          url: SpesenformularWord,
          icon: <FaFileWord />,
          type: "Word",
          category: "Mitarbeitende",
          description:
            "Bearbeitbare Version des Spesenformulars.",
        },
        {
          name: "Weiterbildungsantrag",
          url: Weiterbildungsantrag,
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Weiterbildung",
          description:
            "Antrag zur Planung und Genehmigung einer Weiterbildung.",
        },
        {
          name: "Weiterbildungsantrag Word",
          url: WeiterbildungsantragWord,
          icon: <FaFileWord />,
          type: "Word",
          category: "Weiterbildung",
          description:
            "Bearbeitbare Version des Weiterbildungsantrags.",
        },
      ],
    },

    {
      key: "finance",
      number: "03",
      title: "Finanzen & Buchhaltung",
      description:
        "Formulare und Unterlagen für die laufende finanzielle Administration.",
      icon: <FaCalculator />,
      documents: [
        {
          name: "Einnahmebeleg",
          url: Einnahmebeleg,
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Einnahmen",
          description:
            "Formular zur Erfassung von Einnahmen und Belegen.",
        },
        {
          name: "Einnahmebeleg Word",
          url: EinnahmebelegWord,
          icon: <FaFileWord />,
          type: "Word",
          category: "Einnahmen",
          description:
            "Bearbeitbare Version des Einnahmebelegs.",
        },
        {
          name: "Ausgabebeleg",
          url: Ausgabebeleg,
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Ausgaben",
          description:
            "Formular zur Erfassung von geschäftlichen Ausgaben.",
        },
        {
          name: "Ausgabebeleg Word",
          url: AusgabebelegWord,
          icon: <FaFileWord />,
          type: "Word",
          category: "Ausgaben",
          description:
            "Bearbeitbare Version des Ausgabebelegs.",
        },
        {
          name: "Steuerunterlagen",
          url: "/docs/Steuerunterlagen.pdf",
          icon: <FaFilePdf />,
          type: "PDF",
          category: "Steuern",
          description:
            "Unterlagen für steuerliche und buchhalterische Angelegenheiten.",
        },
      ],
    },

    {
      key: "work",
      number: "04",
      title: "Arbeitsvorlagen",
      description:
        "Wiederverwendbare Dokumente für Besprechungen, Notizen und tägliche Abläufe.",
      icon: <FaBriefcase />,
      documents: [
        {
          name: "Besprechungsprotokoll",
          url: Besprechungsprotokoll,
          icon: <FaFileWord />,
          type: "Word",
          category: "Besprechungen",
          description:
            "Professionelle Vorlage zur Dokumentation von Besprechungen.",
        },
        {
          name: "Notizpapier",
          url: NotizpapierVorlage,
          icon: <FaFileWord />,
          type: "Word",
          category: "Dokumentation",
          description:
            "TBS Notizpapier für interne Notizen und Dokumentationen.",
        },
      ],
    },
  ];

  const marketingDocs = [
    {
      number: "01",
      name: "Social Media Guidelines",
      description:
        "Richtlinien für einen einheitlichen Auftritt auf Social-Media-Kanälen.",
    },
    {
      number: "02",
      name: "Brand Voice",
      description:
        "Grundlagen für einen einheitlichen und professionellen Kommunikationsstil.",
    },
    {
      number: "03",
      name: "Marketing Strategie",
      description:
        "Grundlagen und strategische Ausrichtung der TBS-Kommunikation.",
    },
    {
      number: "04",
      name: "Pressemappe",
      description:
        "Zentrale Informationen für externe Kommunikation und Medienkontakte.",
    },
  ];

  const colors = [
    {
      name: "Primary Blue",
      hex: "#2563eb",
      usage: "Primärfarbe",
    },
    {
      name: "Dark Navy",
      hex: "#0f172a",
      usage: "Navigation & Header",
    },
    {
      name: "Accent Purple",
      hex: "#7c3aed",
      usage: "Akzentfarbe",
    },
    {
      name: "Soft Gray",
      hex: "#e5e7eb",
      usage: "Flächen & Linien",
    },
    {
      name: "Success Green",
      hex: "#16a34a",
      usage: "Status & Erfolg",
    },
  ];

  const logos = [
    {
      name: "Dark Logo",
      image: LogoDark,
      format: "Für helle Hintergründe",
      description:
        "Dunkle TBS Solutions Logo-Variante für helle Flächen.",
    },
    {
      name: "Light Logo",
      image: LogoLight,
      format: "Für dunkle Hintergründe",
      description:
        "Helle TBS Solutions Logo-Variante für dunkle Flächen.",
    },
  ];

  const totalDocuments = documentSections.reduce(
    (total, section) => total + section.documents.length,
    0
  );

  return (
    <main className="download-page">

      {/* =========================
          HERO
      ========================= */}

      <header className="download-hero">

        <div className="hero-main">

          <div className="hero-kicker">
            <span className="hero-kicker-icon">
              <FaFolderOpen />
            </span>

            <span>INTERNE RESSOURCEN</span>
          </div>

          <h1>
            TBS
            <span> Resource Center</span>
          </h1>

          <p>
            Alle wichtigen Unternehmensdokumente, Vorlagen und
            Markenressourcen zentral an einem Ort.
          </p>

        </div>

        <div className="hero-information">

          <div className="hero-status">
            <span className="status-icon">
              <FaCheck />
            </span>

            <div>
              <strong>Zentral verfügbar</strong>
              <span>Interne Dokumentenablage</span>
            </div>
          </div>

          <div className="hero-count">
            <strong>{String(totalDocuments).padStart(2, "0")}</strong>
            <span>Dokumente</span>
          </div>

        </div>

      </header>


      {/* =========================
          RESOURCE NAVIGATION
      ========================= */}

      <section className="resource-intro">

        <div className="resource-intro-label">
          <span>RESSOURCEN</span>
        </div>

        <div className="resource-intro-content">

          <h2>
            Alles, was intern
            <span> benötigt wird.</span>
          </h2>

          <p>
            Dokumente und Ressourcen sind nach ihrem tatsächlichen
            Einsatzbereich organisiert. So bleiben wichtige Unterlagen
            schnell auffindbar und sauber getrennt.
          </p>

        </div>

      </section>


      {/* =========================
          DOCUMENT SECTIONS
      ========================= */}

      <div className="download-sections">

        {documentSections.map((section) => {

          const isOpen = openSection === section.key;

          return (
            <section
              className={`resource-section ${
                isOpen ? "is-open" : ""
              }`}
              key={section.key}
            >

              <button
                type="button"
                className="resource-header"
                onClick={() => toggleSection(section.key)}
                aria-expanded={isOpen}
              >

                <div className="resource-number">
                  {section.number}
                </div>

                <div className="resource-icon">
                  {section.icon}
                </div>

                <div className="resource-heading">

                  <h2>
                    {section.title}
                  </h2>

                  <p>
                    {section.description}
                  </p>

                </div>

                <div className="resource-meta">

                  <span>
                    {String(section.documents.length).padStart(2, "0")}{" "}
                    Dateien
                  </span>

                  <span
                    className={`resource-arrow ${
                      isOpen ? "rotate" : ""
                    }`}
                  >
                    <FaChevronDown />
                  </span>

                </div>

              </button>


              {isOpen && (

                <div className="resource-content">

                  {section.documents.map((document, index) => (

                    <article
                      className="document-item"
                      key={`${document.name}-${index}`}
                    >

                      <div className="document-index">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="document-type-icon">
                        {document.icon}
                      </div>

                      <div className="document-information">

                        <div className="document-heading">

                          <h3>
                            {document.name}
                          </h3>

                          <span className="document-format">
                            {document.type}
                          </span>

                        </div>

                        <p>
                          {document.description}
                        </p>

                        <span className="document-category">
                          {document.category}
                        </span>

                      </div>

                      <button
                        type="button"
                        className="document-download"
                        onClick={() =>
                          handleDownload(
                            document.url,
                            document.name
                          )
                        }
                      >
                        <FaDownload />
                        <span>Download</span>
                      </button>

                    </article>

                  ))}

                </div>

              )}

            </section>
          );

        })}


        {/* =========================
            MARKETING
        ========================= */}

        <section
          className={`resource-section ${
            openSection === "marketing" ? "is-open" : ""
          }`}
        >

          <button
            type="button"
            className="resource-header"
            onClick={() => toggleSection("marketing")}
            aria-expanded={openSection === "marketing"}
          >

            <div className="resource-number">
              05
            </div>

            <div className="resource-icon">
              <FaBullhorn />
            </div>

            <div className="resource-heading">

              <h2>
                Marketing & Kommunikation
              </h2>

              <p>
                Grundlagen für Kommunikation, Marketing und
                den öffentlichen Markenauftritt.
              </p>

            </div>

            <div className="resource-meta">

              <span>
                {String(marketingDocs.length).padStart(2, "0")} Dateien
              </span>

              <span
                className={`resource-arrow ${
                  openSection === "marketing" ? "rotate" : ""
                }`}
              >
                <FaChevronDown />
              </span>

            </div>

          </button>


          {openSection === "marketing" && (

            <div className="marketing-content">

              {marketingDocs.map((item) => (

                <article
                  className="marketing-item"
                  key={item.name}
                >

                  <span className="marketing-number">
                    {item.number}
                  </span>

                  <div className="marketing-information">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.description}
                    </p>

                  </div>

                  <FaBullhorn className="marketing-icon" />

                </article>

              ))}

            </div>

          )}

        </section>


        {/* =========================
            BRAND
        ========================= */}

        <section
          className={`resource-section ${
            openSection === "brand" ? "is-open" : ""
          }`}
        >

          <button
            type="button"
            className="resource-header"
            onClick={() => toggleSection("brand")}
            aria-expanded={openSection === "brand"}
          >

            <div className="resource-number">
              06
            </div>

            <div className="resource-icon">
              <FaPalette />
            </div>

            <div className="resource-heading">

              <h2>
                Marke & Design
              </h2>

              <p>
                TBS Markenfarben und offizielle Logo-Ressourcen
                für digitale Anwendungen.
              </p>

            </div>

            <div className="resource-meta">

              <span>
                Farben & Logos
              </span>

              <span
                className={`resource-arrow ${
                  openSection === "brand" ? "rotate" : ""
                }`}
              >
                <FaChevronDown />
              </span>

            </div>

          </button>


          {openSection === "brand" && (

            <div className="brand-content">

              {/* Farben */}

              <div className="brand-block">

                <div className="brand-block-heading">

                  <div>
                    <span>01</span>
                    <h3>Farben</h3>
                  </div>

                  <p>
                    Definierte Farben für die visuelle
                    TBS-Kommunikation.
                  </p>

                </div>

                <div className="colors-list">

                  {colors.map((color) => (

                    <article
                      className="color-item"
                      key={color.hex}
                    >

                      <div
                        className="color-swatch"
                        style={{
                          backgroundColor: color.hex,
                        }}
                      />

                      <div className="color-information">

                        <strong>
                          {color.name}
                        </strong>

                        <span>
                          {color.hex}
                        </span>

                        <small>
                          {color.usage}
                        </small>

                      </div>

                    </article>

                  ))}

                </div>

              </div>


              {/* Logos */}

              <div className="brand-block">

                <div className="brand-block-heading">

                  <div>
                    <span>02</span>
                    <h3>Logos</h3>
                  </div>

                  <p>
                    Offizielle Logo-Varianten für helle und
                    dunkle Anwendungen.
                  </p>

                </div>

                <div className="logos-list">

                  {logos.map((logo) => (

                    <article
                      className="logo-item"
                      key={logo.name}
                    >

                      <div className="logo-preview">

                        <img
                          src={logo.image}
                          alt={logo.name}
                          className="logo-image"
                        />

                      </div>

                      <div className="logo-information">

                        <div className="logo-title">
                          <h3>
                            {logo.name}
                          </h3>

                          <span>
                            PNG
                          </span>
                        </div>

                        <strong>
                          {logo.format}
                        </strong>

                        <p>
                          {logo.description}
                        </p>

                      </div>

                    </article>

                  ))}

                </div>

              </div>

            </div>

          )}

        </section>

      </div>


      {/* =========================
          FOOTER INFORMATION
      ========================= */}

      <footer className="download-footer">

        <div className="footer-icon">
          <FaCheck />
        </div>

        <div>
          <strong>
            TBS Resource Center
          </strong>

          <p>
            Interne Dokumente und Ressourcen zentral verwaltet.
          </p>
        </div>

      </footer>

    </main>
  );
};

export default Download;