'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface ZoiaxProCardProps {
  videoUrl?: string;
}

const ZoiaxProCard: React.FC<ZoiaxProCardProps> = ({
  videoUrl = '/zoiax-pro-video.mp4',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className='flex flex-col items-center justify-center pb-4 px-4 max-w-4xl mx-auto'>
      <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold text-black mb-6 text-center'>
        Zoiax pro
      </h1>

      <p className='text-base md:text-lg text-black mb-8 text-center max-w-3xl leading-relaxed'>
        Ambassadors are the gateway into Zoiax. They help open industries, invite new members, and build the foundation layer of this global ecosystem. Applications are open for a limited time.
      </p>

      <div className='w-full max-w-4xl'>
        <div className='relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100'>
          <video
            ref={videoRef}
            src={videoUrl}
            className='w-full h-full object-cover'
            controls={isPlaying}
            playsInline
          />

          {!isPlaying && (
            <div
              onClick={handlePlay}
              className='absolute inset-0 flex items-center justify-center cursor-pointer transition-all'
            >
              <div className='w-16 h-16 md:w-24 md:h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform'>
                <Play className='w-8 h-8 md:w-10 md:h-10 text-white ml-1' fill='white' />
              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default ZoiaxProCard;

