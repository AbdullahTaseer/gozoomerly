import React from 'react';
import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';
import { getBoardBySlug } from '@/lib/supabase/boards';

import AvatarFallback from "@/assets/svgs/Sam.svg";
import ShareNetwork from "@/assets/svgs/ShareNetwork.svg";
import FarahImg from "@/assets/svgs/Farah.svg";
import smallAnnaAvatar from "@/assets/pngs/small-anna.png";
import BoardBgImg from "@/assets/pngs/live-board-bg.png";
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import FundRaiserCard from '@/components/cards/FundRaiserCard';
import ShareButtons from '@/components/buttons/ShareButtons';

interface PageProps {
  params: { slug: string }
}

export default async function BoardPage({ params }: PageProps) {
  const { data: board } = await getBoardBySlug(params.slug);
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${siteBase}/dashboard/boards/${params.slug}`;

  return (
    <div className="w-full bg-white">

      <div className='relative w-full min-h-[400px] p-4 max-[420px]:p-3'>
        <Image src={BoardBgImg} alt='' className='inset-0 h-full w-full object-cover absolute' />

        <div className='relative z-10 max-w-[860px] mx-auto'>
          <div className='flex justify-between items-center flex-wrap mt-4 gap-3'>
            <p className='text-[42px] max-[768px]:text-[28px] relative text-white'>{board?.title || 'Board'}</p>
            <div className='flex gap-3 mt-4 items-center'>
              <p className='bg-white text-sm rounded-full px-4 py-1 cursor-pointer'>Post Media</p>
              <p className='bg-white text-sm rounded-full px-4 py-1 cursor-pointer'>Wish</p>
              <ShareButtons shareUrl={shareUrl} title={board?.title} />
            </div>
          </div>

          <div className='flex items-center gap-3 mt-4'>
            <Image src={AvatarFallback} alt='' height={50} width={50} className='rounded-full border-3 border-pink-100' />
            <div className='text-white'>
              <p className='text-md'>{(board as any)?.profiles?.name || 'Unknown'}</p>
              <p className='text-sm'> <span className='font-bold'>Hometown:</span> {board?.honoree_details?.hometown || '—'} • <span className='font-bold'>Birthdate:</span> {board?.honoree_details?.date_of_birth || '—'}</p>
            </div>
          </div>

          <p className='text-white pt-4 text-[16px] max-[450px]:text-[14px]'>
            {board?.description || 'No description provided.'}{board?.goal_amount ? ` and the goal is $${board.goal_amount}` : ''}
          </p>

          <div className='flex gap-2 items-center mt-6 text-white'>
            <span className='text-lg'>Created by</span>
            <Image src={smallAnnaAvatar} alt='' height={40} width={40} className='rounded-full' />
            <span>{(board as any)?.profiles?.name || 'Unknown'}</span>
          </div>
          <div className='flex justify-between flex-wrap gap-3 items-center text-white my-5'>
            <p className='font-bold text-lg'>This surprise board will be delivered {board?.deadline_date ? `on ${new Date(board.deadline_date).toLocaleDateString()}` : ''}</p>
            <p className='text-sm bg-black rounded-full px-3 py-1'>Time left to wish : 00-00-00</p>
          </div>

          {/* Preserved design block commented out in original */}
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
}
