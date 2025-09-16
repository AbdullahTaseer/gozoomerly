import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';

import Avatar from "@/assets/svgs/Sam.svg";
import ShareNetwork from "@/assets/svgs/ShareNetwork.svg";
import FarahImg from "@/assets/svgs/Farah.svg";
import smallAnnaAvatar from "@/assets/pngs/small-anna.png";
import BoardBgImg from "@/assets/pngs/live-board-bg.png";
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import AnimatedButton from '@/components/buttons/AnimatedButton';
import FundRaiserCard from '@/components/cards/FundRaiserCard';

const Posts = () => {

  return (
    <div className="w-full bg-white">

      <div className='relative w-full min-h-[400px] p-4 max-[420px]:p-3'>
        <Image src={BoardBgImg} alt='' className='inset-0 h-full w-full object-cover absolute' />

        <div className='relative z-10 max-w-[860px] mx-auto'>
          <div className='flex justify-between items-center flex-wrap mt-4'>
            <p className='text-[42px] max-[768px]:text-[28px] relative text-white'>Sean Parker birthday</p>
            <div className='flex gap-3 mt-4 items-center'>
              <p className='bg-white text-sm rounded-full px-4 py-1 cursor-pointer'>Post Media</p>
              <p className='bg-white text-sm rounded-full px-4 py-1 cursor-pointer'>Wish</p>
              <Image src={ShareNetwork} alt='' height={30} width={30} className='cursor-pointer' />
            </div>
          </div>

          <div className='flex items-center gap-3 mt-4'>
            <Image src={Avatar} alt='' height={50} width={50} className='rounded-full border-3 border-pink-100' />
            <div className='text-white'>
              <p className='text-md'>Sean Parker</p>
              <p className='text-sm'> <span className='font-bold'>Hometown:</span> Miami, FL • <span className='font-bold'>Birthdate:</span> 03/12</p>
            </div>
          </div>

          <p className='text-white pt-4 text-[16px] max-[450px]:text-[14px]'>Happy Birthday, Sean! 🎉 Wishing you a fantastic year ahead filled with health, happiness, and success. May your special day be as amazing as you are. Cheers to many more celebrations! and the goal is $1000</p>

          <div className='flex gap-2 items-center mt-6 text-white'>
            <span className='text-lg'>Created by</span>
            <Image src={smallAnnaAvatar} alt='' height={40} width={40} className='rounded-full' />
            <span>Anna</span>
          </div>
          <div className='flex justify-between flex-wrap gap-3 items-center text-white my-5'>
            <p className='font-bold text-lg'>This surprise board wil be delivered to sean parker on sep,12,2025</p>
            <p className='text-sm bg-black rounded-full px-3 py-1'>Time left to wish : 00-00-00</p>
          </div>

          {/* <div className='rounded-lg overflow-clip mt-4'>
            <div className='bg-gradient-to-r from-[#E6408A] to-[#8C5AB6] px-4 pt-4 text-white'>
              <p>Let's send Sean to the Caribbean!</p>
              <div className='flex justify-between gap-4 items-center flex-wrap mt-3'>
                <p className='space-x-2'>
                  <span className='font-semibold'>$3,850</span>
                  <span>of $3,000</span>
                  <span className='bg-white/20 rounded-full px-3 py-[2px] text-sm'>128% 🎉</span>
                </p>
                <p className='bg-white/20 text-sm rounded-full px-3 py-1'>🔗 Anyone with the link can join</p>
              </div>
              <div className='h-[6px] bg-gradient-to-r from-[#845CBA] to-[#F43C83] rounded-full mt-6'>
                <div style={{ width: `${93}%` }} className='bg-black h-[6px] rounded-full' />
              </div>
            </div>
            <div className='bg-white/50 p-4 max-[420px]:p-3'>
              <div className='flex justify-between text-xs text-center flex-wrap gap-2 items-center'>
                <div>
                  <p>27</p>
                  <p>Contributors</p>
                </div>
                <div>
                  <p>27</p>
                  <p>Wishes</p>
                </div>
                <div>
                  <p>21</p>
                  <p>People Who Gifted</p>
                </div>
              </div>
              <div className='p-4 border border-[#B2B2B2] bg-[#DDCFDB] rounded-lg mt-4'>
                <div className='flex gap-2 items-center flex-wrap text-sm'>
                  <Image src={FarahImg} alt='' height={35} width={35} className='rounded-full' />
                  <span>Anna</span>
                  <span className='bg-white/50 rounded-full px-2 py-1'>Creator</span>
                  <span className='bg-white/40 rounded-full px-3 py-1 text-xs'>✈️ Take Flight - $250</span>
                </div>
                <p className='mt-2 text-sm'>Sean, you&apos;re the most deserving person I know. Here&apos;s to your dream trip 🌊</p>
                <div className='flex items-center gap-4 mt-3'>
                  <div className='flex items-center gap-1'>
                    <Heart size={16} />
                    <span>34</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <MessageCircle size={16} />
                    <span>387</span>
                  </div>
                </div>
              </div>
            </div>

          </div> */}
        </div>
      </div>

      <div className='max-w-[745px] mx-auto px-4 py-6 space-y-6'>
        <FundRaiserCard />
        <PostsImagesCarouselCard />
        <PostsVideoCard />
        <PostsImagesCarouselCard />
      </div>

    </div>
  );
};

export default Posts;