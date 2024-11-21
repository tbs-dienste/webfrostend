import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaUser, FaVirus, FaGlobe, FaBirthdayCake } from 'react-icons/fa';
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

  // Funktion zur Überprüfung, ob der Mitarbeiter heute Geburtstag hat
  const checkBirthday = (geburtstag) => {
    const today = new Date();
    const birthday = new Date(geburtstag);
    return today.getDate() === birthday.getDate() && today.getMonth() === birthday.getMonth();
  };

  return (
    <div className="mitarbeiter-container">
      <h2>Mitarbeiter</h2>
      <Link to="/mitarbeitererfassen">+</Link>
      {loading ? (
        <p>Lade Mitarbeiter...</p>
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
                  className={`
                    ${m.krankGemeldet ? 'krank' : ''} 
                    ${m.status === 'online' ? 'online' : ''}
                  `}
                >
                  <td>{m.mitarbeiternummer}</td>
                  <td>{m.vorname} {m.nachname}</td>
                  <td>
                    {/* Geburtsstagsicon anzeigen, wenn heute Geburtstag ist */}
                    {checkBirthday(m.geburtstag) && (
                      <FaBirthdayCake
                        className="birthday-icon"
                        title="Mitarbeiter hat heute Geburtstag!"
                      />
                    )}
                    {m.status === 'online' && (
                      <FaGlobe
                        className="online-icon"
                        title="Mitarbeiter ist online"
                      />
                    )}
                    {m.krankGemeldet && (
                      <FaVirus
                        className="krank-icon"
                        title={`Krank gemeldet seit: ${new Date(m.krankStartdatum).toLocaleDateString()}`}
                      />
                    )}
                  </td>
                  <td>
                    <Link to={`/mitarbeiteranzeigen/${m.id}`}>
                      <FaUser /> Anzeigen
                    </Link>
                    <button onClick={() => handleShowConfirmationModal(m.id)}>
                      <FaTrash /> Löschen
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Keine Mitarbeiter gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
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
