"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { SelectItem } from "@/components/ui/select";
import { Country, State, City } from "country-state-city";
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';

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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      setUploadError(null);
      setAvatarFile(file);
      
      // Create preview
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

      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Convert file to array buffer
      const arrayBuffer = await avatarFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Upload using direct storage API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/profile-images/${fileName}`,
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

      // Construct public URL
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${fileName}`;

      return publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleContinue = async () => {
    const selectedCountry = countries.find(c => c.isoCode === countryCode);
    const selectedState = states.find(s => s.isoCode === stateCode);
    
    // Upload avatar if one was selected
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
            <Image src={avatarPreview || dummyAvatar} alt="avatar" fill className="rounded-full object-cover border" />
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