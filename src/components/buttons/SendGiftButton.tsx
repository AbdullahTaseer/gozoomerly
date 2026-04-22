'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import AddGift, { type AddGiftSavedData } from '@/components/compaignSections/AddGift';

interface SendGiftButtonProps {
  boardId: string;
  className?: string;
  children?: React.ReactNode;
}

const SendGiftButton: React.FC<SendGiftButtonProps> = ({
  boardId,
  className,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleGiftSaved = (giftData: AddGiftSavedData) => {
    if (giftData.paymentIntent) {
      toast.success('Payment started. Complete checkout to finish your gift.');
    }
  };

  const goToPayment = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        disabled={!boardId}
        onClick={() => setIsOpen(true)}
        className={
          className ||
          'bg-white text-black px-5 py-2 rounded-full text-sm font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed'
        }
      >
        {children || 'Send Gift'}
      </button>

      <ModalOrBottomSlider
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modalHeader={false}
        desktopClassName="!w-[520px] max-w-[95vw]"
        contentClassName="!p-0"
      >
        <div className="max-h-[min(90vh,720px)] overflow-y-auto p-3 sm:p-4">
          <AddGift
            goToPayment={goToPayment}
            boardId={boardId || undefined}
            onGiftSaved={handleGiftSaved}
          />
        </div>
      </ModalOrBottomSlider>
    </>
  );
};

export default SendGiftButton;
