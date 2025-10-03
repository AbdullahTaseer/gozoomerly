'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TitleCard from '@/components/cards/TitleCard';
import BoardCard from '@/components/cards/BoardCard';
import SpotLightCard from '@/components/cards/SpotLightCard';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import AvatarList from '@/components/cards/AvatarList';
import { homeBoardsSwiper, spotlightCampaigns } from '@/lib/MockData';
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';

const Home = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleAllBoards = () => {
    router.push('/dashboard/allBoards');
  };

  const feedFilters = ['All', 'Friends', 'Family', 'Public', 'Private'];

  return (
    <div className='px-[7%] max-[769px]:px-6'>
      <AvatarList />

      <div className='py-8'>
        <TitleCard title='Active Boards' className='text-left' />
        <div className='flex mt-4 gap-6 overflow-x-auto scrollbar-hide h-full'>
          {homeBoardsSwiper.slice(0, 3).map((board) => (
            <BoardCard
              key={board.id}
              title={board.title}
              avatar={board.avatar}
              name={board.name}
              location={board.location}
              date={board.date}
              description={board.description}
              fundTitle={board.fundTitle}
              raised={board.raised}
              target={board.target}
              invited={board.invited}
              participants={board.participants}
              wishes={board.wishes}
              gifters={board.gifters}
              media={board.media}
              topContributors={board.topContributors}
              buttonText="View Full Board"
              onButtonClick={handleAllBoards}
              className='min-w-[340px] h-full'
            />
          ))}
        </div>
      </div>

      <div className='py-8'>
        <TitleCard title='Spotlight Campaigns' className='text-left' />
        <div className='flex mt-4 gap-6 overflow-x-auto scrollbar-hide h-full'>
          {spotlightCampaigns.map((campaign) => (
            <SpotLightCard
              key={campaign.id}
              name={campaign.name}
              description={campaign.description}
              spotLightImg={campaign.spotLightImg}
              participants={campaign.participants}
              gifted={campaign.gifted}
              wished={campaign.wished}
            />
          ))}
        </div>
      </div>

      <div>
        <div className='flex max-[550px]:flex-col justify-between gap-4'>
          <TitleCard title='Feed' className='text-left' />
          <div className='flex items-center gap-6 max-[500px]:gap-3 justify-center'>
            {feedFilters.map((item) => (
              <p
                key={item}
                onClick={() => setSelectedFilter(item)}
                className={`text-[20px] max-[768px]:text-[16px] cursor-pointer font-bold transition-colors
                  ${selectedFilter === item ? 'text-pink-500' : 'text-gray-700 hover:text-pink-400'}`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className='max-w-[745px] mx-auto py-6 space-y-6'>
          <PostsImagesCarouselCard />
          <PostsVideoCard />
          <PostsImagesCarouselCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
