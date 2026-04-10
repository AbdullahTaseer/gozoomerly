'use client';

import type { LucideIcon } from 'lucide-react';
import GlobalButton from '@/components/buttons/GlobalButton';

type Props = {
  onClose: () => void;
  icon: LucideIcon;
  message: string;
  primaryLabel: string;
  onPrimaryClick: () => void;
  secondaryLabel?: string;
};

const ConfirmationModalContent = ({
  onClose,
  icon: Icon,
  message,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel = 'Cancel',
}: Props) => {
  const handlePrimary = () => {
    onPrimaryClick();
    onClose();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
        <Icon size={28} className="text-black" strokeWidth={2} />
      </div>
      <p className="text-black text-center text-base leading-relaxed mb-6">{message}</p>
      <div className="flex flex-col gap-3 w-full">
        <GlobalButton
          title={primaryLabel}
          onClick={handlePrimary}
          width="100%"
          height="48px"
          className="font-semibold cursor-pointer"
        />
        <GlobalButton
          title={secondaryLabel}
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
    </div>
  );
};

export default ConfirmationModalContent;
