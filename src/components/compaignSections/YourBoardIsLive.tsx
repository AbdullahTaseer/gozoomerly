import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';

import GlobalButton from '../buttons/GlobalButton';

import Avatar from "@/assets/svgs/Sam.svg";
import FarahImg from "@/assets/svgs/Farah.svg";
import BoardBgImg from "@/assets/pngs/live-board-bg.png";
import LiveBoardBoys from "@/assets/pngs/live-board-boys.png";

const YourBoardIsLive = () => {

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 max-[420px]:p-4 mx-auto space-y-6">
      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Your board is live! 🥳
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Every wish, photo, video, and gift will gather here in one place and Sean will receive it all at midnight on their birthday, beautifully wrapped in our BirthdayText story.
          You can invite more people anytime and watch the love grow.
        </p>
      </div>

      <div className='relative min-h-[500px] p-4 max-[420px]:p-3'>
        <Image src={BoardBgImg} alt='' className='rounded-lg inset-0 h-full object-cover absolute' />
        <div className='relative z-10 flex items-center gap-3'>
          <Image src={Avatar} alt='' height={50} width={50} className='rounded-full border-3 border-pink-100' />
          <div className='text-white'>
            <p className='text-sm'>Sean Parker</p>
            <p className='text-xs'>Miami, FL • 03/12</p>
          </div>
        </div>

        <div className='relative z-10 rounded-lg overflow-clip mt-6'>

          <div className='bg-gradient-to-r from-[#E6408A] to-[#8C5AB6] px-4 pt-4 text-white'>
            <p>Let's send Sean to the Caribbean!</p>
            <div className='flex justify-between gap-4 items-center flex-wrap mt-3'>
              <p className='space-x-2'>
                <span className='font-semibold'>$50 raised</span>
                <span>of $3,000</span>
                <span className='bg-white/20 rounded-full px-3 py-[2px] text-sm'>10% 🎉</span>
              </p>
              <p className='bg-white/20 text-sm rounded-full px-3 py-1'>🔗 Anyone with the link can join</p>
            </div>
            <div className='h-[6px] bg-gradient-to-r from-[#845CBA] to-[#F43C83] rounded-full mt-6'>
              <div style={{ width: `${19}%` }} className='bg-black h-[6px] rounded-full' />
            </div>
          </div>
          <div className='bg-white/50 p-4 max-[420px]:p-3'>
            <div className='flex justify-between text-xs text-center flex-wrap gap-2 items-center'>
              <div>
                <p>1</p>
                <p>Contributors</p>
              </div>
              <div>
                <p>1</p>
                <p>Wishes</p>
              </div>
              <div>
                <p>1</p>
                <p>People Who Gifted</p>
              </div>
            </div>
            <div className='p-4 border border-[#B2B2B2] bg-[#DDCFDB] rounded-lg mt-4'>
              <div className='flex gap-2 items-center flex-wrap text-sm'>
                <Image src={FarahImg} alt='' height={35} width={35} className='rounded-full' />
                <span>Anna</span>
                <span>Creator</span>
                <span className='bg-white/40 rounded-full px-3 py-1 text-xs'>✈️ Take Flight - $250</span>
              </div>
              <Image src={LiveBoardBoys} alt='' className='mt-4 w-full rounded-lg' />
              <p className='mt-2 text-sm'>Sean, you&apos;re the most deserving person I know. Here&apos;s to your dream trip 🌊</p>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Heart size={16} />
                  <span>1</span>
                </div>
                <div className='flex items-center gap-1'>
                  <MessageCircle size={16} />
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>

      <GlobalButton
        title="Invite More People"
        height="44px"
        className="mt-6"
      />
    </div>
  );
};

export default YourBoardIsLive;