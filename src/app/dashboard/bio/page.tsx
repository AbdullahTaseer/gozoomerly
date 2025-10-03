import React from 'react';
import Image from 'next/image';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg"
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import TitleCard from '@/components/cards/TitleCard';
import { User } from 'lucide-react';
import MyWorkIcon from "@/assets/svgs/my-work.svg";
import LanguageSpeaksIcon from "@/assets/svgs/language.svg";
import LivesInIcon from "@/assets/svgs/lives-in.svg";
import BellIconIndicator from '@/components/cards/BellIconIndicator';

const BioPage = () => {
  return (
    <div className='px-[7%] max-[768px]:px-6'>

      <div className='flex items-center justify-between gap-3'>
        <TitleCard title='Bio' className='text-left' />
        <BellIconIndicator/>
      </div>

      <div className='bg-[#1B1D26] px-6 py-16 max-[1100px]:py-10 mt-4 relative rounded-[24px] overflow-hidden grid grid-cols-4 max-[1100px]:grid-cols-1 gap-4'>
        <Image src={Particles} alt="" className='absolute object-cover' />
        <div className='flex items-center max-[1100px]:flex-col gap-3'>
          <Image src={ProfileAvatar} alt='' height={90} width={90} className='rounded-full' />
          <span>
            <p className='text-white text-[24px] font-bold'>Alex Johnson</p>
            <p className='text-[#F0F0F0] text-sm'>Birthday on 12jun</p>
            <p className='text-[#F0F0F0] text-sm'>Austin,Texas,United States</p>
          </span>
        </div>
        <span className='my-auto flex items-center gap-2'>
          <Image src={MyWorkIcon} alt='' />
          <p className='text-[#F0F0F0] font-medium'>My Work : Product Designer</p>
        </span>
        <span className='my-auto flex items-center gap-2'>
          <Image src={LanguageSpeaksIcon} alt='' />
          <p className='text-[#F0F0F0] font-medium'>Speaks: English</p>
        </span>
        <span className='my-auto flex items-center gap-2'>
          <Image src={LivesInIcon} alt='' />
          <p className='text-[#F0F0F0] font-medium'>Lives in: Austin,Texas,United States</p>
        </span>
      </div>

      <div className='py-5'>
        <div className='flex items-center gap-2'>
          <User />
          <p className='font-medium text-[18px]'>About:</p>
        </div>
        <p className='mt-2 font-medium text-[18px]'>🚀 Passionate Product Designer 🎨 | Transforming Ideas into Impactful Experiences 💡 | 9+ Years of Creative Innovation 🌟 Welcome! I'm a dedicated product designer with a keen eye for detail and a passion for crafting intuitive and visually stunning experiences. With over 9 years of hands-on experience, I specialize in translating complex ideas into simple, elegant solutions that resonate with users.</p>
      </div>

    </div>
  );
};

export default BioPage;
