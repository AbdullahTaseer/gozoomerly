"use client";
import React from "react";
import Image from "next/image";
import { CalendarCheck, MapPin } from "lucide-react";

import GlobalButton from "../buttons/GlobalButton";

import Community_1_avatar from "@/assets/svgs/community-1.svg";
import Community_2_avatar from "@/assets/svgs/community-2.svg";
import Community_3_avatar from "@/assets/svgs/community-3.svg";
import Community_4_avatar from "@/assets/svgs/community-4.svg";

import BigWish from "@/assets/svgs/big-wish-icon.svg";
import bossBoost from "@/assets/svgs/boss-boost.svg";

const boards = [
  {
    id: 1,
    avatar: Community_1_avatar,
    title: "Sean Parker birthday",
    name: "Sean Parker",
    location: "Miami, FL",
    date: "Sep 12,1988",
    description: "Let’s make Sean’s 40th unforgettable! Help him buy his dream guitar 🎸",
    fundTitle: "Goal Progress",
    target: 3000,
    raised: 1850,
    invited: 65,
    participants: 27,
    wishes: 27,
    gifters: 21,
    media: 92,
    topContributors: [
      { label: "Big Wish", amount: 300, iconSrc: BigWish },
      { label: "Boss Boost", amount: 500, iconSrc: bossBoost },
    ],
  },
  {
    id: 2,
    avatar: Community_2_avatar,
    title: "Asha & David’s Wedding",
    name: "Asha & David’s",
    location: "New York, NY",
    date: "Sep 09,2025",
    description: "Celebrate Asha & David’s love! Share your moments here.",
    fundTitle: "Honeymoon Fund",
    target: 3000,
    raised: 1850,
    invited: 250,
    participants: 112,
    wishes: 112,
    gifters: 89,
    media: '500+',
    topContributors: [
      { label: "Big Wish", amount: 300, iconSrc: BigWish },
      { label: "Boss Boost", amount: 500, iconSrc: bossBoost },
    ],
  },
  {
    id: 3,
    avatar: Community_3_avatar,
    title: "Miami Summer Music Festival",
    name: "Asha & David’s",
    location: "Miami, FL",
    date: "July 2025",
    description: "Fans from around the world! Share your festival experience here!",
    fundTitle: "Education Fund",
    target: 25000,
    raised: 32000,
    invited: 65,
    participants: 27,
    wishes: 27,
    gifters: 21,
    media: 92,
    topContributors: [
      { label: "Big Wish", amount: 300, iconSrc: BigWish },
      { label: "Boss Boost", amount: 500, iconSrc: bossBoost },
    ],
  },
  {
    id: 4,
    avatar: Community_4_avatar,
    title: "Welcoming Baby Khan",
    name: "Baby Khan",
    location: "Chicago, IL",
    date: "May 10,2025",
    description: "Help us shower Baby Khan with love and blessings.",
    fundTitle: "Nursery Fund",
    target: 3000,
    raised: 2200,
    invited: 60,
    participants: 45,
    wishes: 45,
    gifters: 30,
    media: 180,
    topContributors: [
      { label: "Big Wish", amount: 300, iconSrc: BigWish },
      { label: "Boss Boost", amount: 500, iconSrc: bossBoost },
    ],
  },
];

const BoardCard = ({ board }: { board: (typeof boards)[0] }) => {
  const progress = Math.round((board.raised / board.target) * 100);

  return (
    <div className="bg-[#18171F] text-white p-6 rounded-2xl shadow-sm flex flex-col">
      {/* Title */}
      <h3 className="text-[24px]">{board.title}</h3>

      {/* Avatar + Info */}
      <div className="flex items-center gap-3 mt-2">
        <Image
          src={board.avatar}
          alt={board.title}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-medium text-xl">{board.name}</p>
          <div className="text-xs text-gray-300 flex gap-3">
            <span>Location: {board.location}</span>
            <span>Date: {board.date}</span>
          </div>
        </div>
      </div>

      {/* Description + Progress */}
      <div className="bg-[#23232A] p-4 rounded-lg mt-4">
        <p className="text-sm">{board.description}</p>
        <p className="text-sm font-semibold mt-3">{board.fundTitle}</p>
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>Raised: ${board.raised.toLocaleString()}</span>
          <span>Target: ${board.target.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-center text-sm mt-4">
        <div>
          <p>{board.invited}</p>
          <p>Invited</p>
        </div>
        <div>
          <p>{board.participants} </p>
          <p>Participants</p>
        </div>
        <div>
          <p>{board.wishes}</p>
          <p>Wishes</p>
        </div>
        <div>
          <p>{board.gifters}</p>
          <p>Gifters</p>
        </div>
        <div>
          <p>{board.media}</p>
          <p>Media</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold">Top Contributors</p>
        <div className="flex gap-3 mt-2">
          {board.topContributors.map((c, i) => (
            <button
              key={i}
              className="px-3 flex gap-2 items-center py-1 text-xs rounded-full border border-[#303030] bg-[#1B1B1B]"
            >
              <Image src={c.iconSrc} height={22} width={22} alt="" />
              {c.label} - ${c.amount}
            </button>
          ))}
        </div>
      </div>

      <GlobalButton
        title="View Full Board"
        className="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white w-full"
      />
    </div>
  );
};

const OurCommunityBoard = () => {
  return (
    <section className="px-[5%] max-[769px]:px-4 py-10">
      <h2 className="text-center text-[42px] max-[900px]:text-[30px] max-[600px]:text-[24px] font-bold">
        Real Boards from Our Community
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </section>
  );
};

export default OurCommunityBoard;
