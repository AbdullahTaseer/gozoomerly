'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import GlobalButton from '@/components/buttons/GlobalButton';

const SupplyPartnerTab = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="px-[5%] py-6">
      <div className="space-y-6">
        <p className="text-lg md:text-xl text-center text-gray-800 leading-relaxed">
          Apply to become a supply partner to offer your services or sell at zoiax.
        </p>
        {/* Video Player */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black">
          <video
            ref={videoRef}
            src="/zoiax-pro-video.mp4"
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-500/20 flex items-center justify-center border-2 border-pink-500 cursor-pointer hover:bg-pink-500/30 transition-colors"
                >
                  <Play className="text-pink-500 ml-1" size={24} fill="currentColor" />
                </button>
              </div>
            </div>
          )}
          {isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center border-2 border-white/50 cursor-pointer hover:bg-black/70 transition-colors"
            >
              <Pause className="text-white" size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-base text-gray-800 leading-relaxed">
            Apply to become a supply partner to offer your services or sell at zoiax.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Industries zoiax building products and services in media, construction, wellness, education.
          </p>

          {/* Benefits Section */}
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Benefits of becoming a Supply Partner:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Access to a large customer base and marketplace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Marketing support and promotional opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Streamlined payment processing and order management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Analytics and insights to grow your business</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 mt-1">•</span>
                <span>Dedicated partner support team</span>
              </li>
            </ul>
          </div>

          {/* Apply Button */}
          <GlobalButton
            title="Apply to become a media supply partner"
            width="100%"
            height="48px"
            onClick={() => { }}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplyPartnerTab;

