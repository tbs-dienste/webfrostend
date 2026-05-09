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
} from "react-icons/fa";

import Arbeitsvertrag from "./Arbeitsvertrag.docx";
import Unternehmensrichtlinien from "./Unternehmensrichtlinien.pdf";
import Datenschutzrichtlinien from "./Datenschutzrichtlinien.pdf";
import KündigungWord from "./Kündigung.docx";
import Kündigung from "./Kündigung.pdf";

import LogoDark from "./Logo_black.png";
import LogoLight from "./Logo_white.png";

import "./Download.scss";

function Download() {
  const [openDocs, setOpenDocs] = useState(true);
  const [openMarketing, setOpenMarketing] = useState(false);
  const [openColors, setOpenColors] = useState(false);
  const [openLogos, setOpenLogos] = useState(false);

  const documents = [
    {
      category: "Mitarbeiter",
      name: "Arbeitsvertrag",
      url: Arbeitsvertrag,
      icon: <FaFileWord />,
      type: "Word",
      description: "Offizieller Arbeitsvertrag.",
    },
    {
      category: "Unternehmen",
      name: "Unternehmensrichtlinien",
      url: Unternehmensrichtlinien,
      icon: <FaFilePdf />,
      type: "PDF",
      description: "Interne Unternehmensrichtlinien.",
    },
    {
      category: "Datenschutz",
      name: "Datenschutzrichtlinien",
      url: Datenschutzrichtlinien,
      icon: <FaFilePdf />,
      type: "PDF",
      description: "Datenschutz & DSGVO.",
    },
    {
      category: "HR",
      name: "Kündigung Word",
      url: KündigungWord,
      icon: <FaFileWord />,
      type: "Word",
      description: "Kündigung als Word-Datei.",
    },
    {
      category: "HR",
      name: "Kündigung PDF",
      url: Kündigung,
      icon: <FaFilePdf />,
      type: "PDF",
      description: "Kündigung als PDF-Datei.",
    },
  ];

  const marketingDocs = [
    {
      name: "Social Media Guidelines",
      description: "Richtlinien für Instagram, TikTok & LinkedIn.",
    },
    {
      name: "Brand Voice",
      description: "Kommunikationsstil des Startups.",
    },
    {
      name: "Marketing Strategie",
      description: "Marketing- und Kampagnenstrategie.",
    },
    {
      name: "Pressemappe",
      description: "Texte & Medieninformationen.",
    },
  ];

  const startupColors = [
    { name: "Primary Blue", hex: "#2563eb" },
    { name: "Dark Navy", hex: "#0f172a" },
    { name: "Accent Purple", hex: "#7c3aed" },
    { name: "Soft Gray", hex: "#e5e7eb" },
    { name: "Success Green", hex: "#16a34a" },
  ];

  const logos = [
    {
      name: "Dark Logo",
      image: LogoDark,
    },
    {
      name: "Light Logo",
      image: LogoLight,
    },
   
  ];

  const handleDownload = (url, fileName) => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Download fehlgeschlagen");
        }
      })
      .then((blob) => {
        const fileUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(() => {
        alert("Fehler beim Download!");
      });
  };

  return (
    <div className="download-page">

      <div className="hero">
        <h1>Startup Brand & Mitarbeiter Center</h1>
        <p>
          Alle wichtigen Dokumente, Branding-Ressourcen,
          Marketingunterlagen und Logos zentral an einem Ort.
        </p>
      </div>

      {/* DOKUMENTE */}
      <div className="dropdown-section">
        <button
          className="dropdown-header"
          onClick={() => setOpenDocs(!openDocs)}
        >
          <span>
            <FaBriefcase /> Mitarbeiter & Arbeitsalltag
          </span>

          <FaChevronDown
            className={openDocs ? "rotate" : ""}
          />
        </button>

        {openDocs && (
          <div className="dropdown-content">

            {documents.map((doc, index) => (
              <div className="doc-card" key={index}>

                <div className="doc-icon">
                  {doc.icon}
                </div>

                <div className="doc-info">
                  <h3>{doc.name}</h3>
                  <p>{doc.description}</p>

                  <span className="doc-type">
                    {doc.category} • {doc.type}
                  </span>
                </div>

                <button
                  className="download-btn"
                  onClick={() =>
                    handleDownload(doc.url, doc.name)
                  }
                >
                  <FaDownload />
                  Download
                </button>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* MARKETING */}
      <div className="dropdown-section">
        <button
          className="dropdown-header"
          onClick={() => setOpenMarketing(!openMarketing)}
        >
          <span>
            <FaBullhorn /> Marketing & Kommunikation
          </span>

          <FaChevronDown
            className={openMarketing ? "rotate" : ""}
          />
        </button>

        {openMarketing && (
          <div className="dropdown-content grid">

            {marketingDocs.map((item, index) => (
              <div className="marketing-card" key={index}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* FARBEN */}
      <div className="dropdown-section">
        <button
          className="dropdown-header"
          onClick={() => setOpenColors(!openColors)}
        >
          <span>
            <FaPalette /> Startup Farben
          </span>

          <FaChevronDown
            className={openColors ? "rotate" : ""}
          />
        </button>

        {openColors && (
          <div className="colors-grid">

            {startupColors.map((color, index) => (
              <div className="color-card" key={index}>

                <div
                  className="color-preview"
                  style={{ background: color.hex }}
                />

                <h4>{color.name}</h4>
                <p>{color.hex}</p>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* LOGOS */}
      <div className="dropdown-section">
        <button
          className="dropdown-header"
          onClick={() => setOpenLogos(!openLogos)}
        >
          <span>
            <FaUsers /> Logos & Assets
          </span>

          <FaChevronDown
            className={openLogos ? "rotate" : ""}
          />
        </button>

        {openLogos && (
          <div className="logo-grid">

            {logos.map((logo, index) => (
              <div className="logo-card" key={index}>

                <img
                  src={logo.image}
                  alt={logo.name}
                  className="logo-image"
                />

                <h3>{logo.name}</h3>

                <button
                  className="download-btn"
                  onClick={() =>
                    handleDownload(logo.image, logo.name)
                  }
                >
                  <FaDownload />
                  Logo herunterladen
                </button>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}

export default Download;