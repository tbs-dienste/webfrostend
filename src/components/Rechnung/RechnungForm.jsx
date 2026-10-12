import React, { useMemo, useState } from "react";
import "./RechnungForm.scss";

const RechnungForm = () => {
    const [customer, setCustomer] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [invoiceDate, setInvoiceDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [dueDate, setDueDate] = useState("");
    const [paymentTerms, setPaymentTerms] = useState("30 Tage");
    const [notes, setNotes] = useState("");

    const [items, setItems] = useState([
        {
            id: Date.now(),
            description: "",
            quantity: 1,
            price: "",
            vat: 8.1,
        },
    ]);

    const addItem = () => {
        setItems((current) => [
            ...current,
            {
                id: Date.now(),
                description: "",
                quantity: 1,
                price: "",
                vat: 8.1,
            },
        ]);
    };

    const removeItem = (id) => {
        if (items.length === 1) return;

        setItems((current) => current.filter((item) => item.id !== id));
    };

    const updateItem = (id, field, value) => {
        setItems((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    };

    const totals = useMemo(() => {
        let subtotal = 0;
        let vatTotal = 0;

        items.forEach((item) => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            const vat = Number(item.vat) || 0;

            const lineTotal = quantity * price;
            const vatAmount = lineTotal * (vat / 100);

            subtotal += lineTotal;
            vatTotal += vatAmount;
        });

        return {
            subtotal,
            vatTotal,
            total: subtotal + vatTotal,
        };
    }, [items]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("de-CH", {
            style: "currency",
            currency: "CHF",
        }).format(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const invoiceData = {
            customer,
            invoiceNumber,
            invoiceDate,
            dueDate,
            paymentTerms,
            notes,
            items,
            totals,
        };

        console.log("Rechnung:", invoiceData);

        // Hier deinen bestehenden API-Aufruf einsetzen.
    };

    return (
        <main className="rechnung-page">

            {/* HEADER */}
            <header className="rechnung-hero">
                <div className="rechnung-hero-meta">
                    <span>01</span>
                    <span>RECHNUNGSWESEN</span>
                </div>

                <div className="rechnung-hero-content">
                    <div className="rechnung-hero-copy">
                        <p className="rechnung-overline">
                            Neue Rechnung
                        </p>

                        <h1>
                            Rechnung
                            <br />
                            erstellen<span>.</span>
                        </h1>

                        <p className="rechnung-hero-description">
                            Erstelle eine strukturierte und professionelle
                            Rechnung mit allen relevanten Angaben,
                            Leistungen und Zahlungsinformationen.
                        </p>
                    </div>

                    <div className="rechnung-hero-number">
                        <span>DOCUMENT</span>
                        <strong>INV</strong>
                    </div>
                </div>
            </header>

            <form
                className="rechnung-form"
                onSubmit={handleSubmit}
            >

                {/* EMPFÄNGER */}
                <section className="rechnung-section">

                    <div className="rechnung-section-heading">
                        <span className="rechnung-section-number">
                            02
                        </span>

                        <div>
                            <p className="rechnung-section-label">
                                RECHNUNGSEMPFÄNGER
                            </p>

                            <h2>
                                Für wen ist
                                <br />
                                diese Rechnung?
                            </h2>
                        </div>
                    </div>

                    <div className="rechnung-section-body">

                        <div className="rechnung-field rechnung-field-large">
                            <label htmlFor="customer">
                                Kunde / Unternehmen
                            </label>

                            <input
                                id="customer"
                                type="text"
                                value={customer}
                                onChange={(e) =>
                                    setCustomer(e.target.value)
                                }
                                placeholder="Name des Kunden oder Unternehmens"
                                required
                            />
                        </div>

                        <div className="rechnung-customer-grid">

                            <div className="rechnung-field">
                                <label htmlFor="customerAddress">
                                    Adresse
                                </label>

                                <input
                                    id="customerAddress"
                                    type="text"
                                    placeholder="Strasse und Hausnummer"
                                />
                            </div>

                            <div className="rechnung-field">
                                <label htmlFor="customerZip">
                                    PLZ / Ort
                                </label>

                                <input
                                    id="customerZip"
                                    type="text"
                                    placeholder="PLZ / Ort"
                                />
                            </div>

                        </div>

                    </div>
                </section>

                {/* RECHNUNGSDATEN */}
                <section className="rechnung-section">

                    <div className="rechnung-section-heading">
                        <span className="rechnung-section-number">
                            03
                        </span>

                        <div>
                            <p className="rechnung-section-label">
                                RECHNUNGSDATEN
                            </p>

                            <h2>
                                Die wichtigsten
                                <br />
                                Angaben.
                            </h2>
                        </div>
                    </div>

                    <div className="rechnung-section-body">

                        <div className="rechnung-data-grid">

                            <div className="rechnung-field">
                                <label htmlFor="invoiceNumber">
                                    Rechnungsnummer
                                </label>

                                <input
                                    id="invoiceNumber"
                                    type="text"
                                    value={invoiceNumber}
                                    onChange={(e) =>
                                        setInvoiceNumber(e.target.value)
                                    }
                                    placeholder="z. B. 2026-001"
                                    required
                                />
                            </div>

                            <div className="rechnung-field">
                                <label htmlFor="invoiceDate">
                                    Rechnungsdatum
                                </label>

                                <input
                                    id="invoiceDate"
                                    type="date"
                                    value={invoiceDate}
                                    onChange={(e) =>
                                        setInvoiceDate(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="rechnung-field">
                                <label htmlFor="dueDate">
                                    Fälligkeitsdatum
                                </label>

                                <input
                                    id="dueDate"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) =>
                                        setDueDate(e.target.value)
                                    }
                                />
                            </div>

                            <div className="rechnung-field">
                                <label htmlFor="paymentTerms">
                                    Zahlungsfrist
                                </label>

                                <select
                                    id="paymentTerms"
                                    value={paymentTerms}
                                    onChange={(e) =>
                                        setPaymentTerms(e.target.value)
                                    }
                                >
                                    <option value="Sofort">
                                        Sofort
                                    </option>

                                    <option value="10 Tage">
                                        10 Tage
                                    </option>

                                    <option value="30 Tage">
                                        30 Tage
                                    </option>

                                    <option value="60 Tage">
                                        60 Tage
                                    </option>
                                </select>
                            </div>

                        </div>

                    </div>
                </section>

                {/* LEISTUNGEN */}
                <section className="rechnung-section rechnung-items-section">

                    <div className="rechnung-section-heading">
                        <span className="rechnung-section-number">
                            04
                        </span>

                        <div>
                            <p className="rechnung-section-label">
                                LEISTUNGEN
                            </p>

                            <h2>
                                Was wird
                                <br />
                                verrechnet?
                            </h2>
                        </div>
                    </div>

                    <div className="rechnung-section-body">

                        <div className="rechnung-items-header">
                            <span>POSITION</span>
                            <span>MENGE</span>
                            <span>PREIS</span>
                            <span>MWST.</span>
                            <span>TOTAL</span>
                            <span></span>
                        </div>

                        <div className="rechnung-items">

                            {items.map((item, index) => {

                                const lineTotal =
                                    (Number(item.quantity) || 0) *
                                    (Number(item.price) || 0);

                                return (
                                    <div
                                        className="rechnung-item"
                                        key={item.id}
                                    >

                                        <div className="rechnung-item-position">
                                            <span className="rechnung-item-number">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Leistung oder Produkt"
                                                required
                                            />
                                        </div>

                                        <div className="rechnung-item-input">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="rechnung-item-input">
                                            <div className="rechnung-input-prefix">
                                                <span>CHF</span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="rechnung-item-input">
                                            <select
                                                value={item.vat}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "vat",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="8.1">
                                                    8.1%
                                                </option>

                                                <option value="2.6">
                                                    2.6%
                                                </option>

                                                <option value="3.8">
                                                    3.8%
                                                </option>

                                                <option value="0">
                                                    0%
                                                </option>
                                            </select>
                                        </div>

                                        <div className="rechnung-item-total">
                                            {formatCurrency(lineTotal)}
                                        </div>

                                        <button
                                            type="button"
                                            className="rechnung-remove"
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                            aria-label="Position entfernen"
                                        >
                                            ×
                                        </button>

                                    </div>
                                );
                            })}

                        </div>

                        <button
                            type="button"
                            className="rechnung-add-item"
                            onClick={addItem}
                        >
                            <span>+</span>
                            Weitere Position hinzufügen
                        </button>

                    </div>
                </section>

                {/* ZUSAMMENFASSUNG */}
                <section className="rechnung-section rechnung-summary-section">

                    <div className="rechnung-section-heading">
                        <span className="rechnung-section-number">
                            05
                        </span>

                        <div>
                            <p className="rechnung-section-label">
                                ZUSAMMENFASSUNG
                            </p>

                            <h2>
                                Der finale
                                <br />
                                Rechnungsbetrag.
                            </h2>
                        </div>
                    </div>

                    <div className="rechnung-section-body">

                        <div className="rechnung-summary-layout">

                            <div className="rechnung-notes">
                                <label htmlFor="notes">
                                    Bemerkungen
                                </label>

                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(e.target.value)
                                    }
                                    placeholder="Optionale Bemerkungen zur Rechnung..."
                                />

                                <p>
                                    Bitte überprüfe alle Angaben vor
                                    dem Speichern der Rechnung.
                                </p>
                            </div>

                            <div className="rechnung-totals">

                                <div className="rechnung-total-row">
                                    <span>
                                        Zwischensumme
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            totals.subtotal
                                        )}
                                    </strong>
                                </div>

                                <div className="rechnung-total-row">
                                    <span>
                                        Mehrwertsteuer
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            totals.vatTotal
                                        )}
                                    </strong>
                                </div>

                                <div className="rechnung-total-final">
                                    <span>
                                        TOTAL
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            totals.total
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>
                </section>

                {/* ABSCHLUSS */}
                <section className="rechnung-final-section">

                    <div className="rechnung-final-content">

                        <div>
                            <span className="rechnung-final-label">
                                06 — ABSCHLUSS
                            </span>

                            <h2>
                                Rechnung
                                <br />
                                speichern<span>.</span>
                            </h2>

                            <p>
                                Die Rechnung wird mit den oben
                                eingegebenen Angaben erstellt.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="rechnung-submit"
                        >
                            <span>Rechnung speichern</span>
                            <strong>↗</strong>
                        </button>

                    </div>

                </section>

            </form>
        </main>
    );
};

export default RechnungForm;