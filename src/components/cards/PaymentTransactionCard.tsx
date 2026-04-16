'use client';

import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type PaymentTransactionCardProps = {
  type: 'paid' | 'received';
  amount: number;
  description: string;
  date: string;
  boardTitle: string;
  recipientName: string;
  recipientDetails: string;
  recipientAvatar: string | StaticImport;
  overlayColor: string;
  onClick?: () => void;
};

const PaymentTransactionCard = ({
  type,
  amount,
  description,
  date,
  boardTitle,
  recipientName,
  recipientDetails,
  recipientAvatar,
  overlayColor,
  onClick,
}: PaymentTransactionCardProps) => {
  const Icon = type === 'paid' ? ArrowUpRight : ArrowDownRight;
  const iconColorClass = type === 'paid' ? 'text-red-500' : 'text-green-500';

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-2 rounded-xl overflow-hidden bg-[#F4F4F4]"
    >
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
            <Icon size={20} className={iconColorClass} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-black">
              <span className="font-bold text-lg">${amount}</span>
              <span className="font-medium">
                {' '}
                {description.replace(/^\$[\d,]+\s*/, '').trim()}
              </span>
            </p>
            <p className="text-gray-500 text-sm mt-1">{date}</p>
          </div>
        </div>
      </div>
      <div
        className="relative p-4 overflow-hidden rounded-xl"
        style={{ backgroundColor: overlayColor }}
      >
        <div className="absolute inset-0 opacity-20">
          <Image
            src={recipientAvatar}
            alt={recipientName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        <div className="relative z-10">
          <p className="text-white font-bold text-lg mb-3">{boardTitle}</p>
          <div className="flex gap-3">
            <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border-2 border-white/50">
              <Image
                src={recipientAvatar}
                alt={recipientName}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium">{recipientName}</p>
              {recipientDetails && (
                <p className="text-white/80 text-sm mt-0.5">{recipientDetails}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default PaymentTransactionCard;
