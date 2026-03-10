'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import BellIconIndicator from '@/components/cards/BellIconIndicator';
import PaymentTransactionCard from '@/components/cards/PaymentTransactionCard';
import { receivedTransactionsData } from '@/lib/MockData';

const ReceivedPage = () => {
  const router = useRouter();

  return (
    <div className="text-black">
      <DashNavbar />
      <MobileHeader
        title="Received"
        showBack
        onBackClick={() => router.push('/u/settings')}
        profileRight
      />

      <div className="px-[5%] max-[768px]:px-4 py-5">
        <div className="max-[769px]:hidden flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/u/settings')}
            className="flex items-center gap-2 text-black"
          >
            <ArrowLeft size={24} />
            <span className="text-3xl font-bold">Received</span>
          </button>
          <BellIconIndicator />
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {receivedTransactionsData.map((tx) => (
            <PaymentTransactionCard
              key={tx.id}
              type="received"
              amount={tx.amount}
              description={`$${tx.amount} cash received from ${tx.senderName} for ${tx.occasion}.`}
              date={tx.date}
              boardTitle={tx.boardTitle}
              recipientName={tx.senderName}
              recipientDetails={tx.recipientDetails}
              recipientAvatar={tx.recipientAvatar}
              overlayColor={tx.overlayColor}
            />
          ))}
        </div>

        {receivedTransactionsData.length === 0 && (
          <p className="text-center text-gray-500 py-12">No received transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default ReceivedPage;
