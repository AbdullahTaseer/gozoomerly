'use client';

import React, { useState } from 'react';
import { MessageCircle, Share2, Camera, Copy, Check } from 'lucide-react';

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
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <a 
        href={whatsappHref} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
      >
        <MessageCircle size={18} />
        <span className="text-sm font-medium">WhatsApp</span>
      </a>
      <a 
        href={facebookHref} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
      >
        <Share2 size={18} />
        <span className="text-sm font-medium">Facebook</span>
      </a>
      <button 
        onClick={handleCopy} 
        title="Copy link for Instagram" 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          copied 
            ? 'bg-green-500 text-white' 
            : 'bg-[#E1306C] text-white hover:bg-[#C91A56]'
        }`}
      >
        {copied ? <Check size={18} /> : <Camera size={18} />}
        <span className="text-sm font-medium">{copied ? 'Copied' : 'Instagram'}</span>
      </button>
    </div>
  );
};

export default ShareButtons;
