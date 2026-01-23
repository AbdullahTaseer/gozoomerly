'use client';

import {  useState, useEffect, useRef  } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Story } from '@/lib/supabase/stories';
import { viewStory, deleteStory } from '@/lib/supabase/stories';
import toast from 'react-hot-toast';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyGroups: { user: Story['user']; stories: Story[]; hasUnviewed: boolean }[];
  initialGroupIndex?: number;
  currentUserId?: string;
  onStoryDeleted?: () => void; // Callback to refresh stories after deletion
}

const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  storyGroups,
  initialGroupIndex = 0,
  currentUserId,
  onStoryDeleted,
}) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];
  const isOwnStory = currentUserId && currentGroup?.user?.id === currentUserId;

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

  // Adjust story index if current story group changes (e.g., after deletion)
  useEffect(() => {
    if (currentGroup && currentStoryIndex >= currentGroup.stories.length) {
      if (currentGroup.stories.length > 0) {
        setCurrentStoryIndex(currentGroup.stories.length - 1);
      } else {
        // No stories left, close modal
        onClose();
      }
    }
  }, [currentGroup, currentStoryIndex, onClose]);

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

  const handleDeleteStory = async () => {
    if (!currentStory || !currentUserId || !isOwnStory) return;

    const confirmed = window.confirm('Are you sure you want to delete this status?');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteStory(currentStory.id, currentUserId);
      
      if (error) {
        console.error('Delete story error:', error);
        toast.error(`Failed to delete status: ${error.message || 'Unknown error'}`);
        setIsDeleting(false);
        return;
      }

      toast.success('Status deleted successfully');
      
      // Check if this was the last story
      const remainingStories = currentGroup.stories.filter(s => s.id !== currentStory.id);
      
      // If no stories left in the group, close the modal
      if (remainingStories.length === 0) {
        onClose();
        // Call the callback to refresh stories in parent
        if (onStoryDeleted) {
          onStoryDeleted();
        }
        return;
      }

      // Call the callback to refresh stories in parent
      if (onStoryDeleted) {
        onStoryDeleted();
      }

      // Adjust story index - if we're at the end, go to previous, otherwise stay at same index
      if (currentStoryIndex >= remainingStories.length) {
        setCurrentStoryIndex(remainingStories.length - 1);
      }
      // If not at the end, the same index will now show the next story after parent refreshes
    } catch (error) {
      toast.error('Failed to delete status');
    } finally {
      setIsDeleting(false);
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
        <div className="flex items-center gap-2">
          {isOwnStory && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteStory();
              }}
              disabled={isDeleting}
              className="text-white hover:bg-red-500/20 rounded-full p-2 transition-colors disabled:opacity-50"
              title="Delete status"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
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
