'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Heart, MessageCircle, Share2, Bookmark, MapPin } from 'lucide-react';

type ExploreCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  avatars?: string[];
  extraCount?: number;
  creatorName?: string;
  creatorAvatar?: string;
  timeAgo?: string;
  location?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  savesCount?: number;
};

const ExploreCardModal = ({
  isOpen,
  onClose,
  title,
  image,
  avatars = [],
  extraCount = 0,
  creatorName = 'Sarah Chen',
  creatorAvatar,
  timeAgo = '2h ago',
  location = 'Brooklyn, NY',
  likesCount = 234,
  commentsCount = 12,
  sharesCount = 12,
  savesCount = 12,
}: ExploreCardModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      return () => cancelAnimationFrame(id);
    } else {
      document.body.style.overflow = '';
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayAvatars = avatars.slice(0, 4);
  const slideOpen = isOpen && isAnimating;

  const ModalContent = () => (
    <>
      <div className="relative flex items-center justify-center px-4 bg-white">
        <h2 className="font-bold text-xl text-black capitalize">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} className="text-black" strokeWidth={2} />
        </button>
      </div>

      <div className="relative flex bg-[#1a1a1a] mt-5 h-[550px] min-[769px]:rounded-2xl overflow-hidden">

        <Image
          src={image}
          alt={title}
          unoptimized
          priority
          fill
          className='h-full object-contain'
        />


        <div className="absolute top-4 left-4 right-4 flex items-start gap-4 pointer-events-none z-10">
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {displayAvatars.map((avatar, i) => (
                <div
                  key={i}
                  className="relative w-9 h-9 rounded-full border-2 border-white/90 overflow-hidden bg-gray-300"
                >
                  <Image
                    src={avatar}
                    alt=""
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              ))}
              {extraCount > 0 && (
                <span className="w-9 h-9 rounded-full border border-gray-300 bg-white/90 flex items-center justify-center text-xs font-semibold text-gray-800">
                  +{extraCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-5">
            <div className="flex flex-col items-center gap-1">
              <Heart size={20} className="text-white" strokeWidth={2} fill="transparent" />
              <span className="text-[11px] font-medium text-white">100</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <MessageCircle size={18} className="text-white" strokeWidth={2} />
              <span className="text-[11px] font-medium text-white">80</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bookmark size={18} className="text-white" strokeWidth={2} />
              <span className="text-[11px] font-medium text-white">{savesCount}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-4 flex items-end gap-3 z-10">
          <div className="relative w-11 h-11 rounded-full border-2 border-white/80 overflow-hidden shrink-0">
            {creatorAvatar ? (
              <Image
                src={creatorAvatar}
                alt={creatorName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-[#c41e3a]" />
            )}
          </div>
          <div className="flex flex-col gap-0.5 pb-0.5">
            <p className="text-white font-semibold text-sm">{creatorName}</p>
            <p className="text-white/90 text-xs">{timeAgo}</p>
            <div className="flex items-center gap-1.5 text-white/90 text-xs mt-0.5">
              <MapPin size={12} className="shrink-0" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-14 flex flex-col items-center justify-center gap-8 pointer-events-auto max-[769px]:hidden">
          <button className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-80 transition-opacity">
            <Heart size={24} className="text-white" strokeWidth={2} fill="transparent" />
            <span className="text-xs font-medium">{likesCount}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-80 transition-opacity">
            <MessageCircle size={22} className="text-white" strokeWidth={2} />
            <span className="text-xs font-medium">{commentsCount}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-80 transition-opacity">
            <Share2 size={22} className="text-white" strokeWidth={2} />
            <span className="text-xs font-medium">{sharesCount}</span>
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 min-[770px]:hidden pointer-events-auto">
          <button className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-90 transition-opacity">
            <Heart size={24} fill="white" className="drop-shadow-md" />
            <span className="text-xs font-medium drop-shadow-md">{likesCount}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-90 transition-opacity">
            <MessageCircle size={22} className="text-white drop-shadow-md" strokeWidth={2} />
            <span className="text-xs font-medium drop-shadow-md">{commentsCount}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-90 transition-opacity">
            <Share2 size={22} className="text-white drop-shadow-md" strokeWidth={2} />
            <span className="text-xs font-medium drop-shadow-md">{sharesCount}</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-[1010] bg-black/50 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[1011] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${slideOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <ModalContent />
        </div>
      </div>

      <div
        className={`min-[769px]:flex hidden fixed inset-0 z-[1011] items-center justify-center p-4 sm:p-6 pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl p-4 border max-h-[650px] w-[650px] border-gray-200 overflow-hidden pointer-events-auto transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalContent />
        </div>
      </div>
    </>
  );
};

export default ExploreCardModal;
