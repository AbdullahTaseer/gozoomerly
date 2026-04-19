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

const MemoryDetailsCardContent = ({
  isOpen,
  title = 'Memories',
  items,
  initialIndex = 0,
  onClose,
}: MemoryDetailsCardProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const bounded = Math.max(0, Math.min(initialIndex, Math.max(0, items.length - 1)));
    setActiveIndex(bounded);
  }, [isOpen, initialIndex, items.length]);

  if (!isOpen) return null;

  const current = items[activeIndex];
  if (!current) return null;
  const hasCarousel = items.length > 1;

  return (
      <div className="relative bg-[#111] h-[78vh] min-[770px]:h-[600px] rounded-t-2xl min-[770px]:rounded-xl overflow-hidden">
        <div className="absolute top-3 left-5 z-20 text-white text-xl min-[770px]:text-2xl font-medium truncate max-w-[70%]">
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

        <div className="absolute top-12 min-[770px]:top-14 left-3 right-3 min-[770px]:left-5 min-[770px]:right-5 z-20 flex gap-1">
          {items.map((_, i) => (
            <div
              key={`memory-progress-${i}`}
              className={`h-1 flex-1 rounded ${i === activeIndex ? 'bg-white' : 'bg-white/35'}`}
            />
          ))}
        </div>

        <div className="h-full w-full flex items-center justify-center px-8 min-[770px]:px-14">
          {current.isVideo ? (
            <video key={current.id} src={current.url} controls autoPlay playsInline className="max-h-full max-w-full object-contain" />
          ) : (
            <img key={current.id} src={current.url} alt="" decoding="async" className="max-h-full max-w-full object-contain" draggable={false} />
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
  );
};

export default MemoryDetailsCardContent;
