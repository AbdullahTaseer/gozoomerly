'use client';

import { useState, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

let bodyScrollLockCount = 0;

function lockBodyScroll() {
  bodyScrollLockCount += 1;
  if (bodyScrollLockCount !== 1) return;
  const html = document.documentElement;
  const body = document.body;
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
  if (bodyScrollLockCount !== 0) return;
  const html = document.documentElement;
  const body = document.body;
  html.style.overflow = '';
  body.style.overflow = '';
}

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
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  const header = modalHeader && (
    <div className="px-4 pt-4 flex items-center justify-between gap-4">
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

  const modalUi = (
    <>
      <div
        className={`fixed inset-0 z-[60000] bg-black/60 backdrop-blur-sm transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[60001] bg-white rounded-t-2xl shadow-2xl
        pb-[env(safe-area-inset-bottom,0px)]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-[100dvh] pointer-events-none'}
        ${className}`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!isOpen}
      >
        <div className="flex justify-center pt-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="max-h-[85vh] overflow-y-auto overscroll-contain">
          {content}
        </div>
      </div>

      <div
        className={`min-[770px]:flex hidden fixed inset-0 z-[60001] items-center justify-center p-4
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

  if (!portalTarget) {
    return null;
  }

  return createPortal(modalUi, portalTarget);
};

export default ModalOrBottomSlider;
