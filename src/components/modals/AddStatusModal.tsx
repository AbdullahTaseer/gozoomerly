'use client';

import {  useEffect, useState, useRef  } from 'react';
import Image, { StaticImageData } from 'next/image';
import { X, Camera, Send, ALargeSmall, Music, CirclePlus } from 'lucide-react';
import { statusImages } from '@/lib/MockData';
import GlobalInput from '../inputs/GlobalInput';
import { isStoryVideoFile } from '@/lib/supabase/stories';

interface StoryItem {
  id: string;
  file: File;
  preview: string;
  caption: string;
}

interface AddStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect?: (imageUrl: string | StaticImageData) => void;
  onStoryCreate?: (file: File, caption: string) => void;
  onMultipleStoriesCreate?: (stories: { file: File; caption: string }[]) => void;
}

const AddStatusModalContent: React.FC<AddStatusModalProps> = ({ isOpen, onClose, onImageSelect, onStoryCreate, onMultipleStoriesCreate }) => {
  const [selectedImage, setSelectedImage] = useState<string | StaticImageData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isMultiMode, setIsMultiMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStories(prev => {
      prev.forEach(story => URL.revokeObjectURL(story.preview));
      return [];
    });
    setSelectedImage(prev => {
      if (prev && typeof prev === 'string') {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setShowPreview(false);
    setSelectedFile(null);
    setCaption('');
    setIsMultiMode(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetState();
    } else {
      resetState();
      setIsUploading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stories.forEach(story => URL.revokeObjectURL(story.preview));
      if (selectedImage && typeof selectedImage === 'string') {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [stories, selectedImage]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddMoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isMultiMode || files.length > 1 || (selectedFile || stories.length > 0)) {
      setIsMultiMode(true);
      const newStories: StoryItem[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        file,
        preview: URL.createObjectURL(file),
        caption: '',
      }));
      
      if (selectedFile && !isMultiMode) {
        const existingStory: StoryItem = {
          id: `${Date.now()}-existing`,
          file: selectedFile,
          preview: typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedFile),
          caption: caption,
        };
        setStories([existingStory, ...newStories]);
        setSelectedImage(null);
        setSelectedFile(null);
        setCaption('');
      } else {
        setStories(prev => [...prev, ...newStories]);
      }
      setShowPreview(true);
    } else {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
      setShowPreview(true);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = (imageUrl: string | StaticImageData) => {
    setSelectedImage(imageUrl);
    setShowPreview(true);
  };

  const handleBackToGrid = () => {
    if (isMultiMode) {
      resetState();
    } else {
      if (selectedImage && typeof selectedImage === 'string') {
        URL.revokeObjectURL(selectedImage);
      }
      setShowPreview(false);
      setSelectedImage(null);
      setSelectedFile(null);
      setCaption('');
    }
  };

  const handleSend = async () => {
    if (isMultiMode && stories.length > 0) {
      if (onMultipleStoriesCreate) {
        setIsUploading(true);
        try {
          await onMultipleStoriesCreate(stories.map(s => ({ file: s.file, caption: s.caption })));
          resetState();
        } finally {
          setIsUploading(false);
        }
      }
      onClose();
    } else if (selectedFile && onStoryCreate) {
      setIsUploading(true);
      try {
        await onStoryCreate(selectedFile, caption);
        resetState();
      } finally {
        setIsUploading(false);
      }
      onClose();
    } else if (selectedImage && onImageSelect) {
      onImageSelect(selectedImage);
      resetState();
      onClose();
    }
  };

  const handleRemoveStory = (id: string) => {
    const story = stories.find(s => s.id === id);
    if (story) {
      URL.revokeObjectURL(story.preview);
    }
    setStories(prev => prev.filter(s => s.id !== id));
    if (stories.length === 1) {
      setIsMultiMode(false);
      setShowPreview(false);
    }
  };

  const handleUpdateStoryCaption = (id: string, caption: string) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, caption } : s));
  };

  const header = (
    <div className='flex justify-between items-center mb-4 flex-shrink-0'>
      <h2 className="text-xl font-bold text-black">Add Status</h2>
      <button
        onClick={showPreview ? handleBackToGrid : onClose}
        className="w-6 h-6 rounded-full border border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <X size={18} className="text-black" />
      </button>
    </div>
  );

  const imageGrid = (
    <div className='grid grid-cols-3 gap-2'>
      {}
      <button
        onClick={handleCameraClick}
        className='aspect-square rounded-lg bg-[#1B1D26] flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-opacity'
      >
        <Camera size={24} stroke='#E73F88' />
        <span className='text-white text-xs font-medium'>Camera</span>
      </button>

      {}
      {statusImages.map((imageSrc, index) => (
        <div
          key={index}
          onClick={() => handleImageClick(imageSrc)}
          className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === imageSrc
            ? 'border-[#F43C83]'
            : 'border-transparent hover:border-gray-300'
            }`}
        >
          <Image
            src={imageSrc}
            alt={`Status image ${index + 1}`}
            width={150}
            height={150}
            className='w-full h-full object-cover'
          />
        </div>
      ))}
    </div>
  );

  const previewView = (selectedImage || stories.length > 0) && (
    <div className='flex flex-col h-full min-h-0'>
      {isMultiMode && stories.length > 0 ? (
        <>
          <div className='flex-1 overflow-y-auto mb-4 space-y-4'>
            {stories.map((story, index) => (
              <div key={story.id} className='relative rounded-lg border-2 border-pink-500 overflow-hidden'>
                <div className='relative w-full aspect-square'>
                  {isStoryVideoFile(story.file) ? (
                    <video
                      src={story.preview}
                      className='w-full h-full object-cover'
                      controls
                    />
                  ) : (
                    <Image
                      src={story.preview}
                      alt={`Story ${index + 1}`}
                      fill
                      className='object-cover'
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  )}
                  <button
                    onClick={() => handleRemoveStory(story.id)}
                    className='absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center hover:bg-black/90 transition-colors z-10'
                  >
                    <X size={16} className='text-white' />
                  </button>
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3'>
                    <GlobalInput
                      placeholder={`Caption for story ${index + 1}...`}
                      onChange={(e) => handleUpdateStoryCaption(story.id, e.target.value)}
                      value={story.caption}
                      disabled={isUploading}
                      className='bg-white/90 rounded-full!'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='flex-shrink-0 flex items-center gap-3'>
            <button
              onClick={handleAddMoreClick}
              disabled={isUploading}
              className='px-4 py-2 rounded-full border-2 border-gray-300 hover:border-pink-500 transition-colors disabled:opacity-50'
            >
              <CirclePlus size={20} className='text-gray-700' />
            </button>
            <button
              onClick={handleSend}
              disabled={isUploading || stories.length === 0}
              className='flex-1 py-2 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 text-white font-medium'
            >
              {isUploading ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                `Post ${stories.length} ${stories.length === 1 ? 'Story' : 'Stories'}`
              )}
            </button>
          </div>
        </>
      ) : selectedImage && (
        <>
          <div className='flex-1 relative overflow-hidden mb-4 rounded-lg border-2 border-pink-500 min-h-[400px] max-h-[500px]'>
            {selectedFile && isStoryVideoFile(selectedFile) && typeof selectedImage === 'string' ? (
              <video
                src={selectedImage}
                className="absolute inset-0 w-full h-full object-cover"
                controls
              />
            ) : (
            <Image
              src={selectedImage}
              alt="Selected status"
              fill
              className='object-cover'
              sizes="(max-width: 768px) 100vw, 500px"
            />
            )}
            <div className='absolute top-4 right-4 flex flex-col gap-3 z-10'>
              <button className='w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/90 transition-colors'>
                <ALargeSmall size={20} className='text-white' />
              </button>
              <button className='w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/90 transition-colors'>
                <Music size={20} className='text-white' />
              </button>
              <button onClick={handleAddMoreClick} className='w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/90 transition-colors'>
                <CirclePlus size={20} className='text-white' />
              </button>
            </div>
          </div>
          <div className='flex-shrink-0 flex items-center gap-3'>
            <GlobalInput inputClassName='rounded-full!' placeholder='Add a caption..' onChange={(e) => setCaption(e.target.value)} value={caption} disabled={isUploading} />
            <button
              onClick={handleSend}
              disabled={isUploading}
              className='w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50'
            >
              {isUploading ? (
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                <Send size={18} className='text-white' />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div>
        {header}
        {showPreview ? previewView : imageGrid}
      </div>
    </>
  );
};

export default AddStatusModalContent;

