import React from 'react'
import Image from 'next/image';
import { Search } from 'lucide-react';
import FlowerImg from "@/assets/pngs/flowers.png";
import VideoThumbnail from "@/assets/pngs/thumbnail.png";
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import ContributionCard from '@/components/cards/ContributionCard';

const data = [
  {
    number: '15',
    title: 'Total Contributions'
  },
  {
    number: '15',
    title: 'Gifts Sent'
  },
  {
    number: '$500',
    title: 'Total Gifts value'
  },
  {
    number: '15',
    title: 'Videos Sent'
  },
  {
    number: '15',
    title: 'Longest Streak (Months)'
  },
]

const MyContributions = () => {
  return (
    <div className='px-[7%] max-[769px]:px-6 pb-4'>
      <div className='flex justify-between max-[870px]:flex-col gap-6'>
        <TitleCard title='My Contributions' className='text-left' />
        <div className='flex gap-4 items-center max-[870px]:mx-auto'>
          <div className='relative w-[260px]'>
            <Search size={18} className='absolute top-3 left-3' />
            <GlobalInput placeholder='Search friends & family...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
          </div>
          <Image src={FilterSliderIcon} alt='icon' height={45} width={45} />
        </div>
      </div>

      <div className='flex overflow-x-auto scrollbar-hide mt-5 gap-4'>
        {data.map((item, i) => (
          <div key={i} className='bg-[#1B1D26] min-w-[220px] w-full text-center py-10 px-5 border border-[#2E2C39] rounded-3xl'>
            <p className='font-bold text-white text-2xl'>{item.number}</p>
            <p className='text-[#F0F0F0]'>{item.title}</p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
        <ContributionCard
          birthdayNumber={'Sarah 30th Birthday'}
          birthdayTo={'To: Sarah Mitchell - Apr 28, 2025'}
          desc={'"Cheers to a fantastic year ahead…"'}
          gift={' $40 via Stripe'}
          thumbnail={VideoThumbnail}
          iframeSrc='https://www.youtube.com/embed/n6M8ELkdPOM?si=k8MxYbUPstr2O4ud'
        />
        <ContributionCard
          birthdayNumber={'Linda 30th Birthday'}
          birthdayTo={'To: Linda Thompson - Feb 10, 2025'}
          desc={'"Cheers to a fantastic year ahead…"'}
          gift={' $200 via Stripe'}
          imgSrc={FlowerImg}
        />
      </div>

    </div>
  );
};

export default MyContributions;