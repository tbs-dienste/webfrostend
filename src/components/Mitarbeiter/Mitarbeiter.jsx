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
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://tbsdigitalsolutionsbackend.onrender.com/api/mitarbeiter`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setMitarbeiterListe(response.data.data);
        } else {
          console.error('Expected an array but received:', response.data);
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
      <h2>Mitarbeiter</h2>
      {loading ? (
        <p>Lade Mitarbeiter...</p>
      ) : (
        <div className="mitarbeiter-liste">
          {mitarbeiterListe.length > 0 ? (
            mitarbeiterListe.map((m) => (
              <div key={m.id} className="mitarbeiter-box">
                  <p>Mitarbeiternummer: {m.mitarbeiternummer}</p>
                <p>{m.vorname} {m.nachname}</p>
                <div className="mitarbeiter-buttons">
                  <Link to={`/mitarbeiteranzeigen/${m.id}`}>
                    <FaUser /> Anzeigen
                  </Link>
                  <button onClick={() => handleShowConfirmationModal(m.id)}>
                    <FaTrash /> Löschen
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Keine Mitarbeiter gefunden.</p>
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
