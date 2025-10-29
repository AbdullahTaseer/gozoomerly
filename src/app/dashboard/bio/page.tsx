'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Edit2 } from 'lucide-react';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg"
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import TitleCard from '@/components/cards/TitleCard';
import MyWorkIcon from "@/assets/svgs/my-work.svg";
import LanguageSpeaksIcon from "@/assets/svgs/language.svg";
import LivesInIcon from "@/assets/svgs/lives-in.svg";
import BellIconIndicator from '@/components/cards/BellIconIndicator';
import GlobalButton from '@/components/buttons/GlobalButton';
import { authService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';

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
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [work, setWork] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [livesIn, setLivesIn] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [saving, setSaving] = useState(false);
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
        console.error('Profile fetch error:', profileError);
        setError('Failed to load profile data');
      } else if (profileData) {
        setProfile(profileData);
        setBio(profileData.bio || '');
        setWork(profileData.work || '');
        setLivesIn(profileData.lives_in || '');
        setLanguages(profileData.languages || []);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
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

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const supabase = createClient();
      
      const updateData = {
        bio,
        work,
        lives_in: livesIn,
        languages
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile?.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        setError('Failed to update profile');
        return;
      }

      await authService.updateUserProfile(updateData);

      // Refresh profile data
      await fetchUserProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='px-[7%] max-[768px]:px-6 flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-[7%] max-[768px]:px-6'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => router.push('/dashboard/profile')}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <ArrowLeft size={24} />
          </button>
          <TitleCard title='Bio' className='text-left' />
        </div>
        <BellIconIndicator/>
      </div>

      <div className='bg-[#1B1D26] px-6 py-16 max-[1100px]:py-10 mt-4 relative rounded-[24px] overflow-hidden'>
        <Image src={Particles} alt="" className='absolute object-cover' />
        
        <div className='relative z-10'>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className='absolute right-0 -top-10 max-[1100px]:-top-4 cursor-pointer p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors'
            >
              <Edit2 size={20} className='text-white' />
            </button>
          )}

          <div className='grid grid-cols-4 max-[1300px]:grid-cols-2 max-[900px]:grid-cols-1 gap-4'>
            <div className='flex items-center max-[900px]:flex-col gap-3'>
              {profile?.profile_pic_url ? (
                <img 
                  src={profile.profile_pic_url} 
                  alt='Profile' 
                  className='rounded-full object-cover h-[90px] w-[90px]' 
                />
              ) : (
                <Image src={ProfileAvatar} alt='' height={90} width={90} className='rounded-full' />
              )}
              <span>
                <p className='text-white text-[24px] font-bold'>{profile?.name || 'User'}</p>
                <p className='text-[#F0F0F0] text-sm'>{formatBirthDate(profile?.birth_date)}</p>
                <p className='text-[#F0F0F0] text-sm'>{formatLocation(profile?.country, profile?.state, profile?.city)}</p>
              </span>
            </div>
            
            <span className='my-auto flex items-center gap-2'>
              <Image src={MyWorkIcon} alt='' />
              {isEditing ? (
                <input
                  type='text'
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  placeholder='Your profession'
                  className='bg-white/10 text-[#F0F0F0] px-2 py-1 rounded border border-white/20 flex-1'
                />
              ) : (
                <p className='text-[#F0F0F0] font-medium'>My Work: {profile?.work || 'Not specified'}</p>
              )}
            </span>
            
            <span className='my-auto flex items-start gap-2'>
              <Image src={LanguageSpeaksIcon} alt='' className='mt-1' />
              {isEditing ? (
                <div className='flex-1'>
                  <div className='flex gap-1 mb-1'>
                    <input
                      type='text'
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                      placeholder='Add language'
                      className='bg-white/10 text-[#F0F0F0] px-2 py-1 rounded border border-white/20 flex-1 text-sm'
                    />
                    <button
                      onClick={handleAddLanguage}
                      className='px-2 py-1 bg-white/20 rounded text-white text-sm'
                    >
                      +
                    </button>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {languages.map((lang, idx) => (
                      <span key={idx} className='text-[#F0F0F0] text-sm bg-white/10 px-2 py-0.5 rounded flex items-center gap-1'>
                        {lang}
                        <button onClick={() => handleRemoveLanguage(lang)} className='text-red-400'>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className='text-[#F0F0F0] font-medium'>Speaks: {languages.join(', ') || 'Not specified'}</p>
              )}
            </span>
            
            <span className='my-auto flex items-center gap-2'>
              <Image src={LivesInIcon} alt='' />
              {isEditing ? (
                <input
                  type='text'
                  value={livesIn}
                  onChange={(e) => setLivesIn(e.target.value)}
                  placeholder='City, Country'
                  className='bg-white/10 text-[#F0F0F0] px-2 py-1 rounded border border-white/20 flex-1'
                />
              ) : (
                <p className='text-[#F0F0F0] font-medium'>Lives in: {profile?.lives_in || formatLocation(profile?.country, profile?.state, profile?.city)}</p>
              )}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      <div className='py-5'>
        <div className='flex items-center gap-2 mb-3'>
          <User />
          <p className='font-medium text-[18px]'>About:</p>
        </div>
        {isEditing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Tell others about yourself...'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[150px] resize-none'
            maxLength={500}
          />
        ) : (
          <p className='mt-2 font-medium text-[18px]'>{profile?.bio || 'No bio added yet. Click edit to add one!'}</p>
        )}
      </div>

      {isEditing && (
        <div className='flex gap-3 justify-end pb-5'>
          <button
            onClick={() => {
              setIsEditing(false);
              setBio(profile?.bio || '');
              setWork(profile?.work || '');
              setLivesIn(profile?.lives_in || '');
              setLanguages(profile?.languages || []);
            }}
            className='px-6 py-2 border border-gray-300 text-gray-700 rounded-full cursor-pointer hover:bg-gray-50'
            disabled={saving}
          >
            Cancel
          </button>
          <GlobalButton
            title={saving ? 'Saving...' : 'Save Changes'}
            onClick={handleSave}
            disabled={saving}
            width='150px'
            height='46px'
          />
        </div>
      )}
    </div>
  );
};

export default BioPage;