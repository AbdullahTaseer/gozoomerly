"use client";

import React from 'react';
import { Car, UtensilsCrossed, Briefcase, Video, Home } from 'lucide-react';
import TitleCard from '../cards/TitleCard';

const actionButtons = [
  {
    icon: Car,
    text: "Book a ride",
    color: "text-blue-500",
    bgColor: "#EBF2FE"
  },
  {
    icon: UtensilsCrossed,
    text: "Order food for an event",
    color: "text-orange-500",
    bgColor: "#FFF2E8"
  },
  {
    icon: Briefcase,
    text: "Hire a professional",
    color: "text-green-500",
    bgColor: "#EBF9EF"
  },
  {
    icon: Video,
    text: "Book a creator",
    color: "text-purple-500",
    bgColor: "#F7EDFE"
  },
  {
    icon: Home,
    text: "Get help for home or business",
    color: "text-red-500",
    bgColor: "#FFEBEE"
  }
];

const MomentNeedsSupport = () => {
  return (
    <section className="px-[5%] max-[769px]:px-4 max-[768px]:px-0 py-10">
      <div className="bg-[#F7F7F7] rounded-2xl p-8 max-[768px]:p-6">
        <div className="text-center mb-8 max-w-[1100px] mx-auto">
          <p className="text-gray-500 text-sm uppercase tracking-wider font-medium mb-4">
            FROM CONVERSATIONS TO ACTION (WHEN YOU NEED IT)
          </p>
          <TitleCard title="When a moment needs support, Zoomerly lets you act naturally." />
        </div>

        <div className="overflow-x-auto scrollbar-hide mb-8">
          <div className="grid grid-cols-5 max-[1300px]:grid-cols-3 gap-4 max-[768px]:flex py-4">
            {actionButtons.map((button, index) => {
              const IconComponent = button.icon;
              return (
                <button
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow flex-shrink-0 min-w-[200px] max-[768px]:min-w-[180px]"
                >
                  <div style={{ background: button.bgColor }} className='h-16 rounded-md w-16 flex justify-center items-center'>
                    <IconComponent className={`w-8 h-8 ${button.color}`} />
                  </div>
                  <p className="text-black font-medium text-lg text-center">
                    {button.text}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center font-semibold text-lg">
          <p className="text-gray-600 mb-2">
            No ads. No switching apps.
          </p>
          <p className="text-black">
            Just the right help, at the right time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MomentNeedsSupport;
