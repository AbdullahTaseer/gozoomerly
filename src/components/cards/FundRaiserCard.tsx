"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { giftsData } from "@/lib/MockData";
import { addGiftContribution } from "@/lib/supabase/boards";
import { authService } from "@/lib/supabase/auth";

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
  invitedCount?: number;
  participantsCount?: number;
  mediaCount?: number;
  wishes?: number;
  gifters?: number;
  boardId?: string;
  onGiftAdded?: () => void;
};

const FundRaiserCard = ({ 
  raised = 0, 
  target = 0, 
  giftOptions = [],
  topContributors = [],
  invitedCount = 0,
  participantsCount = 0,
  mediaCount = 0,
  wishes = 0,
  gifters = 0,
  boardId,
  onGiftAdded
}: FundRaiserCardProps) => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [isAddingGift, setIsAddingGift] = useState(false);
  const [localRaised, setLocalRaised] = useState(raised);
  const router = useRouter();

  // Sync localRaised with raised prop when it changes
  useEffect(() => {
    setLocalRaised(raised);
  }, [raised]);

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

  const handleGiftClick = async (gift: typeof displayGifts[0]) => {
    if (!boardId) {
      // If no boardId, just select the gift (for display purposes)
      setSelectedGift(gift.label);
      return;
    }

    // If it's the Custom option, don't add it automatically
    if (gift.isCustom || gift.amount === 0) {
      setSelectedGift(gift.label);
      return;
    }

    setIsAddingGift(true);
    try {
      const user = await authService.getUser();
      if (!user) {
        alert('Please sign in to add a gift');
        setIsAddingGift(false);
        return;
      }

      const { data, error } = await addGiftContribution(boardId, user.id, {
        amount: gift.amount,
        gift_option_id: gift.label,
        is_custom: false,
      });

      if (error) {
        console.error('Error adding gift:', error);
        alert('Failed to add gift. Please try again.');
        setIsAddingGift(false);
        return;
      }

      // Update local raised amount immediately for better UX
      setLocalRaised(prev => prev + gift.amount);
      setSelectedGift(gift.label);

      // Refresh the page data
      if (onGiftAdded) {
        onGiftAdded();
      } else {
        // Fallback: refresh the page to get updated data
        router.refresh();
      }
    } catch (error) {
      console.error('Error processing gift:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsAddingGift(false);
    }
  };

  // Use localRaised if it's been updated, otherwise use the prop
  const displayRaised = localRaised !== raised ? localRaised : raised;

  return (
    <div className="bg-black p-6 rounded-[24px]">
      {/* Goal Progress */}
      <div className="mb-6">
        <p className="text-white text-[24px] font-bold mb-4">Goal Progress</p>
        <div className="w-full h-[6px] bg-[#D9D9D9] rounded-full">
          <div
            className="h-[6px] rounded-full bg-gradient-to-r from-[#E6408A] to-[#8C5AB6]"
            style={{ width: `${target > 0 ? Math.min((displayRaised / target) * 100, 100) : 0}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-white mt-2">
          <span>Raised: ${displayRaised.toLocaleString()}</span>
          <span>Target: ${target.toLocaleString()}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="rounded-xl mb-6">
        <div className="flex justify-between items-center gap-2 text-center flex-wrap">
          <div className="flex-1 min-w-[100px]">
            <p className="text-white text-lg font-semibold">{invitedCount}</p>
            <p className="text-gray-300 text-xs mt-1">Invited</p>
          </div>
          <div className="flex-1 min-w-[100px]">
            <p className="text-white text-lg font-semibold">{participantsCount}</p>
            <p className="text-gray-300 text-xs mt-1">Participants</p>
          </div>
          <div className="flex-1 min-w-[100px]">
            <p className="text-white text-lg font-semibold">{wishes}</p>
            <p className="text-gray-300 text-xs mt-1">Wishes</p>
          </div>
          <div className="flex-1 min-w-[100px]">
            <p className="text-white text-lg font-semibold">{gifters}</p>
            <p className="text-gray-300 text-xs mt-1">Gifters</p>
          </div>
          <div className="flex-1 min-w-[100px]">
            <p className="text-white text-lg font-semibold">{mediaCount >= 500 ? `${mediaCount}+` : mediaCount}</p>
            <p className="text-gray-300 text-xs mt-1">Media</p>
          </div>
        </div>
      </div>

      {/* Gift Options */}
      <div className="bg-[#1B1B1B] flex justify-start gap-3 p-4 rounded-xl flex-wrap">
        {displayGifts.map((gift, i) => (
          <button
            key={i}
            onClick={() => handleGiftClick(gift)}
            disabled={isAddingGift}
            className={`px-4 py-2 rounded-full text-white cursor-pointer transition text-sm flex items-center gap-2 ${
              isAddingGift
                ? "opacity-50 cursor-not-allowed"
                : selectedGift === gift.label
                ? "bg-gradient-to-r from-[#E6408A] to-[#8C5AB6]"
                : "bg-[#303030] hover:bg-[#404040]"
            }`}
          >
            {gift.icon && (
              <Image src={gift.icon} alt={gift.label} height={20} width={20} />
            )}
            {gift.label} {gift.amount > 0 && `- $${gift.amount}`}
            {isAddingGift && selectedGift === gift.label && (
              <span className="ml-2 text-xs">Adding...</span>
            )}
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
