"use client";
import React, { useState } from "react";
import TitleCard from "@/components/cards/TitleCard";
import GlobalButton from "@/components/buttons/GlobalButton";

import avatar_1 from "@/assets/svgs/chat-avatar-1.svg";
import avatar_2 from "@/assets/svgs/chat-avatar-2.svg";
import avatar_3 from "@/assets/svgs/chat-avatar-3.svg";
import avatar_4 from "@/assets/svgs/chat-avatar-4.svg";
import AddCircleCard from "@/components/cards/AddCircleCard";
import GlobalModal from "@/components/modals/GlobalModal";
import AddCircleMemberModal from "@/components/modals/AddCircleMemberModal";

const mockData = [
  { avatar: avatar_1, name: "joshua_l", time: "now", message: "Have a nice day, bro!" },
  { avatar: avatar_2, name: "karennne", time: "15m", message: "I heard this is a good movie, s..." },
  { avatar: avatar_3, name: "martini_rond", time: "20m", message: "Have a nice day, bro!" },
  { avatar: avatar_4, name: "andrewww_", time: "2h", message: "Sounds good 😂😂😂" },
  { avatar: avatar_1, name: "kiero_d", time: "3h", message: "The new design looks cool, b..." },
  { avatar: avatar_2, name: "maxjacobson", time: "3h", message: "Thank you, bro!" },
  { avatar: avatar_3, name: "jamie.franco", time: "4h", message: "Yep, I'm going to travel in To..." },
  { avatar: avatar_4, name: "m_humphrey", time: "5h", message: "Have a nice day, bro!" },
];

const CircleById = () => {
  const [memberModalOpen, setIsMemberModalOpen] = useState(false);
  return (
    <div className="px-[7%] max-[769px]:px-4 py-6">

      <div className="flex justify-between items-center flex-wrap gap-2">
        <TitleCard title="Family Circles" />
        <GlobalButton
          title="Add Member"
          bgColor="black"
          width="140px"
          hover={{ bgColor: "black" }}
          onClick={() => setIsMemberModalOpen(true)}
        />
      </div>

      {/* LIST */}
      <div className="mt-4">
        {mockData.map((item: any, index: number) => (
          <AddCircleCard
            key={index}
            avatar={item.avatar}
            name={item.name}
            time={item.time}
            message={item.message}
          />
        ))}
      </div>

      <GlobalModal
        title="Add Member"
        isOpen={memberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        className="w-[500px] max-[550px]:w-[95vw]"
      >
        <AddCircleMemberModal />
      </GlobalModal>

    </div>
  );
};

export default CircleById;