"use client";
import React from "react";
import Image from "next/image";
import { CalendarCheck, MapPin } from "lucide-react";

import GlobalButton from "../buttons/GlobalButton";

import Community_1_avatar from "@/assets/svgs/community-1.svg";
import Community_2_avatar from "@/assets/svgs/community-2.svg";
import Community_3_avatar from "@/assets/svgs/community-3.svg";
import Community_4_avatar from "@/assets/svgs/community-4.svg";

const boards = [
  {
    id: 1,
    avatar: Community_1_avatar,
    title: "Sean's 40th Birthday Surprise Board",
    location: "Miami, FL",
    date: "03/12",
    description: "Let's send Sean to the Caribbean!",
    target: 3000,
    raised: 3850,
    contributors: 27,
    wishes: 27,
    gifters: 21,
    topContributors: [
      { name: "Team Crew", amount: 500 },
      { name: "Mom & Dad", amount: 300 },
      { name: "Anna", amount: 250 },
    ],
  },
  {
    id: 2,
    avatar: Community_2_avatar,
    title: "Asha & David's Wedding Board",
    location: "New York",
    date: "09/22",
    description: "Help us start our new life together!",
    target: 7500,
    raised: 8000,
    contributors: 112,
    wishes: 112,
    gifters: 89,
    topContributors: [
      { name: "Maya", amount: 200 },
      { name: "Uncle Raj", amount: 500 },
      { name: "Anna", amount: 250 },
    ],
  },
  {
    id: 3,
    avatar: Community_3_avatar,
    title: "Miami Summer Music Festival Board",
    location: "New York",
    date: "July 2025",
    description: "Fan Board Wall",
    target: 7500,
    raised: 8000,
    contributors: 112,
    wishes: 112,
    gifters: 89,
    topContributors: [
      { name: "Maya", amount: 200 },
      { name: "Uncle Raj", amount: 500 },
      { name: "Anna", amount: 250 },
    ],
  },
  {
    id: 4,
    avatar: Community_4_avatar,
    title: "Martinez Family Reunion Board",
    location: "Texas",
    date: "July 2025",
    description: "Capture Generations of Love",
    target: 7500,
    raised: 8000,
    contributors: 112,
    wishes: 112,
    gifters: 89,
    topContributors: [
      { name: "Maya", amount: 200 },
      { name: "Uncle Raj", amount: 500 },
      { name: "Anna", amount: 250 },
    ],
  },
];


const BoardCard = ({ board }: { board: (typeof boards)[0] }) => {

  const progress = Math.round((board.raised / board.target) * 100);

  return (
    <div className="bg-[#18171F] text-white p-6 rounded-2xl shadow-lg">

      <div className="flex items-center gap-3">
        <Image
          src={board.avatar}
          alt={board.title}
          width={45}
          height={45}
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold">{board.title}</h3>
          <div className="text-xs text-white flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {board.location}
            </div>
            <div className="flex items-center gap-1">
              <CalendarCheck className="h-4 w-4" />
              • {board.date}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#23232A] p-4 rounded-md mt-4">
        <p className="text-sm font-semibold">{board.description}</p>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-white">
            <span>Target: ${board.target.toLocaleString()}</span>
            <span>
              Raised: ${board.raised.toLocaleString()} ({progress}%)
            </span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-1">
            <div
              className="h-2 mt-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4 text-sm text-center">
        <div>
          <p className="font-semibold">{board.contributors} </p>
          <p>Contributors</p>
        </div>
        <div>
          <p className="font-semibold">{board.wishes}</p>
          <p> Wishes</p>
        </div>
        <div>
          <p className="font-semibold">{board.gifters}</p>
          <p>Gifters</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[18px] font-semibold">Top Contributors</p>
        <div className="flex gap-3 flex-wrap mt-2">
          {board.topContributors.map((c, i) => (
            <p
              key={i}
              className="bg-[#1B1B1B] text-xs px-3 py-1 rounded-full border border-[#303030]"
            >
              {c.name} -{" "}
              <span className="text-[#F71873]">${c.amount}</span>
            </p>
          ))}
        </div>
      </div>

      <GlobalButton title="View Full Board" className="mt-6" />
    </div>
  );
};


const OurCommunityBoard = () => {
  return (
    <section className="px-[5%] max-[769px]:px-4 py-10">
      <h2 className="text-center text-[30px] max-[600px]:text-[24px] font-bold">
        Real Boards from Our Community
      </h2>
      <p className="text-sm text-center mt-2">
        See how Zoomerly works for every type of celebration
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </section>
  );
};

export default OurCommunityBoard;