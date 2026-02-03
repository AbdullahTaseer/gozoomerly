"use client";

import React from 'react';
import { Users2, Heart, StickyNote, MessageCircleMore } from 'lucide-react';
import TitleCard from '../cards/TitleCard';

const featureCards = [
  {
    icon: MessageCircleMore,
    text: "1-on-1 chats"
  },
  {
    icon: Users2,
    text: "Group chats"
  },
  {
    icon: Heart,
    text: "Family & friends circles"
  },
  {
    icon: StickyNote,
    text: "Private, simple conversations"
  }
];

const ZoomerlyBegins = () => {
  return (
    <section className="px-[5%] max-[769px]:px-4 max-[768px]:px-0 py-16 bg-white">
      <div className="text-center mb-12 px-4">
        <p className="text-gray-500 text-sm uppercase tracking-wider font-medium mb-4">
          MESSAGING COMES FIRST
        </p>
        <TitleCard title="Zoomerly begins as a clean, fast, human messenger." />
      </div>

      <div className="overflow-x-auto scrollbar-hide max-[768px]:p-4 mb-8">
        <div className="grid grid-cols-4 max-[1150px]:grid-cols-2 max-[768px]:flex max-[768px]:gap-4 gap-6">
          {featureCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-xl hover:border-pink-200 transition-shadow flex flex-col max-[768px]:min-w-[280px] flex-shrink-0"
              >
                <div className="w-12 h-12 bg-[#FEE4E8] rounded-lg flex items-center justify-center self-start mb-4">
                  <IconComponent className="w-6 h-6 text-[#EA4088]" />
                </div>
                <p className="text-black font-semibold text-lg max-[900px]:text-base mt-auto">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center px-4">
        <p className="font-bold text-2xl max-[900px]:text-xl max-[768px]:text-lg text-black mb-3">
          No noise. No pressure. No algorithms controlling your life.
        </p>
        <p className="text-lg max-[900px]:text-base max-[768px]:text-sm text-[#7A7A7A]">
          Just messaging the way it should feel.
        </p>
      </div>
    </section>
  );
};

export default ZoomerlyBegins;
