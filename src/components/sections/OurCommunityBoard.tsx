"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { boards } from "@/lib/MockData";
import GlobalButton from "../buttons/GlobalButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TitleCard from "../cards/TitleCard";

const BoardCard = ({ board }: { board: (typeof boards)[0] }) => {
  const progress = board.target > 0 ? Math.round((board.raised / board.target) * 100) : 0;

  return (
    <div className="bg-[#18171F] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full max-[400px]:min-h-[650px]">
      <h3 className="text-[24px] max-[1250px]:text-[20px] max-[400px]:text-[16px]">{board.title}</h3>
      <div className="flex items-center gap-3 mt-2">
        <Image src={board.avatar} alt={board.title} width={70} height={70} className="rounded-full shrink-0" />
        <div>
          <p className="font-medium text-[20px] max-[400px]:text-[16px]">{board.name}</p>
          <div className="text-sm text-gray-100 flex flex-col gap-1">
            <span>Location: {board.location}</span>
            <span>Date: {board.date}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#23232A] p-4 rounded-lg mt-4">
        <p className="text-sm min-h-[40px]">{board.description}</p>
        <p className="text-sm font-semibold mt-3">{board.fundTitle}</p>
        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-100 mt-1">
          <span>Raised: ${board.raised.toLocaleString()}</span>
          <span>Target: ${board.target.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-between gap-1 flex-wrap text-center text-sm mt-4">
        <div><p>{board.invited}</p><p>Invited</p></div>
        <div><p>{board.participants}</p><p>Participants</p></div>
        <div><p>{board.wishes}</p><p>Wishes</p></div>
        <div><p>{board.gifters}</p><p>Gifters</p></div>
        <div><p>{board.media}</p><p>Media</p></div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold">Top Contributors</p>
        <div className="flex gap-3 mt-2 flex-wrap">
          {board.topContributors.map((c, i) => (
            <button
              key={i}
              className="px-3 flex gap-2 items-center py-1 text-xs rounded-full border border-[#303030] bg-[#303030]"
            >
              <Image src={c.iconSrc} height={22} width={22} alt="" />
              {c.label} - ${c.amount}
            </button>
          ))}
        </div>
      </div>

      <GlobalButton title="View Full Board" className="mt-6" />
    </div>
  );
};

const OurCommunityBoard = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);


  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <section className="px-[5%] max-[769px]:px-4 py-10">

      <TitleCard title="Real Boards from Our Community" />

      <div className="mt-10 relative px-10 max-[800px]:px-6 max-[420px]:px-4">

        <button
          ref={prevRef}
          disabled={isBeginning}
          className={`absolute -left-4 max-[800px]:-left-2 top-1/2 -translate-y-1/2 z-10 p-3 max-[600px]:p-2 rounded-full border transition 
            ${isBeginning ? "cursor-not-allowed bg-gray-300" : "cursor-pointer bg-white hover:bg-pink-500 hover:text-white"}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>


        <button
          ref={nextRef}
          disabled={isEnd}
          className={`absolute -right-4 max-[800px]:-right-2 top-1/2 -translate-y-1/2 z-10 p-3 max-[600px]:p-2 rounded-full border transition 
            ${isEnd ? "cursor-not-allowed bg-gray-300" : "cursor-pointer bg-white hover:bg-pink-500 hover:text-white"}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>


        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          onInit={(swiper) => {
            if (typeof swiper.params.navigation !== "boolean") {
              const nav = swiper.params.navigation as any;
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);

            swiper.on("slideChange", () => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            });
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {boards.map((board) => (
            <SwiperSlide key={board.id}>
              <BoardCard board={board} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OurCommunityBoard;
