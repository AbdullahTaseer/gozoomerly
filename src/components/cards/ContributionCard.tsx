'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Gift, PlayCircle } from 'lucide-react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Particles from "@/assets/svgs/why-people-love-particles.svg";
import DefaulftThumbnail from "@/assets/pngs/video-thumbnail.png";

type Props = {
  birthdayNumber: string;
  birthdayTo: string;
  desc: string;
  gift: string;
  iframeSrc?: string;
  imgSrc?: string | StaticImport;
  thumbnail?: string | StaticImport;
};

const ContributionCard = ({ birthdayNumber, birthdayTo, desc, gift, imgSrc, iframeSrc, thumbnail }: Props) => {

  const [showVideo, setShowVideo] = useState(false);

  const autoplaySrc = iframeSrc
    ? iframeSrc.includes("?")
      ? `${iframeSrc}&autoplay=1`
      : `${iframeSrc}?autoplay=1`
    : "";

  return (
    <div className='border border-[#2E2C39] bg-[#1B1D26] rounded-[24px] relative overflow-clip'>
      <Image src={Particles} alt='particles' className='absolute' />

      <div className='py-4 px-6'>
        <p className='text-[24px] max-[768px]:text-[20px] font-medium text-white'>{birthdayNumber}</p>
        <p className='text-[#F0F0F0] text-sm'>{birthdayTo}</p>
      </div>

      {imgSrc && !iframeSrc && (
        <div className='h-[270px] max-[1024px]:h-[210px] relative'>
          <Image src={imgSrc} alt='image' fill />
        </div>
      )}

      {iframeSrc && !showVideo && (
        <div className="relative w-full h-[270px] max-[1024px]:h-[210px] overflow-hidden cursor-pointer" onClick={() => setShowVideo(true)}>
          <Image
            src={thumbnail || DefaulftThumbnail}
            alt="video-thumbnail"
            className="w-full h-full object-cover"
            fill
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <PlayCircle size={64} className="text-white opacity-90 hover:opacity-100 transition" />
          </div>
        </div>
      )}

      {iframeSrc && showVideo && (
        <div className="w-full h-[270px] max-[1024px]:h-[210px] overflow-hidden relative">
          <iframe
            src={autoplaySrc}
            title="iframe-preview"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className='text-sm py-4 px-6'>
        <p className='text-white'>{desc}</p>
        <span className='flex items-center gap-2'>
          <Gift color='white' />
          <p className='text-[#F0F0F0]'>{gift}</p>
        </span>
      </div>
    </div>
  );
};

export default ContributionCard;
