'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type MemoryDetailsItem = {
  id: string;
  url: string;
  isVideo: boolean;
};

type MemoryDetailsCardProps = {
  isOpen: boolean;
  title?: string;
  items: MemoryDetailsItem[];
  initialIndex?: number;
  onClose: () => void;
};

const MemoryDetailsCard = ({
  isOpen,
  title = 'Memories',
  items,
  initialIndex = 0,
  onClose,
}: MemoryDetailsCardProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const bounded = Math.max(0, Math.min(initialIndex, Math.max(0, items.length - 1)));
    setActiveIndex(bounded);
  }, [isOpen, initialIndex, items.length]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      setIsAnimating(false);
      return;
    }
    document.body.style.overflow = 'hidden';
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAnimating(true));
    });
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const current = items[activeIndex];
  if (!current) return null;
  const hasCarousel = items.length > 1;
  const slideOpen = isOpen && isAnimating;

  return (
    <>
      <div
        className={`fixed inset-0 z-[1200] bg-black/50 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[1201] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${slideOpen ? 'translate-y-0' : 'translate-y-full'} ${!isOpen ? 'pointer-events-none' : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!isOpen}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        <div className="relative bg-[#111] h-[78vh] rounded-t-2xl overflow-hidden">

          <div className="absolute top-3 left-5 z-20 text-white text-2xl font-medium">
            {title}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white hover:opacity-80"
            aria-label="Close memory details"
          >
            <X size={24} />
          </button>

          <div className="absolute top-14 left-3 right-3 z-20 flex gap-1">
            {items.map((_, i) => (
              <div
                key={`memory-progress-mobile-${i}`}
                className={`h-1 flex-1 rounded ${i === activeIndex ? 'bg-white' : 'bg-white/35'}`}
              />
            ))}
          </div>

          <div className="h-full w-full flex items-center justify-center px-8">
            {current.isVideo ? (
              <video key={current.id} src={current.url} controls autoPlay playsInline className="max-h-full max-w-full object-contain" />
            ) : (
              <img key={current.id} src={current.url} alt="" className="max-h-full max-w-full object-contain" draggable={false} />
            )}
          </div>

          {hasCarousel && (
            <>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeIndex === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/50 bg-black/50 text-white flex items-center justify-center disabled:opacity-40"
                aria-label="Previous media"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => Math.min(items.length - 1, prev + 1))}
                disabled={activeIndex === items.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/50 bg-black/50 text-white flex items-center justify-center disabled:opacity-40"
                aria-label="Next media"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`min-[769px]:flex hidden fixed inset-0 z-[1201] items-center justify-center p-4 sm:p-6 pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl p-4 border max-h-[760px] w-[750px] border-gray-200 overflow-hidden pointer-events-auto transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-[#111] h-[600px] rounded-xl overflow-hidden">

            <div className="absolute top-2 left-5 z-20 text-white text-xl font-medium truncate max-w-[70%]">
              {title}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-4 z-20 text-white hover:opacity-80"
              aria-label="Close memory details"
            >
              <X size={24} />
            </button>

            <div className="absolute top-12 left-5 right-5 z-20 flex gap-1">
              {items.map((_, i) => (
                <div
                  key={`memory-progress-desktop-${i}`}
                  className={`h-1 flex-1 rounded ${i === activeIndex ? 'bg-white' : 'bg-white/35'}`}
                />
              ))}
            </div>

            <div className="h-full w-full flex items-center justify-center px-14">
              {current.isVideo ? (
                <video key={current.id} src={current.url} controls autoPlay playsInline className="max-h-full max-w-full object-contain" />
              ) : (
                <img key={current.id} src={current.url} alt="" className="max-h-full max-w-full object-contain" draggable={false} />
              )}
            </div>

            {hasCarousel && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeIndex === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/50 bg-black/50 text-white flex items-center justify-center disabled:opacity-40"
                  aria-label="Previous media"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => Math.min(items.length - 1, prev + 1))}
                  disabled={activeIndex === items.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-white/50 bg-black/50 text-white flex items-center justify-center disabled:opacity-40"
                  aria-label="Next media"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoryDetailsCard;
