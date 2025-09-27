"use client";
import React, { useState } from "react";
import FloatingInput from "../inputs/FloatingInput";
import Image from "next/image";
import dummyAvatar from "@/assets/svgs/boy-avatar.svg";
import { Plus } from "lucide-react";
import { Country, State, City } from "country-state-city";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import GlobalButton from "../buttons/GlobalButton";


const SignupInfoCard = ({ continueClick }: { continueClick: () => void }) => {

  const [avatar, setAvatar] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");

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

  const countries = Country.getAllCountries();
  const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
  const cities =
    countryCode && stateCode
      ? City.getCitiesOfState(countryCode, stateCode)
      : [];

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

      <div className="space-y-6">

        <FloatingInput id={"Full Name"} title="Full Name" width="100%" />
        <FloatingInput id={"Birthday Date"} title="Birthday Date" type="date" width="100%" />

        <Select onValueChange={(val) => { setCountryCode(val); setStateCode(""); }}>
          <SelectTrigger className="w-full border bg-white border-[#2E2C39] !h-[50px]">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.isoCode} value={c.isoCode}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setStateCode(val)} disabled={!countryCode}>
          <SelectTrigger className="w-full border bg-white border-[#2E2C39] !h-[50px]">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((s) => (
              <SelectItem key={s.isoCode} value={s.isoCode}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select disabled={!stateCode}>
          <SelectTrigger className="w-full border bg-white border-[#2E2C39] !h-[50px]">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <GlobalButton title='Continue' height='50px' onClick={continueClick} />
      </div>

    </div>
  );
};

export default SignupInfoCard;