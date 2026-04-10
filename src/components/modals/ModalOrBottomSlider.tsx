'use client';

import { useEffect } from 'react';
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


  const header = modalHeader && (
    <div className="px-3 py-2 flex items-center justify-between gap-4">
      <h3 className="text-black text-[20px] 3sm:text-[18px] 2xs:text-[14px] font-[700]">
        {title}
      </h3>
      <button
        onClick={onClose}
        className="hover:bg-gray-100 border border-black w-[28px] h-[28px] rounded-full flex items-center justify-center"
      >
        <X size={18} />
      </button>
    </div>
  );

  const content = (
    <>
      {header}
      <div
        className={`p-4 min-[770px]:overflow-y-auto min-[770px]:max-h-[calc(90vh-100px)] ${contentClassName}`}
      >
        {children}
      </div>
    </>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[1010] bg-black/60 backdrop-blur-sm transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[1011] bg-white rounded-t-2xl shadow-2xl
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="max-h-[85vh] overflow-y-auto overscroll-contain">
          {content}
        </div>
      </div>

      <div
        className={`min-[770px]:flex hidden fixed inset-0 z-[1011] items-center justify-center p-4
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl border-2 border-[#E9E9E9]
          max-h-[90vh] overflow-hidden w-[min(550px,90vw)]
          transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          ${desktopClassName}`}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    </>
  );
};

export default ModalOrBottomSlider;