import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

import GlobalButton from '../buttons/GlobalButton';

import Avatar from "@/assets/svgs/Sam.svg";
import FarahImg from "@/assets/svgs/Farah.svg";
import BoardBgImg from "@/assets/pngs/live-board-bg.png";
import LiveBoardBoys from "@/assets/pngs/live-board-boys.png";
import ShareNetwork from "@/assets/svgs/ShareNetwork.svg";

type Props = {
  onPublish?: () => void;
  isPublishing?: boolean;
};

const YourBoardIsLive = ({ onPublish, isPublishing }: Props) => {

  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 max-[420px]:p-4 mx-auto space-y-6">
      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Your board is ready! 🥳
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Your board is created and saved as a draft. Click "Publish Board" to make it live and start inviting people!
        </p>
      </div>

      <div className='relative min-h-[500px] p-4 max-[420px]:p-3'>
        <Image src={BoardBgImg} alt='' className='rounded-lg inset-0 h-full object-cover absolute' />
        <p className='text-[42px] max-[768px]:text-[28px] relative text-white'>Sean Parker birthday</p>
        <div className='relative z-10 flex items-center gap-3 mt-4'>
          <Image src={Avatar} alt='' height={50} width={50} className='rounded-full border-3 border-pink-100' />
          <div className='text-white'>
            <p className='text-md'>Sean Parker</p>
            <p className='text-sm'> <span className='font-bold'>Hometown:</span> Miami, FL • <span className='font-bold'>Birthdate:</span> 03/12</p>
          </div>
        </div>
        <div className='relative'>
          <p className='text-white pt-4 text-[16px] max-[450px]:text-[14px]'>Happy Birthday, Sean! 🎉 Wishing you a fantastic year ahead filled with health, happiness, and success. May your special day be as amazing as you are. Cheers to many more celebrations! and the goal is $1000</p>
          <div className='flex gap-3 mt-4 items-center'>
            <p className='bg-white text-sm rounded-full px-4 py-1 cursor-pointer'>Post Media</p>
            <p className='bg-white text-sm rounded-full px-4 py-1 cursor-pointer'>Wish</p>
            <Image src={ShareNetwork} alt='' height={30} width={30} className='ml-auto cursor-pointer' />
          </div>
        </div>

        <div className='relative z-10 rounded-b-lg overflow-clip mt-6'>

          {/* <div className='bg-gradient-to-r from-[#E6408A] to-[#8C5AB6] px-4 pt-4 text-white'>
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
          </div> */}

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
                <span className='bg-white/40 rounded-full px-3 py-1 text-xs'>Creator</span>
                <span className='bg-white/60 rounded-full px-3 py-1 text-xs'>✈️ Take Flight - $250</span>
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

      <div className="space-y-3">
        {onPublish && (
          <GlobalButton
            title={isPublishing ? "Publishing..." : "Publish Board"}
            height="48px"
            className="mt-6"
            onClick={onPublish}
            disabled={isPublishing}
          />
        )}
        
        <Link href="/dashboard/home">
          <GlobalButton
            title="Save as Draft & Go to Dashboard"
            height="48px"
            bgColor="#E5E5E5"
            color="#333333"
            className="mt-3"
          />
        </Link>
      </div>
    </div>
  );
};

export default YourBoardIsLive;