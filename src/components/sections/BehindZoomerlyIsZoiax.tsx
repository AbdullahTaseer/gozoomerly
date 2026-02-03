"use client";

import Image from 'next/image';
import React from 'react';
import TitleCard from '../cards/TitleCard';
import BehindZoomerlyIsZoiaxImg from "@/assets/pngs/behind-zoomerly.png";

const BehindZoomerlyIsZoiax = () => {
  return (
    <section className="px-[5%] max-[769px]:px-4 max-[768px]:px-0 py-16 relative">

      <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-8 max-[900px]:gap-6 items-center px-8 max-[900px]:px-4 py-12">
        <div className="flex justify-center max-[900px]:order-2">
          <div className="relative w-full max-w-full rounded-xl overflow-hidden">
            <Image
              src={BehindZoomerlyIsZoiaxImg}
              alt="Business professionals in modern office setting"
              className="w-full h-auto rounded-xl"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col justify-center max-[900px]:order-1">
          <div>
            <p className="text-gray-500 uppercase tracking-wider font-medium">
              POWERED BY ZOIAX
            </p>
            <TitleCard title='Behind Zoomerly is Zoiax' className='text-left' />
            <p className="text-xl max-[900px]:text-lg max-[768px]:text-md leading-relaxed mt-5">
              the private engine that powers services, earnings, and operations. You don't see it. You don't manage it. You just feel how smoothly everything works.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default BehindZoomerlyIsZoiax;
