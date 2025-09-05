import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';

import Avatar from "@/assets/svgs/Sam.svg";
import FarahImg from "@/assets/svgs/Farah.svg";
import BoardBgImg from "@/assets/pngs/live-board-bg.png";
import PostsTopContributorsCard from '@/components/cards/PostsTopContributorsCard';
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import AnimatedButton from '@/components/buttons/AnimatedButton';

const Posts = () => {

  return (
    <div className="w-full bg-white">

      <div className='relative w-full min-h-[450px] p-4 max-[420px]:p-3'>
        <Image src={BoardBgImg} alt='' className='inset-0 h-full w-full object-cover absolute' />

        <div className='relative z-10 max-w-[860px] mx-auto'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-3'>
              <Image src={Avatar} alt='' height={50} width={50} className='rounded-full border-3 border-pink-100' />
              <div className='text-white'>
                <p className='text-sm'>Sean Parker</p>
                <p className='text-xs'>Miami, FL • 03/12</p>
              </div>
            </div>
            <AnimatedButton height='36px' width='115px' title='Add wish' />
          </div>

          <div className='rounded-lg overflow-clip mt-4'>
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

          </div>
        </div>
      </div>

      <div className='max-w-[745px] mx-auto px-4 py-6 space-y-6'>
        <PostsTopContributorsCard />
        <PostsImagesCarouselCard />
        <PostsVideoCard />
        <PostsImagesCarouselCard />
      </div>

    </div>
  );
};

export default Posts;