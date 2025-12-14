import React from "react";
import Image from "next/image";
import DummyAvatar1 from "@/assets/svgs/chat-avatar-1.svg";
import DummyAvatar2 from "@/assets/svgs/chat-avatar-2.svg";
import DummyAvatar3 from "@/assets/svgs/chat-avatar-3.svg";

const BoardSlugGifts = () => {
  const gifts = [
    { id: 1, name: "Jamie", amount: 250, avatar: DummyAvatar1, date: "11 Dec" },
    { id: 2, name: "Anna", amount: 50, avatar: DummyAvatar3, date: "14 Oct" },
    { id: 3, name: "Anna", amount: 150, avatar: DummyAvatar2, date: "10 Jul" },
    { id: 4, name: "Alex the Brave", amount: 20, avatar: DummyAvatar1, date: "22 Feb" },
    { id: 5, name: "Jordan the Fearless", amount: 250, avatar: DummyAvatar2, date: "11 Dec" },
  ];

  const totalAmount = gifts.reduce((sum, gift) => sum + gift.amount, 0);

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center px-4 py-3 bg-linear-to-r from-[#18171F] to-[#2a263d] rounded-[12px] text-white">
        <div>
          <p className="text-lg font-semibold">Total Gifts</p>
          <p className="text-sm">
            {gifts.length} contributors
          </p>
        </div>
        <p className="text-lg font-bold">
          ${totalAmount}
        </p>
      </div>

      {gifts.map((gift) => (
        <div
          key={gift.id}
          className="bg-[#F4F4F4] flex-wrap gap-3 rounded-[12px] px-4 py-3 flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <Image
              src={gift.avatar}
              className="h-12 w-12 rounded-full shrink-0"
              alt={gift.name}
            />
            <div>
              <p className="text-black max-[450px]:text-[16px] text-[18px] font-semibold">
                {gift.name}
              </p>
              <p className="text-sm text-gray-500">{gift.date}</p>
            </div>
          </div>

          <p className="bg-black text-sm text-white rounded-full py-1 px-3">
            Gifted : ${gift.amount}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BoardSlugGifts;
