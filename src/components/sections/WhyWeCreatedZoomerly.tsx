"use client";
import React from "react";
import Image from "next/image";

import Particles from "@/assets/svgs/why-people-love-particles.svg";

import problem_1 from "@/assets/svgs/problem-icon-1.svg";
import problem_2 from "@/assets/svgs/problem-icon-2.svg";
import problem_3 from "@/assets/svgs/problem-icon-3.svg"

import solve_1 from "@/assets/svgs/solves-icon-1.svg";
import solve_2 from "@/assets/svgs/solves-icon-2.svg";
import solve_3 from "@/assets/svgs/solves-icon-3.svg";

import TitleCard from "../cards/TitleCard";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type CardProps = {
  icon: string | StaticImport;
  title: string;
  desc: string;
}

const Card = ({ icon, title, desc }: CardProps) => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 flex max-[768px]:flex-col max-[768px]:items-center gap-3 items-start max-[768px]:min-w-[240px]">
      <div className="flex-shrink-0 h-[55px] w-[55px] flex justify-center items-center rounded-full bg-white">
        <Image
          src={icon}
          alt={title}
          width={26}
          height={26}
        />
      </div>
      <div className="max-[768px]:text-center">
        <p className="font-semibold text-[20px] max-[900px]:text-[16px]">{title}</p>
        <p className="text-gray-600 mt-1 max-[900px]:text-sm">{desc}</p>
      </div>
    </div>
  )
}

const WhyWeCreatedZoomerly = () => {
  return (
    <section className="px-[5%] max-[769px]:px-4 py-16 relative">

      <div className="px-18 max-[1200px]:px-1">
        <Image src={Particles} alt="particles" className='absolute bottom-28 -z-10 right-0' />
        <TitleCard title="Why We Created Zoomerly" />
        <div className="grid grid-cols-2 gap-6 mt-12 relative max-[768px]:hidden">
          <p className="text-transparent font-bold text-[32px] max-[900px]:text-[28px] bg-clip-text bg-gradient-to-r from-[#EA4088] to-[#885CB8]">The Problem</p>
          <p className="text-transparent font-bold text-[32px] max-[900px]:text-[28px] bg-clip-text bg-gradient-to-r from-[#EA4088] to-[#885CB8]">Zoomerly solves all of this</p>
          <Card icon={problem_1} title="Memories get lost across chats, feeds, and phones." desc="Important moments scattered across different platforms" />
          <Card icon={solve_1} title="One shared space for wishes, photos, videos, and gifts." desc="Everything in one beautiful, organized place" />
          <Card icon={problem_2} title="Guests often never get to connect after events." desc="Missing opportunities to build lasting relationships" />
          <Card icon={solve_2} title="A social layer so people at the same event can connect, follow, and message each other." desc="Missing opportunities to build lasting relationships" />
          <Card icon={problem_3} title="Gifting feels transactional instead of meaningful." desc="Gifts lack personal connection and context" />
          <Card icon={solve_3} title="Boards that last forever, so celebrations never fade away." desc="Preserve precious memories for generations" />
        </div>

        <div className="hidden max-[768px]:block">
          <div className="mt-10">
            <p className="text-transparent font-bold text-[32px] max-[900px]:text-[28px] bg-clip-text bg-gradient-to-r from-[#EA4088] to-[#885CB8]">The Problem</p>
            <div className="flex gap-6 mt-3 overflow-x-auto scrollbar-hide">
              <Card icon={problem_1} title="Memories get lost across chats, feeds, and phones." desc="Important moments scattered across different platforms" />
              <Card icon={solve_1} title="One shared space for wishes, photos, videos, and gifts." desc="Everything in one beautiful, organized place" />
              <Card icon={problem_2} title="Guests often never get to connect after events." desc="Missing opportunities to build lasting relationships" />
            </div>
          </div>

          <div className="mt-10">
            <p className="text-transparent font-bold text-[32px] max-[900px]:text-[28px] bg-clip-text bg-gradient-to-r from-[#EA4088] to-[#885CB8]">Zoomerly solves all of this</p>
            <div className="flex gap-6 mt-3 overflow-x-auto scrollbar-hide">
              <Card icon={solve_2} title="A social layer so people at the same event can connect, follow, and message each other." desc="Missing opportunities to build lasting relationships" />
              <Card icon={problem_3} title="Gifting feels transactional instead of meaningful." desc="Gifts lack personal connection and context" />
              <Card icon={solve_3} title="Boards that last forever, so celebrations never fade away." desc="Preserve precious memories for generations" />
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default WhyWeCreatedZoomerly;