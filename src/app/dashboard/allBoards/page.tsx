import React from 'react'
import Image from 'next/image';
import { Search } from 'lucide-react';
import { homeBoardsSwiper } from '@/lib/MockData';
import BoardCard from '@/components/cards/BoardCard';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";

const AllBoards = () => {
  return (
    <div className='px-[7%] max-[769px]:px-3'>
      <div className='py-4'>
        <div className='flex justify-between max-[870px]:flex-col gap-6'>
          <TitleCard title='Personal Boards' className='text-left' />
          <div className='flex gap-4 items-center max-[870px]:mx-auto'>
            <div className='relative w-[260px]'>
              <Search size={18} className='absolute top-3 left-3' />
              <GlobalInput placeholder='Search...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
            </div>
            <Image src={FilterSliderIcon} alt='' height={45} width={45} />
          </div>
        </div>
        <div className='flex mt-6 gap-6 overflow-x-auto scrollbar-hide h-full'>
          {homeBoardsSwiper.map((board) => (
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
              className='min-w-[340px] h-full'
            />
          ))}
        </div>
      </div>
      <div className='py-4'>
        <TitleCard title='Circle Boards' className='text-left' />
        <div className='flex mt-4 gap-6 overflow-x-auto scrollbar-hide h-full'>
          {homeBoardsSwiper.map((board) => (
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
              className='min-w-[340px] h-full'
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllBoards;