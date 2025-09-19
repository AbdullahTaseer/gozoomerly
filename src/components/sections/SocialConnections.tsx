"use client";

import React from "react";
import Image from "next/image";
import Social_Connection from "@/assets/pngs/social-connection.png";

import icon_1 from "@/assets/svgs/social-connections-icon-1.svg";
import icon_2 from "@/assets/svgs/social-connections-icon-2.svg";
import icon_3 from "@/assets/svgs/social-connections-icon-3.svg";
import icon_4 from "@/assets/svgs/social-connections-icon-4.svg";
import TitleCard from "../cards/TitleCard";

const features = [
  {
    icon: icon_1,
    title: "See Each Other’s Profiles",
    desc: "Guests discover each other through the shared board experience",
  },
  {
    icon: icon_2,
    title: "Follow & Friend",
    desc: "Connect with people you meet at events, even if you didn’t exchange numbers",
  },
  {
    icon: icon_3,
    title: "Direct Messaging",
    desc: "Start conversations with new contacts from shared experiences",
  },
  {
    icon: icon_4,
    title: "Build Communities",
    desc: "Turn one-time events into lasting friendships and networks",
  },
];

const circles = [
  {
    color: "bg-[#E51F9A]",
    title: "Stay Connected, Your Way",
    desc: "Create separate circles for friends, family, co-workers, or anonymous contacts.",
  },
  {
    color: "bg-[#F44274]",
    title: "Control your feed",
    desc: "Filter whose posts, stories, and wishes you want to see.",
  },
  {
    color: "bg-[#B4DF86]",
    title: "Decide how to share",
    desc: "Show posts to one circle, but not others.",
  },
  {
    color: "bg-[#45BFB4]",
    title: "Your Stream, Your Way",
    desc: "Personalize your stream to focus on what matters most.",
  },
];

const SocialConnections = () => {
  return (
    <div className="px-[5%] max-[769px]:px-4 max-[768px]:px-0 mt-12">

      <div className="bg-[#F7F7F7] rounded-2xl max-[768px]:rounded-none py-12 px-8 max-[768px]:px-4 max-[600px]:px-4">

        <TitleCard title="The New Twist: Social Connections" />

        <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-8 mt-12 items-center">
          <div className="flex flex-col gap-4 max-[768px]:order-1">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#FAFAFA] h-[45px] w-[45px] rounded-full flex justify-center items-center">
                      <Image src={item.icon} height={20} width={20} alt={item.title} />
                    </div>
                    <p className="font-semibold text-[24px] max-[1150px]:text-[18px]">{item.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mt-1 pl-13">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Image
              src={Social_Connection}
              alt="Social Connections"
              className="rounded-xl max-[768px]:w-full"
            />
          </div>
        </div>


        <div className="bg-white max-[768px]:bg-transparent rounded-2xl mt-12 py-8 px-8 max-[768px]:px-0">

          <TitleCard title="Circles for Deeper Connection" />

          <div className="grid max-[768px]:flex max-[768px]:overflow-x-auto scrollbar-hide grid-cols-4 max-[1150px]:grid-cols-2 gap-6 mt-6">
            {circles.map((circle, i) => (
              <div
                key={i}
                className={`${circle.color} text-white p-6 max-[768px]:min-w-[280px] max-[600px]:p-4 rounded-xl shadow-sm`}
              >
                <p className="font-semibold mb-2 px-5 text-[24px] text-center">{circle.title}</p>
                <p className="text-[16px] text-center">{circle.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="font-bold text-[32px] max-[768px]:hidden">Personalized Social Experience</p>
            <div className="hidden max-[768px]:block">
              <TitleCard title="Personalized Social Experience" />
            </div>
            <p className="text-gray-600 font-medium mt-2 max-w-4xl mx-auto">
              Filter whose posts, stories, and wishes you want to see. Show posts
              to one circle, but not others. Focus on what matters most to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialConnections;
