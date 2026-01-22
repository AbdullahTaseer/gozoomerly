'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story } from '@/lib/supabase/stories';
import { viewStory } from '@/lib/supabase/stories';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyGroups: { user: Story['user']; stories: Story[]; hasUnviewed: boolean }[];
  initialGroupIndex?: number;
  currentUserId?: string;
}

const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  storyGroups,
  initialGroupIndex = 0,
  currentUserId,
}) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  useEffect(() => {
    if (isOpen && currentStory) {
      setProgress(0);

      if (currentUserId && currentStory.id) {
        viewStory(currentStory.id, currentUserId).catch(() => {});
      }

      const duration = 5000;
      const interval = 100;
      let elapsed = 0;

      progressIntervalRef.current = setInterval(() => {
        elapsed += interval;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= duration) {
          handleNextStory();
        }
      }, interval);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [isOpen, currentGroupIndex, currentStoryIndex, currentStory?.id, currentUserId]);

  useEffect(() => {
    if (isOpen) {
      setCurrentGroupIndex(initialGroupIndex);
      setCurrentStoryIndex(0);
      setProgress(0);
    }
  }, [isOpen, initialGroupIndex]);

  useEffect(() => {
    if (videoRef.current && currentStory?.content_type === 'video') {
      videoRef.current.play().catch(() => {});
    }
  }, [currentStory]);

  const handleNextStory = () => {
    if (!currentGroup) return;

    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {

      if (currentGroupIndex < storyGroups.length - 1) {
        setCurrentGroupIndex(currentGroupIndex + 1);
        setCurrentStoryIndex(0);
      } else {

        onClose();
      }
    }
  };

  const handlePreviousStory = () => {
    if (!currentGroup) return;

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {

      if (currentGroupIndex > 0) {
        setCurrentGroupIndex(currentGroupIndex - 1);
        const prevGroup = storyGroups[currentGroupIndex - 1];
        setCurrentStoryIndex(prevGroup.stories.length - 1);
      }
    }
  };

  const handleProgressClick = (index: number) => {
    if (!currentGroup) return;
    if (index < currentGroup.stories.length) {
      setCurrentStoryIndex(index);
      setProgress(0);
    }
  };

  if (!isOpen || !currentGroup || !currentStory) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black"
      onClick={onClose}
    >
      {}
      <div className="absolute top-0 left-0 right-0 z-10 p-2 flex gap-1">
        {currentGroup.stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleProgressClick(index);
            }}
          >
            <div
              className={`h-full bg-white transition-all duration-100 ${
                index < currentStoryIndex
                  ? 'w-full'
                  : index === currentStoryIndex
                  ? 'w-full'
                  : 'w-0'
              }`}
              style={{
                width: index === currentStoryIndex ? `${progress}%` : index < currentStoryIndex ? '100%' : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {}
      <div className="absolute top-12 left-0 right-0 z-10 px-4 flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          {currentGroup.user?.profile_pic_url ? (
            <Image
              src={currentGroup.user.profile_pic_url}
              alt={currentGroup.user.name || 'User'}
              width={40}
              height={40}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
              {currentGroup.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className="text-white font-semibold">{currentGroup.user?.name || 'Unknown User'}</p>
            <p className="text-white/70 text-sm">
              {new Date(currentStory.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {}
      <div className="absolute inset-0 flex items-center justify-center">
        {currentStory.content_type === 'image' && currentStory.media?.cdn_url && (
          <Image
            src={currentStory.media.cdn_url}
            alt={currentStory.caption || 'Story'}
            fill
            className="object-contain"
            unoptimized
          />
        )}

        {currentStory.content_type === 'video' && currentStory.media?.cdn_url && (
          <video
            ref={videoRef}
            src={currentStory.media.cdn_url}
            className="max-w-full max-h-full object-contain"
            controls={false}
            autoPlay
            loop={false}
            onEnded={handleNextStory}
          />
        )}

        {currentStory.content_type === 'text' && (
          <div
            className="text-center px-8 py-16 rounded-lg max-w-md"
            style={{
              backgroundColor: currentStory.text_background_color || '#000',
              fontFamily: currentStory.text_font_style || 'sans-serif',
              color: '#fff',
            }}
          >
            <p className="text-2xl whitespace-pre-wrap">{currentStory.text_content}</p>
          </div>
        )}

        {}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <p className="text-white text-center bg-black/50 rounded-lg px-4 py-2">
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>

      {}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePreviousStory();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-20"
        disabled={currentGroupIndex === 0 && currentStoryIndex === 0}
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNextStory();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-20"
      >
        <ChevronRight size={32} />
      </button>

      {}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handlePreviousStory();
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleNextStory();
        }}
      />
    </div>
  );
};

export default StoryViewerModal;
