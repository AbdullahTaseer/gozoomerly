"use client";
import React, { useState } from "react";
import GlobalInput from "../inputs/GlobalInput";
import { CloudUpload } from "lucide-react";
import GlobalButton from "../buttons/GlobalButton";
import ArrowRight from "@/assets/svgs/ArrowRight.svg";

const themes = [
  { label: "Fun & Colorful", color: "bg-gradient-to-b from-[#CE7ADD] to-[#9184FC]" },
  { label: "Elegant & Gold", color: "bg-gradient-to-b from-[#FDF6B4] to-[#FBE66C]" },
  { label: "Love", color: "bg-gradient-to-b from-[#F6CDD7] to-[#F6CFDA]" },
  { label: "Love", color: "bg-gradient-to-b from-[#C0E1FC] to-[#B0F3EF]" },
  { label: "Kids", color: "bg-gradient-to-b from-[#C0F4D1] to-[#D1F6B5]" },
  { label: "Success", color: "bg-gradient-to-b from-[#C1F4D2] to-[#D5F7AF]" },
  { label: "Travel", color: "bg-gradient-to-b from-[#F9DCA6] to-[#FBEC93]" },
];

type props = {
  nextClick?: () => void;
}

const PickThemeForm = ({ nextClick }: props) => {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 max-[420px]:p-4 mx-auto">

      <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
        Let's make someone's birthday unforgettable 🎉
      </p>
      <p className="text-sm text-center mt-1">
        Pick a theme and tell us about the birthday star
      </p>

      <div className="grid grid-cols-7 gap-3 mt-6 flex-wrap">
        {themes.map((theme, i) => (
          <div
            key={i}
            onClick={() => setSelectedTheme(i)}
            className={`flex flex-col items-center cursor-pointer`}
          >
            <div
              className={`w-14 max-[600px]:w-10 h-14 max-[600px]:h-10 rounded-full border-2 flex items-center justify-center 
              ${selectedTheme === i ? "border-black" : "border-[#F2F2F2]"}`}
            >
              <div className={`w-11 max-[600px]:w-7 h-11 max-[600px]:h-7 rounded-full ${theme.color}`} />
            </div>
            <p className="text-xs mt-1 text-center md:whitespace-nowrap">{theme.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlobalInput placeholder="Sean" title="First Name*" width="100%" height="40px" />
          <GlobalInput placeholder="Parker" title="Last Name*" width="100%" height="40px" />
        </div>

        <GlobalInput
          placeholder="Pick a date"
          title="Date of Birth*"
          width="100%"
          height="40px"
          type="Date"
        />

        <GlobalInput
          placeholder="Miami, FL"
          title="Hometown*"
          width="100%"
          height="40px"
        />

        <GlobalInput
          placeholder="(555) 123-4567"
          title="Phone Number (Private)"
          width="100%"
          height="40px"
        />

        <GlobalInput
          placeholder="sean@email.com"
          title="Email Address (Private)"
          width="100%"
          height="40px"
        />

        <div>
          <p className="text-sm mb-1">Profile Picture*</p>
          <label
            className="w-full h-32 border border-dashed border-[#B2B2B2] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          >
            <div className="bg-[#EEEEEE] flex justify-center items-center h-9 w-9 rounded-full">
              <CloudUpload className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {profilePicture ? profilePicture.name : "Upload Picture"}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <GlobalButton onClick={nextClick} title="Next" height="44px" icon={ArrowRight} className="flex-row-reverse" />
      </div>

    </div>
  );
};

export default PickThemeForm;