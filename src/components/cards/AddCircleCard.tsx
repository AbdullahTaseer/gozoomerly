import React from "react";
import Image from "next/image";
import Delete from "@/assets/svgs/trash.svg";
import MoveToFolder from "@/assets/svgs/move-to-folder.svg";

interface AddCircleCardProps {
  avatar: string;
  name: string;
  time: string;
  message: string;
  onDelete?: () => void;
  onMoveToFolder?: () => void;
}

const AddCircleCard = ({ avatar, name, time, message, onDelete, onMoveToFolder }: AddCircleCardProps) => {
  return (
    <div className="bg-[#F4F4F4] rounded-[12px] px-4 py-3 flex items-center justify-between mt-4">

      <div className="flex items-start space-x-3">
        <div className="h-[46px] w-[46px] p-[2px] border border-black rounded-full">
          <Image src={avatar} alt="avatar" width={40} height={40} className="w-[40px] h-[40px] rounded-full" />
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
        <Image
          src={Delete}
          alt="Delete"
          className="cursor-pointer hover:opacity-75"
          onClick={onDelete}
        />
        <Image
          src={MoveToFolder}
          alt="Move to folder"
          className="cursor-pointer hover:opacity-75"
          onClick={onMoveToFolder}
        />
      </div>
    </div>
  );
};

export default AddCircleCard;