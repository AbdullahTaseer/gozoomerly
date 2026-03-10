'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  desktopClassName?: string;
  modalHeader?: boolean;
};

const ModalOrBottomSlider = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  contentClassName = '',
  desktopClassName = '',
  modalHeader = true,
}: Props) => {
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

  const header = modalHeader && (
    <div className="px-3 py-2 flex items-center gap-4 justify-between">
      <h3 className="text-black text-[20px] 3sm:text-[18px] 2xs:text-[14px] font-[700] tracking-normal">
        {title}
      </h3>
      <button
        onClick={onClose}
        className="hover:bg-gray-100 border border-black w-[28px] h-[28px] rounded-full flex items-center justify-center cursor-pointer shrink-0"
      >
        <X size={18} />
      </button>
    </div>
  );

  const slideOpen = isOpen && isAnimating;

  const content = (
    <>
      {header}
      <div className={`p-4 min-[770px]:overflow-y-auto min-[770px]:max-h-[calc(90vh-100px)] ${contentClassName}`}>
        {children}
      </div>
    </>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-[1010] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[1011] bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${slideOpen ? 'translate-y-0' : 'translate-y-full'
          } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2 shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        <div className="max-h-[85vh] min-h-0 overflow-y-auto overscroll-contain">
          {content}
        </div>
      </div>

      <div
        className={`min-[770px]:flex hidden fixed inset-0 z-[1011] items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl border-2 border-[#E9E9E9] max-h-[90vh] overflow-hidden transition-all duration-300 w-[min(550px,90vw)] ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            } ${desktopClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    </>
  );
};

export default ModalOrBottomSlider;
