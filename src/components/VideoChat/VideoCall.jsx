import React, { useEffect, useRef, useState } from 'react';
import styles from './VideoCall.scss';

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

    useEffect(() => {
        // Initialize WebSocket connection
        const ws = new WebSocket('ws://localhost:3000');
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
            setIsScreenSharing(false);
        }

        setIsCallActive(false);
    };

    const toggleVideo = () => {
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
    };

    const toggleAudio = () => {
        const audioTrack = stream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
    };

    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = screenStream;

            screenStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, screenStream);
            });

            setIsScreenSharing(true);
        } catch (error) {
            console.error('Error sharing screen:', error);
        }
    };

    return (
        <div className={styles.videoCallContainer}>
            <div className={styles.videoContainer}>
                <video ref={localVideoRef} autoPlay muted className={styles.videoElement} />
                <video ref={remoteVideoRef} autoPlay className={styles.videoElement} />
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => startCall('recipient-id')} className={styles.button}>Start Call</button>
                <button onClick={endCall} disabled={!isCallActive} className={styles.button}>End Call</button>
                <button onClick={toggleVideo} className={styles.button}>
                    {isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
                </button>
                <button onClick={toggleAudio} className={styles.button}>
                    {isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
                </button>
                <button onClick={startScreenShare} disabled={isScreenSharing} className={styles.button}>
                    {isScreenSharing ? 'Stop Sharing Screen' : 'Share Screen'}
                </button>
            </div>
        </div>
    );
};

export default VideoCall;
