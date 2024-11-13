// Import necessary React hooks and other resources
import React, { useEffect, useRef, useState } from 'react';
import './VideoCall.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faPhoneSlash, faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, faShareSquare, faStopCircle, faCompressArrowsAlt, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';

const VideoCall = () => {
    const [stream, setStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const screenStreamRef = useRef(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const [remoteStreamVisible, setRemoteStreamVisible] = useState(true);
    const [screenSharingInitiatedBy, setScreenSharingInitiatedBy] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const ws = new WebSocket('wss://tbsdigitalsolutionsbackend.onrender.com');
        setSocket(ws);

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'offer') {
                await handleOffer(data.offer, data.from);
            } else if (data.type === 'answer') {
                await handleAnswer(data.answer);
            } else if (data.type === 'ice-candidate') {
                await handleICECandidate(data.candidate);
            } else if (data.type === 'screen-share-start') {
                handleScreenShareStart(data.from);
            } else if (data.type === 'screen-share-stop') {
                handleScreenShareStop(data.from);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleOffer = async (offer, from) => {
        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.send(JSON.stringify({
                    type: 'ice-candidate',
                    candidate: event.candidate,
                    to: from
                }));
            }
        };

        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({
            type: 'answer',
            answer: answer,
            to: from
        }));

        setIsCallActive(true);
    };

    const handleAnswer = async (answer) => {
        if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    };

    const handleICECandidate = async (candidate) => {
        if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    const handleScreenShareStart = (from) => {
        setIsScreenSharing(true);
        setScreenSharingInitiatedBy(from);
        setRemoteStreamVisible(false); // Hide the remote video during screen share
    };

    const handleScreenShareStop = (from) => {
        setIsScreenSharing(false);
        setScreenSharingInitiatedBy(null);
        setRemoteStreamVisible(true); // Show the remote video when screen share stops
    };

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = screenStream;
            setIsScreenSharing(true);
            screenStream.getTracks()[0].onended = stopScreenShare;

            localVideoRef.current.srcObject = screenStream; // Display the shared screen locally

            socket.send(JSON.stringify({
                type: 'screen-share-start',
                from: 'me'
            }));
        } catch (error) {
            console.error('Error starting screen share:', error);
        }
    };

    const stopScreenShare = () => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
        setIsScreenSharing(false);
        socket.send(JSON.stringify({
            type: 'screen-share-stop',
            from: 'me'
        }));
        setRemoteStreamVisible(true); // Restore the remote video visibility
        localVideoRef.current.srcObject = stream; // Revert to the user's webcam stream
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !isVideoEnabled;
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const toggleAudio = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !isAudioEnabled;
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    const startCall = async () => {
        try {
            const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(userStream);
            localVideoRef.current.srcObject = userStream;
            setIsCallActive(true);
        } catch (error) {
            console.error('Error starting call:', error);
        }
    };

    const endCall = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsCallActive(false);
        }
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className={`video-call-container ${isScreenSharing ? 'screen-sharing-active' : ''} ${isMinimized ? 'minimized' : ''}`}>
        <div className={`video-container ${isScreenSharing ? 'small-video' : ''}`} id="local-video">
            <video ref={localVideoRef} autoPlay muted playsInline></video>
        </div>
        <div className={`video-container ${isScreenSharing ? 'small-video' : ''}`} id="remote-video">
            {remoteStreamVisible && <video ref={remoteVideoRef} autoPlay playsInline></video>}
            {!remoteStreamVisible && <div className="placeholder">Video hidden during screen share</div>}
        </div>
        {isScreenSharing && <div className="screen-share-display">Screen sharing active</div>}
        <div className="controls">
            <button onClick={startCall} disabled={isCallActive}>
                <FontAwesomeIcon icon={faPhone} /> Start Call
            </button>
            <button onClick={endCall} disabled={!isCallActive}>
                <FontAwesomeIcon icon={faPhoneSlash} /> End Call
            </button>
            <button onClick={toggleAudio} disabled={!isCallActive}>
                <FontAwesomeIcon icon={isAudioEnabled ? faMicrophone : faMicrophoneSlash} /> {isAudioEnabled ? 'Mute' : 'Unmute'}
            </button>
            <button onClick={toggleVideo} disabled={!isCallActive}>
                <FontAwesomeIcon icon={isVideoEnabled ? faVideo : faVideoSlash} /> {isVideoEnabled ? 'Cam Off' : 'Cam On'}
            </button> {/* Add the muted microphone icon here */}
    
            <button onClick={isScreenSharing ? stopScreenShare : startScreenShare} disabled={!isCallActive}>
                <FontAwesomeIcon icon={isScreenSharing ? faStopCircle : faShareSquare} /> {isScreenSharing ? 'Stop Share' : 'Share Screen'}
            </button>
            <button onClick={toggleMinimize}>
                <FontAwesomeIcon icon={isMinimized ? faExpandArrowsAlt : faCompressArrowsAlt} /> {isMinimized ? 'Expand' : 'Minimize'}
            </button>
        </div>
       
    </div>
    
    );
};

export default VideoCall;
