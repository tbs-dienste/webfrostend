
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KundeErfassen.scss";
import agb from "../Documents/AGB.pdf";

const KundeErfassen = () => {
  const [kunde, setKunde] = useState({
    firma: "",
    vorname: "",
    nachname: "",
    strasse: "",
    hausnummer: "",
    strasseHausnummer: "",
    postleitzahl: "",
    ort: "",
    land: "",
    email: "",
    mobil: "",
    geschlecht: "",
    art: ""
  });

  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [ausgewaehlteDienstleistungen, setAusgewaehlteDienstleistungen] =
    useState([""]);
  const [beschreibungen, setBeschreibungen] = useState([""]);

  const [datenschutzAkzeptiert, setDatenschutzAkzeptiert] = useState(false);

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =====================================================
     DIENSTLEISTUNGEN LADEN
  ===================================================== */

  useEffect(() => {
    const fetchDienstleistungen = async () => {
      try {
        const response = await axios.get(
          "https://tbsdigitalsolutionsbackend.onrender.com/api/dienstleistung"
        );

        setDienstleistungen(
          response.data.data || response.data || []
        );
      } catch (error) {
        console.error(
          "Fehler beim Laden der Dienstleistungen:",
          error
        );
      }
    };

    fetchDienstleistungen();
  }, []);

  /* =====================================================
     CLICK OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".kontakt-adresse-wrapper")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  /* =====================================================
     INPUT
  ===================================================== */

  const handleInputChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    if (type === "checkbox") {
      setDatenschutzAkzeptiert(checked);
      return;
    }

    setKunde((prev) => {
      const updated = {
        ...prev,
        [name]: value
      };

      if (
        name === "strasse" ||
        name === "hausnummer"
      ) {
        updated.strasseHausnummer =
          `${updated.strasse} ${updated.hausnummer}`.trim();
      }

      return updated;
    });

    if (
      name === "strasse" &&
      value.length > 3
    ) {
      fetchAddressSuggestions(value);
    } else if (name === "strasse") {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  /* =====================================================
     ADDRESS SUGGESTIONS
  ===================================================== */

  const fetchAddressSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=CH&q=${encodeURIComponent(
          query
        )}`
      );

      const data = await response.json();

      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error(
        "Adressvorschläge Fehler:",
        error
      );
    }
  };

  /* =====================================================
     ADDRESS SELECT
  ===================================================== */

  const handleSelectAddress = (suggestion) => {
    const address = suggestion.address;

    const strasse = address.road || "";
    const hausnummer = address.house_number || "";

    setKunde((prev) => ({
      ...prev,
      strasse,
      hausnummer,
      strasseHausnummer:
        `${strasse} ${hausnummer}`.trim(),
      postleitzahl: address.postcode || "",
      ort:
        address.city ||
        address.town ||
        address.village ||
        "",
      land: address.country || ""
    }));

    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  /* =====================================================
     DIENSTLEISTUNG ÄNDERN
  ===================================================== */

  const handleDienstleistungChange = (
    index,
    value
  ) => {
    const dienstleistungenCopy = [
      ...ausgewaehlteDienstleistungen
    ];

    dienstleistungenCopy[index] = value;

    setAusgewaehlteDienstleistungen(
      dienstleistungenCopy
    );

    const beschreibungenCopy = [
      ...beschreibungen
    ];

    beschreibungenCopy[index] = "";

    setBeschreibungen(
      beschreibungenCopy
    );
  };

  /* =====================================================
     BESCHREIBUNG
  ===================================================== */

  const handleBeschreibungChange = (
    index,
    value
  ) => {
    const copy = [...beschreibungen];

    copy[index] = value;

    setBeschreibungen(copy);
  };

  /* =====================================================
     WEITERE DIENSTLEISTUNG
  ===================================================== */

  const handleAddDienstleistung = () => {
    setAusgewaehlteDienstleistungen([
      ...ausgewaehlteDienstleistungen,
      ""
    ]);

    setBeschreibungen([
      ...beschreibungen,
      ""
    ]);
  };

  /* =====================================================
     KUNDE ERFASSEN
  ===================================================== */

  const handleKundeErfassen = async () => {
    if (isSubmitting) return;

    if (
      !kunde.vorname ||
      !kunde.nachname ||
      !kunde.email ||
      !kunde.mobil ||
      !datenschutzAkzeptiert ||
      ausgewaehlteDienstleistungen.length === 0 ||
      !ausgewaehlteDienstleistungen[0]
    ) {
      alert(
        "Bitte alle Pflichtfelder ausfüllen und AGB akzeptieren."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const ipResponse = await axios.get(
        "https://api.ipify.org?format=json"
      );

      const ip_adresse =
        ipResponse.data.ip;

      const newKunde = {
        ...kunde,

        ip_adresse,

        dienstleistungen:
          ausgewaehlteDienstleistungen
            .filter((dienstleistungsId) =>
              dienstleistungsId
            )
            .map(
              (dienstleistungsId, index) => ({
                dienstleistungsId:
                  parseInt(
                    dienstleistungsId,
                    10
                  ),

                beschreibung:
                  beschreibungen[index] || ""
              })
            )
      };

      await axios.post(
        "https://tbsdigitalsolutionsbackend.onrender.com/api/kunden",
        newKunde
      );

      window.location.href =
        "/dankesnachricht";
    } catch (error) {
      console.error(error);

      alert(
        "Fehler beim Erfassen der Kundendaten."
      );

      setIsSubmitting(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="kunde-erfassen">

      {/* =================================================
          INTRO
      ================================================= */}

      <section className="kontakt-intro">

        <div className="kontakt-intro-top">
          <span className="kontakt-intro-label">
            TBS SOLUTIONS / KONTAKT
          </span>

          <span className="kontakt-intro-number">
            01
          </span>
        </div>

        <div className="kontakt-intro-content">

          <div>
            <h2>
              Lassen Sie uns
              <br />
              <span>sprechen.</span>
            </h2>
          </div>

          <div className="kontakt-intro-description">
            <p>
              Erzählen Sie uns von Ihrem Anliegen,
              Ihrer Idee oder Ihrem Projekt.
            </p>

            <p>
              Wir melden uns persönlich bei Ihnen
              und besprechen gemeinsam die nächsten
              Schritte.
            </p>
          </div>

        </div>
      </section>


      {/* =================================================
          FORMULAR
      ================================================= */}

      <section className="kontakt-formular">

        <div className="kontakt-formular-header">

          <div>
            <span>
              KONTAKTFORMULAR
            </span>

            <h3>
              Ihre Angaben
            </h3>
          </div>

          <p>
            Die mitgeteilten Informationen werden
            vertraulich behandelt.
          </p>

        </div>


        <div className="formular">

          {/* =============================================
              PERSON
          ============================================= */}

          <section className="formular-bereich">

            <div className="formular-bereich-kopf">

              <span className="formular-bereich-nummer">
                02
              </span>

              <div>
                <h4>
                  Persönliche Angaben
                </h4>

                <p>
                  Teilen Sie uns mit, mit wem wir
                  Kontakt aufnehmen dürfen.
                </p>
              </div>

            </div>


            {/* KUNDENTYP / GESCHLECHT */}

            <div className="flex-row">

              <div className="radio-gruppe">

                <span>
                  Kundentyp
                </span>

                <label>
                  <input
                    type="radio"
                    name="art"
                    value="privat"
                    checked={
                      kunde.art === "privat"
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  Privatkunde
                </label>

                <label>
                  <input
                    type="radio"
                    name="art"
                    value="geschäft"
                    checked={
                      kunde.art === "geschäft"
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  Geschäftskunde
                </label>

              </div>


              <div className="radio-gruppe">

                <span>
                  Geschlecht
                </span>

                <label>
                  <input
                    type="radio"
                    name="geschlecht"
                    value="männlich"
                    checked={
                      kunde.geschlecht ===
                      "männlich"
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  Männlich
                </label>

                <label>
                  <input
                    type="radio"
                    name="geschlecht"
                    value="weiblich"
                    checked={
                      kunde.geschlecht ===
                      "weiblich"
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  Weiblich
                </label>

              </div>

            </div>


            {/* FIRMA */}

            {kunde.art === "geschäft" && (
              <div className="input-gruppe kontakt-firma">

                <label>
                  Firma
                </label>

                <input
                  type="text"
                  name="firma"
                  value={kunde.firma}
                  onChange={
                    handleInputChange
                  }
                />

              </div>
            )}


            {/* NAME */}

            <div className="flex-row">

              <div className="input-gruppe">

                <label>
                  Vorname *
                </label>

                <input
                  type="text"
                  name="vorname"
                  value={kunde.vorname}
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>


              <div className="input-gruppe">

                <label>
                  Nachname *
                </label>

                <input
                  type="text"
                  name="nachname"
                  value={kunde.nachname}
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

            </div>

          </section>


          {/* =============================================
              ADRESSE
          ============================================= */}

          <section className="formular-bereich">

            <div className="formular-bereich-kopf">

              <span className="formular-bereich-nummer">
                03
              </span>

              <div>
                <h4>
                  Adresse
                </h4>

                <p>
                  Ihre Anschrift für die weitere
                  Kontaktaufnahme und Abwicklung.
                </p>
              </div>

            </div>


            <div className="flex-row kontakt-adresse-wrapper">

              <div className="input-gruppe">

                <label>
                  Straße
                </label>

                <input
                  type="text"
                  name="strasse"
                  value={kunde.strasse}
                  onChange={
                    handleInputChange
                  }
                  autoComplete="off"
                />

                {showSuggestions &&
                  addressSuggestions.length >
                    0 && (

                    <ul className="adress-vorschlaege">

                      {Array.from(
                        new Set(
                          addressSuggestions.map(
                            (address) =>
                              address.display_name
                          )
                        )
                      ).map(
                        (
                          displayName,
                          index
                        ) => {

                          const suggestion =
                            addressSuggestions.find(
                              (address) =>
                                address.display_name ===
                                displayName
                            );

                          const address =
                            suggestion.address;

                          return (
                            <li
                              key={index}
                              onClick={() =>
                                handleSelectAddress(
                                  suggestion
                                )
                              }
                            >
                              {address.road || ""}{" "}
                              {address.house_number ||
                                ""}

                              {", "}

                              {address.postcode ||
                                ""}{" "}

                              {address.city ||
                                address.town ||
                                address.village ||
                                ""}
                            </li>
                          );
                        }
                      )}

                    </ul>
                  )}

              </div>


              <div className="input-gruppe">

                <label>
                  Hausnummer
                </label>

                <input
                  type="text"
                  name="hausnummer"
                  value={
                    kunde.hausnummer
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

            </div>


            <div className="flex-row">

              <div className="input-gruppe">

                <label>
                  Postleitzahl
                </label>

                <input
                  type="text"
                  name="postleitzahl"
                  value={
                    kunde.postleitzahl
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              <div className="input-gruppe">

                <label>
                  Ort
                </label>

                <input
                  type="text"
                  name="ort"
                  value={kunde.ort}
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              <div className="input-gruppe">

                <label>
                  Land
                </label>

                <input
                  type="text"
                  name="land"
                  value={kunde.land}
                  onChange={
                    handleInputChange
                  }
                />

              </div>

            </div>

          </section>


          {/* =============================================
              KONTAKT
          ============================================= */}

          <section className="formular-bereich">

            <div className="formular-bereich-kopf">

              <span className="formular-bereich-nummer">
                04
              </span>

              <div>
                <h4>
                  Kontaktdaten
                </h4>

                <p>
                  Damit wir Sie zuverlässig erreichen
                  können.
                </p>
              </div>

            </div>


            <div className="flex-row">

              <div className="input-gruppe">

                <label>
                  E-Mail *
                </label>

                <input
                  type="email"
                  name="email"
                  value={kunde.email}
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>


              <div className="input-gruppe">

                <label>
                  Mobil *
                </label>

                <input
                  type="tel"
                  name="mobil"
                  value={kunde.mobil}
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

            </div>

          </section>


          {/* =============================================
              DIENSTLEISTUNGEN
          ============================================= */}

          <section className="formular-bereich">

            <div className="formular-bereich-kopf">

              <span className="formular-bereich-nummer">
                05
              </span>

              <div>
                <h4>
                  Ihr Anliegen
                </h4>

                <p>
                  Wählen Sie die gewünschte
                  Dienstleistung und beschreiben Sie
                  Ihr Vorhaben.
                </p>
              </div>

            </div>


            <div className="dienstleistungen-bereich">

              <label>
                Gewünschte Dienstleistungen
              </label>

              {ausgewaehlteDienstleistungen.map(
                (dienstleistung, index) => (

                  <div
                    className="dienstleistung-gruppe"
                    key={index}
                  >

                    <select
                      value={
                        dienstleistung
                      }
                      onChange={(event) =>
                        handleDienstleistungChange(
                          index,
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        Dienstleistung auswählen
                      </option>

                      {dienstleistungen.map(
                        (service) => (
                          <option
                            key={service.id}
                            value={service.id}
                          >
                            {service.title}
                          </option>
                        )
                      )}

                    </select>


                    <textarea
                      placeholder="Beschreiben Sie kurz Ihr Anliegen oder Ihre Vorstellungen ..."
                      value={
                        beschreibungen[index]
                      }
                      onChange={(event) =>
                        handleBeschreibungChange(
                          index,
                          event.target.value
                        )
                      }
                    />

                  </div>

                )
              )}


              <button
                type="button"
                className="add-dienstleistung-button"
                onClick={
                  handleAddDienstleistung
                }
              >
                + Weitere Dienstleistung
              </button>

            </div>

          </section>


          {/* =============================================
              AGB
          ============================================= */}

          <section className="formular-bereich formular-abschluss">

            <div className="formular-bereich-kopf">

              <span className="formular-bereich-nummer">
                06
              </span>

              <div>
                <h4>
                  Abschluss
                </h4>

                <p>
                  Prüfen Sie Ihre Angaben und senden
                  Sie Ihre Anfrage anschliessend ab.
                </p>
              </div>

            </div>


            <div className="checkbox-gruppe">

              <input
                type="checkbox"
                id="datenschutzAkzeptiert"
                checked={
                  datenschutzAkzeptiert
                }
                onChange={
                  handleInputChange
                }
              />

              <label htmlFor="datenschutzAkzeptiert">

                Ich akzeptiere die{" "}

                <a
                  href={agb}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGB
                </a>

                .

              </label>

            </div>


            <button
              className="submit-button"
              onClick={
                handleKundeErfassen
              }
              disabled={isSubmitting}
            >

              <span>
                {isSubmitting
                  ? "Anfrage wird gesendet ..."
                  : "Kontakt aufnehmen"}
              </span>

              {!isSubmitting && (
                <span className="submit-arrow">
                  →
                </span>
              )}

            </button>

          </section>

        </div>

      </section>

    </main>
  );
};

export default KundeErfassen;

