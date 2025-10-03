'use client';

import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { personalCircles } from '@/lib/MockData';
import TitleCard from '@/components/cards/TitleCard';
import CircleCard from '@/components/cards/CircleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";

const Circles = () => {

  const router = useRouter();

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
          <GlobalButton title='Create Circle' height='42px' className='w-[164px] max-[580px]:w-[120px]' />
        </div>
      </div>

      <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {personalCircles.map((circle) => (
          <CircleCard
            key={circle.id}
            title={circle.title}
            backgroundImage={circle.backgroundImage}
            avatars={circle.avatars}
            memberCount={circle.memberCount}
            onClick={() => router.push('/dashboard/profile')}
          />
        ))}
      </div>
    </div>
  );
};

export default Circles;