"use client";
import React, { useState } from "react";
import FloatingInput from "../inputs/FloatingInput";
import Image from "next/image";
import dummyAvatar from "@/assets/svgs/boy-avatar.svg";
import { Plus } from "lucide-react";

const SignupInfoCard = () => {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex justify-center py-6">
        <div className="relative inline-block">
          <div className="relative h-[130px] w-[130px]">
            <Image src={avatar || dummyAvatar} alt="avatar" fill className="rounded-full object-cover border" />
          </div>

          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <label
            htmlFor="avatarUpload"
            className="cursor-pointer border-2 absolute bottom-2 right-1 h-7 w-7 flex justify-center items-center text-white rounded-full border-white bg-[#E3418B]"
          >
            <Plus size={18} />
          </label>
        </div>
      </div>

      <FloatingInput id={"Full Name"} title="Full Name" width="100%" className="mb-6" />
      <FloatingInput id={"Birthday Date"} title="Birthday Date" type="date" width="100%" className="mb-6" />
    </div>
  );
};

export default SignupInfoCard;