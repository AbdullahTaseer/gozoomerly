'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { X, Camera, Send, ALargeSmall, Music, CirclePlus } from 'lucide-react';
import { statusImages } from '@/lib/MockData';
import GlobalInput from '../inputs/GlobalInput';

interface AddStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect?: (imageUrl: string | StaticImageData) => void;
}

const AddStatusModal: React.FC<AddStatusModalProps> = ({ isOpen, onClose, onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | StaticImageData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset preview state when modal closes
      setShowPreview(false);
      setSelectedImage(null);
      setCaption('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCameraClick = () => {
    // Trigger the hidden file input which will open camera on mobile
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the selected image
    const imageUrl = URL.createObjectURL(file);

    // Set as selected image and show preview
    setSelectedImage(imageUrl);
    setShowPreview(true);

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = (imageUrl: string | StaticImageData) => {
    setSelectedImage(imageUrl);
    setShowPreview(true);
  };

  const handleBackToGrid = () => {
    setShowPreview(false);
    setSelectedImage(null);
  };

  const handleSend = () => {
    if (selectedImage && onImageSelect) {
      onImageSelect(selectedImage);
    }
    onClose();
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
      {/* Camera Button */}
      <button
        onClick={handleCameraClick}
        className='aspect-square rounded-lg bg-[#1B1D26] flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-opacity'
      >
        <Camera size={24} stroke='#E73F88' />
        <span className='text-white text-xs font-medium'>Camera</span>
      </button>

      {/* Image Thumbnails */}
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

  const previewView = selectedImage && (
    <div className='flex flex-col h-full min-h-0'>

      {/* Image Preview */}
      <div className='flex-1 relative overflow-hidden mb-4 rounded-lg border-2 border-blue-500 min-h-[400px] max-h-[500px]'>
        <Image
          src={selectedImage}
          alt="Selected status"
          fill
          className='object-cover'
          sizes="(max-width: 768px) 100vw, 500px"
        />

        <div className='absolute top-4 right-4 flex flex-col gap-3 z-10'>
          <button className='w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/90 transition-colors'>
            <ALargeSmall size={20} className='text-white' />
          </button>
          <button className='w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/90 transition-colors'>
            <Music size={20} className='text-white' />
          </button>
          <button className='w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-800/90 transition-colors'>
            <CirclePlus size={20} className='text-white' />
          </button>
        </div>
      </div>

      <div className='flex-shrink-0 flex items-center gap-3'>
        <GlobalInput borderRadius='40px' placeholder='Add a caption..' onChange={(e) => setCaption(e.target.value)} value={caption} />
        <button
          onClick={handleSend}
          className='w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors'
        >
          <Send size={18} className='text-white' />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Hidden file input for camera/gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Mobile Bottom Slide-up Modal */}
      <div
        className={`hidden max-[769px]:flex flex-col fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] ${isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 flex-shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="px-4 pb-6 overflow-y-auto flex-1 min-h-0">
          {header}
          {showPreview ? previewView : imageGrid}
        </div>
      </div>

      {/* Desktop Centered Modal */}
      <div
        className={`min-[770px]:flex hidden fixed inset-0 z-[1001] items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-[90%] max-w-md transition-all duration-300 flex flex-col max-h-[75vh] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 overflow-y-auto flex-1 min-h-0">
            {header}
            {showPreview ? previewView : imageGrid}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStatusModal;

