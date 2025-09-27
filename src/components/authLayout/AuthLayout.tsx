import React from 'react';
import Image from 'next/image';

import Background from "@/assets/svgs/hero-bg-img.svg";
import WhiteLogo from "@/assets/svgs/Zoomerly-white.svg";


const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-screen'>
      <div className='w-[45%] max-[768px]:hidden relative flex justify-center items-center'>
        <Image src={Background} alt='Background' fill className='object-cover' />
        <div className='bg-black/50 absolute inset-0' />
        <Image src={WhiteLogo} alt='' className='relative' />
      </div>
      <div className='w-[55%] relative max-[768px]:w-full flex justify-center flex-col items-center p-4'>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
