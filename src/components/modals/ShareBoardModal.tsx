'use client';

import React, { useState } from 'react';
import { X, Share2, Facebook, Copy, Check, Users } from 'lucide-react';
import Image from 'next/image';
import WhatsappIcon from "@/assets/svgs/whatsapp.png";

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  title?: string;
}

const ShareBoardModal: React.FC<ShareBoardModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  title
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsapp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title ? title + ' - ' : ''}${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareContacts = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Check this out!',
          url: shareUrl,
        });
      } catch (e) {
        console.error('Error sharing:', e);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[24px] w-[400px] max-w-[90vw] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">Share</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Share Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <Share2 size={32} className="text-gray-700" />
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 mb-6">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-gray-600 text-sm outline-none truncate"
            placeholder="Your unique link"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-black font-medium text-sm ml-2 whitespace-nowrap"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        {/* Share Via */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Share via</h3>
          <div className="flex items-center gap-6">
            <button
              onClick={handleShareFacebook}
              className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
            >
              <Facebook size={20} className="text-[#1877F2]" fill="#1877F2" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
            <button
              onClick={handleShareWhatsapp}
              className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
            >
              <Image src={WhatsappIcon} alt="WhatsApp" width={20} height={20} />
              <span className="text-sm font-medium">Whatsapp</span>
            </button>
            <button
              onClick={handleShareContacts}
              className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
            >
              <Users size={20} />
              <span className="text-sm font-medium">Contacts</span>
            </button>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-full text-white font-semibold text-base"
          style={{
            background: 'linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ShareBoardModal;
