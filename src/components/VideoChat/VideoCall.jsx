import React, { useEffect, useRef, useState } from 'react';
import './VideoCall.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faPhoneSlash, faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, faShareSquare, faStopCircle } from '@fortawesome/free-solid-svg-icons';

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
    const [screenSharingInitiatedBy, setScreenSharingInitiatedBy] = useState(null); // Track who started screen sharing

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

    const startCall = async (recipientId) => {
        if (!peerConnection) {
            const pc = new RTCPeerConnection();

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.send(JSON.stringify({
                        type: 'ice-candidate',
                        candidate: event.candidate,
                        to: recipientId
                    }));
                }
            };

            pc.ontrack = (event) => {
                remoteVideoRef.current.srcObject = event.streams[0];
            };

            setPeerConnection(pc);

            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = localStream;
            setStream(localStream);

            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.send(JSON.stringify({
                type: 'offer',
                offer: offer,
                to: recipientId
            }));

            setIsCallActive(true);
        }
    };

    const endCall = () => {
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
            setIsScreenSharing(false);
        }

        setIsCallActive(false);
        setRemoteStreamVisible(true);
        setScreenSharingInitiatedBy(null);
    };

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoEnabled(videoTrack.enabled);
        }
    };

    const toggleAudio = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioEnabled(audioTrack.enabled);
        }
    };

    const startScreenShare = async () => {
        if (isScreenSharing) {
            alert('Screen sharing is already active.');
            return;
        }

        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = screenStream;

            if (peerConnection) {
                screenStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, screenStream);
                });
            }

            setIsScreenSharing(true);
            setRemoteStreamVisible(false);

            // Notify other users that screen sharing has started
            socket.send(JSON.stringify({
                type: 'screen-share-start',
                from: 'your-user-id' // Replace with actual user ID or identifier
            }));
            setScreenSharingInitiatedBy('your-user-id'); // Track who initiated screen sharing

        } catch (error) {
            console.error('Error sharing screen:', error);
            alert('Unable to share screen. Please check your permissions and try again.');
        }
    };

    const stopScreenShare = () => {
        if (!isScreenSharing) {
            alert('Screen sharing is not active.');
            return;
        }

        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
            setIsScreenSharing(false);
            setRemoteStreamVisible(true);

            // Notify other users that screen sharing has stopped
            socket.send(JSON.stringify({
                type: 'screen-share-stop',
                from: 'your-user-id' // Replace with actual user ID or identifier
            }));
            setScreenSharingInitiatedBy(null);
        }
    };

    const handleScreenShareStart = (from) => {
        // Handle incoming screen share start message
        if (screenSharingInitiatedBy === null) {
            // If no one is currently sharing the screen
            setScreenSharingInitiatedBy(from);
            setRemoteStreamVisible(false);
        }
    };

    const handleScreenShareStop = (from) => {
        // Handle incoming screen share stop message
        if (screenSharingInitiatedBy === from) {
            // If the screen share was initiated by this user
            setScreenSharingInitiatedBy(null);
            setRemoteStreamVisible(true);
        }
    };

    return (
        <div className="videoCallContainer">
            <div className="videoContainer">
                <video ref={localVideoRef} autoPlay muted className="videoElement" />
                {remoteStreamVisible && (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        className={`videoElement ${isScreenSharing ? 'remoteVideoMinimized' : ''}`}
                    />
                )}
            </div>
            <div className="buttonContainer">
                <button onClick={() => startCall('recipient-id')} className="button">
                    <FontAwesomeIcon icon={faPhone} /> Start Call
                </button>
                <button onClick={endCall} disabled={!isCallActive} className="button">
                    <FontAwesomeIcon icon={faPhoneSlash} /> End Call
                </button>
                <button onClick={toggleVideo} className="button">
                    <FontAwesomeIcon icon={isVideoEnabled ? faVideo : faVideoSlash} />
                    {isVideoEnabled ? ' Turn Off Video' : ' Turn On Video'}
                </button>
                <button onClick={toggleAudio} className="button">
                    <FontAwesomeIcon icon={isAudioEnabled ? faMicrophone : faMicrophoneSlash} />
                    {isAudioEnabled ? ' Mute Audio' : ' Unmute Audio'}
                </button>
                {isScreenSharing ? (
                    <button onClick={stopScreenShare} className="button">
                        <FontAwesomeIcon icon={faStopCircle} /> Stop Sharing Screen
                    </button>
                ) : (
                    <button onClick={startScreenShare} disabled={!isCallActive} className="button">
                        <FontAwesomeIcon icon={faShareSquare} /> Share Screen
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoCall;
