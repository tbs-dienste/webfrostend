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
  FiAlertCircle,
  FiTrash2,
  FiFolderPlus,
  FiMove,
  FiCornerUpLeft
} from 'react-icons/fi';
import './Mailbox.scss';

export default function Mailbox() {
  const [view, setView] = useState('inbox'); // inbox | unread | sent | compose
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [status, setStatus] = useState(null);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [moveToFolder, setMoveToFolder] = useState('');

  // Compose States
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (view !== 'compose') loadMails();
    loadFolders();
  }, [view]);

  // 🔹 Mails laden
  const loadMails = async () => {
    const endpoints = {
      inbox: '/api/mailbox/inbox',
      unread: '/api/mailbox/current',
      sent: '/api/mailbox/sent'
    };
    try {
      const res = await axios.get(
        `https://tbsdigitalsolutionsbackend.onrender.com${endpoints[view]}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMails(res.data);
      setSelectedMail(null);
    } catch {
      setMails([]);
    }
  };

  // 🔹 Ordner laden
  const loadFolders = async () => {
    // Dummy: nur Beispielordner, GMX IMAP-Ordner müssen aus Backend geladen werden
    setFolders(['INBOX/Gesendet', 'INBOX/Archiv', 'INBOX/Projekte']);
  };

  // 🔹 Mail senden
  const sendMail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/send',
        { to, cc, bcc, subject, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setStatus('success'); resetCompose(); setView('sent'); loadMails();
      } else setStatus('error');
    } catch { setStatus('error'); }
    setTimeout(() => setStatus(null), 4000);
  };

  const resetCompose = () => { setTo(''); setCc(''); setBcc(''); setSubject(''); setText(''); };

  // 🔹 Mail antworten
  const replyMail = async (replyText) => {
    if (!selectedMail) return;
    try {
      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/reply',
        { uid: selectedMail.uid, box: view === 'sent' ? 'INBOX/Gesendet' : 'INBOX', text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('success'); loadMails();
    } catch { setStatus('error'); }
    setTimeout(() => setStatus(null), 4000);
  };

  // 🔹 Mail löschen
  const deleteSelectedMail = async () => {
    if (!selectedMail) return;
    try {
      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/delete',
        { uid: selectedMail.uid, box: view === 'sent' ? 'INBOX/Gesendet' : 'INBOX' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('success'); loadMails(); setSelectedMail(null);
    } catch { setStatus('error'); }
    setTimeout(() => setStatus(null), 4000);
  };

  // 🔹 Mail als gelesen markieren
  const markAsRead = async () => {
    if (!selectedMail) return;
    try {
      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/markAsRead',
        { uid: selectedMail.uid, box: view === 'sent' ? 'INBOX/Gesendet' : 'INBOX' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('success'); loadMails();
    } catch { setStatus('error'); }
    setTimeout(() => setStatus(null), 4000);
  };

  // 🔹 Mail verschieben
  const moveMail = async () => {
    if (!selectedMail || !moveToFolder) return;
    try {
      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/move',
        { uid: selectedMail.uid, folder: moveToFolder },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('success'); loadMails(); setSelectedMail(null);
    } catch { setStatus('error'); }
    setTimeout(() => setStatus(null), 4000);
  };

  // 🔹 Ordner erstellen
  const createFolder = async () => {
    if (!newFolderName) return;
    try {
      await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/createFolder',
        { name: newFolderName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('success'); loadFolders(); setNewFolderName('');
    } catch { setStatus('error'); }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <div className="mailbox">

      {/* SIDEBAR */}
      <aside className="mailbox__sidebar">
        <button onClick={() => setView('compose')} className="compose"><FiEdit /> Neue Mail</button>
        <button onClick={() => setView('inbox')} className={view==='inbox'?'active':''}><FiInbox /> Posteingang</button>
        <button onClick={() => setView('unread')} className={view==='unread'?'active':''}><FiMail /> Ungelesen</button>
        <button onClick={() => setView('sent')} className={view==='sent'?'active':''}><FiSend /> Gesendet</button>

        <div className="folders">
          <h4>Ordner</h4>
          {folders.map(f => <div key={f}>{f}</div>)}
          <input placeholder="Neuer Ordner" value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} />
          <button onClick={createFolder}><FiFolderPlus /> Erstellen</button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="mailbox__content">

        {/* COMPOSE */}
        {view==='compose' && (
          <form className="compose" onSubmit={sendMail}>
            <h2>Neue Nachricht</h2>
            {status && <div className={`status ${status}`}>{status==='success'?<FiCheckCircle/>:<FiAlertCircle/>}{status==='success'?'Mail gesendet':'Fehler'}</div>}
            <label><FiUser /> An</label><input value={to} onChange={e=>setTo(e.target.value)} required />
            <label><FiUsers /> CC</label><input value={cc} onChange={e=>setCc(e.target.value)} />
            <label><FiLock /> BCC</label><input value={bcc} onChange={e=>setBcc(e.target.value)} />
            <label><FiEdit /> Betreff</label><input value={subject} onChange={e=>setSubject(e.target.value)} required />
            <label><FiMessageCircle /> Nachricht</label><textarea rows={8} value={text} onChange={e=>setText(e.target.value)} required />
            <button type="submit"><FiSend /> Senden</button>
          </form>
        )}

        {/* LIST + VIEWER */}
        {view!=='compose' && (
          <div className="mailbox__panel">
            <section className="mailbox__list">
              {mails.length===0 && <div className="empty">📭 Keine Mails</div>}
              {mails.map(mail=>(
                <div key={mail.uid} className={`item ${mail.seen?'':'unread'}`} onClick={()=>setSelectedMail(mail)}>
                  {mail.seen?<FiBookOpen className="mail-icon mail-icon--read"/>:<FiMail className="mail-icon mail-icon--unread"/>}
                  <div><strong>{mail.subject}</strong><span>{mail.from}</span></div>
                  <time>{new Date(mail.date).toLocaleString()}</time>
                </div>
              ))}
            </section>

            <section className="mailbox__viewer">
              {!selectedMail ? <div className="empty">📭 Keine Mail ausgewählt</div> : (
                <>
                  <h2>{selectedMail.subject}</h2>
                  <div className="meta">
                    <span><b>Von:</b> {selectedMail.from}</span>
                    <span><b>An:</b> {selectedMail.to}</span>
                  </div>
                  <div className="content">{selectedMail.html?<div dangerouslySetInnerHTML={{__html:selectedMail.html}}/>:<pre>{selectedMail.text}</pre>}</div>

                  {/* Aktionen */}
                  <div className="actions">
                    <button onClick={markAsRead}><FiBookOpen /> Als gelesen markieren</button>
                    <button onClick={()=>{ const reply=prompt('Antwort schreiben:'); if(reply) replyMail(reply); }}><FiCornerUpLeft /> Antworten</button>
                    <button onClick={deleteSelectedMail}><FiTrash2 /> Löschen</button>
                    <select onChange={e=>setMoveToFolder(e.target.value)} value={moveToFolder}>
                      <option value="">Verschieben...</option>
                      {folders.map(f=> <option key={f} value={f}>{f}</option>)}
                    </select>
                    <button onClick={moveMail}><FiMove /> Verschieben</button>
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
