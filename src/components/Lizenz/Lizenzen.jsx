import React, { useEffect, useState } from "react";
import axios from "axios";
import './Lizenzen.scss'; // Importiere die SCSS-Datei

const Lizenzen = () => {
    const [lizenzen, setLizenzen] = useState([]);

    // Lizenzen-Daten abrufen
    useEffect(() => {
        const fetchLizenzen = async () => {
            try {
                const response = await axios.get("https://tbsdigitalsolutionsbackend.onrender.com/api/licenses");  // API-Aufruf für die Lizenzen
                setLizenzen(response.data.data);  // Setzt die Lizenzen-Daten in den State
            } catch (error) {
                console.error("Fehler beim Abrufen der Lizenzen:", error);
            }
        };

        fetchLizenzen();
    }, []);

    // Lizenz zum Warenkorb hinzufügen
    const addToCart = async (license_id) => {
        try {
            await axios.post("/api/cart", {
                license_id,
                quantity: 1  // Die Anzahl der Lizenzen, die du hinzufügen möchtest
            });
            alert("Lizenz erfolgreich zum Warenkorb hinzugefügt.");
        } catch (error) {
            console.error("Fehler beim Hinzufügen der Lizenz zum Warenkorb:", error);
        }
    };

    return (
        <div className="license-container">
            <header className="header">
                <h1>Unsere Lizenzangebote</h1>
                <p className="intro-text">
                    Entdecken Sie unsere vielfältigen Lizenzoptionen, die speziell auf Ihre Bedürfnisse zugeschnitten sind. Ob für kleine Teams oder große Unternehmen, finden Sie die passende Lizenz für Ihr Geschäft.
                </p>
                <p className="note">
                    Alle Preise verstehen sich in CHF und exklusive Mehrwertsteuer. Bei Fragen oder besonderen Anforderungen stehen wir Ihnen gerne zur Verfügung.
                </p>
            </header>

            {lizenzen.length === 0 ? (
                <p className="no-licenses">Zurzeit keine Lizenzen verfügbar. Bitte versuchen Sie es später erneut.</p>
            ) : (
                <ul className="license-list">
                    {lizenzen.map((lizenz) => (
                        <li key={lizenz.id} className="license-item">
                            <div className="license-details">
                                <h3 className="license-title">{lizenz.name}</h3>
                                <div className="license-info">
                                    <p><strong>Max. Personen:</strong> {lizenz.max_persons}</p>
                                    <p><strong>Dauer:</strong> {lizenz.duration} Monate</p>
                                    <div className="price-info">
                                        <div className="price-item">
                                            <span className="price-label">Monatlicher Preis:</span>
                                            <span className="price-value">{lizenz.monthly_price} CHF</span>
                                        </div>
                                        <div className="price-item">
                                            <span className="price-label">Jährlicher Preis:</span>
                                            <span className="price-value">{lizenz.yearly_price} CHF</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="add-to-cart-btn" onClick={() => addToCart(lizenz.id)}>
                                In den Warenkorb
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <footer className="footer">
                <p className="footer-text">
                    Vielen Dank für Ihr Interesse an unseren Lizenzen. Besuchen Sie regelmäßig unsere Website für aktuelle Angebote und Neuigkeiten.
                </p>
            </footer>
        </div>
    );
};

export default Lizenzen;
