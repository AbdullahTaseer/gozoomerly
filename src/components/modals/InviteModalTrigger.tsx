'use client';

import {  useState  } from 'react';
import { UserPlus } from 'lucide-react';
import InviteToBoardModal from './InviteToBoardModal';

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

      <InviteToBoardModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        boardId={boardId}
        boardTitle={boardTitle}
      />
    </>
  );
};

export default InviteModalTrigger;
