"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { homeBoardsSwiper } from "@/lib/MockData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TitleCard from "../cards/TitleCard";
import BoardCard from "../cards/BoardCard";

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
          {homeBoardsSwiper.map((board) => (
            <SwiperSlide key={board.id}>
              <BoardCard
                title={board.title}
                avatar={board.avatar}
                name={board.name}
                location={board.location}
                date={board.date}
                description={board.description}
                fundTitle={board.fundTitle}
                raised={board.raised}
                target={board.target}
                invited={board.invited}
                participants={board.participants}
                wishes={board.wishes}
                gifters={board.gifters}
                media={board.media}
                topContributors={board.topContributors}
                buttonText="View Full Board"
                onButtonClick={() => {}}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OurCommunityBoard;