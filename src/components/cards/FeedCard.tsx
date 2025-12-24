'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MoreVertical, Heart, MessageCircle, Share, Clock, Play } from 'lucide-react';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';

export type FeedCardLayout = 'horizontal' | 'carousel';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface FeedCardProps {
  userName?: string;
  userAvatar?: string;
  timestamp?: string;
  onOptionsClick?: () => void;
  onUserClick?: () => void;

  layout?: FeedCardLayout;
  videoThumbnail?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  actionTag?: string;
  onVideoClick?: () => void;

  mediaItems?: MediaItem[];
  thumbnailImage?: string; 

  // Footer props
  likes?: number;
  comments?: number;
  shares?: number;
  memories?: number;
  onLikeClick?: () => void;
  onCommentClick?: () => void;
  onShareClick?: () => void;
  onMemoryClick?: () => void;
}

const FeedCard: React.FC<FeedCardProps> = ({
  userName = 'Samantha Carter',
  userAvatar,
  timestamp = '5 Minutes ago',
  onOptionsClick,
  onUserClick,
  layout = 'horizontal',
  videoThumbnail = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  videoUrl = 'https://videos.pexels.com/video-files/855337/855337-hd_1920_1080_25fps.mp4',
  title = "Sean Parker birthday",
  description = "Sean, you're the most deserving person I know. Here's to your dream trip",
  actionTag = "Gifted : $250",
  onVideoClick,
  mediaItems = [],
  thumbnailImage,
  likes = 1,
  comments = 1,
  shares = 1,
  memories = 1,
  onLikeClick,
  onCommentClick,
  onShareClick,
  onMemoryClick,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [playingVideos, setPlayingVideos] = useState<{ [key: number]: boolean }>({});

  const handleVideoClick = () => {
    if (onVideoClick) {
      onVideoClick();
    } else {
      setIsPlaying(true);
    }
  };

  const handleCarouselVideoClick = (index: number) => {
    setPlayingVideos(prev => ({ ...prev, [index]: true }));
  };

  const goPrev = () => setCarouselIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCarouselIndex((prev) => Math.min(prev + 1, (mediaItems?.length || 1) - 1));

  const currentMedia = mediaItems?.[carouselIndex];

  return (
    <div className="bg-[#F5F5F5] rounded-[24px] p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div
          onClick={onUserClick}
          className={`flex items-center gap-3 ${onUserClick ? 'cursor-pointer' : ''}`}
        >
          <div className="relative w-[50px] h-[50px] shrink-0">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName}
                fill
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = ProfileAvatar.src || ProfileAvatar;
                }}
              />
            ) : (
              <Image
                src={ProfileAvatar}
                alt={userName}
                fill
                className="rounded-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-bold text-base text-[#1B1D26]">{userName}</p>
            <p className="text-sm text-gray-500 mt-0.5">{timestamp}</p>
          </div>
        </div>
        <button
          onClick={onOptionsClick}
          className="text-gray-600 hover:text-gray-900 cursor-pointer p-1"
          aria-label="More options"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {layout === 'horizontal' ? (
        <div className="flex gap-4 max-[350px]:flex-col mb-4">
          <div className="relative w-[150px] max-[350px]:w-full h-[170px] shrink-0 rounded-lg overflow-hidden bg-gray-200">
            {isPlaying && videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover rounded-lg"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div
                className="relative w-full h-full cursor-pointer"
                onClick={handleVideoClick}
              >
                <Image
                  src={videoThumbnail}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <Play size={24} className="text-black ml-1" fill="black" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#1B1D26] mb-2">{title}</h3>
              <p className="text-sm text-[#1B1D26] line-clamp-3 leading-relaxed mb-3">{description}</p>
            </div>
            {actionTag && (
              <div className="inline-block">
                <span className="bg-black text-white rounded-full px-4 py-2 text-xs">
                  {actionTag}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-4 mb-4">
            {thumbnailImage && (
              <div className="relative w-[80px] h-[80px] shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={thumbnailImage}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#1B1D26] mb-2">{title}</h3>
              <p className="text-sm text-[#1B1D26] line-clamp-3 leading-relaxed">{description}</p>
            </div>
          </div>

          {mediaItems && mediaItems.length > 0 && (
            <div className="relative w-full mb-4 rounded-lg overflow-hidden bg-gray-200">
              {currentMedia?.type === 'video' && playingVideos[carouselIndex] ? (
                <video
                  src={currentMedia.url}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[500px] object-cover"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="relative w-full">
                  <Image
                    src={currentMedia?.type === 'video' ? (currentMedia.thumbnail || currentMedia.url) : (currentMedia?.url || '')}
                    alt={title}
                    width={800}
                    height={500}
                    className="w-full h-auto max-h-[500px] object-cover"
                    unoptimized
                  />
                  {currentMedia?.type === 'video' && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer"
                      onClick={() => handleCarouselVideoClick(carouselIndex)}
                    >
                      <div className="bg-white/90 rounded-full p-4 shadow-lg">
                        <Play size={28} className="text-black ml-1" fill="black" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {mediaItems.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {mediaItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCarouselIndex(idx);
                        setPlayingVideos({});
                      }}
                      className={`h-2 w-2 rounded-full transition ${carouselIndex === idx ? 'bg-white' : 'bg-white/50'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="flex items-center flex-wrap gap-6 pt-4">
        <button
          onClick={onLikeClick}
          className="flex items-center gap-2 text-black hover:text-pink-500 transition-colors"
        >
          <Heart size={18} className="stroke-2" />
          <span className="text-sm">{likes} Like{likes !== 1 ? 's' : ''}</span>
        </button>

        <button
          onClick={onCommentClick}
          className="flex items-center gap-2 text-black hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={18} className="stroke-2" />
          <span className="text-sm">{comments} Comments</span>
        </button>

        <button
          onClick={onShareClick}
          className="flex items-center gap-2 text-black hover:text-green-500 transition-colors"
        >
          <Share size={18} className="stroke-2" />
          <span className="text-sm">{shares} Share{shares !== 1 ? 's' : ''}</span>
        </button>

        <button
          onClick={onMemoryClick}
          className="flex items-center gap-2 text-black hover:text-purple-500 transition-colors"
        >
          <Clock size={18} className="stroke-2" />
          <span className="text-sm">{memories} Memories</span>
        </button>
      </div>
    </div>
  );
};

export default FeedCard;