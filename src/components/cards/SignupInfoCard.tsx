"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { SelectItem } from "@/components/ui/select";
import { Country, State, City } from "country-state-city";

import FloatingInput from "../inputs/FloatingInput";
import GlobalButton from "../buttons/GlobalButton";
import FloatingSelect from "../inputs/FloatingSelect";

import dummyAvatar from "@/assets/svgs/boy-avatar.svg";

export interface UserInfo {
  fullName: string;
  birthDate: string;
  country: string;
  state: string;
  city: string;
  avatar?: string | null;
}

interface SignupInfoCardProps {
  continueClick: (userInfo: UserInfo) => void;
}

const SignupInfoCard = ({ continueClick }: SignupInfoCardProps) => {

  const [avatar, setAvatar] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");
  const [city, setCity] = useState<string>("");

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

  const handleContinue = () => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    const selectedState = states.find(s => s.isoCode === stateCode);
    
    continueClick({
      fullName,
      birthDate,
      country: selectedCountry?.name || countryCode,
      state: selectedState?.name || stateCode,
      city,
      avatar
    });
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

      <div className="space-y-6">

        <FloatingInput 
          id={"Full Name"} 
          title="Full Name" 
          width="100%" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <FloatingInput 
          id={"Birthday Date"} 
          title="Birthday Date" 
          type="date" 
          width="100%" 
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <FloatingSelect
          label="Country"
          value={countryCode}
          onChange={(val) => {
            setCountryCode(val);
            setStateCode("");
          }}
        >
          {countries.map((c) => (
            <SelectItem key={c.isoCode} value={c.isoCode}>
              {c.name}
            </SelectItem>
          ))}
        </FloatingSelect>

        <FloatingSelect
          label="State"
          value={stateCode}
          onChange={(val) => setStateCode(val)}
          disabled={!countryCode}
        >
          {states.map((s) => (
            <SelectItem key={s.isoCode} value={s.isoCode}>
              {s.name}
            </SelectItem>
          ))}
        </FloatingSelect>

        <FloatingSelect
          label="City"
          value={city}
          onChange={(val) => setCity(val)}
          disabled={!stateCode}
        >
          {cities.map((cityObj) => (
            <SelectItem key={cityObj.name} value={cityObj.name}>
              {cityObj.name}
            </SelectItem>
          ))}
        </FloatingSelect>

        <GlobalButton 
          title='Continue' 
          height='50px' 
          onClick={handleContinue}
          disabled={!fullName || !birthDate || !countryCode || !stateCode || !city}
        />
      </div>

    </div>
  );
};

export default SignupInfoCard;