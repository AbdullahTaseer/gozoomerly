"use client";

import React, { useState } from "react";
import Image from "next/image";
import { giftsData } from "@/lib/MockData";

type GiftOption = {
  id?: string;
  label?: string;
  amount: number;
  is_custom?: boolean;
};

type TopContributor = {
  label: string;
  amount: number;
};

type FundRaiserCardProps = {
  raised?: number;
  target?: number;
  giftOptions?: GiftOption[];
  topContributors?: TopContributor[];
};

const FundRaiserCard = ({ 
  raised = 0, 
  target = 0, 
  giftOptions = [],
  topContributors = []
}: FundRaiserCardProps) => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  // Map gift options to display format with icons
  const getGiftIcon = (label: string) => {
    const gift = giftsData.find(g => 
      label.toLowerCase().includes(g.label.toLowerCase()) ||
      g.label.toLowerCase().includes(label.toLowerCase())
    );
    return gift?.icon || giftsData[0]?.icon;
  };

  // Combine gift options with default gifts if needed
  const displayGifts = giftOptions.length > 0 
    ? giftOptions.map(g => ({
        label: g.label || `$${g.amount}`,
        amount: g.amount,
        icon: getGiftIcon(g.label || ''),
        isCustom: g.is_custom || false
      }))
    : giftsData.slice(0, 5).map(g => ({
        label: g.label,
        amount: g.price,
        icon: g.icon,
        isCustom: false
      }));

  // Add Custom option
  displayGifts.push({ label: 'Custom', amount: 0, icon: null, isCustom: true });

  return (
    <div className="bg-black p-6 rounded-[24px]">
      {/* Gift Options */}
      <div className="bg-[#1B1B1B] flex justify-between max-[700px]:justify-start gap-3 p-4 rounded-xl flex-wrap">
        {displayGifts.map((gift, i) => (
          <button
            key={i}
            onClick={() => setSelectedGift(gift.label)}
            className={`px-4 py-2 rounded-full text-white cursor-pointer transition text-sm flex items-center gap-2 ${
              selectedGift === gift.label
                ? "bg-gradient-to-r from-[#E6408A] to-[#8C5AB6]"
                : "bg-[#303030] hover:bg-[#404040]"
            }`}
          >
            {gift.icon && (
              <Image src={gift.icon} alt={gift.label} height={20} width={20} />
            )}
            {gift.label} {gift.amount > 0 && `- $${gift.amount}`}
          </button>
        ))}
      </div>

      {/* Top Contributors */}
      {topContributors.length > 0 && (
        <div className="mt-6">
          <p className="text-white text-[18px] font-bold">Top Contributors</p>
          <div className="flex gap-3 flex-wrap mt-4">
            {topContributors.map((contributor, i) => {
              const giftIcon = getGiftIcon(contributor.label);
              return (
                <div
                  key={i}
                  className="border border-[#303030] rounded-full text-white text-sm bg-[#1B1B1B] px-3 py-1 flex items-center gap-2"
                >
                  {giftIcon && (
                    <Image src={giftIcon} alt={contributor.label} height={18} width={18} />
                  )}
                  {contributor.label} - <span className="text-[#F71873]">${contributor.amount}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FundRaiserCard;
