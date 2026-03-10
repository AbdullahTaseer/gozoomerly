'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  LayoutGrid,
  Clock,
  Heart,
  Bookmark,
  Share2,
  HelpCircle,
  Settings,
  Play,
} from 'lucide-react';
import EditIcon from "@/assets/svgs/Pencil.svg";
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ProfilePictureUpload from './ProfilePictureUpload';
import ModalOrBottomSlider from '@/components/modals/ModalOrBottomSlider';
import EditProfileModal from '@/components/modals/EditProfileModal';
import FollowersModalContent from '@/components/modals/FollowersModalContent';
import FollowingModalContent from '@/components/modals/FollowingModalContent';
import { recalculateFollowingCount, recalculateFollowersCount } from '@/lib/supabase/followUtils';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import GlobalButton from '@/components/buttons/GlobalButton';
import BellIconIndicator from '@/components/cards/BellIconIndicator';

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
  yours_boards_count?: number;
}

const Profile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showFollowerModal, setIsShowFollowerModal] = useState(false);
  const [showFollowingModal, setIsShowFollowingModal] = useState(false);

  const featureCards = [
    { label: "Boards", icon: LayoutGrid, href: '/u/boards' },
    { label: "Memories", icon: Clock, href: '/u/memories' },
    { label: "Liked", icon: Heart, href: '/u/likes' },
    { label: "Saved", icon: Bookmark, href: '#' },
    { label: "Shared", icon: Share2, href: '/u/share' },
    { label: "Support", icon: HelpCircle, href: '/u/support' },
    { label: "Settings", icon: Settings, href: '/u/settings' },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getUser();

      if (!currentUser) {
        router.push('/signin');
        return;
      }

      setUser(currentUser);

      const supabase = createClient();
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        setError(`Failed to load profile data: ${profileError.message}`);
      } else if (profileData) {
        const [actualFollowingCount, actualFollowersCount] = await Promise.all([
          recalculateFollowingCount(currentUser.id),
          recalculateFollowersCount(currentUser.id)
        ]);

        const updatedProfile = {
          ...profileData,
          following_count: actualFollowingCount,
          followers_count: actualFollowersCount
        };
        setProfile(updatedProfile);
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
          setError(`Failed to create profile: ${insertError.message}`);
        } else {
          setProfile(insertedProfile);
        }
      }
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (profile) setShowEditProfileModal(true);
  };

  const getUsername = () => {
    const u = (profile as any)?.username;
    if (u) return `@${u.replace(/^@/, '')}`;
    const name = profile?.name || 'user';
    return `@${name.toLowerCase().replace(/\s+/g, '')}`;
  };

  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `Birthday on ${date.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className='pb-5'>
      <DashNavbar />
      <MobileHeader homeRight={true} titleColor='bg-clip-text text-transparent bg-linear-to-r from-[#E5408A] to-[#845CBA]' />
      <div className='px-[5%] max-[768px]:px-4'>
        {loading ? (
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Loading profile...</p>
            </div>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center min-h-[400px]'>
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
        ) : (
          <>

            <div className='flex justify-between items-center max-[769px]:hidden mt-6'>
              <p className='text-3xl font-bold text-black'>Profile</p>
              <BellIconIndicator />
            </div>

            <div className='max-w-[748px] mx-auto'>
              <div className='bg-gradient-to-r from-[#845CBA] to-[#F43C83] p-10 max-[500px]:p-4 mt-4 relative rounded-2xl overflow-hidden'>
                <Image src={Particles} alt="" className='absolute inset-0 object-cover' aria-hidden />
                <div className='relative z-10 flex max-[630px]:items-start items-center max-[630px]:flex-col justify-between gap-4'>
                  <div className='flex items-center gap-4 min-w-0'>
                    <ProfilePictureUpload
                      profile={profile}
                      onUpdate={(updatedProfile) => setProfile(updatedProfile)}
                      userId={user?.id || ''}
                    />
                    <div className='min-w-0'>
                      <p className='text-white text-xl font-bold truncate'>{profile?.name || 'User'}</p>
                      <p className='text-white/90 text-sm'>{formatBirthDate(profile?.birth_date) || 'Add your birthday'}</p>
                    </div>
                  </div>
                  <div className='flex items-center max-[630px]:justify-center max-[630px]:w-full gap-6 shrink-0'>
                    <button onClick={() => setIsShowFollowerModal(true)} className='text-center'>
                      <p className='text-white text-xl font-bold'>{(profile?.followers_count ?? 0) >= 1000 ? `${((profile?.followers_count ?? 0) / 1000).toFixed(1)}K` : (profile?.followers_count ?? 0)}</p>
                      <p className='text-white/90 text-sm'>Follower</p>
                    </button>
                    <button onClick={() => setIsShowFollowingModal(true)} className='text-center'>
                      <p className='text-white text-xl font-bold'>{profile?.following_count ?? 0}</p>
                      <p className='text-white/90 text-sm'>Following</p>
                    </button>
                  </div>
                  <button onClick={handleEdit} className='p-2 absolute -right-7 max-[500px]:right-0 -top-7 max-[500px]:-top-2 rounded-lg hover:bg-white/10 transition-colors'>
                    <Image src={EditIcon} alt='' />
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3 mt-6'>
                {featureCards.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (item.href && item.href !== '#') {
                          router.push(item.href);
                        }
                      }}
                      className="p-4 bg-white space-y-2 cursor-pointer border border-gray-200 rounded-xl text-left hover:bg-gray-50 transition-colors"
                    >
                      <IconComponent size={20} className='text-black' />
                      <span className='text-gray-800 font-medium'>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className='mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100'>
                <p className='text-xl lg:text-2xl font-medium text-black mb-2'>Want to become ambassadors earn passive income?</p>
                <p className='text-black lg:text-lg leading-relaxed mb-4'>
                  Zoiax is a modern messenger that helps people communicate, stay connected through real-life moments, and grow into something more at their own pace.
                </p>
                <div className='flex items-center gap-3'>
                  <GlobalButton
                    title="Learn more"
                    width="140px"
                    height="44px"
                    bgColor="white"
                    color="#000"
                    borderColor="#000"
                    borderWidth="1px"
                    hover={{ bgColor: '#f5f5f5' }}
                    className='flex-1'
                  />
                  <button className='w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors'>
                    <Play size={20} className='text-white' />
                  </button>
                </div>
              </div>
            </div>

            <EditProfileModal
              isOpen={showEditProfileModal}
              onClose={() => setShowEditProfileModal(false)}
              profile={profile}
              onSuccess={async (updatedProfile) => {
                if (updatedProfile) setProfile(updatedProfile);
                await fetchUserData();
              }}
            />

            <ModalOrBottomSlider
              title='Followers'
              isOpen={showFollowerModal}
              onClose={async () => {
                setIsShowFollowerModal(false);
                if (user?.id) {
                  const [actualFollowingCount, actualFollowersCount] = await Promise.all([
                    recalculateFollowingCount(user.id),
                    recalculateFollowersCount(user.id)
                  ]);
                  setProfile(prev => prev ? {
                    ...prev,
                    following_count: actualFollowingCount,
                    followers_count: actualFollowersCount
                  } : null);
                }
              }}
              contentClassName='pb-0'
            >
              <FollowersModalContent userId={user?.id} />
            </ModalOrBottomSlider>

            <ModalOrBottomSlider
              title='Following'
              isOpen={showFollowingModal}
              onClose={async () => {
                setIsShowFollowingModal(false);

                if (user?.id) {
                  const [actualFollowingCount, actualFollowersCount] = await Promise.all([
                    recalculateFollowingCount(user.id),
                    recalculateFollowersCount(user.id)
                  ]);
                  setProfile(prev => prev ? {
                    ...prev,
                    following_count: actualFollowingCount,
                    followers_count: actualFollowersCount
                  } : null);
                }
              }}
              contentClassName='pb-0'
            >
              <FollowingModalContent userId={user?.id} />
            </ModalOrBottomSlider>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;