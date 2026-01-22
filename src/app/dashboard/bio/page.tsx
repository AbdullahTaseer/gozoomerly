'use client';

import {  useState, useEffect  } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import TitleCard from '@/components/cards/TitleCard';
import MyWorkIcon from "@/assets/svgs/my-work.svg";
import LanguageSpeaksIcon from "@/assets/svgs/language.svg";
import LivesInIcon from "@/assets/svgs/lives-in.svg";
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import DashNavbar from '@/components/navbar/DashNavbar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  birth_date?: string;
  country?: string;
  state?: string;
  city?: string;
  bio?: string;
  work?: string;
  languages?: string[];
  lives_in?: string;
  profile_pic_url?: string;
}

const BioPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getUser();

      if (!currentUser) {
        router.push('/signin');
        return;
      }

      const supabase = createClient();
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        setError('Failed to load profile data');
      } else {
        setProfile(profileData);
      }
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `Birthday on ${date.toLocaleDateString('en-US', options)}`;
  };

  const formatLocation = (country?: string, state?: string, city?: string) => {
    const parts = [city, state, country].filter(Boolean);
    return parts.join(', ') || 'Location not set';
  };

  return (
    <div>
      <DashNavbar hide={false} />
      <div className="px-[7%] max-[768px]:px-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <TitleCard title="Bio" className="text-left" />
        </div>
      </div>

      <div className="bg-[#1B1D26] px-6 py-16 max-[1100px]:py-10 mt-4 relative rounded-[24px] overflow-hidden">
        <Image src={Particles} alt="" className="absolute object-cover" />
        <div className="relative z-10">
          <div className="grid grid-cols-4 max-[1300px]:grid-cols-2 max-[900px]:grid-cols-1 gap-4">
            <div className="flex items-center max-[900px]:flex-col gap-3">
              {profile?.profile_pic_url ? (
                <img
                  src={profile.profile_pic_url}
                  alt="Profile"
                  className="rounded-full object-cover h-[90px] w-[90px]"
                />
              ) : (
                <Image src={ProfileAvatar} alt="Avatar" height={90} width={90} className="rounded-full" />
              )}
              <span>
                <p className="text-white text-[24px] font-bold">{profile?.name || 'User'}</p>
                <p className="text-[#F0F0F0] text-sm">{formatBirthDate(profile?.birth_date)}</p>
                <p className="text-[#F0F0F0] text-sm">
                  {formatLocation(profile?.country, profile?.state, profile?.city)}
                </p>
              </span>
            </div>

            <span className="my-auto flex items-center gap-2">
              <Image src={MyWorkIcon} alt="Work" />
              <p className="text-[#F0F0F0] font-medium">
                My Work: {profile?.work || 'Not specified'}
              </p>
            </span>

            <span className="my-auto flex items-start gap-2">
              <Image src={LanguageSpeaksIcon} alt="Languages" />
              <p className="text-[#F0F0F0] font-medium">
                Speaks: {profile?.languages?.join(', ') || 'Not specified'}
              </p>
            </span>

            <span className="my-auto flex items-center gap-2">
              <Image src={LivesInIcon} alt="Lives in" />
              <p className="text-[#F0F0F0] font-medium">
                Lives in: {profile?.lives_in || formatLocation(profile?.country, profile?.state, profile?.city)}
              </p>
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="py-5">
        <div className="flex items-center gap-2 mb-3">
          <User />
          <p className="font-medium text-[18px]">About:</p>
        </div>
            <p className="mt-2 font-medium text-[18px]">{profile?.bio || 'No bio added yet.'}</p>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BioPage;