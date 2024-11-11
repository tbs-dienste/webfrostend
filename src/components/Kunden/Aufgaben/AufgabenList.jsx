import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';
import './AufgabenList.scss';

const MAX_DESCRIPTION_LENGTH = 50;
const MAX_TITLE_LENGTH = 50;

// Function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const AufgabenList = () => {
  const { kundenId } = useParams();
  const [aufgaben, setAufgaben] = useState([]);
  const [dienstleistungen, setDienstleistungen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks and services data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/aufgaben/${kundenId}`);
        const data = response.data.data;
        
        // Set the services and tasks
        setDienstleistungen(data);
        setAufgaben(data.flatMap(item => item.aufgaben || [])); // Flatten all tasks
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kundenId]);

  if (loading) return <p className="loading">Lade Aufgaben...</p>;
  if (error) return <p className="error">Fehler: {error}</p>;

  return (
    <div className="aufgaben-list">
      <h1>Aufgaben</h1>
      
      {dienstleistungen.length === 0 ? (
        <p className="no-tasks">Keine Dienstleistungen verfügbar.</p>
      ) : (
        <div className="dienstleistungen-container">
          {dienstleistungen.map((dienstleistung) => (
            <div key={dienstleistung.dienstleistungen_id} className="dienstleistung-box">
              <h2>{dienstleistung.dienstleistungen_title}</h2>
              <Link to={`/aufgaben/erstellen/${kundenId}/${dienstleistung.dienstleistungen_id}`} className="add-task-link">
                <FontAwesomeIcon icon={faPlus} /> Aufgabe zu dieser Dienstleistung hinzufügen
              </Link>

              <ul className="task-list">
                {dienstleistung.aufgaben && dienstleistung.aufgaben.length > 0 ? (
                  dienstleistung.aufgaben.map((aufgabe) => (
                    <li key={aufgabe.aufgaben_id} className="task-item">
                      <Link to={`/aufgabe/${aufgabe.aufgaben_id}`} className="task-link">
                        <h3 className="task-title">{truncateText(aufgabe.aufgaben_titel, MAX_TITLE_LENGTH)}</h3>
                      </Link>
                      <p>{truncateText(aufgabe.beschreibung, MAX_DESCRIPTION_LENGTH)}</p>

                      {aufgabe.unteraufgaben && aufgabe.unteraufgaben.length > 0 && (
                        <table className="unteraufgaben-table">
                          <thead>
                            <tr>
                              <th>Titel</th>
                              <th>Beschreibung</th>
                              <th>Abgabedatum</th>
                              <th>Status</th>
                              <th>Schwierigkeitsgrad</th>
                              <th>Mitarbeiter ID</th>
                              <th>Admin ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {aufgabe.unteraufgaben.map((unteraufgabe) => (
                              <tr key={unteraufgabe.unteraufgaben_id}>
                                <td>
                                  <Link to={`/unteraufgabe/${unteraufgabe.unteraufgaben_id}`} className="unteraufgabe-link">
                                    {truncateText(unteraufgabe.unteraufgaben_titel, MAX_TITLE_LENGTH)}
                                  </Link>
                                </td>
                                <td>{truncateText(unteraufgabe.unteraufgaben_beschreibung, MAX_DESCRIPTION_LENGTH)}</td>
                                <td>{new Date(unteraufgabe.unteraufgaben_abgabedatum).toLocaleDateString()}</td>
                                <td>{unteraufgabe.unteraufgaben_status}</td>
                                <td>{unteraufgabe.unteraufgaben_schwierigkeitsgrad}</td>
                                <td>{unteraufgabe.unteraufgaben_mitarbeiter_id}</td>
                                <td>{unteraufgabe.unteraufgaben_admin_id}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="no-tasks">Keine Aufgaben vorhanden.</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AufgabenList;
