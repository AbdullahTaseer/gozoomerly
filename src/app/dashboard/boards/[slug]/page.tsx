import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBoardBySlug } from '@/lib/supabase/boards';
import { createClient } from '@/lib/supabase/server';
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import FundRaiserCard from '@/components/cards/FundRaiserCard';
import ShareButtons from '@/components/buttons/ShareButtons';

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: board } = await getBoardBySlug(params.slug);
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${siteBase}/dashboard/boards/${params.slug}`;
  
  let imageUrl = `${siteBase}/Zoomerly.svg`; 
  if (board?.cover_media_id) {
    try {
      const supabase = await createClient();
      const { data: media } = await supabase
        .from('media')
        .select('cdn_url')
        .eq('id', board.cover_media_id)
        .single();
      if (media?.cdn_url) {
        imageUrl = media.cdn_url.startsWith('http') 
          ? media.cdn_url 
          : `${siteBase}${media.cdn_url.startsWith('/') ? '' : '/'}${media.cdn_url}`;
      }
    } catch (error) {
      console.error('Error fetching cover media:', error);
    }
  }
  
  if (imageUrl === `${siteBase}/Zoomerly.svg` && board?.id) {
    try {
      const supabase = await createClient();
      const { data: firstMedia } = await supabase
        .from('media')
        .select('cdn_url')
        .eq('board_id', board.id)
        .eq('media_type', 'image')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (firstMedia?.cdn_url) {
        imageUrl = firstMedia.cdn_url.startsWith('http') 
          ? firstMedia.cdn_url 
          : `${siteBase}${firstMedia.cdn_url.startsWith('/') ? '' : '/'}${firstMedia.cdn_url}`;
      }
    } catch (error) {
    }
  }

  const title = board?.title || 'Board';
  const description = board?.description 
    ? `${board.description}${board?.goal_amount ? ` - Goal: $${board.goal_amount}` : ''}`
    : `Join this board${board?.goal_amount ? ` - Goal: $${board.goal_amount}` : ''}`;
  const creatorName = (board as any)?.profiles?.name || 'Unknown';

  return {
    title: title,
    description: description,
    metadataBase: new URL(siteBase),
    openGraph: {
      type: 'website',
      url: shareUrl,
      title: title,
      description: description,
      siteName: 'Zoomerly',
      locale: 'en_US',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
    alternates: {
      canonical: shareUrl,
    },
    other: {
      'og:url': shareUrl,
      'og:type': 'website',
      'og:title': title,
      'og:description': description,
      'og:image': imageUrl,
      'og:image:secure_url': imageUrl,
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': title,
      'og:site_name': 'Zoomerly',
      'og:locale': 'en_US',
    },
  };
}

export default async function BoardPage({ params }: PageProps) {
  const { data: board } = await getBoardBySlug(params.slug);
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/';
  const shareUrl = `${siteBase}/dashboard/boards/${params.slug}`;

  // Fetch gift options and statistics
  const supabase = await createClient();
  let giftOptions: any[] = [];
  let topContributors: any[] = [];
  let invitedCount = 0;
  let participantsCount = 0;
  let mediaCount = 0;

  if (board?.id) {
    // Fetch gift options
    const { data: giftData } = await supabase
      .from('board_gift_options')
      .select('*')
      .eq('board_id', board.id)
      .order('display_order', { ascending: true });

    if (giftData) {
      giftOptions = giftData;
    }

    // Fetch top contributors (from gift options with amounts)
    if (giftData && giftData.length > 0) {
      topContributors = giftData
        .filter(g => g.amount > 0)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map(g => ({
          label: g.label || `Gift - $${g.amount}`,
          amount: g.amount
        }));
    }

    // Count invitations
    const { count: invited } = await supabase
      .from('board_invitations')
      .select('*', { count: 'exact', head: true })
      .eq('board_id', board.id);
    invitedCount = invited || 0;

    // Count media
    const { count: media } = await supabase
      .from('media')
      .select('*', { count: 'exact', head: true })
      .eq('board_id', board.id);
    mediaCount = media || 0;

    // Participants count (contributors)
    participantsCount = board.contributors_count || 0;
  }

  const raised = board?.total_raised || 0;
  const target = board?.goal_amount || 0;
  const wishes = board?.wishes_count || 0;
  const gifters = board?.contributors_count || 0;

  return (
    <div className="w-full bg-[#0A0A0A] min-h-screen">
      <div className='max-w-[900px] mx-auto px-4 py-8'>
        {/* Title */}
        <h1 className='text-white text-[32px] max-[768px]:text-[24px] font-bold mb-6'>
          {board?.description || board?.title || 'Board'}
        </h1>

        {/* Goal Progress */}
        <div className="bg-black p-6 rounded-[24px] mb-6">
          <p className="text-white text-[24px] font-bold mb-4">
            Goal Progress
          </p>
          <div className="w-full h-[6px] bg-gray-600 rounded-full">
            <div
              className="h-[6px] rounded-full bg-gradient-to-r from-[#E6408A] to-[#8C5AB6]"
              style={{ width: `${target > 0 ? Math.min((raised / target) * 100, 100) : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-white mt-2">
            <span>Raised: ${raised.toLocaleString()}</span>
            <span>Target: ${target.toLocaleString()}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-[#1B1B1B] p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center gap-2 text-center flex-wrap">
            <div className="flex-1 min-w-[100px]">
              <p className="text-white text-lg font-semibold">{invitedCount}</p>
              <p className="text-gray-300 text-xs mt-1">Invited</p>
            </div>
            <div className="flex-1 min-w-[100px]">
              <p className="text-white text-lg font-semibold">{participantsCount}</p>
              <p className="text-gray-300 text-xs mt-1">Participants</p>
            </div>
            <div className="flex-1 min-w-[100px]">
              <p className="text-white text-lg font-semibold">{wishes}</p>
              <p className="text-gray-300 text-xs mt-1">Wishes</p>
            </div>
            <div className="flex-1 min-w-[100px]">
              <p className="text-white text-lg font-semibold">{gifters}</p>
              <p className="text-gray-300 text-xs mt-1">Gifters</p>
            </div>
            <div className="flex-1 min-w-[100px]">
              <p className="text-white text-lg font-semibold">{mediaCount >= 500 ? `${mediaCount}+` : mediaCount}</p>
              <p className="text-gray-300 text-xs mt-1">Media</p>
            </div>
          </div>
        </div>

        {/* FundRaiser Card with Gift Options */}
        <FundRaiserCard 
          raised={raised}
          target={target}
          giftOptions={giftOptions}
          topContributors={topContributors}
        />

        {/* Media Sections */}
        <div className='mt-6 space-y-6'>
          <PostsImagesCarouselCard />
          <PostsVideoCard />
          <PostsImagesCarouselCard />
        </div>
      </div>
    </div>
  );
}
