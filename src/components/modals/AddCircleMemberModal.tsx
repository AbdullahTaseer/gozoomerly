import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";
import GlobalInput from "../inputs/GlobalInput";
import GlobalButton from "../buttons/GlobalButton";
import avatar_1 from "@/assets/svgs/chat-avatar-1.svg";
import avatar_2 from "@/assets/svgs/chat-avatar-2.svg";
import avatar_3 from "@/assets/svgs/chat-avatar-3.svg";
import avatar_4 from "@/assets/svgs/chat-avatar-4.svg";

const members = [
  { name: "Rasib malik", avatar: avatar_4 },
  { name: "Nashit malik", avatar: avatar_2 },
  { name: "Bilal malik", avatar: avatar_3 },
  { name: "M.Haroon", avatar: avatar_4 },
  { name: "Amelia", avatar: avatar_2 },
  { name: "John Smith", avatar: avatar_2 },
  { name: "John Doe", avatar: avatar_1 },
];

const AddCircleMemberModal = () => {
  return (
    <div className="space-y-4">

      <div className="relative">
        <Search size={18} className="absolute top-3 left-3 text-gray-500" />
        <GlobalInput
          placeholder="Search"
          height="42px"
          width="100%"
          borderRadius="100px"
          inputClassName="pl-10"
        />
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">

        {members.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-[#F4F4F4] rounded-[12px] py-3 px-4"
          >
            <div className="flex items-center space-x-3">
              <Image
                src={m.avatar}
                width={40}
                height={40}
                alt={m.name}
                className="rounded-full object-cover"
              />

              <p className="font-medium text-[15px]">{m.name}</p>
            </div>

            <GlobalButton
              title="Add"
              bgColor="black"
              width="80px"
              hover={{ bgColor: "black" }}
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default AddCircleMemberModal;
