// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { WebRtc } from '../../utils/webrtc';
import { Viewer } from '../../utils/Viewer';
const Connect = () => {
    const mainClass = new WebRtc();
    const viewer = new Viewer();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [magnetLink, setMagnetLink] = useState('');
    const [inputLink, setInputLink] = useState('');


    const startStream = () => {
        const startStream = async () => {
        if (isStreaming) return;
        try {
            const magnetURI = await mainClass.getUsermedia({ video: true, audio: false });
            setMagnetLink(magnetURI);
            if (videoRef.current) {
                videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            }
            setIsStreaming(true);
        } catch (error) {
            console.error('Error accessing media:', error);
        }
    };
    };

    const stopStream = () => {
        mainClass.stopStream();
        if (videoRef.current) {
            videoRef.current.srcObject = null; // Remove video source
        }
        setIsStreaming(false);
    };

    const joinStream = () => {
        if (!inputLink.trim()) return;
        viewer.playStream(inputLink, (url) => {
            if (videoRef.current) {
                videoRef.current.src = url;
            }
        });
    };


    return (
        <div className='min-h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-300 via-blue-200 to-blue-300'>
            <div className='flex flex-col lg:flex-row gap-6 min-h-screen items-center'>

                {/* Video Container */}
                <div className='h-[60%] w-[66%] p-8 md:h-[500px] md:w-[880px] bg-black rounded-3xl'>
                    <video ref={videoRef} id="localVideo" autoPlay className='h-full w-full bg-white rounded-xl object-cover' />
                </div>

                <div id="controls" className='flex flex-col lg:flex-row gap-12 items-center'>
                    <input type="text" className='bg-white p-3 rounded-xl' placeholder='Enter Magnet Link' onChange={(event) => setInputLink(event.target.value)} />
                    
                    <button className='py-4 px-10 bg-green-500 rounded-3xl' onClick={joinStream}>
                        Join Stream
                    </button>

                    <button className='py-4 px-10 bg-blue-500 rounded-3xl' onClick={startStream}>
                        Start Stream
                    </button>
                </div>
            </div>
        </div>
    );

}

export default Connect;
