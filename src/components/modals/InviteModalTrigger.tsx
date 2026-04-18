'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import ModalOrBottomSlider from './ModalOrBottomSlider';
import InviteToBoardModalContent from './InviteToBoardModal';

interface InviteModalTriggerProps {
  boardId: string;
  boardTitle?: string;
  className?: string;
}

const InviteModalTrigger: React.FC<InviteModalTriggerProps> = ({
  boardId,
  boardTitle,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 p-2 rounded-full hover:bg-white/10 ${className || ''}`}
        aria-label="Invite"
      >
        <UserPlus size={24} className="text-black cursor-pointer" />
      </button>

      <ModalOrBottomSlider
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={boardTitle}
        desktopClassName="!w-[450px] max-w-[90vw]"
        contentClassName="!p-0"
      >
        <InviteToBoardModalContent
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          boardId={boardId}
        />
      </ModalOrBottomSlider>
    </>
  );
};

export default InviteModalTrigger;
