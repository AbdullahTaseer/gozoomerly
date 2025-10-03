'use client';

import React from 'react';
import Image from 'next/image';
import bellIcon from "@/assets/svgs/bell.svg";
import { useRouter } from 'next/navigation';

const BellIconIndicator = () => {

  const router = useRouter();

  return (
    <div onClick={() => router.push("/dashboard/notifications")} className='relative cursor-pointer'>
      <Image src={bellIcon} alt='' />
      <span className='p-1.5 absolute top-0 right-0 rounded-full bg-pink-500' />
    </div>
  );
};

export default BellIconIndicator;