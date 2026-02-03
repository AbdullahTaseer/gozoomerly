"use client";

import React from 'react';
import Image from 'next/image';
import Amb_Main_img from "@/assets/pngs/ambassador-main.png";
import AmbSub_1 from "@/assets/pngs/ambassador-sub-1.png";
import AmbSub_2 from "@/assets/pngs/ambassador-sub-2.png";
import AmbSub_3 from "@/assets/pngs/ambassador-sub-3.png";
import AmbSub_4 from "@/assets/pngs/ambassador-sub-4.png";
import TitleCard from '../cards/TitleCard';

const featureCards = [
  {
    image: AmbSub_1,
    text: "Invite professionals into the ecosystem"
  },
  {
    image: AmbSub_2,
    text: "Build your own business circle"
  },
  {
    image: AmbSub_3,
    text: "Earn from real services"
  },
  {
    image: AmbSub_4,
    text: "Help people and businesses grow"
  }
];

const BecomeZoomerlyAmbassador = () => {
  return (
    <section className="bg-[#F7F7F7] px-[5%] max-[769px]:px-4 max-[768px]:px-0 py-16">
      <div className="text-center mb-12 max-w-[1000px] mx-auto px-3">
        <p className="text-gray-500 text-sm uppercase tracking-wider font-medium mb-4">
          WANT TO GO FURTHER?
        </p>
        <TitleCard title="Zoomerly is also the only gateway into a bigger ecosystem." />
      </div>

      <div className="rounded-2xl max-[768px]:rounded-none px-8 max-[768px]:px-4 mb-12">
        <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-8 items-center">
          <div className="max-[768px]:order-1">
            <p className='text-[#F43C83] text-[44px] max-[1024px]:text-[36px] max-[768px]:text-[28px] font-bold'>Become an Ambassador</p>
            <p className="text-2xl max-[900px]:text-xl max-[768px]:text-lg leading-relaxed">
              Ambassadors help grow the platform by inviting professionals they trust.
            </p>
          </div>

          <div className="flex justify-center max-[768px]:order-2">
            <div className="relative w-full rounded-xl overflow-hidden">
              <Image
                src={Amb_Main_img}
                alt="Ambassadors shaking hands in modern office"
                className="w-full h-auto rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 max-[1150px]:grid-cols-2 max-[768px]:flex max-[768px]:overflow-x-auto scrollbar-hide gap-6 max-[768px]:gap-0 max-[768px]:px-4">
        {featureCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden max-[768px]:mx-3 max-[768px]:w-[280px] flex-shrink-0"
          >
            <div className="w-full">
              <Image
                src={card.image}
                alt={card.text}
                className="w-full h-[180px] object-cover"
              />
            </div>
            <div className="p-6">
              <p className="font-semibold text-xl max-[900px]:text-lg">
                {card.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BecomeZoomerlyAmbassador;
