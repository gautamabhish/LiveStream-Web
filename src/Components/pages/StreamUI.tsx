// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { WebRtc } from "../../utils/webrtc";

const StreamUI = () => {
    const webrtc = new WebRtc();
    const videoRef = useRef<HTMLVideoElement>(null);

    // ✅ State Management
    const [streamLink, setStreamLink] = useState("");
    const [videoSources, setVideoSources] = useState([]);
    const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
    const [showVideoOptions, setShowVideoOptions] = useState(false);

    const [audioSources, setAudioSources] = useState([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
    const [showAudioOptions, setShowAudioOptions] = useState(false);

    /** ✅ Get List of Video & Audio Input Devices */
    useEffect(() => {
        async function fetchDevices() {
            const devices = await navigator.mediaDevices.enumerateDevices();

            // Filter video and audio devices
            setVideoSources(devices.filter(device => device.kind === "videoinput"));
            setAudioSources(devices.filter(device => device.kind === "audioinput"));
        }

        fetchDevices();
    }, []);

    /** ✅ Start Stream with Selected Video & Audio Source */
    const startStream = async () => {
        try {
            const stream = await webrtc.getUsermedia({ 
                video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true, 
                audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            console.log("🎥 Streaming started...");
        } catch (error) {
            console.error("❌ Error starting stream:", error);
        }
    };

    /** ✅ End Stream Properly */
    const endStream = () => {
        webrtc.stopStream();
        if (videoRef.current) {
            videoRef.current.srcObject = null; // Clear video
        }
        console.log("❌ Streaming ended...");
        
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
            {/* Video Container */}
            <div className="relative w-full max-w-screen-lg m-2 bg-gray-800 rounded-xl overflow-hidden">
                <video ref={videoRef} className="w-full h-96 bg-black rounded-xl" autoPlay playsInline muted />

                {/* Control Bar */}
                <div className="absolute bottom-0 left-0 right-0 flex bg-black bg-opacity-60 py-4 text-xl items-center justify-evenly">
                    
                    {/* Video Source Selection */}
                    <div>
                        {showVideoOptions && (
                            <div className="absolute bottom-16 bg-gray-800 p-4 rounded-lg">
                                {videoSources.map((device, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => { 
                                            setSelectedVideoDevice(device.deviceId);
                                            setShowVideoOptions(false);
                                        }}
                                        className="block px-4 py-2 bg-gray-700 rounded-lg w-full mt-2"
                                    >
                                        {device.label || `Camera ${index + 1}`}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button 
                            className="px-4 py-2 bg-gray-700 rounded-lg" 
                            onClick={() => setShowVideoOptions(!showVideoOptions)}
                        >
                            Select Camera
                        </button>
                    </div>

                    {/* Audio Source Selection */}
                    <div>
                        {showAudioOptions && (
                            <div className="absolute bottom-16 bg-gray-800 p-4 rounded-lg">
                                {audioSources.map((device, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => { 
                                            setSelectedAudioDevice(device.deviceId);
                                            setShowAudioOptions(false);
                                        }}
                                        className="block px-4 py-2 bg-gray-700 rounded-lg w-full mt-2"
                                    >
                                        {device.label || `Microphone ${index + 1}`}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button 
                            className="px-4 py-2 bg-gray-700 rounded-lg" 
                            onClick={() => setShowAudioOptions(!showAudioOptions)}
                        >
                            Select Microphone
                        </button>
                    </div>

                    <button className="px-4 py-2 bg-gray-700 rounded-lg">Screen Share</button>
                </div>
            </div>

            {/* Streaming Controls */}
            <div className="mt-6 gap-2 flex flex-col items-center">
                <button 
                    className="px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-700 transition"
                    onClick={startStream}
                >
                    Start Stream
                </button>
                <button 
                    className="px-6 py-3 bg-red-500 rounded-xl hover:bg-red-700 transition"
                    onClick={endStream}
                >
                    End Stream
                </button>

                {streamLink && (
                    <div className="mt-4">
                        <span>Link is: </span>
                        <code className="bg-gray-700 px-3 py-1 rounded-lg">{streamLink}</code>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StreamUI;
