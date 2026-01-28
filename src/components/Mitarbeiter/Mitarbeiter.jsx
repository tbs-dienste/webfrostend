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
        const response = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data.data)) {
          setMitarbeiterListe(response.data.data);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Mitarbeiter:', error);
        alert('Fehler beim Laden der Mitarbeiter.');
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setMitarbeiterListe(mitarbeiterListe.filter((m) => m.id !== mitarbeiterIdToDelete));
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen. Bitte erneut versuchen.');
    }
  };

  const handleCancelDelete = () => setShowConfirmationModal(false);

  return (
    <div className="mitarbeiter-container">
      <div className="header">
        <h2>Mitarbeiterverwaltung</h2>
        <Link to="/mitarbeitererfassen" className="add-button">+</Link>
      </div>

      {loading ? (
        <p className="loading-text">Lade Mitarbeiter...</p>
      ) : mitarbeiterListe.length === 0 ? (
        <p className="no-data">Keine Mitarbeiter gefunden.</p>
      ) : (
        <div className="mitarbeiter-grid">
          {mitarbeiterListe.map((m) => (
            <div key={m.id} className="mitarbeiter-card">
              <div className="foto-container">
                {m.foto ? (
                  <img
                    src={`data:image/png;base64,${m.foto}`}
                    alt={`${m.vorname} ${m.nachname}`}
                    className="mitarbeiter-foto"
                  />
                ) : (
                  <div className="mitarbeiter-foto placeholder">
                    {m.vorname[0]}{m.nachname[0]}
                  </div>
                )}
                {m.hatGeburtstag && <FaBirthdayCake className="icon birthday" title={`${m.geburtstagsInfo} von ${m.vorname}`} />}
                {m.krankGemeldet && <FaVirus className="icon krank" title={`Krank seit ${new Date(m.krankStartdatum).toLocaleDateString()}`} />}
              </div>

              <div className="mitarbeiter-info">
                <h3>{m.vorname} {m.nachname}</h3>
                <p><strong>ID:</strong> {m.mitarbeiternummer}</p>
                <p><strong>Status:</strong> 
                  {m.status === 'online' && <FaGlobe className="status-icon online" />}
                  {m.status === 'offline' && <FaBan className="status-icon offline" />}
                  {m.status === 'abwesend' && <FaDoorOpen className="status-icon abwesend" />}
                  {m.statusInfo && ` ${m.statusInfo}`}
                </p>
              </div>

              <div className="mitarbeiter-actions">
                <Link to={`/mitarbeiteranzeigen/${m.id}`} className="action-button">
                  <FaUser /> Anzeigen
                </Link>
                <button onClick={() => handleShowConfirmationModal(m.id)} className="action-button delete">
                  <FaTrash /> Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
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
