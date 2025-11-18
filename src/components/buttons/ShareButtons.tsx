'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import WhatsappImg from "@/assets/svgs/whatsapp.png";
import { Check, Facebook, Instagram } from 'lucide-react';

type Props = {
  shareUrl: string;
  title?: string;
  className?: string;
};

const ShareButtons = ({ shareUrl, title, className }: Props) => {
  const [copied, setCopied] = useState(false);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title ? title + ' - ' : ''}${shareUrl}`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className={`grid grid-cols-3 max-[500px]:grid-cols-2 gap-3 ${className || ''}`}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2 h-[37px] bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
      >
        <Image src={WhatsappImg} height={32} alt='' />
        <span className="text-sm font-medium">WhatsApp</span>
      </a>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-2 h-[37px] bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
      >
        <Facebook size={18} />
        <span className="text-sm font-medium">Facebook</span>
      </a>
      <button
        onClick={handleCopy}
        title="Copy link for Instagram"
        className={`flex items-center justify-center gap-2 px-4 py-2 h-[37px] rounded-lg transition-colors ${copied
          ? 'bg-green-500 text-white cursor-not-allowed'
          : 'bg-[#E1306C] text-white hover:bg-[#C91A56] cursor-pointer'
          }`}
      >
        {copied ? <Check size={18} /> : <Instagram size={18} />}
        <span className="text-sm font-medium">{copied ? 'Copied' : 'Instagram'}</span>
      </button>
    </div>
  );
};

export default ShareButtons;
