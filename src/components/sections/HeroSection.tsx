import React from 'react';
import Image from 'next/image';
import LayerImg from "@/assets/svgs/hero-layer.svg";
import GlobalButton from '../buttons/GlobalButton';
import BgImg from "@/assets/svgs/hero-bg-img.svg";

const HeroSection = () => {
  return (
    <div className='px-[5%] max-[769px]:px-4 max-[768px]:px-0 pt-4 max-[768px]:pt-1'>
      <div className='relative min-h-[calc(100vh-60px)] max-[1024px]:min-h-[400px] p-6 flex justify-center items-center rounded-2xl max-[768px]:rounded-none overflow-clip'>
        <Image src={LayerImg} alt='' fill className='object-cover z-1' />
        <Image src={BgImg} alt='' fill className='object-cover' />
        <div className='text-center text-white max-w-[1000px] relative z-2 px-4'>
          <p className='text-[60px] max-[1024px]:text-[48px] max-[768px]:text-[36px] max-[420px]:text-[28px] font-semibold'>Celebrate Life&apos;s Biggest Moments. Together.</p>
          <p className='text-[20px] max-md:text-[18px] mt-6 max-[768px]:hidden'>Zoomerly lets you create interactive boards for every occasion birthdays, weddings, concerts, graduations, family gatherings, and more. Collect wishes, share media, send gifts, and now… connect with the people you meet at events.</p>
          <p className='text-[20px] max-md:text-[18px] mt-6 hidden max-[768px]:flex'>Zoomerly creates interactive boards for occasions. Collect wishes, photos, videos, and gifts to relive memories.</p>
          <div className='flex justify-center items-center max-[520px]:flex-col gap-6 mt-6'>
            <div className='w-[200px] max-[520px]:w-full'>
              <GlobalButton title='Create Your Board' height='44px' />
            </div>
            <div className='w-[200px] max-[520px]:w-full'>
              <GlobalButton title='Watch How It Works' bgColor='transparent' height='44px' borderColor='white' borderWidth='2px' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;