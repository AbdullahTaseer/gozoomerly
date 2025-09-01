"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Play,
} from "lucide-react";

import Avatar from "@/assets/svgs/Sohail.svg";
import carousel_1 from "@/assets/pngs/post-carousel-1.jpg";
import carousel_2 from "@/assets/pngs/posts-carsousel-2.jpg";

const PostsImagesCarouselCard = () => {
  const media = [
    { type: "image", src: carousel_1 },
    { type: "image", src: carousel_2 },
    {
      type: "video",
      src: "https://www.youtube.com/embed/3GwjfUFyY6M",
    },
    { type: "image", src: carousel_1 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, media.length - 1));

  const currentItem = media[currentIndex];

  useEffect(() => {
    if (currentItem.type === "video") {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentItem]);

  return (
    <div className="border border-[#E8E8E8] rounded-[24px] overflow-clip">

      <div className="flex justify-between items-center flex-wrap gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <Image
            src={Avatar}
            alt=""
            height={50}
            width={50}
            className="rounded-full border-2 border-pink-100"
          />
          <span className="font-semibold">Anna</span>
          <span className="bg-[#F4F4F4] rounded-full px-2 py-1 text-sm">Creator</span>
        </div>
        <div className="space-x-2 flex flex-wrap">
          <span className="bg-black text-white rounded-full px-3 py-1 text-xs">
            ✨ Wished
          </span>
          <span className="bg-black text-white rounded-full px-3 py-1 text-xs">
            ✈️ Take Flight - $250
          </span>
        </div>
      </div>

      <div className="relative px-5">
        {currentItem.type === "image" ? (
          <Image
            src={currentItem.src}
            alt={`carousel-item-${currentIndex}`}
            className="rounded-xl w-full object-cover"
          />
        ) : (
          <div className="relative w-full">
            {isPlaying ? (
              <iframe
                className="rounded-xl w-full aspect-video"
                src={`${currentItem.src}?autoplay=1`}
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative">
                <div className="rounded-xl w-full aspect-video bg-black/40 flex items-center justify-center text-white">
                  Video Preview
                </div>
                <button
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={() => setIsPlaying(true)}
                >
                  <div className="border border-white text-white rounded-full p-3 shadow-md bg-black/60 hover:bg-black transition">
                    <Play size={23} />
                  </div>
                </button>
              </div>
            )}
          </div>
        )}


        {media.length > 1 && currentIndex > 0 && (
          <button
            onClick={() => {
              goPrev();
            }}
            className="absolute top-1/2 left-8 -translate-y-1/2 border border-white text-white hover:text-black hover:bg-white cursor-pointer rounded-full p-2 shadow transition"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {media.length > 1 && currentIndex < media.length - 1 && (
          <button
            onClick={() => {
              goNext();
            }}
            className="absolute top-1/2 right-8 -translate-y-1/2 border border-white text-white hover:text-black hover:bg-white cursor-pointer rounded-full p-2 shadow transition"
          >
            <ChevronRight size={20} />
          </button>
        )}


        {media.length > 1 && (
          <div className="flex justify-center gap-2 mt-3 absolute bottom-5 w-full">
            {media.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 w-2 rounded-full transition ${currentIndex === idx ? "bg-black" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        )}
      </div>


      <p className="mt-4 px-5 text-sm">
        <span className="font-bold">Sean,</span> you&apos;re the most deserving person I know.
        Here&apos;s to your dream trip 🌊
      </p>


      <div className="border-t bg-[#F4F4F4] mt-4 py-3 px-5 flex justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Heart size={16} />
          <span>68 likes</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={16} />
          <span>3 comments</span>
        </div>
      </div>
    </div>
  );
};

export default PostsImagesCarouselCard;
