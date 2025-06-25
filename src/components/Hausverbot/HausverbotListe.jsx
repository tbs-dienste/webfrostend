import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HausverbotListe.scss'; // Einfach im selben Ordner speichern

function HausverbotListe() {
  const [hausverbote, setHausverbote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHausverbote() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/hausverbot', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHausverbote(response.data);
      } catch {
        setError('Fehler beim Laden der Hausverbote.');
      } finally {
        setLoading(false);
      }
    }
    fetchHausverbote();
  }, []);

  if (loading) return <p className="loading-text">Lade Hausverbote...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="hausverbote-container">
      <h2>Hausverbote</h2>
      {hausverbote.length === 0 ? (
        <p>Keine Hausverbote vorhanden.</p>
      ) : (
        <table className="hausverbote-table" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Grund</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {hausverbote.map(({ id, vorname, nachname, grund }) => (
              <tr key={id}>
                <td>{vorname} {nachname}</td>
                <td>{grund}</td>
                <td>
                  <button
                    className="hausverbote-button"
                    onClick={() => alert(`Details für Hausverbot ID: ${id}`)}
                    aria-label={`Details anzeigen für ${vorname} ${nachname}`}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HausverbotListe;
