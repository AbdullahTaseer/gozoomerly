import React from 'react';
import Image from 'next/image';
import LayerImg from "@/assets/svgs/hero-layer.svg";
import GlobalButton from '../buttons/GlobalButton';
import BgImg from "@/assets/svgs/hero-bg-img.svg";

const HeroSection = () => {
  return (
    <div className='px-[5%] max-[769px]:px-4 pt-4'>
      <div className='relative min-h-[calc(100vh-60px)] flex justify-center items-center rounded-2xl overflow-clip'>
        <Image src={LayerImg} alt='' fill className='object-cover z-1' />
        <Image src={BgImg} alt='' fill className='object-cover' />
        <div className='text-center text-white max-w-[1000px] relative z-2 px-4'>
          <p className='text-[60px] max-[1024px]:text-[48px] max-[768px]:text-[36px] max-[420px]:text-[28px] font-semibold'>Celebrate Life&apos; Biggest Moments. Together.</p>
          <p className='text-[20px] max-md:text-[18px] mt-6'>Zoomerly lets you create interactive celebration boards for every occasion. From birthdays to weddings, concerts to graduations, collect wishes, photos, videos, and gifts in one place and relive the memories forever.</p>
          <div className='flex justify-center items-center flex-wrap gap-6 mt-6'>
            <div className='w-[200px]'>
              <GlobalButton title='Create Your Board' />
            </div>
            <div className='w-[200px]'>
              <GlobalButton title='Watch a Real Board' bgColor='transparent' borderColor='white' borderWidth='2px' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;