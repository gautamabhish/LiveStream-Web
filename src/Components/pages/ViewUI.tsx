// @ts-nocheck
import React, { useRef, useState } from 'react';

import { Broadcaster } from '../../utils/BroadCaster';
import { Viewer } from '../../utils/Viewer';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
    const mainClass = new Broadcaster();
    const viewer = new Viewer();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [magnetLink, setMagnetLink] = useState('');
    const [inputLink, setInputLink] = useState('');
    const navigate = useNavigate();

    /** ✅ Join Stream from Magnet Link */
    const joinStream = () => {
        if (!inputLink.trim()) return;

        viewer.playStream(inputLink);
    };

    return (
        <div className='min-h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-300 via-blue-200 to-blue-300'>
            <div className='flex flex-col lg:flex-row gap-6 min-h-screen items-center'>

                {/* Video Container */}
                <div className='h-[60%] w-[66%] p-8 md:h-[500px] md:w-[880px] bg-black rounded-3xl'>
                    <video ref={videoRef} id="remoteVideo" autoPlay playsInline controls={false} className='h-full w-full bg-white rounded-xl object-cover'  />
                </div>

                <div id="controls" className='flex flex-col lg:flex-row gap-12 items-center'>
                    <input 
                        type="text" 
                        className='bg-white p-3 rounded-xl' 
                        placeholder='Enter Magnet Link' 
                        value={inputLink} 
                        onChange={(event) => setInputLink(event.target.value)} 
                    />
                    
                    <button 
                        className='py-4 px-10 bg-green-500 rounded-3xl hover:cursor-pointer hover:bg-green-800' 
                        onClick={joinStream}
                    >
                        Join Stream
                    </button>

                    <button 
                        className='py-4 px-10 bg-blue-500 rounded-3xl hover:cursor-pointer hover:bg-blue-800' 
                        onClick={()=>navigate('/stream')}
                    >
                        Start Stream
                    </button>

                    {magnetLink && (
                        <p className="text-white mt-4">Share this Magnet Link: <code>{magnetLink}</code></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Connect;
