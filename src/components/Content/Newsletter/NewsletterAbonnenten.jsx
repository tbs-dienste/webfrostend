import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, CheckCircle, XCircle, Search } from 'lucide-react';
import './NewsletterAbonnenten.scss';

const NewsletterAbonnenten = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://tbsdigitalsolutionsbackend.onrender.com/api/newsletter/subscribers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscribers(res.data);
      } catch (err) {
        console.error('Fehler beim Laden:', err);
        setError('Nicht autorisiert oder Serverfehler.');
      }
    };

    fetchSubscribers();
  }, []);

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="newsletter-container">
      <div className="header">
        <Mail size={28} />
        <h2>Newsletter Abonnenten</h2>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Nach Email suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Angemeldet</th>
              <th>Abgemeldet</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.email}</td>
                <td className={`status ${sub.status}`}>
                  {sub.status === 'aktiv' ? (
                    <>
                      <CheckCircle size={16} className="icon aktiv" /> Aktiv
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="icon inaktiv" /> Inaktiv
                    </>
                  )}
                </td>
                <td title={sub.subscribed_at}>
                  {new Date(sub.subscribed_at).toLocaleDateString()}
                </td>
                <td title={sub.unsubscribed_at}>
                  {sub.unsubscribed_at
                    ? new Date(sub.unsubscribed_at).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="no-results">Keine Ergebnisse gefunden.</p>}
      </div>
    </div>
  );
};

export default NewsletterAbonnenten;
