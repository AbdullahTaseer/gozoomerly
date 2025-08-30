"use client";
import React, { useState } from "react";
import GlobalButton from "../buttons/GlobalButton";
import ArrowRightIcon from "@/assets/svgs/ArrowRight.svg";
import GlobalInput from "../inputs/GlobalInput";
import Image from "next/image";
import { giftsData } from "@/lib/MockData";

type props = {
  goToPayment: () => void;
}

const AddGift = ({ goToPayment }: props) => {
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");

  const raised = 50;
  const goal = 2000;
  const progress = Math.min((raised / goal) * 100, 100);

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 mx-auto space-y-6">

      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Add a gift 🎁
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Your gift helps make their dream happen Goal Progress
        </p>
      </div>


      <div className="bg-black text-white rounded-lg p-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#D9D9D9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F43C83]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span>${raised} raised</span>
          <span>${goal} goal</span>
        </div>
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
        <p className="text-sm mb-1">Message with Gift</p>
        <textarea
          placeholder="Write a message to go with your gift…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none resize-none min-h-[100px]"
        />
      </div>


      <GlobalButton
        title="Continue to Payment"
        icon={ArrowRightIcon}
        height="44px"
        className="mt-6 flex-row-reverse"
        onClick={goToPayment}
      />
    </div>
  );
};

export default AddGift;