import React from 'react';
import Image from 'next/image';
import LayerImg from "@/assets/svgs/hero-layer.svg";
import GlobalButton from '../buttons/GlobalButton';
import BgImg from "@/assets/svgs/hero-bg-img.svg";

const HeroSection = () => {
  return (
    <div className='px-[5%] max-[769px]:px-4 max-[768px]:px-0 pt-2 max-[768px]:pt-1'>
      <div className='relative min-h-[calc(100vh-60px)] max-[1024px]:min-h-[400px] py-10 px-10 max-[768px]:px-6 flex justify-center items-center rounded-2xl max-[768px]:rounded-none overflow-clip'>
        <Image src={LayerImg} alt='' fill className='object-cover z-1' />
        <Image src={BgImg} alt='' fill className='object-cover' />
        <div className='text-center text-white max-w-[1150px] relative z-2'>
          <p className='text-[70px] max-[1024px]:text-[55px] max-[768px]:text-[44px] max-[600px]:text-[36px] font-semibold'>Celebrate Life&apos;s Biggest Moments. Together.</p>
          <p className='text-[24px] max-[768px]:text-[20px] mt-4'>Zoomerly lets you create interactive boards for every occasion birthdays, weddings, concerts, graduations, family gatherings, and more. Collect wishes, share media, send gifts, and now… connect with the people you meet at events.</p>
          <div className='flex justify-center items-center max-[520px]:flex-col gap-6 mt-6'>
            <div className='w-[200px] max-[520px]:w-full'>
              <GlobalButton title='Create Your Board' height='48px' />
            </div>
            <div className='w-[200px] max-[520px]:w-full'>
              <GlobalButton title='Watch How It Works' bgColor='transparent' height='48px' borderColor='white' borderWidth='2px' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;