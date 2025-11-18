'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Bio from "@/assets/svgs/bio.svg";
import Friends from "@/assets/svgs/friends.svg";
import {
  Bell,
  ChevronRight,
  LockKeyhole,
  Mail,
  Trash2,
  UserLock,
  Smartphone,
  Edit2,
} from 'lucide-react';
import Activity from "@/assets/svgs/activity.svg";
import TitleCard from '@/components/cards/TitleCard';
import Follow from "@/assets/svgs/following.svg";
import BoardsIcon from "@/assets/svgs/board-icon.svg";
import MyContributors from "@/assets/svgs/coins 1.svg";
import MyMemories from "@/assets/svgs/memory-icon.svg";
import MastercardImg from "@/assets/svgs/Mastercard.svg";
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg"
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import PaymentMethodCard from '@/components/cards/PaymentMethodCard';
import * as Switch from '@radix-ui/react-switch';
import BellIconIndicator from '@/components/cards/BellIconIndicator';
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ProfilePictureUpload from './ProfilePictureUpload';
import GlobalModal from '@/components/modals/GlobalModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import EmailChangeForm from '@/components/modals/EmailChangeModal';
import PasswordChangeForm from '@/components/modals/PasswordChangeModal';
import FollowersModalContent from '@/components/modals/FollowersModalContent';
import FollowingModalContent from '@/components/modals/FollowingModalContent';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  birth_date?: string;
  country?: string;
  state?: string;
  city?: string;
  bio?: string;
  work?: string;
  languages?: string[];
  lives_in?: string;
  profile_pic_url?: string;
  followers_count?: number;
  following_count?: number;
  boards_created_count?: number;
}

const Profile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showFollowerModal, setIsShowFollowerModal] = useState(false);
  const [showFollowingModal, setIsShowFollowingModal] = useState(false);

  const menuItems = [
    { label: "Memories", icon: MyMemories, href: '/dashboard/memories' },
    { label: "Boards", icon: BoardsIcon, href: '/dashboard/boards' },
    { label: "My Contributions", icon: MyContributors, href: '/dashboard/myContributions' },
    { label: "Share with friends", icon: Friends, href: '/dashboard/friends' },
    { label: "Bio", icon: Bio, href: '/dashboard/bio' },
    { label: "Activity", icon: Activity, href: '/dashboard/activity' },
    { label: "Followers", icon: Follow, onClick: () => setIsShowFollowerModal(true) },
    { label: "Following", icon: Follow, onClick: () => setIsShowFollowingModal(true) },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getUser();

      if (!currentUser) {
        console.error('No authenticated user found');
        router.push('/signin');
        return;
      }

      console.log('Current user:', currentUser);
      setUser(currentUser);

      // Fetch profile data from the profiles table
      const supabase = createClient();
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
        setError(`Failed to load profile data: ${profileError.message}`);
      } else if (profileData) {
        setProfile(profileData);
      } else {
        const newProfile: any = {
          id: currentUser.id,
          name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
          email: currentUser.email || '',
          phone_number: currentUser.user_metadata?.phone || currentUser.phone || null,
          birth_date: currentUser.user_metadata?.birth_date || null,
          country: currentUser.user_metadata?.country || null,
          state: currentUser.user_metadata?.state || null,
          city: currentUser.user_metadata?.city || null,
          bio: currentUser.user_metadata?.bio || null,
          work: currentUser.user_metadata?.work || null,
          languages: currentUser.user_metadata?.languages || [],
          lives_in: currentUser.user_metadata?.lives_in || null,
          profile_pic_url: currentUser.user_metadata?.avatar_url || null,
          followers_count: 0,
          following_count: 0,
          boards_created_count: 0,
        };

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (insertError) {
          console.error('Profile insert error:', insertError);
          setError(`Failed to create profile: ${insertError.message}`);

          console.error('Insert error details:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            profile: newProfile
          });
        } else {
          setProfile(insertedProfile);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (profile) setShowEditProfileModal(true);
  };

  const handleLogout = async () => {
    await authService.signOut();
    router.push('/signin');
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

  if (loading) {
    return (
      <div className='px-[7%] max-[768px]:px-6 flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='px-[7%] max-[768px]:px-6 flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button
            onClick={fetchUserData}
            className='px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='px-[7%] max-[768px]:px-6'>

      <div className='flex items-center justify-between gap-3'>
        <TitleCard title='Profile' className='text-left' />
        <BellIconIndicator />
      </div>

      <div className='bg-[#1B1D26] p-16 max-[1100px]:p-10 mt-4 relative rounded-[24px] overflow-hidden'>
        <Image src={Particles} alt="" className='absolute object-cover' />

        <div className='relative z-10'>
          <button
            onClick={handleEdit}
            className='absolute -top-10 max-[1100px]:-top-4 -right-10 max-[1100px]:-right-4 cursor-pointer p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors'
          >
            <Edit2 size={20} className='text-white' />
          </button>

          <div className='grid grid-cols-5 max-[900px]:grid-cols-3 gap-4'>
            <div className='flex items-center max-[500px]:flex-col gap-3 col-span-2 max-[900px]:col-span-3'>
              <ProfilePictureUpload
                profile={profile}
                onUpdate={(updatedProfile) => setProfile(updatedProfile)}
                userId={user?.id || ''}
              />
              <span>
                <p className='text-white text-[24px] font-bold'>{profile?.name || 'User'}</p>
                <p className='text-[#F0F0F0] text-sm'>{formatBirthDate(profile?.birth_date)}</p>
                <p className='text-[#F0F0F0] text-sm'>{formatLocation(profile?.country, profile?.state, profile?.city)}</p>
              </span>
            </div>
            <span className='my-auto'>
              <p className='text-white text-[24px] font-bold'>{profile?.boards_created_count || 0}</p>
              <p className='text-[#F0F0F0] text-sm'>Campaigns</p>
            </span>
            <span className='my-auto'>
              <p className='text-white text-[24px] font-bold'>{profile?.followers_count || 0}</p>
              <p className='text-[#F0F0F0] text-sm'>Followers</p>
            </span>
            <span className='my-auto'>
              <p className='text-white text-[24px] font-bold'>{profile?.following_count || 0}</p>
              <p className='text-[#F0F0F0] text-sm'>Following</p>
            </span>
          </div>

          <div className='mt-6'>
            <p className='text-white font-semibold mb-2'>Bio</p>
            <p className='text-[#F0F0F0] text-sm'>{profile?.bio || 'No bio added yet'}</p>
          </div>

          {profile?.work && (
            <div className='mt-4'>
              <p className='text-white font-semibold mb-2'>Work</p>
              <p className='text-[#F0F0F0] text-sm'>{profile?.work}</p>
            </div>
          )}

        </div>
      </div>

      <div className='mt-4 bg-white border-b pb-4'>
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (item.href) {
                router.push(item.href);
              } else if (item.onClick) {
                item.onClick();
              }
            }}
            className="w-full text-left flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Image src={item.icon} alt="" width={20} height={20} />
              <span className="text-gray-800 font-medium">{item.label}</span>
            </div>
            <ChevronRight className="text-[#8A8A8A]" size={22} />
          </button>
        ))}
      </div>

      <div className='py-4 border-b'>
        <div className='flex justify-between gap-3 items-center mb-2'>
          <p className='text-[20px] font-semibold'>Payment Method</p>
          <Link href='/dashboard/paymentMethod' className='cursor-pointer hover:text-pink-500'>Change</Link>
        </div>
        <PaymentMethodCard
          showRadio={false}
          cardImg={MastercardImg}
          cardName='Mastercard'
          cardNumber='**** 5930'
        />
      </div>

      <div className='py-4 border-b'>
        <p className='text-[20px] font-semibold mb-3'>Notification Settings</p>
        <div className='flex items-center justify-between px-1 py-2'>
          <div className='flex items-center gap-3'>
            <Bell size={20} />
            <span className='text-gray-800'>In-app Notifications</span>
          </div>
          <Switch.Root defaultChecked className="w-11 h-6 bg-[#0D0C10] rounded-full relative data-[state=checked]:bg-pink-500">
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5.5" />
          </Switch.Root>
        </div>
        <div className='flex items-center justify-between px-1 py-2'>
          <div className='flex items-center gap-3'>
            <Smartphone size={20} />
            <span className='text-gray-800'>SMS Notifications</span>
          </div>
          <Switch.Root className="w-11 h-6 rounded-full bg-[#0D0C10] relative data-[state=checked]:bg-pink-500">
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5.5" />
          </Switch.Root>
        </div>
      </div>

      <div className='py-4 border-b'>
        <p className='text-[20px] font-semibold mb-3'>Account Settings</p>
        <div
          className='flex items-center justify-between px-1 py-2 cursor-pointer hover:bg-gray-100'
          onClick={() => setShowEmailModal(true)}
        >
          <div className='flex items-center gap-3'>
            <Mail size={20} />
            <span className='text-gray-800'>Email: {user?.email || 'Not set'}</span>
          </div>
          <ChevronRight className='text-[#8A8A8A]' size={22} />
        </div>
        <div
          className='flex items-center justify-between px-1 py-2 cursor-pointer hover:bg-gray-100'
          onClick={() => setShowPasswordModal(true)}
        >
          <div className='flex items-center gap-3'>
            <LockKeyhole size={20} />
            <span className='text-gray-800'>Change password</span>
          </div>
          <ChevronRight className='text-[#8A8A8A]' size={22} />
        </div>
      </div>

      <div className='py-4'>
        <div className='flex items-center gap-3 px-1 py-2 cursor-pointer hover:bg-gray-100'>
          <Trash2 size={20} className='text-red-500' />
          <span className='text-red-500'>Delete Account</span>
        </div>
        <div
          onClick={handleLogout}
          className='flex items-center gap-3 px-1 py-2 cursor-pointer hover:bg-gray-100'
        >
          <UserLock size={20} />
          <span className='text-gray-800'>Log out</span>
        </div>
      </div>

      <GlobalModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Change Email"
        className='w-[400px] max-[420px]:w-[95vw]'
      >
        <EmailChangeForm
          currentEmail={user?.email || ''}
          onClose={() => setShowEmailModal(false)}
          onSuccess={async () => {
            // Refresh user data
            await fetchUserData();
          }}
        />
      </GlobalModal>

      <GlobalModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        className='w-[400px] max-[420px]:w-[95vw]'
      >
        <PasswordChangeForm
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            // Optional: Show success message
          }}
        />
      </GlobalModal>

      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        profile={profile}
        onSuccess={async (updatedProfile) => {
          if (updatedProfile) setProfile(updatedProfile);
          await fetchUserData();
        }}
      />

      <GlobalModal
        title='Followers'
        isOpen={showFollowerModal}
        onClose={() => setIsShowFollowerModal(false)}
        className='w-[550px] pb-0 max-[600px]:w-[90vw]'
      >
        <FollowersModalContent />
      </GlobalModal>

      <GlobalModal
        title='Following'
        isOpen={showFollowingModal}
        onClose={() => setIsShowFollowingModal(false)}
        className='w-[550px] pb-0 max-[600px]:w-[90vw]'
      >
        <FollowingModalContent />
      </GlobalModal>

    </div>
  );
};

export default Profile;