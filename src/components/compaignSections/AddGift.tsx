"use client";
import React, { useState, useEffect } from "react";
import GlobalButton from "../buttons/GlobalButton";
import ArrowRightIcon from "@/assets/svgs/ArrowRight.svg";
import GlobalInput from "../inputs/GlobalInput";
import Image from "next/image";
import { giftsData } from "@/lib/MockData";
import { addGiftContribution } from "@/lib/supabase/boards";
import { authService } from "@/lib/supabase/auth";

type props = {
  goToPayment: () => void;
  boardId?: string;
  onGiftSaved?: (giftData: any) => void;
}

const AddGift = ({ goToPayment, boardId, onGiftSaved }: props) => {
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinueToPayment = async () => {
    if (!selectedGift && !customAmount) {
      alert('Please select a gift or enter a custom amount');
      return;
    }

    let amount = 0;
    let isCustom = false;
    let giftLabel = '';

    if (customAmount) {
      amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      isCustom = true;
      giftLabel = `Custom Gift - $${amount}`;
    } else if (selectedGift) {
      const selectedGiftData = giftsData.find(g => g.id === selectedGift);
      if (selectedGiftData) {
        amount = selectedGiftData.price;
        giftLabel = selectedGiftData.label;
      }
    }

    if (amount <= 0) {
      alert('Please select a valid gift or enter a valid amount');
      return;
    }

    if (!boardId) {
      const giftData = {
        amount,
        label: giftLabel,
        message,
        isCustom
      };
      
      if (onGiftSaved) {
        onGiftSaved(giftData);
      }
      
      goToPayment();
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getUser();
      if (!user) {
        alert('Please sign in to continue');
        setLoading(false);
        return;
      }

      let amount = 0;
      let isCustom = false;

      if (customAmount) {
        amount = parseFloat(customAmount);
        if (isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount');
          setLoading(false);
          return;
        }
        isCustom = true;
      } else if (selectedGift) {
        const selectedGiftData = giftsData.find(g => g.id === selectedGift);
        if (selectedGiftData) {
          amount = selectedGiftData.price;
        }
      }

      if (amount <= 0) {
        alert('Please select a valid gift or enter a valid amount');
        setLoading(false);
        return;
      }

      let giftLabel = '';
      if (isCustom) {
        giftLabel = `Custom Gift - $${amount}`;
      } else if (selectedGift) {
        const selectedGiftData = giftsData.find(g => g.id === selectedGift);
        giftLabel = selectedGiftData?.label || '';
      }

      const { data, error } = await addGiftContribution(boardId, user.id, {
        amount,
        gift_option_id: giftLabel,
        message: message || undefined,
        is_custom: isCustom,
      });

      if (error) {
        console.error('Error saving gift:', error);
        alert('Failed to save gift. Please try again.');
        setLoading(false);
        return;
      }

      if (onGiftSaved) {
        onGiftSaved(data);
      }

      goToPayment();
    } catch (error) {
      console.error('Error processing gift:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 max-[420px]:p-4 mx-auto space-y-6">

      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Add a gift 🎁
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Make their celebration extra special with a thoughtful gift
        </p>
      </div>

      <div>
        <p className="font-medium mb-3">Choose a Gift Amount</p>
        <div className="grid max-[420px]:grid-cols-2 max-[640px]:grid-cols-3 grid-cols-4 gap-3">
          {giftsData.map((gift) => (
            <div
              key={gift.id}
              className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer transition ${selectedGift === gift.id
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 hover:border-pink-300"
                }`}
              onClick={() => {
                setSelectedGift(gift.id);
                setCustomAmount("");
              }}
            >
              <Image src={gift.icon} alt={gift.label} width={40} height={40} />
              <p className="text-sm text-center font-medium mt-2">{gift.label}</p>
              <p className="text-pink-500 font-bold">${gift.price}</p>
            </div>
          ))}
        </div>
      </div>

      <GlobalInput
        placeholder="Enter custom amount"
        title="Custom Amount"
        value={customAmount}
        onChange={(e: any) => {
          setCustomAmount(e.target.value);
          setSelectedGift(null);
        }}
        width="100%"
        height="40px"
      />

      <div>
        <p className="text-sm mb-1">Description</p>
        <textarea
          placeholder="Write a description for your gift…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none resize-none min-h-[100px]"
        />
      </div>


      <GlobalButton
        title={loading ? "Processing..." : "Continue to Payment"}
        icon={ArrowRightIcon}
        height="44px"
        className="mt-6 flex-row-reverse"
        onClick={handleContinueToPayment}
        disabled={loading}
      />
    </div>
  );
};

export default AddGift;