import React from 'react';
import Image from 'next/image';

import Background from "@/assets/svgs/hero-bg-img.svg";
import WhiteLogo from "@/assets/svgs/Zoomerly-white.svg";
import GlobalButton from '@/components/buttons/GlobalButton';
import FloatingInput from '@/components/inputs/FloatingInput';

const Signup = () => {
  return (
    <div className='flex h-screen'>
      <div className='w-[45%] max-[768px]:hidden relative flex justify-center items-center'>
        <Image src={Background} alt='Background' fill className='object-cover' />
        <div className='bg-black/50 absolute inset-0' />
        <Image src={WhiteLogo} alt='' className='relative' />
      </div>
      <div className='w-[55%] max-[768px]:w-full flex justify-center items-center p-4'>
        <div className='max-w-md w-full'>
          <p className='text-center poppin-font text-[36px] font-medium'>Welcome back!</p>
          <p className='text-center font-poppins'>Please login to your account</p>
          <FloatingInput id={"email"} title='Email' type='email' width='100%' className="mt-10" />
          <FloatingInput id={"phone-number"} title='Phone Number' type='tel' width='100%' className="mt-6" />
          <FloatingInput id={"password"} title='Password' type='password' width='100%' className="mt-6" />
          <p className='text-right font-medium text-sm my-3'>Forgot Password?</p>
          <GlobalButton title='Continue' height='46px' />
        </div>
      </div>
    </div>
  );
};

export default Signup;
