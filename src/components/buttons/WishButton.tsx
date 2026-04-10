'use client';

import {  useState  } from 'react';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import WishModalContent from '@/components/modals/WishModal';

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

  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className || "bg-white text-black px-5 py-2 rounded-full text-sm font-medium shadow"}
      >
        {children || `Wish ${honoreeName || 'Sean'}`}
      </button>

      <ModalOrBottomSlider
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modalHeader={false}
        desktopClassName="!w-[450px] max-w-[95vw]"
        contentClassName="!p-0"
      >
        <WishModalContent
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          boardId={boardId}
          honoreeName={honoreeName}
          onSubmit={handleSubmit}
        />
      </ModalOrBottomSlider>
    </>
  );
};

export default WishButton;
