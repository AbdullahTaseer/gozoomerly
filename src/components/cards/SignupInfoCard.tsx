"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { createClient } from '@/lib/supabase/client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storageBuckets';
import { authService } from '@/lib/supabase/auth';

import FloatingInput from "../inputs/FloatingInput";
import GlobalButton from "../buttons/GlobalButton";
import FloatingSearchSelect from "../inputs/FloatingSearchSelect";

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

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      setUploadError(null);
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
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

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null;

    setUploadingImage(true);
    try {
      const currentUser = await authService.getUser();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const supabase = createClient();
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${currentUser.id}.${fileExt}`;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const arrayBuffer = await avatarFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKETS.PROFILE_IMAGES}/${fileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': avatarFile.type,
            'Cache-Control': 'max-age=3600'
          },
          body: uint8Array
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to upload image: ${error}`);
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKETS.PROFILE_IMAGES}/${fileName}`;

      return publicUrl;
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleContinue = async () => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    const selectedState = states.find(s => s.isoCode === stateCode);

    const avatarUrl = await uploadAvatar();

    continueClick({
      fullName,
      birthDate,
      country: selectedCountry?.name || countryCode,
      state: selectedState?.name || stateCode,
      city,
      avatar: avatarUrl
    });
  };

  return (
    <div>
      <div className="flex justify-center py-6">
        <div className="relative inline-block">
          <div className="relative h-[130px] w-[130px]">
            <Image
              src={avatarPreview || dummyAvatar}
              alt="avatar"
              fill
              className="rounded-full object-cover border"
              sizes="130px"
            />
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

        <FloatingSearchSelect
          label="Country"
          value={countryCode}
          onChange={(val) => {
            setCountryCode(val);
            setStateCode("");
            setCity("");
          }}
          options={countries.map((c) => ({
            value: c.isoCode,
            label: c.name,
            keywords: [c.isoCode],
          }))}
          searchPlaceholder="Search country..."
        />

        <FloatingSearchSelect
          label="State"
          value={stateCode}
          onChange={(val) => {
            setStateCode(val);
            setCity("");
          }}
          disabled={!countryCode}
          options={states.map((s) => ({
            value: s.isoCode,
            label: s.name,
            keywords: [s.isoCode],
          }))}
          searchPlaceholder="Search state..."
        />

        <FloatingSearchSelect
          label="City"
          value={city}
          onChange={(val) => setCity(val)}
          disabled={!stateCode}
          options={cities.map((cityObj) => ({
            value: cityObj.name,
            label: cityObj.name,
          }))}
          searchPlaceholder="Search city..."
        />

        {uploadError && (
          <div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm'>
            {uploadError}
          </div>
        )}

        <GlobalButton
          title={uploadingImage ? 'Uploading...' : 'Continue'}
          height='50px'
          onClick={handleContinue}
          disabled={!fullName || !birthDate || !countryCode || !stateCode || !city || uploadingImage}
        />
      </div>

    </div>
  );
};

export default SignupInfoCard;