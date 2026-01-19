'use client';

import React, { useState } from 'react';
import WishModal from '@/components/modals/WishModal';

interface WishButtonProps {
  boardId: string;
  honoreeName?: string;
  className?: string;
  children?: React.ReactNode;
}

const WishButton: React.FC<WishButtonProps> = ({
  boardId,
  honoreeName,
  className,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log('Wish submitted:', data);
    // TODO: Implement API call to submit the wish
    // This would upload media and create the wish entry
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className || "bg-white text-black px-5 py-2 rounded-full text-sm font-medium shadow"}
      >
        {children || `Wish ${honoreeName || 'Sean'}`}
      </button>

      <WishModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        boardId={boardId}
        honoreeName={honoreeName}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default WishButton;
