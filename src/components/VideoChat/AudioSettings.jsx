// AudioSettings.js
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import './AudioSettings.scss';
import warteschleifenmusik from './warteschleife.mp3';

function AudioSettings() {
  const [micAllowed, setMicAllowed] = useState(false);
  const [microphones, setMicrophones] = useState([]);
  const [selectedMic, setSelectedMic] = useState('');
  const [volumeLevels, setVolumeLevels] = useState(Array(10).fill(false));
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const audioRef = useRef(null);

  const facts = [
    "Wussten Sie schon, dass Videoanrufe die Kommunikation verbessern können?",
    "Wussten Sie schon, dass regelmäßige Pausen Ihre Produktivität steigern?",
    "Wussten Sie schon, dass eine stabile Internetverbindung für klare Videoanrufe sorgt?",
    "Wussten Sie schon, dass Lächeln Ihre Stimme freundlicher klingen lässt?",
  ];

  useEffect(() => {
    if (micAllowed) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const mics = devices.filter(device => device.kind === 'audioinput');
        setMicrophones(mics);
        if (mics.length === 1) {
          setSelectedMic(mics[0].deviceId);
        }
      });
    }
  }, [micAllowed]);

  useEffect(() => {
    if (selectedMic) {
      navigator.mediaDevices
        .getUserMedia({ audio: { deviceId: selectedMic } })
        .then(stream => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const volume = Math.max(...dataArray);
            const newVolumeLevels = volumeLevels.map((_, i) => i < (volume / 25));
            setVolumeLevels(newVolumeLevels);
            requestAnimationFrame(updateVolume);
          };

          updateVolume();
        });
    }
  }, [selectedMic]);

  useEffect(() => {
    let interval;
    if (inWaitingRoom) {
      interval = setInterval(() => {
        setCurrentFact((prevFact) => (prevFact + 1) % facts.length);
      }, 8000);
      if (audioRef.current) {
        audioRef.current.play().catch(error => console.error("Error playing audio: ", error));
      }
    }
    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [inWaitingRoom, facts.length]);

  const handleMicAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicAllowed(true);
    } catch (err) {
      alert('Zugriff auf das Mikrofon verweigert!');
    }
  };

  const handleMicChange = (e) => {
    setSelectedMic(e.target.value);
  };

  const handleStartVideo = async () => {
    setInWaitingRoom(true);
    try {
      const { data: ipData } = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = ipData.ip;
      // Send IP address to your backend
      const { data: client } = await axios.post('http://localhost:5000/api/waiting-room', {
        ip: ipAddress
      });
      
      // Add client to waiting queue
      setWaitingQueue(prevQueue => [...prevQueue, client]);
    } catch (error) {
      console.error("Error starting video consultation:", error);
    }
  };

  const moveToConsultation = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/waiting-room/${id}`, { status: 'consulting' });
      // Move client from waiting queue to consultation
      setWaitingQueue(prevQueue => prevQueue.map(client =>
        client.id === id ? { ...client, status: 'consulting' } : client
      ));
    } catch (error) {
      console.error("Error moving client to consultation:", error);
    }
  };

  return (
    <div className="audio-settings">
      {inWaitingRoom && (
        <audio ref={audioRef} src={warteschleifenmusik} loop />
      )}
      {!inWaitingRoom ? (
        !micAllowed ? (
          <div className="mic-access">
            <p>Wir würden Sie gern hören. Bitte schalten Sie Ihr Mikrofon frei, damit wir die Beratung starten können.</p>
            <button onClick={handleMicAccess}>Mikrofon Zugriff erlauben</button>
          </div>
        ) : (
          <div className="mic-settings">
            <p>Sie können nun Ihre Geräte einstellen.</p>
            <div className="mic-selection">
              <label htmlFor="microphone">Mikrofon:</label>
              <select id="microphone" value={selectedMic} onChange={handleMicChange}>
                {microphones.map(mic => (
                  <option key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || `Mikrofon ${mic.deviceId}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="volume-indicator">
              {volumeLevels.map((active, i) => (
                <div key={i} className={`volume-bar ${active ? 'active' : ''}`}></div>
              ))}
            </div>
            <div className="speaker-settings">
              <label htmlFor="speaker">Lautsprecher:</label>
              <select id="speaker">
                {/* Lautsprecher-Auswahl könnte hier ebenfalls eingebaut werden */}
              </select>
            </div>
            <button className="test-audio">
              Lautsprecher testen
            </button>
            <button className="start-video" onClick={handleStartVideo}>Video Beratung starten</button>
          </div>
        )
      ) : (
        <WaitingRoom
          facts={facts}
          currentFact={currentFact}
          waitingQueue={waitingQueue}
          moveToConsultation={moveToConsultation}
        />
      )}
    </div>
  );
}

const WaitingRoom = ({ facts, currentFact, waitingQueue, moveToConsultation }) => {
  return (
    <div className="waiting-room">
      <p>Sie werden gleich mit dem nächsten freien Mitarbeiter verbunden.</p>
      <p className="fact">{facts[currentFact]}</p>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
      <div className="waiting-queue">
        <h2>Warteschlange</h2>
        <ul>
          {waitingQueue.map(client => (
            <li key={client.id}>
              <span>ID: {client.id}</span>
              <span>IP: {client.ip}</span>
              <span>Status: {client.status}</span>
              {client.status === 'waiting' && (
                <button onClick={() => moveToConsultation(client.id)}>In Beratung holen</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AudioSettings;
