'use client';

import {  useState, useRef  } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { createClient } from '@/lib/supabase/client';
import { STORAGE_BUCKETS } from '@/lib/supabase/storageBuckets';
import { authService } from '@/lib/supabase/auth';

interface ProfilePictureUploadProps {
  profile: any;
  onUpdate: (updatedProfile: any) => void;
  userId: string;
}

export default function ProfilePictureUpload({ profile, onUpdate, userId }: ProfilePictureUploadProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKETS.PROFILE_IMAGES}/${fileName}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
              'Content-Type': file.type,
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

        await updateProfilePicture(publicUrl);
      };

      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setUploadingImage(false);
    }
  };

  const updateProfilePicture = async (imageUrl: string) => {
    try {
      const supabase = createClient();

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ profile_pic_url: imageUrl })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        setError('Failed to update profile picture');
        return;
      }

      await authService.updateUserProfile({
        avatar_url: imageUrl,
      });

      onUpdate(updatedProfile);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className='relative group shrink-0'>
      {profile?.profile_pic_url && profile.profile_pic_url !== '' ? (
        <img
          src={profile.profile_pic_url}
          alt='Profile'
          className='rounded-full object-cover h-[90px] w-[90px]'
          onError={(e) => {

            (e.target as HTMLImageElement).src = ProfileAvatar.src || ProfileAvatar;
          }}
        />
      ) : (
        <Image
          src={ProfileAvatar}
          alt='Default profile'
          height={90}
          width={90}
          className='rounded-full object-cover'
        />
      )}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadingImage}
        className='absolute bottom-0 right-0 cursor-pointer p-1.5 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        title='Change profile picture'
      >
        {uploadingImage ? (
          <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' />
        ) : (
          <Camera size={16} className='text-white' />
        )}
      </button>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageUpload}
        className='hidden'
      />
      {error && (
        <div className='absolute top-full left-0 mt-2 p-2 bg-red-100 text-red-700 text-xs rounded whitespace-nowrap'>
          {error}
        </div>
      )}
    </div>
  );
}