import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiInbox,
  FiMail,
  FiSend,
  FiBookOpen,
  FiEdit,
  FiUser,
  FiUsers,
  FiLock,
  FiMessageCircle,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

import './Mailbox.scss';

export default function Mailbox() {
  const [view, setView] = useState('inbox'); // inbox | unread | sent | compose
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [status, setStatus] = useState(null);

  // Compose States
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (view !== 'compose') loadMails();
  }, [view]);

  const loadMails = async () => {
    const endpoints = {
      inbox: '/api/mailbox/inbox',
      unread: '/api/mailbox/current',
      sent: '/api/mailbox/sent'
    };

    const res = await axios.get(
      `https://tbsdigitalsolutionsbackend.onrender.com${endpoints[view]}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMails(res.data);
    setSelectedMail(null);
  };

  const sendMail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/send',
        { to, cc, bcc, subject, text },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setStatus('success');
        setTo('');
        setCc('');
        setBcc('');
        setSubject('');
        setText('');
        setView('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mailbox">

      {/* SIDEBAR */}
      <aside className="mailbox__sidebar">
        <button onClick={() => setView('compose')} className="compose">
          <FiEdit /> Neue Mail
        </button>

        <button onClick={() => setView('inbox')} className={view === 'inbox' ? 'active' : ''}>
          <FiInbox /> Posteingang
        </button>

        <button onClick={() => setView('unread')} className={view === 'unread' ? 'active' : ''}>
          <FiMail /> Ungelesen
        </button>

        <button onClick={() => setView('sent')} className={view === 'sent' ? 'active' : ''}>
          <FiSend /> Gesendet
        </button>
      </aside>

      {/* CONTENT */}
      <main className="mailbox__content">

        {/* COMPOSE */}
        {view === 'compose' && (
          <form className="compose" onSubmit={sendMail}>
            <h2>Neue Nachricht</h2>

            {status && (
              <div className={`status ${status}`}>
                {status === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                {status === 'success' ? 'Mail gesendet' : 'Fehler beim Senden'}
              </div>
            )}

            <label><FiUser /> An</label>
            <input value={to} onChange={e => setTo(e.target.value)} required />

            <label><FiUsers /> CC</label>
            <input value={cc} onChange={e => setCc(e.target.value)} />

            <label><FiLock /> BCC</label>
            <input value={bcc} onChange={e => setBcc(e.target.value)} />

            <label><FiEdit /> Betreff</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} required />

            <label><FiMessageCircle /> Nachricht</label>
            <textarea rows={8} value={text} onChange={e => setText(e.target.value)} required />

            <button type="submit">
              <FiSend /> Senden
            </button>
          </form>
        )}

        {/* LIST + VIEWER */}
        {view !== 'compose' && (
          <div className="mailbox__panel">

            <section className="mailbox__list">
              {mails.map(mail => (
                <div
                  key={mail.uid}
                  className={`item ${mail.seen ? '' : 'unread'}`}
                  onClick={() => setSelectedMail(mail)}
                >
                 {mail.seen ? (
  <FiBookOpen className="mail-icon mail-icon--read" />
) : (
  <FiMail className="mail-icon mail-icon--unread" />
)}

                  <div>
                    <strong>{mail.subject}</strong>
                    <span>{mail.from}</span>
                  </div>
                  <time>{new Date(mail.date).toLocaleDateString()}</time>
                </div>
              ))}
            </section>

            <section className="mailbox__viewer">
              {!selectedMail ? (
                <div className="empty">📭 Keine Mail ausgewählt</div>
              ) : (
                <>
                  <h2>{selectedMail.subject}</h2>
                  <div className="meta">
                    <span><b>Von:</b> {selectedMail.from}</span>
                    <span><b>An:</b> {selectedMail.to}</span>
                  </div>
                  <div className="content">
                    {selectedMail.html
                      ? <div dangerouslySetInnerHTML={{ __html: selectedMail.html }} />
                      : <pre>{selectedMail.text}</pre>}
                  </div>
                </>
              )}
            </section>

          </div>
        )}
      </main>
    </div>
  );
}
