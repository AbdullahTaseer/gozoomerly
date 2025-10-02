import React from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Gift, Heart, UsersRound } from 'lucide-react';

type props = {
  description: string;
  spotLightImg: string | StaticImport;
  name: string;
  participants: number;
  gifted: number;
  wished: number;
}

const SpotLightCard = ({ description, spotLightImg, name, participants, gifted, wished }: props) => {
  return (
    <div className='bg-[#18171F] p-6 rounded-[24px] min-w-[480px] text-white flex flex-col gap-4'>

      <div className='flex items-center gap-4'>
        <Image
          src={spotLightImg}
          alt={name}
          width={56}
          height={56}
          className='rounded-full object-cover'
        />
        <p className='text-lg font-bold'>Campaign for {name}!</p>
      </div>

      <p className='text-white text-sm leading-relaxed'>
        {description}
      </p>

      <div className='flex items-center gap-3 mt-2'>
        <div className='flex items-center gap-2 bg-[#F43C83] text-white text-xs font-semibold px-3 py-2 rounded-full'>
          <UsersRound size={16} />
          <span>{participants} People Participated</span>
        </div>
        <div className='flex items-center gap-2 bg-[#F43C83] text-white text-xs font-semibold px-3 py-2 rounded-full'>
          <Gift size={16} />
          <span>{gifted} Gifted</span>
        </div>
        <div className='flex items-center gap-2 bg-[#F43C83] text-white text-xs font-semibold px-3 py-2 rounded-full'>
          <Heart size={16} />
          <span>{wished} Wished</span>
        </div>
      </div>
    </div>
  );
};

export default SpotLightCard;