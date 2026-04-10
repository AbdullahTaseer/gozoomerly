'use client';

import { X } from 'lucide-react';
import GlobalButton from '@/components/buttons/GlobalButton';

type Props = {
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

const InviteDeclinedModalContent = ({ onClose, onConfirm }: Props) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <>
      <div className="flex flex-col items-center py-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <X size={32} className="text-black" strokeWidth={2} />
        </div>
        <p className="text-black text-center text-base leading-relaxed">
          Just to confirm do you want to decline this board?
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <GlobalButton
          title="Yes, Decline"
          onClick={() => handleConfirm()}
          width="100%"
          height="48px"
          color="white"
          className="font-bold cursor-pointer"
        />
        <GlobalButton
          title="Cancel"
          onClick={onClose}
          width="100%"
          height="48px"
          bgColor="transparent"
          color="#000"
          borderColor="#000"
          borderWidth="1px"
          hover={{ bgColor: '#f5f5f5' }}
        />
      </div>
    </>
  );
};

export default InviteDeclinedModalContent;
