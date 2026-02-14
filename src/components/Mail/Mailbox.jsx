import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  FiInbox, FiMail, FiSend, FiBookOpen, FiEdit,
  FiUser, FiUsers, FiLock, FiMessageCircle,
  FiCheckCircle, FiAlertCircle, FiTrash2,
  FiCornerUpLeft, FiEye
} from 'react-icons/fi';
import './Mailbox.scss';


export default function Mailbox() {
  const [view, setView] = useState('inbox');
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [status, setStatus] = useState(null);
  const [preview, setPreview] = useState(false);
  const editorRef = useRef(null);

  // Compose state
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (view !== 'compose') loadMails();
  }, [view]);

  /* =============================
     MAILS LADEN
  ============================== */
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

  /* =============================
     MAIL SENDEN
  ============================== */
  const sendMail = async () => {
    const htmlContent = editorRef.current?.innerHTML || '';
  
    try {
      const res = await axios.post(
        'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/send',
        { to, cc, bcc, subject, text: htmlContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (res.data.success) {
        setStatus('success');
        resetCompose();
        setView('sent');
        loadMails();
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
  
    setTimeout(() => setStatus(null), 4000);
  };
  

  const resetCompose = () => {
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setText('');
    setPreview(false);
  };

  /* =============================
     MAIL LÖSCHEN
  ============================== */
  const deleteSelectedMail = async () => {
    if (!selectedMail) return;

    await axios.post(
      'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/delete',
      { uid: selectedMail.uid, box: view === 'sent' ? 'INBOX/Gesendet' : 'INBOX' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadMails();
    setSelectedMail(null);
  };

  /* =============================
     MAIL ANTWORTEN
  ============================== */
  const replyMail = async () => {
    const reply = prompt('Antwort schreiben:');
    if (!reply || !selectedMail) return;

    await axios.post(
      'https://tbsdigitalsolutionsbackend.onrender.com/api/mailbox/reply',
      { uid: selectedMail.uid, box: 'INBOX', text: reply },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadMails();
  };

  /* =============================
     JSX
  ============================== */
  return (
    <div className="mailbox">

      {/* SIDEBAR */}
      <aside className="mailbox__sidebar">
        <button onClick={() => setView('compose')} className="compose">
          <FiEdit /> Neue Mail
        </button>
        <button onClick={() => setView('inbox')} className={view==='inbox'?'active':''}>
          <FiInbox /> Posteingang
        </button>
        <button onClick={() => setView('unread')} className={view==='unread'?'active':''}>
          <FiMail /> Ungelesen
        </button>
        <button onClick={() => setView('sent')} className={view==='sent'?'active':''}>
          <FiSend /> Gesendet
        </button>
      </aside>

      {/* CONTENT */}
      <main className="mailbox__content">

        {/* =============================
           COMPOSE MIT RICH TEXT EDITOR
        ============================== */}
{view==='compose' && (
  <form className="compose" onSubmit={(e)=>{
    e.preventDefault();
    sendMail();
  }}>

    <div className="compose__header">
      <h2>Neue Nachricht</h2>

      {status && (
        <div className={`status ${status}`}>
          {status==='success'?<FiCheckCircle/>:<FiAlertCircle/>}
          {status==='success'?'Mail gesendet':'Fehler'}
        </div>
      )}
    </div>

    {/* FIELDS */}
    <div className="compose__fields">
      <div className="field">
        <label>An</label>
        <input value={to} onChange={e=>setTo(e.target.value)} required />
      </div>

      <div className="field">
        <label>CC</label>
        <input value={cc} onChange={e=>setCc(e.target.value)} />
      </div>

      <div className="field">
        <label>BCC</label>
        <input value={bcc} onChange={e=>setBcc(e.target.value)} />
      </div>

      <div className="field">
        <label>Betreff</label>
        <input value={subject} onChange={e=>setSubject(e.target.value)} required />
      </div>
    </div>

    {/* TOOLBAR */}
    <div className="toolbar">
      <button type="button" onClick={()=>document.execCommand('bold')}><b>B</b></button>
      <button type="button" onClick={()=>document.execCommand('italic')}><i>I</i></button>
      <button type="button" onClick={()=>document.execCommand('underline')}><u>U</u></button>
      <button type="button" onClick={()=>document.execCommand('insertUnorderedList')}>• Liste</button>
      <button type="button" onClick={()=>document.execCommand('insertOrderedList')}>1. Liste</button>
      <button type="button" onClick={()=>{
        const url = prompt('Link eingeben:');
        if(url) document.execCommand('createLink', false, url);
      }}>🔗 Link</button>
      <button type="button" onClick={()=>setPreview(!preview)}>
        <FiEye /> Vorschau
      </button>
    </div>

    <div
  ref={editorRef}
  className="editor"
  contentEditable
  suppressContentEditableWarning
  onInput={() => setText(editorRef.current?.innerHTML || '')}
/>


    {/* PREVIEW */}
    {preview && (
      <div className="preview">
        <h3>Vorschau</h3>
        <div dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML }} />
      </div>
    )}

    {/* FOOTER ACTIONS */}
    <div className="compose__footer">
      <button type="submit" className="send">
        <FiSend /> Senden
      </button>

      <button type="button" className="cancel" onClick={resetCompose}>
        Abbrechen
      </button>
    </div>
  </form>
)}


        {/* =============================
           MAIL LISTE & VIEWER
        ============================== */}
        {view!=='compose' && (
          <div className="mailbox__panel">

            <section className="mailbox__list">
              {mails.length===0 && <div className="empty">📭 Keine Mails</div>}
              {mails.map(mail=>(
                <div
                  key={mail.uid}
                  className={`item ${mail.seen?'':'unread'}`}
                  onClick={()=>setSelectedMail(mail)}
                >
                  {mail.seen?<FiBookOpen/>:<FiMail/>}
                  <div>
                    <strong>{mail.subject}</strong>
                    <span>{mail.from}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="mailbox__viewer">
              {!selectedMail ? (
                <div className="empty">📭 Keine Mail ausgewählt</div>
              ) : (
                <>
                  <h2>{selectedMail.subject}</h2>
                  <div className="content">
                    {selectedMail.html
                      ? <div dangerouslySetInnerHTML={{__html:selectedMail.html}}/>
                      : <pre>{selectedMail.text}</pre>}
                  </div>

                  <div className="actions">
                    <button onClick={replyMail}><FiCornerUpLeft/> Antworten</button>
                    <button onClick={deleteSelectedMail}><FiTrash2/> Löschen</button>
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
