import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';
import './AufgabenList.scss';

const MAX_DESCRIPTION_LENGTH = 50; // Maximal zulässige Zeichenanzahl für die Beschreibung
const MAX_TITLE_LENGTH = 50; // Maximal zulässige Zeichenanzahl für den Titel

// Funktion zum Kürzen von Text, falls er zu lang ist
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const AufgabenList = () => {
  const { kundenId } = useParams(); // Holen der Kunden-ID aus der URL
  const [aufgaben, setAufgaben] = useState([]); // Aufgaben-Daten im Zustand speichern
  const [dienstleistungenId, setDienstleistungenId] = useState(null); // Dienstleistungs-ID speichern
  const [loading, setLoading] = useState(true); // Ladezustand
  const [error, setError] = useState(null); // Fehlerzustand

  // Funktion zum Abrufen der Aufgaben und Unteraufgaben vom Backend
  useEffect(() => {
    const fetchAufgaben = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/${kundenId}`);
        const data = response.data.data[0]; // Die erste Antwort im Array
        setDienstleistungenId(data?.dienstleistungen_id); // Dienstleistungs-ID setzen
        setAufgaben(data?.aufgaben || []); // Aufgaben setzen
      } catch (err) {
        setError(err.message); // Fehler setzen
      } finally {
        setLoading(false); // Ladezustand beenden
      }
    };

    fetchAufgaben(); // Abrufen der Aufgaben
  }, [kundenId]); // Nur erneut laden, wenn die Kunden-ID sich ändert

  if (loading) return <p className="loading">Lade Aufgaben...</p>; // Ladeanzeige
  if (error) return <p className="error">Fehler: {error}</p>; // Fehleranzeige

  return (
    <div className="aufgaben-list">
      <h1>Aufgaben</h1>
      <p>Dienstleistung ID: {dienstleistungenId}</p> {/* Dienstleistungs-ID anzeigen */}
      <Link to={`/aufgaben/erstellen/${kundenId}`} className="create-task-link">
        <FontAwesomeIcon icon={faPlus} /> Aufgabe erstellen
      </Link>

      {aufgaben.length === 0 ? (
        <p className="no-tasks">
          Keine Aufgaben gefunden. <FontAwesomeIcon icon={faClipboardList} />
        </p>
      ) : (
        <ul className="task-list">
          {aufgaben.map((aufgabe) => (
            <li key={aufgabe.id} className="task-item">
              <h2 className="task-title">
                <FontAwesomeIcon icon={faClipboardList} className="task-icon" />
                {truncateText(aufgabe.titel, MAX_TITLE_LENGTH)} {/* Titel gekürzt */}
                <Link to={`/aufgaben/${aufgabe.id}/unteraufgabe/create`} className="add-subtask-link">
                  <FontAwesomeIcon icon={faPlus} />
                </Link>
              </h2>
              {/* Unteraufgaben in einer Tabelle anzeigen */}
              {aufgabe.unteraufgaben && aufgabe.unteraufgaben.length > 0 && (
                <table className="subtask-table">
                  <thead>
                    <tr>
                      <th>Titel</th>
                      <th>Beschreibung</th>
                      <th>Abgabedatum</th>
                      <th>Status</th>
                      <th>Schwierigkeitsgrad</th>
                      <th>Mitarbeiter</th>
                      <th>Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aufgabe.unteraufgaben.map((unteraufgabe) => (
                      <tr key={unteraufgabe.id}>
                        <td>
                          <Link to={`/unteraufgaben/${unteraufgabe.id}?kundenId=${kundenId}`}>
                            {truncateText(unteraufgabe.titel, MAX_TITLE_LENGTH)}
                          </Link>
                        </td> {/* Titel der Unteraufgabe mit Link */}
                        <td>{truncateText(unteraufgabe.beschreibung, MAX_DESCRIPTION_LENGTH)}</td>
                        <td>{new Date(unteraufgabe.abgabedatum).toLocaleDateString()}</td>
                        <td>{unteraufgabe.status}</td>
                        <td>{unteraufgabe.schwierigkeitsgrad}</td>
                        <td>{unteraufgabe.mitarbeiter_id || 'N/A'}</td>
                        <td>{unteraufgabe.admin_id || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link to="/kunden" className="back-to-customers">Zurück zu Kunden</Link>
    </div>
  );
};

export default AufgabenList;
