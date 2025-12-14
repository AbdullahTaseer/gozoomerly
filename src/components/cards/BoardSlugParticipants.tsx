import React from "react";
import Image from "next/image";
import DummyAvatar1 from "@/assets/svgs/chat-avatar-1.svg";
import DummyAvatar2 from "@/assets/svgs/chat-avatar-2.svg";
import DummyAvatar3 from "@/assets/svgs/chat-avatar-3.svg";

const BoardSlugParticipants = () => {
  const participants = [
    { id: 1, name: "Jamie", avatar: DummyAvatar1, date: "Joined Nov 11" },
    { id: 2, name: "Anna", avatar: DummyAvatar3, date: "Joined Nov 11" },
    { id: 3, name: "Anna", avatar: DummyAvatar2, date: "Joined Nov 11" },
    { id: 4, name: "Alex the Brave", avatar: DummyAvatar1, date: "Joined Nov 11" },
  ];

  return (
    <div className="space-y-4">

      {participants.map((participant) => (
        <div
          key={participant.id}
          className="bg-[#F4F4F4] flex-wrap gap-3 rounded-[12px] px-4 py-3 flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <Image
              src={participant.avatar}
              className="h-12 w-12 rounded-full shrink-0"
              alt={participant.name}
            />
            <div>
              <p className="text-black max-[450px]:text-[16px] text-[18px] font-semibold">
                {participant.name}
              </p>
              <p className="text-sm text-gray-500">{participant.date}</p>
            </div>
          </div>

          <p className="bg-white text-md text-black rounded-full py-1 px-5">
            Follow
          </p>
        </div>
      ))}
    </div>
  );
};

export default BoardSlugParticipants;
