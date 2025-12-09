"use client";

import React, { useState } from 'react';
import GlobalModal from './GlobalModal';
import ShareButtons from '@/components/buttons/ShareButtons';
import { Share2 } from 'lucide-react';

type Props = {
  shareUrl: string;
  title?: string;
  className?: string;
};

const ShareModalTrigger = ({ shareUrl, title, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 p-2 rounded-full hover:bg-white/10 ${className || ''}`}
        aria-label="Share"
      >
        <Share2 size={24} className="text-black cursor-pointer" />
      </button>

      <GlobalModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title ? `Share ${title}` : 'Share'} className="w-[520px] max-w-[95vw]">
        <ShareButtons shareUrl={shareUrl} title={title} />
      </GlobalModal>
    </>
  );
};

export default ShareModalTrigger;
