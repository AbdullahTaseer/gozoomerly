
import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getBoardByIdRPC } from '@/lib/supabase/boards';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import FundRaiserCard from '@/components/cards/FundRaiserCard';
import ShareModalTrigger from '@/components/modals/ShareModalTrigger';
import InviteModalTrigger from '@/components/modals/InviteModalTrigger';
import WishButton from '@/components/buttons/WishButton';
import staticProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import backgroundcake from "@/assets/svgs/background-cake.svg";
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';
import ImageWithFallback from '@/components/images/ImageWithFallback';
import BoardSlugTabsCard from '@/components/cards/BoardSlugTabsCard';
import BoardSlugChatDesign from '@/components/cards/BoardSlugChatDesign';
import BoardSlugGifts from '@/components/cards/BoardSlugGifts';
import BoardSlugParticipants from '@/components/cards/BoardSlugParticipants';
import BoardSlugWishes from '@/components/cards/BoardSlugWishes';
import BoardSlugMemories from '@/components/cards/BoardSlugMemories';

async function getBoardById(boardId: string) {
  if (!boardId) {
    return { data: null, error: new Error('Board ID is required') };
  }

  const supabase = await createClient();

  try {

    const rpcParams = {
      p_board_id: boardId,
    };

    const rpcResult = await supabase.rpc('get_board_by_id', rpcParams);
    const { data, error: rpcError } = rpcResult;

    if (rpcError) {

      const { data: fallbackData, error: fallbackError } = await supabase
        .from('boards')
        .select(`
          *,
          board_types (
            name,
            slug,
            icon,
            color_scheme
          ),
          profiles:creator_id (
            id,
            name,
            profile_pic_url
          )
        `)
        .eq('id', boardId)
        .single();

      if (fallbackError) {
        return { data: null, error: fallbackError };
      }

      return { data: fallbackData, error: null };
    }

    if (!data) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('boards')
        .select(`
          *,
          board_types (
            name,
            slug,
            icon,
            color_scheme
          ),
          profiles:creator_id (
            id,
            name,
            profile_pic_url
          )
        `)
        .eq('id', boardId)
        .single();

      if (fallbackError) {
        return { data: null, error: fallbackError };
      }

      return { data: fallbackData, error: null };
    }

    if (data && typeof data === 'object') {

      if ('success' in data && 'data' in data && data.success && data.data) {
        const rpcBoard = data.data;

        const normalizedBoard = {
          ...rpcBoard,

          profiles: rpcBoard.creator ? {
            id: rpcBoard.creator.id,
            name: rpcBoard.creator.name,
            profile_pic_url: rpcBoard.creator.profile_pic_url,
          } : null,

          board_types: rpcBoard.board_type ? {
            name: rpcBoard.board_type.name,
            slug: rpcBoard.board_type.slug,
            icon: rpcBoard.board_type.icon,
            color_scheme: rpcBoard.board_type.color_scheme,
          } : null,

          contributors_count: rpcBoard.contributors_count ?? 0,
          wishes_count: rpcBoard.wishes_count ?? 0,
          participants_count: rpcBoard.participants_count ?? 0,
          gifters_count: rpcBoard.gifters_count ?? 0,
          media_count: rpcBoard.media_count ?? 0,
          views_count: rpcBoard.views_count ?? 0,
          shares_count: rpcBoard.shares_count ?? 0,
          total_raised: rpcBoard.total_raised ?? 0,
          invited_count: rpcBoard.invited_count ?? 0,
        };

        return { data: normalizedBoard, error: null };
      }

      else if ('id' in data && 'title' in data) {

        const rpcBoard = data;
        const normalizedBoard = {
          ...rpcBoard,
          profiles: rpcBoard.creator ? {
            id: rpcBoard.creator.id,
            name: rpcBoard.creator.name,
            profile_pic_url: rpcBoard.creator.profile_pic_url,
          } : null,
          board_types: rpcBoard.board_type ? {
            name: rpcBoard.board_type.name,
            slug: rpcBoard.board_type.slug,
            icon: rpcBoard.board_type.icon,
            color_scheme: rpcBoard.board_type.color_scheme,
          } : null,

          contributors_count: rpcBoard.contributors_count ?? 0,
          wishes_count: rpcBoard.wishes_count ?? 0,
          participants_count: rpcBoard.participants_count ?? 0,
          gifters_count: rpcBoard.gifters_count ?? 0,
          media_count: rpcBoard.media_count ?? 0,
          views_count: rpcBoard.views_count ?? 0,
          shares_count: rpcBoard.shares_count ?? 0,
          total_raised: rpcBoard.total_raised ?? 0,
          invited_count: rpcBoard.invited_count ?? 0,
        };
        return { data: normalizedBoard, error: null };
      }
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from('boards')
      .select(`
        *,
        board_types (
          name,
          slug,
          icon,
          color_scheme
        ),
        profiles:creator_id (
          id,
          name,
          profile_pic_url
        )
      `)
      .eq('id', boardId)
      .single();

    if (fallbackError) {
      return { data: null, error: fallbackError };
    }

    return { data: fallbackData, error: null };
  } catch (err) {

    const supabase = await createClient();
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('boards')
      .select(`
        *,
        board_types (
          name,
          slug,
          icon,
          color_scheme
        ),
        profiles:creator_id (
          id,
          name,
          profile_pic_url
        )
      `)
      .eq('id', boardId)
      .single();

    return { data: fallbackData, error: fallbackError };
  }
}

interface PageProps {
  params: { id: string }
}

export async function generateMetadata(props: any): Promise<Metadata> {

  const params = await props.params;
  const boardId = params.id;
  const { data: board } = await getBoardById(boardId);
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const shareUrl = `${siteBase}/dashboard/boards/${boardId}`;

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
  const params = await props.params;
  const boardId = params.id;
  const { data: board } = await getBoardById(boardId);
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000/';
  const shareUrl = `${siteBase}/dashboard/boards/${boardId}`;

  const supabase = await createClient();
  let giftOptions: any[] = [];
  let topContributors: any[] = [];

  const invitedCount = (board as any)?.invited_count ?? 0;
  const participantsCount = board?.participants_count ?? 0;
  const mediaCount = board?.media_count ?? 0;
  let boardImages: any[] = [];
  let boardVideos: any[] = [];

  if (board?.id) {
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

    const { data: allMedia } = await supabase
      .from('media')
      .select(`
        *,
        profiles:uploader_id (
          id,
          name,
          profile_pic_url
        )
      `)
      .eq('board_id', board.id)
      .order('created_at', { ascending: false });

    if (allMedia) {
      boardImages = allMedia.filter(m => m.media_type === 'image');
      boardVideos = allMedia.filter(m => m.media_type === 'video');
    }
  }

  const raised = board?.total_raised || 0;
  const target = board?.goal_amount || 0;
  const wishes = board?.wishes_count || 0;
  const gifters = board?.gifters_count ?? 0;

  const honoreeFirstName = board?.honoree_details?.first_name || '';
  const honoreeLastName = board?.honoree_details?.last_name || '';
  const honoreeName = honoreeFirstName && honoreeLastName
    ? `${honoreeFirstName} ${honoreeLastName}`.trim()
    : honoreeFirstName || honoreeLastName || 'Unknown';
  const honoreeProfilePhoto = board?.honoree_details?.profile_photo_url || staticProfileAvatar;
  const honoreeHometown = board?.honoree_details?.hometown || '';
  const honoreeDateOfBirth = board?.honoree_details?.date_of_birth || '';

  const formatDateOfBirth = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const formatDeadlineDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const boardTitle = board?.title || `${honoreeName} birthday`;
  const boardDescription = board?.description || `Happy Birthday, ${honoreeFirstName || honoreeName}! 🎉`;
  const creatorName = (board as any)?.profiles?.name || 'Unknown';
  const creatorAvatar = (board as any)?.profiles?.profile_pic_url || staticProfileAvatar;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className='flex justify-between items-center p-4 max-w-[1200px] mx-auto'>
        <div className='flex gap-4 items-center'>
          <Link href={"/dashboard/boards"}>
            <ArrowLeft className='cursor-pointer' />
          </Link>
          <p className='max-[450px]:text-[24px] max-[768px]:text-[32px] max-[1024px]:text-[42px] text-[52px]'>{honoreeName}</p>
        </div>
        <div className="flex items-center gap-2">
          <InviteModalTrigger boardId={board?.id || ''} boardTitle={boardTitle} />
          <ShareModalTrigger shareUrl={shareUrl} title={boardTitle} />
        </div>
      </div>
      <div className='bg-[#18171F] text-white flex flex-wrap justify-center gap-8 px-4 py-6'>
        <p>
          <span className='mr-1'>{invitedCount || 0}</span>
          <span>Invited</span>
        </p>
        <p>
          <span className='mr-1'>{participantsCount || 0}</span>
          <span>Participants</span>
        </p>
        <p>
          <span className='mr-1'>{wishes || 0}</span>
          <span>Wishes</span>
        </p>
        <p>
          <span className='mr-1'>{gifters || 0}</span>
          <span>Gifts</span>
        </p>
        <p>
          <span className='mr-1'>{mediaCount >= 500 ? `${mediaCount}+` : mediaCount}</span>
          <span>Media</span>
        </p>
      </div>
      <div className="relative w-full overflow-hidden mb-4 min-h-[420px] bg-gradient-to-br from-[#622774] via-[#94406d] to-[#b84c67]">
        <Image
          src={backgroundcake}
          alt="Birthday Cake"
          className="w-full absolute h-full opacity-75 object-cover z-10 object-bottom"
        />
        <div className="relative p-8 max-w-[1200px] mx-auto z-20">
          <div className='flex justify-between items-center flex-wrap gap-4'>
            <p className='bg-black rounded-full text-white py-1 px-3 text-sm'>Time left to wish : {formatDeadlineDate(board.deadline_date) || "00-00-00"}</p>
            <div className="flex items-center gap-2 mt-6">
              <p className="text-white text-[15px]">Created by</p>
              <div className="flex items-center gap-2">
                <Image
                  src={creatorAvatar}
                  alt={creatorName}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <p className="text-white font-semibold text-sm">{creatorName}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-6 gap-4">
            <Image
              src={honoreeProfilePhoto}
              alt={honoreeName}
              width={65}
              height={65}
              className="rounded-full object-cover"
            />

            <div>
              <p className="text-white font-semibold text-lg">{honoreeName}</p>
              <p className="text-white/90 text-sm flex gap-5 mt-1">
                {honoreeHometown && <span><strong>Location:</strong> {honoreeHometown}</span>}
                {honoreeDateOfBirth && <span><strong>Date of Birth:</strong> {formatDateOfBirth(honoreeDateOfBirth)}</span>}
              </p>
            </div>
          </div>

          <FundRaiserCard
            raised={raised}
            target={target}
            giftOptions={giftOptions}
            topContributors={topContributors}
            boardId={board?.id}
            description={boardDescription}
          />

          <div className="flex items-start w-full flex-wrap gap-2">
            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium shadow">
              Send Gift
            </button>
            <WishButton boardId={board?.id || ''} honoreeName={honoreeFirstName || honoreeName} />
            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium shadow">
              Share Memories
            </button>
          </div>

        </div>
      </div>

      <BoardSlugTabsCard
        wishesChildren={<BoardSlugWishes boardId={board?.id || ''} boardTitle={boardTitle} boardSlug={boardId} />}
        giftsChildren={<BoardSlugGifts />}
        memoriesChildren={<BoardSlugMemories boardId={board?.id || ''} boardTitle={boardTitle} boardSlug={boardId} />}
        chatsChildren={<BoardSlugChatDesign boardId={board?.id || ''} boardName={boardTitle} />}
        participantsChildren={<BoardSlugParticipants boardId={board?.id || ''} />}
      />

      {}
    </div>
  );
}
