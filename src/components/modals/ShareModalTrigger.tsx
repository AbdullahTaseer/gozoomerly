"use client";

import { useState } from 'react';
import GlobalModal from './GlobalModal';
import ShareButtons from '@/components/buttons/ShareButtons';
import GlobalButton from '@/components/buttons/GlobalButton';
import { Share2 } from 'lucide-react';

type Props = {
  shareUrl: string;
  title?: string;
  className?: string;
  triggerStyle?: 'icon' | 'primary';
  buttonTitle?: string;
};

const ShareModalTrigger = ({
  shareUrl,
  title,
  className,
  triggerStyle = 'icon',
  buttonTitle = 'Share',
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {triggerStyle === 'primary' ? (
        <GlobalButton
          title={buttonTitle}
          height="48px"
          className={className || 'mt-6'}
          onClick={() => setIsOpen(true)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 p-2 rounded-full hover:bg-white/10 ${className || ''}`}
          aria-label="Share"
        >
          <Share2 size={24} className="text-black cursor-pointer" />
        </button>
      )}

      <GlobalModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title ? `Share ${title}` : 'Share'} className="w-[520px] max-w-[95vw]">
        <ShareButtons shareUrl={shareUrl} title={title} />
      </GlobalModal>
    </>
  );
};

export default ShareModalTrigger;
