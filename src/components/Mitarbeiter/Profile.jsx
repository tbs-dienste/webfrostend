import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.scss';
import { User, Mail, Phone, Calendar, MapPin, Globe, LogIn } from 'lucide-react'; // Icons

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Kein Token vorhanden. Bitte einloggen.');
            setLoading(false);
            return;
        }

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
                setError(err.response?.data?.error || 'Unbekannter Fehler');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="profile-loading">Lade Profil...</div>;
    if (error) return <div className="profile-error">Fehler: {error}</div>;

    const isAdmin = profileData?.adminnummer;
    const isMitarbeiter = profileData?.mitarbeiternummer;

    return (
        <div className="profile-wrapper">
            <div className="profile-card">
                <h2 className="profile-title">👤 Profilübersicht</h2>
                <div className="profile-details">
                    {isAdmin && (
                        <>
                            <ProfileItem icon={<User size={18} />} label="Name" value={`${profileData.vorname} ${profileData.name}`} />
                            <ProfileItem icon={<MapPin size={18} />} label="Adresse" value={`${profileData.adresse}, ${profileData.plz} ${profileData.ort}`} />
                            <ProfileItem icon={<Mail size={18} />} label="Email" value={profileData.email} />
                            <ProfileItem icon={<Phone size={18} />} label="Mobil" value={profileData.mobil} />
                            <ProfileItem icon={<Globe size={18} />} label="Sprache" value={profileData.sprache} />
                            <ProfileItem icon={<Calendar size={18} />} label="Geburtstag" value={new Date(profileData.geburtstagdatum).toLocaleDateString()} />
                            <ProfileItem label="Status" value={profileData.status} />
                            <ProfileItem icon={<LogIn size={18} />} label="Letzter Login" value={new Date(profileData.last_login).toLocaleString()} />
                        </>
                    )}
                    {isMitarbeiter && (
                        <>
                            <ProfileItem icon={<User size={18} />} label="Name" value={`${profileData.vorname} ${profileData.nachname}`} />
                            <ProfileItem icon={<MapPin size={18} />} label="Adresse" value={`${profileData.adresse}, ${profileData.postleitzahl} ${profileData.ort}`} />
                            <ProfileItem icon={<Mail size={18} />} label="Email" value={profileData.email} />
                            <ProfileItem icon={<Phone size={18} />} label="Mobil" value={profileData.mobil} />
                            <ProfileItem icon={<Globe size={18} />} label="Land" value={profileData.land} />
                            <ProfileItem icon={<Calendar size={18} />} label="Geburtstag" value={new Date(profileData.geburtstag).toLocaleDateString()} />
                            <ProfileItem label="Verfügbarkeit" value={profileData.verfügbarkeit} />
                            <ProfileItem label="Teilzeit %" value={`${profileData.teilzeit_prozent}%`} />
                            <ProfileItem label="Krank gemeldet" value={profileData.krankGemeldet ? 'Ja' : 'Nein'} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ icon, label, value }) => (
    <div className="profile-item">
        {icon && <span className="profile-icon">{icon}</span>}
        <span className="profile-label">{label}:</span>
        <span className="profile-value">{value}</span>
    </div>
);

export default Profile;
