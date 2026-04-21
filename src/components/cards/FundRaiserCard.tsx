"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { giftsData } from "@/lib/MockData";
import {
  createGiftPaymentIntent,
  CreateGiftPaymentIntentResponse,
} from "@/lib/supabase/boards";
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

export interface GiftSelectedPayload {
  boardId: string;
  amount: number;
  label: string;
  isCustom: boolean;
  /** board_gift_options.id when the picked option came from the DB. */
  boardGiftOptionId?: string | null;
  paymentIntent: CreateGiftPaymentIntentResponse;
  idempotencyKey?: string;
}

type FundRaiserCardProps = {
  raised?: number;
  target?: number;
  giftOptions?: GiftOption[];
  topContributors?: TopContributor[];
  boardId?: string;
  description?: string;
  /**
   * Called after a gift payment intent is created. Parent is responsible for
   * advancing to the payment step (e.g. opening a Stripe modal using the
   * returned client_secret).
   */
  onGiftSelected?: (payload: GiftSelectedPayload) => void;
  /** Legacy callback kept for backwards compatibility. */
  onGiftAdded?: () => void;
};

const FundRaiserCard = ({
  raised = 0,
  target = 0,
  giftOptions = [],
  topContributors = [],
  boardId,
  description,
  onGiftSelected,
  onGiftAdded
}: FundRaiserCardProps) => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [isAddingGift, setIsAddingGift] = useState(false);
  const [localRaised, setLocalRaised] = useState(raised);
  const router = useRouter();

  useEffect(() => {
    setLocalRaised(raised);
  }, [raised]);

  const getGiftIcon = (label: string) => {
    const gift = giftsData.find(g =>
      label.toLowerCase().includes(g.label.toLowerCase()) ||
      g.label.toLowerCase().includes(label.toLowerCase())
    );
    return gift?.icon || giftsData[0]?.icon;
  };

  const displayGifts: Array<{
    id?: string;
    label: string;
    amount: number;
    icon: any;
    isCustom: boolean;
  }> = giftOptions.length > 0
    ? giftOptions.map(g => ({
      id: g.id,
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

  displayGifts.push({ label: 'Custom', amount: 0, icon: null, isCustom: true });

  const handleGiftClick = async (gift: typeof displayGifts[0]) => {
    if (!boardId) {
      setSelectedGift(gift.label);
      return;
    }

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

      const { data, error, idempotencyKey } = await createGiftPaymentIntent({
        boardId,
        userId: user.id,
        amount: gift.amount,
        currency: 'USD',
        boardGiftOptionId: gift.id ?? null,
        provider: 'stripe',
        providerMetadata: {
          source: 'web_checkout',
          gift_label: gift.label,
        },
      });

      if (error || !data) {
        const msg =
          (error as { message?: string } | null)?.message ||
          'Failed to start payment. Please try again.';
        alert(msg);
        setIsAddingGift(false);
        return;
      }

      setSelectedGift(gift.label);

      if (onGiftSelected) {
        onGiftSelected({
          boardId,
          amount: gift.amount,
          label: gift.label,
          isCustom: false,
          boardGiftOptionId: gift.id ?? null,
          paymentIntent: data,
          idempotencyKey,
        });
      } else if (onGiftAdded) {
        onGiftAdded();
      } else {
        router.refresh();
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsAddingGift(false);
    }
  };

  const displayRaised = localRaised !== raised ? localRaised : raised;

  return (
    <div>
      <div className="my-6">
        {description && <p className="text-lg text-white font-semibold mb-2">{description}</p>}
        <div className="w-full h-[12px] bg-[#9B57AF]/50 rounded-full">
          <div
            className="h-[12px] rounded-full bg-gradient-to-r from-[#E6408A] to-[#8C5AB6]"
            style={{ width: `${target > 0 ? Math.min((displayRaised / target) * 100, 100) : 0}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-white mt-2">
          <span>Raised: ${displayRaised.toLocaleString()}</span>
          <span>Target: ${target.toLocaleString()}</span>
        </div>
      </div>

      {}
      {}

      {}
      {}
    </div>
  );
};

export default FundRaiserCard;
