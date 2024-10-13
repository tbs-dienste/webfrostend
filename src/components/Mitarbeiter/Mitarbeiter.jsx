import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaUser, FaPen } from 'react-icons/fa';
import './Mitarbeiter.scss';

const Mitarbeiter = () => {
  const [mitarbeiterListe, setMitarbeiterListe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [mitarbeiterIdToDelete, setMitarbeiterIdToDelete] = useState(null);

  useEffect(() => {
    const fetchMitarbeiter = async () => {
      try {
        const token = localStorage.getItem('token'); // Token aus localStorage holen
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter`, {
          headers: {
            Authorization: `Bearer ${token}` // Token im Header einfügen
          }
        });

        const data = response.data.data;
        if (Array.isArray(data)) {
          setMitarbeiterListe(data);
        } else {
          console.error('Erwartet ein Array, aber erhalten:', data);
          setMitarbeiterListe([]);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Mitarbeiter:', error);
        alert('Fehler beim Abrufen der Mitarbeiter. Bitte versuche es später noch einmal.');
        setMitarbeiterListe([]);
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
      const token = localStorage.getItem('token'); // Token aus localStorage holen
      await axios.delete(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter/${mitarbeiterIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}` // Token im Header einfügen
        }
      });
      const updatedListe = mitarbeiterListe.filter(mitarbeiter => mitarbeiter.id !== mitarbeiterIdToDelete);
      setMitarbeiterListe(updatedListe);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Fehler beim Löschen des Mitarbeiters:', error);
      alert('Fehler beim Löschen des Mitarbeiters. Bitte versuche es später noch einmal.');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setMitarbeiterIdToDelete(null);
  };

  return (
    <div className="mitarbeiter-container">
      <h2 className="mitarbeiter-title">Mitarbeiter</h2>

      {loading ? (
        <p>Lade Mitarbeiter...</p>
      ) : (
        <div className="mitarbeiter-liste">
          {mitarbeiterListe.length > 0 ? (
            mitarbeiterListe.map((mitarbeiter) => (
              <div key={mitarbeiter.id} className="mitarbeiter-box">
                <p className="mitarbeiter-name">{mitarbeiter.vorname} {mitarbeiter.nachname}</p>
                <div className="mitarbeiter-buttons">
                  <Link to={`/mitarbeiteranzeigen/${mitarbeiter.id}`} className="mitarbeiter-button">
                    <FaUser /> Anzeigen
                  </Link>
                  <Link to={`/mitarbeiterbearbeiten/${mitarbeiter.id}`} className="mitarbeiter-button">
                    <FaPen /> Bearbeiten
                  </Link>
                  <button onClick={() => handleShowConfirmationModal(mitarbeiter.id)} className="mitarbeiter-button">
                    <FaTrash /> Löschen
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">Keine Mitarbeiter gefunden.</p>
          )}
        </div>
      )}
      
      {showConfirmationModal && (
        <div className="confirmation-modal">
          <p>Bist du sicher, dass du diesen Mitarbeiter löschen möchtest?</p>
          <button onClick={handleDeleteConfirmation}>Ja</button>
          <button onClick={handleCancelDelete}>Nein</button>
        </div>
      )}
    </div>
  );
};

export default Mitarbeiter;
