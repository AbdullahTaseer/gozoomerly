'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TitleCard from '@/components/cards/TitleCard';
import CircleCard from '@/components/cards/CircleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/supabase/auth';
import GlobalModal from '@/components/modals/GlobalModal';
import FloatingInput from '@/components/inputs/FloatingInput';
import AddCircleModal from '@/components/modals/AddCircleModal';

interface Circle {
  id: string;
  name: string;
  slug: string;
  circle_type?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_default?: boolean;
  is_system_generated?: boolean;
  display_order?: number;
  member_count: number;
  owner_user_id: string;
  created_at: string;
  updated_at: string;
  avatars: string[];
  memberCount: number;
}

const Circles = () => {
  const router = useRouter();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createCircleModalOpen, setIsCreateCircleModalOpen] = useState(false);

  useEffect(() => {
    fetchUserCircles();
  }, []);

  const fetchUserCircles = async () => {
    try {
      const supabase = createClient();
      const user = await authService.getUser();

      if (!user) {
        router.push('/signin');
        return;
      }

      // Fetch circles where the user is a member
      const { data: circleData, error: circleError } = await supabase
        .from('circles')
        .select(`
          *,
          circle_members!inner(member_user_id),
          member_count
        `)
        .eq('circle_members.member_user_id', user.id)
        .order('created_at', { ascending: false });

      if (circleError) {
        console.error('Error fetching circles:', circleError);
        setError('Failed to load circles');
        return;
      }

      // For each circle, fetch member avatars
      const circlesWithAvatars = await Promise.all(
        (circleData || []).map(async (circle) => {
          // Get first 3 members for avatar display
          const { data: members } = await supabase
            .from('circle_members')
            .select(`
              profiles:member_user_id (
                id,
                profile_pic_url
              )
            `)
            .eq('circle_id', circle.id)
            .limit(3);

          return {
            ...circle,
            avatars: members?.map((m: any) => m.profiles?.profile_pic_url).filter(Boolean) || [],
            memberCount: circle.member_count || 0
          };
        })
      );

      setCircles(circlesWithAvatars);
    } catch (err) {
      console.error('Error in fetchUserCircles:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-[7%] max-[769px]:px-4 py-4'>

      <div className='flex justify-between max-[1200px]:flex-col gap-6'>
        <TitleCard title='Personal Boards' className='text-left' />
        <div className='flex gap-4 max-[580px]:gap-2 max-[350px]:gap-1 items-center max-[1200px]:mx-auto'>
          <div className='relative w-[300px] max-[580px]:w-[170px]'>
            <Search size={18} className='absolute top-3 left-3' />
            <GlobalInput placeholder='Search...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
          </div>
          <Image src={FilterSliderIcon} alt='' height={45} width={45} />
          <GlobalButton onClick={() => setIsCreateCircleModalOpen(true)} title='Create Circle' height='42px' className='w-[164px] max-[580px]:w-[120px]' />
        </div>
      </div>

      <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {loading ? (
          <div className='col-span-2 text-center py-8'>Loading circles...</div>
        ) : error ? (
          <div className='col-span-2 text-center py-8 text-red-500'>{error}</div>
        ) : circles.length === 0 ? (
          <div className='col-span-2 text-center py-8'>
            <p className='text-gray-500 mb-4'>You haven't joined any circles yet</p>
            <GlobalButton title='Create Your First Circle' onClick={() => console.log('Create circle')} />
          </div>
        ) : (
          circles.map((circle) => (
            <CircleCard
              key={circle.id}
              title={circle.name}
              backgroundImage={circle.color || '/default-circle-bg.jpg'}
              avatars={circle.avatars}
              memberCount={circle.memberCount}
              onClick={() => router.push(`/dashboard/circles/${circle.id}`)}
            />
          ))
        )}
      </div>

      <GlobalModal
        title='Create Circles'
        isOpen={createCircleModalOpen}
        onClose={() => setIsCreateCircleModalOpen(false)}
        className="w-[500px] max-[550px]:w-[95vw]"
      >
        <AddCircleModal />
      </GlobalModal>
    </div>
  );
};

export default Circles;