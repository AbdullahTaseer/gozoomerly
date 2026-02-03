import React from 'react';
import Image from 'next/image';
import PinkShade from "@/assets/svgs/pink-ellips.svg";
import PurpleEllipse from "@/assets/svgs/purple-ellips.svg";
import GirlImg from "@/assets/pngs/social-connection.png";
import TitleCard from '../cards/TitleCard';

const ZoomerlyExpands = () => {
  return (
    <div className='px-[5%] max-[769px]:px-0 overflow-hidden'>
      <div className='bg-[#F7F7F7] py-8 px-8 max-[768px]:px-5 md:rounded-2xl grid md:grid-cols-2 gap-6 relative'>
        <Image src={PurpleEllipse} alt='' className='absolute bottom-0 left-[40%] z-20' />
        <Image src={PinkShade} alt='' className='absolute top-0 left-[20%] z-20' />
        <div className='my-auto'>
          <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">
            THEN IT BECOMES SOCIAL (WITHOUT THE NOISE)
          </p>
          <TitleCard title='As you use Zoomerly, it naturally expands.' className='text-left' />
          <p className='my-4'>Follow people you actually care about</p>
          <p className='mb-4'>Share real moments and updates</p>
          <p className='mb-4'>Discover people and places around you</p>
          <p className='mb-6'>Stay connected without likes or performance pressure</p>
          <p className='text-[#F71873]'>It feels social — but still personal.</p>
        </div>
        <div className='my-auto'>
          <Image src={GirlImg} alt='' className='w-full' />
        </div>
      </div>
    </div>
  );
};

export default ZoomerlyExpands;
