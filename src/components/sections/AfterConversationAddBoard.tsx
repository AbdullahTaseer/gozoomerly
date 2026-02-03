"use client";

import { Check } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import ConversationBoard_1 from "@/assets/pngs/conversation-board-1.png";
import ConversationBoard_2 from "@/assets/pngs/conversation-board-2.png";
import ConversationBoard_3 from "@/assets/pngs/conversation-board-3.png";
import ConversationBoard_4 from "@/assets/pngs/conversation-board-4.png";
import TitleCard from '../cards/TitleCard';

const boardCards = [
  {
    image: ConversationBoard_1,
    label: "Birthdays"
  },
  {
    image: ConversationBoard_2,
    label: "Trips & travel"
  },
  {
    image: ConversationBoard_3,
    label: "Events & parties"
  },
  {
    image: ConversationBoard_4,
    label: "New homes"
  },
  {
    image: ConversationBoard_1,
    label: "Ideas & Projects"
  },
  {
    image: ConversationBoard_2,
    label: "Family Moments"
  },
  {
    image: ConversationBoard_3,
    label: "Personal Goals"
  },
];

const features = ["Messages", "Photos & videos", "Memories", "Plans", "Contributions"];

const AfterConversationAddBoard = () => {
  return (
    <section className="py-10 bg-white">
      <div className="text-center max-w-[1200px] mx-auto px-4">
        <p className="text-gray-500 text-sm uppercase tracking-wider font-medium mb-4">
          ADD BOARDS TO ANY MOMENT IN YOUR LIFE
        </p>
        <TitleCard title="When a conversation becomes something more, add a board." />
      </div>

      <div className="overflow-x-auto scrollbar-hide mb-8 max-[768px]:px-4 py-6">
        <div className="flex">
          {boardCards.map((card, index) => (
            <div
              key={index}
              className="bg-white ml-6 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex-shrink-0 w-[280px] max-[768px]:w-[240px]"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.label}
                  className="object-cover w-full h-full"
                  priority={index === 0}
                />
              </div>
              <p className="text-black font-semibold text-center py-4 text-lg max-[900px]:text-base">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[#E1E1E1] rounded-xl p-8 max-[768px]:p-6 mx-[5%] max-[768px]:mx-0">
        <p className="font-bold text-2xl max-[900px]:text-xl max-[768px]:text-lg text-black text-center mb-6">
          Boards become living spaces for:
        </p>
        <div className="overflow-x-auto scrollbar-hide max-[768px]:-mx-4 max-[768px]:px-4">
          <div className="grid grid-cols-5 max-[1150px]:grid-cols-3 max-[768px]:flex max-[768px]:gap-4 gap-4">
            {features.map((item) => (
              <div
                key={item}
                className="bg-[#845CBA29] shadow-sm flex items-center justify-center gap-2 py-3 px-4 rounded-lg max-[768px]:min-w-[200px] flex-shrink-0"
              >
                <Check className="w-5 h-5 text-[#845CBA] flex-shrink-0" />
                <p className="text-black font-medium text-sm max-[900px]:text-xs text-center whitespace-nowrap">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[#845CBA] text-center mt-6 text-lg max-[900px]:text-base max-[768px]:text-sm">
          Your life — organized beautifully.
        </p>
      </div>
    </section>
  );
};

export default AfterConversationAddBoard;
