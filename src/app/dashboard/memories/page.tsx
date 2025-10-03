import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { homeBoardsSwiper } from '@/lib/MockData';
import BoardCard from '@/components/cards/BoardCard';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";


const Memories = () => {
  return (
    <div className='px-[7%] max-[769px]:px-6 pb-4'>
      <div className='flex justify-between max-[870px]:flex-col gap-6'>
        <TitleCard title='Memories' className='text-left' />
        <div className='flex gap-4 items-center max-[870px]:mx-auto'>
          <div className='relative w-[260px]'>
            <Search size={18} className='absolute top-3 left-3' />
            <GlobalInput placeholder='Search friends & family...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
          </div>
          <Image src={FilterSliderIcon} alt='icon' height={45} width={45} />
        </div>
      </div>
      <div className='grid grid-cols-3 max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1 mt-6 gap-6 h-full'>
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
          />
        ))}
      </div>
    </div>
  );
};

export default Memories;
