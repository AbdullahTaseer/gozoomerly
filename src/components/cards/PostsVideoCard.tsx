"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Play } from "lucide-react";

import Avatar from "@/assets/svgs/Sohail.svg";
import videoThumb from "@/assets/pngs/video-thumbnail.png";

const PostsVideoCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);

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
          <span className="font-semibold">Mark D.</span>
          <span className="bg-[#F4F4F4] rounded-full px-2 py-1 text-sm">
            Creator
          </span>
        </div>
        <div className="space-x-2 flex flex-wrap">
          <span className="bg-black text-white rounded-full px-3 py-1 text-xs">
            ✨ Wished
          </span>
          <span className="bg-black text-white rounded-full px-3 py-1 text-xs">
            💖 With Love - $100
          </span>
        </div>
      </div>

      <div className="relative px-5">
        {isPlaying ? (
          <iframe
            className="rounded-xl w-full aspect-video"
            src="https://www.youtube.com/embed/3GwjfUFyY6M?autoplay=1"
            title="Birthday Celebration Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={videoThumb}
              alt="video thumbnail"
              className="rounded-xl w-full object-cover"
            />
            <button
              className="absolute inset-0 flex items-center justify-center"
              onClick={() => setIsPlaying(true)}
            >
              <div className="border border-white text-white rounded-full p-3 shadow-md bg-black/60 hover:bg-black transition">
                <Play size={23} />
              </div>
            </button>
          </>
        )}
      </div>

      
      <p className="mt-4 px-5 text-sm">
        <span className="font-bold">Sean,</span> you&apos;re the most deserving
        person I know. Here&apos;s to your dream trip 🌊
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

export default PostsVideoCard;