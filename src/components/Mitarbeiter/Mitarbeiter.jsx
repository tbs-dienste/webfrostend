import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaUser, FaVirus, FaGlobe, FaBirthdayCake, FaBan, FaDoorOpen } from 'react-icons/fa';
import './Mitarbeiter.scss';

const Mitarbeiter = () => {
  const [mitarbeiterListe, setMitarbeiterListe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [mitarbeiterIdToDelete, setMitarbeiterIdToDelete] = useState(null);

  useEffect(() => {
    const fetchMitarbeiter = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          const updatedMitarbeiter = response.data.data.map((m) => ({
            ...m,
            hatGeburtstag: m.hatGeburtstag,
          }));
          setMitarbeiterListe(updatedMitarbeiter);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        alert('Error fetching employees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMitarbeiter();
  }, []);

  const handleShowConfirmationModal = (id) => {
    setShowConfirmationModal(true);
    setMitarbeiterIdToDelete(id);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${mitarbeiterIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMitarbeiterListe(mitarbeiterListe.filter((m) => m.id !== mitarbeiterIdToDelete));
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee. Please try again later.');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="mitarbeiter-container">
      <h2>Mitarbeiterverwaltung</h2>
      <Link to="/mitarbeitererfassen" className="add-button">+</Link>
      {loading ? (
        <p className="loading-text">Lade Mitarbeiter...</p>
      ) : (
        <table className="mitarbeiter-tabelle">
          <thead>
            <tr>
              <th>Mitarbeiternummer</th>
              <th>Name</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {mitarbeiterListe.length > 0 ? (
              mitarbeiterListe.map((m) => (
                <tr
                  key={m.id}
                  className={`mitarbeiter-row 
                    ${m.krankGemeldet ? 'krank' : ''}
                    ${m.status === 'online' ? 'online' : ''}
                    ${m.hatGeburtstag ? 'birthday' : ''}
                  `}
                >
                  <td>{m.mitarbeiternummer}</td>
                  <td>{m.vorname} {m.nachname}</td>
                  <td>
                    {m.hatGeburtstag && (
                      <FaBirthdayCake className="status-icon birthday" title={`Heute ist der ${m.geburtstagsInfo} von ${m.vorname}!`} />
                    )}
                    {m.status === 'online' && (
                      <FaGlobe className="status-icon online" title="Mitarbeiter ist online" />
                    )}
                    {m.status === 'abwesend' && (
                      <FaDoorOpen className="status-icon abwesend" title="Mitarbeiter ist abwesend" />
                    )}
                    {m.status === 'offline' && (
                      <FaBan className="status-icon abwesend" title="Mitarbeiter hat sich noch nie eingloggt" />
                    )}
                    {m.krankGemeldet && (
                      <FaVirus className="status-icon krank" title={`Krank gemeldet seit: ${new Date(m.krankStartdatum).toLocaleDateString()}`} />
                    )}
                  </td>
                  <td>
                    <Link to={`/mitarbeiteranzeigen/${m.id}`} className="action-button">
                      <FaUser /> Anzeigen
                    </Link>
                    <button onClick={() => handleShowConfirmationModal(m.id)} className="action-button delete">
                      <FaTrash /> Löschen
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">Keine Mitarbeiter gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {showConfirmationModal && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <p>Bist du sicher, dass du diesen Mitarbeiter löschen möchtest?</p>
            <div className="modal-actions">
              <button onClick={handleDeleteConfirmation} className="confirm-button">Ja</button>
              <button onClick={handleCancelDelete} className="cancel-button">Nein</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mitarbeiter;
