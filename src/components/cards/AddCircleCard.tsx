import React from "react";
import Image from "next/image";
import Delete from "@/assets/svgs/trash.svg";
import MoveToFolder from "@/assets/svgs/move-to-folder.svg";

const AddCircleCard = ({ avatar, name, time, message }: any) => {
  return (
    <div className="bg-[#F4F4F4] rounded-[12px] px-4 py-3 flex items-center justify-between mt-4">

      <div className="flex items-start space-x-3">
        <div className="h-[46px] w-[46px] p-[2px] border border-black rounded-full">
          <Image src={avatar} alt="avatar" className="w-[40px] h-[40px] rounded-full" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold">{name}</p>
            <span className="text-gray-500 text-sm">{time}</span>
          </div>
          <p className="text-gray-600 text-sm mt-1 line-clamp-1">{message}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Image src={Delete} alt="" className="cursor-pointer hover:opacity-75" />
        <Image src={MoveToFolder} alt="" className="cursor-pointer hover:opacity-75" />
      </div>
    </div>
  );
};

export default AddCircleCard;