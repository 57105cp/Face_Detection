import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import "./App.css";

const socket = io('http://localhost:5000');

function App() {
    const [streaming, setStreaming] = useState(false);
    const [faces, setFaces] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (streaming) {
            startVideoStream();
        } else {
            stopVideoStream();
        }
    });

    const startVideoStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;

            // Add event listener to play the video once the metadata is loaded
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();
                captureFrame();
            };
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const captureFrame = async () => {
        if (streaming && streamRef.current?.active) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            const imageCapture = new ImageCapture(videoTrack);
            const bitmap = await imageCapture.grabFrame();

            canvasRef.current.width = bitmap.width;
            canvasRef.current.height = bitmap.height;
            const ctx = canvasRef.current.getContext('2d');
            ctx.drawImage(bitmap, 0, 0);
            const frameData = canvasRef.current.toDataURL('image/png');
            socket.emit('frame', frameData);
            // setTimeout(captureFrame, 1000);
        }
    };

    const stopVideoStream = () => {
        // const stream = videoRef.current.srcObject;
        const stream = streamRef.current;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        videoRef.current.srcObject = null;
        streamRef.current = null;
    };

    useEffect(() => {
        socket.on('processedFrame', ({ frameDataUrl, faces }) => {
            // console.log('Faces:', faces);
            setFaces(faces);
            // console.log("frameDataUrl_front : ", frameDataUrl.length);
            const img = new Image();
            img.src = frameDataUrl;
            img.onload = () => {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(img, 0, 0);
            };
        });

        return () => {
            socket.off('processedFrame');
        };
    }, []);

    return (
        <>
            <div className="App">
                <h1>Face Detection: Live Video</h1>
                <button className="button" onClick={() => setStreaming(!streaming)}>
                    {streaming ? 'Stop Video' : 'Start Video'}
                </button>
                {/* <video ref={videoRef} width="600" style={{ display: streaming ? 'block' : 'none' }} /> */}
                <video ref={videoRef} width="600" style={{ display: 'none' }} />
                <canvas ref={canvasRef} />
            </div>

            {/* Face Coordinates */}
            <div>
                <h3>Face Coordinates (x, y)</h3>
                {faces.map((face, index) => (
                    <div key={index}>
                        <h4>Face {index + 1}:</h4>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="highlight">Top Left</td>
                                    <td>{face.topLeft[0]}</td>
                                    <td>{face.topLeft[1]}</td>
                                </tr>
                                <tr>
                                    <td className="highlight">Bottom Right</td>
                                    <td>{face.bottomRight[0]}</td>
                                    <td>{face.bottomRight[1]}</td>
                                </tr>
                                {Object.entries(face.landmarks).map(([key, value], idx) => (
                                    <tr key={idx}>
                                        <td className="highlight">{key.replace('_', ' ')}</td>
                                        <td>{value[0]}</td>
                                        <td>{value[1]}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="highlight">Probability</td>
                                    <td colSpan="2">{(face.probability * 100).toFixed(2)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
