'use client';

import React, { useState, useEffect } from 'react';
import GlobalModal from './GlobalModal';
import GlobalButton from '../buttons/GlobalButton';
import { Copy, Check } from 'lucide-react';
import { generateInviteLink, copyToClipboard } from '@/lib/utils/inviteLink';
import ShareButtons from '@/components/buttons/ShareButtons';

type InviteModalContentProps = {
  boardSlug: string;
  boardTitle?: string;
  onClose: () => void;
};

const InviteModalContent = ({ boardSlug, boardTitle, onClose }: InviteModalContentProps) => {
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (boardSlug) {
      const link = generateInviteLink(boardSlug);
      setInviteLink(link);
      setCopied(false);
    }
  }, [boardSlug]);

  const handleCopy = async () => {
    const success = await copyToClipboard(inviteLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {boardTitle && (
        <div>
          <p className="font-bold text-lg">Board Name</p>
          <p className="font-semibold bg-gradient-to-r from-[#E5408A] to-[#845CBA] text-transparent bg-clip-text text-lg">{boardTitle}</p>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 mb-2">Share this link to invite others:</p>
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 break-all"
          />

          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-colors shrink-0 ${copied
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            title={copied ? 'Copied!' : 'Copy link'}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Or share directly on:</p>
          <ShareButtons shareUrl={inviteLink} title={boardTitle} />
        </div>

      </div>

      <div className="flex justify-end">
        <GlobalButton
          title="Close"
          onClick={onClose}
          height="40px"
          bgColor="#e5e5e5"
          hover={{ color: 'white' }}
          color="#333"
          className="min-w-[100px]"
        />
      </div>
    </div>
  );
};

type InviteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  boardSlug: string;
  boardTitle?: string;
};

const InviteModal = ({ isOpen, onClose, boardSlug, boardTitle }: InviteModalProps) => {
  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Someone"
      className="w-[400px] max-[470px]:w-[90vw]"
    >
      <InviteModalContent
        boardSlug={boardSlug}
        boardTitle={boardTitle}
        onClose={onClose}
      />
    </GlobalModal>
  );
};

export default InviteModal;
