import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getBoardBySlug } from '@/lib/supabase/boards';
import { createClient } from '@/lib/supabase/server';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import FundRaiserCard from '@/components/cards/FundRaiserCard';
import ShareModalTrigger from '@/components/modals/ShareModalTrigger';
import staticProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import backgroundcake from "@/assets/svgs/background-cake.svg";
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata(props: any): Promise<Metadata> {
  // `props.params` may be a Promise in Next.js dynamic routes. Await it before using.
  const params = await props.params;
  const slug = params.slug;
  const { data: board } = await getBoardBySlug(slug);
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${siteBase}/dashboard/boards/${slug}`;

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

export default async function BoardPage(props: any) {
  // await props.params because it might be a Promise for dynamic routes
  const params = await props.params;
  const slug = params.slug;
  const { data: board } = await getBoardBySlug(slug);
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/';
  const shareUrl = `${siteBase}/dashboard/boards/${slug}`;

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

    const { count: invited } = await supabase
      .from('board_invitations')
      .select('*', { count: 'exact', head: true })
      .eq('board_id', board.id);
    invitedCount = invited || 0;

    const { count: media } = await supabase
      .from('media')
      .select('*', { count: 'exact', head: true })
      .eq('board_id', board.id);
    mediaCount = media || 0;

    participantsCount = board.contributors_count || 0;
  }

  const raised = board?.total_raised || 0;
  const target = board?.goal_amount || 0;
  const wishes = board?.wishes_count || 0;
  const gifters = board?.contributors_count || 0;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="relative w-full overflow-hidden mb-6 min-h-[420px] bg-gradient-to-br from-[#622774] via-[#94406d] to-[#b84c67]">
        <Image
          src={backgroundcake}
          alt="Birthday Cake"
          className="w-full absolute h-full opacity-75 object-cover z-10 object-bottom"
        />
        <div className="relative p-8 max-w-[1200px] mx-auto z-20">
          <div className="flex items-start justify-between w-full flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <ArrowLeft size={26} className="text-white" />
              </Link>
              <h1 className="text-white text-[46px] max-[1024px]:text-[32px] max-[768px]:text-[24px] font-semibold">
                Sean Parker birthday
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium shadow">
                Post Media
              </button>
              <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium shadow">
                Wish
              </button>
              <ShareModalTrigger shareUrl={shareUrl} title="Sean Parker birthday" />
            </div>
          </div>

          <div className="flex items-center mt-6 gap-4">
            <Image
              src={staticProfileAvatar}
              alt="User"
              width={65}
              height={65}
              className="rounded-full"
            />

            <div>
              <p className="text-white font-semibold text-lg">Sean Parker</p>
              <p className="text-white/90 text-sm flex gap-5 mt-1">
                <span><strong>Hometown:</strong> Miami, FL</span>
                <span><strong>Date of Birth:</strong> December 03</span>
              </p>
            </div>
          </div>

          <p className="text-white/95 mt-5 max-w-[70%] max-[768px]:max-w-full leading-relaxed text-[15px]">
            Happy Birthday, Sean! 🎉 Wishing you a fantastic year ahead filled with health, happiness,
            and success. May your special day be as amazing as you are. Cheers to many more celebrations!
            and the goal is $1000
          </p>

          <div className="flex items-center gap-2 mt-6">
            <p className="text-white text-[15px]">Created by</p>
            <div className="flex items-center gap-2">
              <Image
                src={staticProfileAvatar}
                alt="Anna"
                width={32}
                height={32}
                className="rounded-full"
              />
              <p className="text-white font-semibold text-sm">Anna</p>
            </div>
          </div>

          <div className="mt-6 flex items-center flex-wrap gap-2 justify-between">
            <p className="text-white font-semibold text-lg">
              This surprise board will be delivered to Sean Parker on Sep 12, 2025
            </p>
            <div className="bg-black text-white text-xs px-4 py-2 rounded-full">
              Time left to wish : 00-00-00
            </div>
          </div>
        </div>
      </div>


      <div className='max-w-[900px] mx-auto px-4 py-8'>

        <FundRaiserCard
          raised={raised}
          target={target}
          giftOptions={giftOptions}
          topContributors={topContributors}
          invitedCount={invitedCount}
          participantsCount={participantsCount}
          mediaCount={mediaCount}
          wishes={wishes}
          gifters={gifters}
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
