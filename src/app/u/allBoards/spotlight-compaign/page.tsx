'use client';

import { useEffect } from 'react';
import SpotLightCard from '@/components/cards/SpotLightCard';
import TitleCard from '@/components/cards/TitleCard';
import MobileHeader from '@/components/navbar/MobileHeader';
import { useGetSpotlightBoards } from '@/hooks/useGetSpotlightBoards';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { SkeletonSpotlightCard } from '@/components/skeletons';

const SpotlightCampaigns = () => {
  const {
    spotlightBoards,
    isLoading: spotlightLoading,
    fetchSpotlightBoards
  } = useGetSpotlightBoards();

  useEffect(() => {
    loadSpotlightBoards();
  }, []);

  const loadSpotlightBoards = async () => {
    try {
      await fetchSpotlightBoards({
        p_limit: 1000,
        p_offset: 0
      });
    } catch (err) {
      console.error('Failed to load spotlight boards:', err);
    }
  };

  return (
    <>
      <MobileHeader title='Spotlight Campaigns' />
      <div className='py-8 px-[7%] max-[769px]:px-3'>
        <TitleCard title='Spotlight Campaigns' className='text-left' />
        <div className='flex mt-4 gap-6 max-[500px]:gap-4 overflow-x-auto scrollbar-hide h-full flex-wrap max-[769px]:flex-col'>
          {spotlightLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonSpotlightCard key={i} className='min-w-[370px] h-[350px]' />
            ))
          ) : spotlightBoards.length > 0 ? (
            spotlightBoards.map((board) => (
              <SpotLightCard
                key={board.id}
                name={board.name}
                description={board.description}
                spotLightImg={board.spotlight_img || ProfileAvatar}
                participants={board.participants}
                organizerName={board.organizer_name}
                organizerAvatar={board.organizer_avatar || ProfileAvatar}
                topContributors={board.top_contributors.length > 0 ? board.top_contributors : []}
              />
            ))
          ) : (
            <div className='text-center py-12 w-full'>
              <p className='text-gray-500'>No spotlight boards found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SpotlightCampaigns;

