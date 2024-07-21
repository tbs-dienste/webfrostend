import React from 'react';
import './Preisinformationen.scss';

const datenbankPakete = [
  { leistung: 'XS Medium Space', speicher: '10 GiB', preis: 26.00, empfohlen: true },
  { leistung: 'S Small Space', speicher: '10 GiB', preis: 50.00, empfohlen: true },
  { leistung: 'M Medium Space', speicher: '40 GiB', preis: 116.00, empfohlen: true },
  { leistung: 'L Medium Space', speicher: '80 GiB', preis: 240.00, empfohlen: false },
  { leistung: 'XL Medium Space', speicher: '160 GiB', preis: 512.00, empfohlen: false },
  { leistung: 'XXL Medium Space', speicher: '320 GiB', preis: 1088.00, empfohlen: false },
];

const backendPakete = [
  { leistung: 'Starter', ram: '512 MB', preis: 7, empfohlen: true },
  { leistung: 'Standard', ram: '2 GB', preis: 25, empfohlen: true },
  { leistung: 'Pro', ram: '4 GB', preis: 85, empfohlen: false },
  { leistung: 'Pro Plus', ram: '8 GB', preis: 175, empfohlen: false },
  { leistung: 'Pro Max', ram: '16 GB', preis: 225, empfohlen: false },
  { leistung: 'Pro Ultra', ram: '32 GB', preis: 450, empfohlen: false },
];

const Preisinformationen = () => {
  return (
    <div className="preisinformationen">
      <h1>Preisinformationen</h1>
      <p>Unsere Dienstleistungen werden nach einem individuell mit den Kunden vereinbarten Stundensatz berechnet. Die Kosten für Backend-Entwicklung und Datenbank sind ebenfalls aufgeführt.</p>

      <div className="legend">
        <h2>Legende</h2>
        <p><strong>Empfohlen:</strong> Diese Pakete sind für die meisten Kunden die beste Wahl basierend auf Preis-Leistungs-Verhältnis.</p>
      </div>
      
      <div className="tables">
        <div className="table-container">
          <h2>Stundensatz</h2>
          <table>
            <thead>
              <tr>
                <th>Leistung</th>
                <th>Preis pro Stunde</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Entwicklung</td>
                <td>Individuell</td>
              </tr>
              <tr>
                <td>Design</td>
                <td>Individuell</td>
              </tr>
              <tr>
                <td>Beratung</td>
                <td>Individuell</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2>Backend-Kosten</h2>
          <table>
            <thead>
              <tr>
                <th>Leistung</th>
                <th>RAM</th>
                <th>Preis pro Monat</th>
                <th>Preis pro Jahr</th>
              </tr>
            </thead>
            <tbody>
              {backendPakete.map((paket, index) => (
                <tr key={index} className={paket.empfohlen ? 'empfohlen' : ''}>
                  <td>{paket.leistung}</td>
                  <td>{paket.ram}</td>
                  <td>{paket.preis.toFixed(2)}€</td>
                  <td>{(paket.preis * 12).toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h2>Datenbank-Kosten</h2>
          <table>
            <thead>
              <tr>
                <th>Leistung</th>
                <th>Speicher</th>
                <th>Preis pro Monat</th>
                <th>Preis pro Jahr</th>
              </tr>
            </thead>
            <tbody>
              {datenbankPakete.map((paket, index) => (
                <tr key={index} className={paket.empfohlen ? 'empfohlen' : ''}>
                  <td>{paket.leistung}</td>
                  <td>{paket.speicher}</td>
                  <td>{paket.preis.toFixed(2)}€</td>
                  <td>{(paket.preis * 12).toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Preisinformationen;
