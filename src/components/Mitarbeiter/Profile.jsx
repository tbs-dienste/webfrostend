import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.scss'; // Für professionelle SCSS-Gestaltung

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Token aus localStorage holen
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Kein Token vorhanden. Bitte einloggen.');
            setLoading(false);
            return;
        }

        // Benutzerdaten vom Server abrufen
        axios
            .get('https://tbsdigitalsolutionsbackend.onrender.com/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setProfileData(response.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Fehler beim Abrufen der Profildaten:', err);
                setError(err.response?.data?.error || 'Unbekannter Fehler');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="profile-loading">Lade Profil...</div>;
    }

    if (error) {
        return <div className="profile-error">Fehler: {error}</div>;
    }

    // Überprüfe den Benutzertyp und rendere die entsprechenden Daten
    const isAdmin = profileData?.adminnummer; // Wenn adminnummer vorhanden ist, handelt es sich um einen Admin
    const isMitarbeiter = profileData?.mitarbeiternummer; // Wenn mitarbeiternummer vorhanden ist, handelt es sich um einen Mitarbeiter

    return (
        <div className="profile-container">
            <h1>Profil</h1>
            <div className="profile-card">
                {isAdmin ? (
                    <>
                        <p>
                            <strong>ID:</strong> {profileData.id}
                        </p>
                        <p>
                            <strong>Name:</strong> {profileData.name}
                        </p>
                        <p>
                            <strong>Vorname:</strong> {profileData.vorname}
                        </p>
                        <p>
                            <strong>Adresse:</strong> {profileData.adresse}
                        </p>
                        <p>
                            <strong>PLZ:</strong> {profileData.plz}
                        </p>
                        <p>
                            <strong>Ort:</strong> {profileData.ort}
                        </p>
                        <p>
                            <strong>Email:</strong> {profileData.email}
                        </p>
                        <p>
                            <strong>Mobil:</strong> {profileData.mobil}
                        </p>
                        <p>
                            <strong>Sprache:</strong> {profileData.sprache}
                        </p>
                        <p>
                            <strong>Geburtstag:</strong> {new Date(profileData.geburtstagdatum).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Status:</strong> {profileData.status}
                        </p>
                        <p>
                            <strong>Letzter Login:</strong> {new Date(profileData.last_login).toLocaleString()}
                        </p>
                    </>
                ) : isMitarbeiter ? (
                    <>
                        <p>
                            <strong>Mitarbeiternummer:</strong> {profileData.mitarbeiternummer}
                        </p>
                        <p>
                            <strong>Vorname:</strong> {profileData.vorname}
                        </p>
                        <p>
                            <strong>Nachname:</strong> {profileData.nachname}
                        </p>
                        <p>
                            <strong>Adresse:</strong> {profileData.adresse}
                        </p>
                        <p>
                            <strong>PLZ:</strong> {profileData.postleitzahl}
                        </p>
                        <p>
                            <strong>Ort:</strong> {profileData.ort}
                        </p>
                        <p>
                            <strong>Email:</strong> {profileData.email}
                        </p>
                        <p>
                            <strong>Mobil:</strong> {profileData.mobil}
                        </p>
                        <p>
                            <strong>Benutzername:</strong> {profileData.benutzername}
                        </p>
                        <p>
                            <strong>Land:</strong> {profileData.land}
                        </p>
                        <p>
                            <strong>Geburtstag:</strong> {new Date(profileData.geburtstag).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Verfügbarkeit:</strong> {profileData.verfügbarkeit}
                        </p>
                        <p>
                            <strong>Teilzeit Prozent:</strong> {profileData.teilzeit_prozent}%
                        </p>
                        <p>
                            <strong>Krank gemeldet:</strong> {profileData.krankGemeldet ? 'Ja' : 'Nein'}
                        </p>
                    </>
                ) : (
                    <p>Unbekannter Benutzertyp</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
