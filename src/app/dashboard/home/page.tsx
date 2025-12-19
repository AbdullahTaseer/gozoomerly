'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TitleCard from '@/components/cards/TitleCard';
import SpotLightCard from '@/components/cards/SpotLightCard';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import AvatarList from '@/components/cards/AvatarList';
import InviteModal from '@/components/modals/InviteModal';
import { spotlightCampaigns, boardInvitations, feedCardData } from '@/lib/MockData';
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';
import { fetchActiveBoards, fetchUserBoards, type Board } from '@/lib/supabase/boards';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import { authService } from '@/lib/supabase/auth';
import BoardCategoryCard from '@/components/cards/BoardCategoryCard';
import HomeFeedFilters from '@/components/filters/HomeFeedFilters';
import FeedCard from '@/components/cards/FeedCard';

const Home = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [counts, setCounts] = useState({
    new: 0,
    active: 0,
    your: 0,
    past: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      setLoading(true);
      const user = await authService.getUser();

      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      const [
        { boards: activeBoards },
        { boards: userBoards },
        { boards: allBoards },
      ] = await Promise.all([
        fetchActiveBoards({
          userId: user.id,
          includeStatus: ['published'],
        }),
        fetchUserBoards(user.id),
        fetchActiveBoards({
          userId: user.id,
          showAll: true,
        }),
      ]);

      const activeCount = activeBoards?.length || 0;
      const yourCount = userBoards?.length || 0;
      const newCount = boardInvitations.length;

      const pastCount = (allBoards || []).filter((board: Board) => {
        if (board.status === 'completed' || board.status === 'cancelled') return true;
        if (board.deadline_date) {
          return new Date(board.deadline_date) < new Date();
        }
        return false;
      }).length;

      setCounts({
        new: newCount,
        active: activeCount,
        your: yourCount,
        past: pastCount,
      });
    } catch (err) {
      console.error('Error loading board counts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-[7%] max-[769px]:px-3'>
      <AvatarList />

      <div className='py-4'>
        <TitleCard title='Boards' className='text-left' />
        {loading ? (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-4'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='h-48 bg-gray-100 rounded-2xl animate-pulse' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mt-4'>
            <BoardCategoryCard
              count={counts.new}
              label="New Boards"
              path="/dashboard/allBoards/new"
            />
            <BoardCategoryCard
              count={counts.active}
              label="Active Boards"
              path="/dashboard/allBoards/active"
            />
            <BoardCategoryCard
              count={counts.your}
              label="Your Boards"
              path="/dashboard/allBoards/your"
            />
            <BoardCategoryCard
              count={counts.past}
              label="Past Boards"
              path="/dashboard/allBoards/past"
            />
          </div>
        )}
      </div>

      <BoardCategoryCard
        count={spotlightCampaigns.length}
        label="Spotlight Compaigns"
        path="/dashboard/spotlight-compaign"
      />

      {/* <div className='py-8'>
        <TitleCard title='Spotlight Campaigns' className='text-left' />
        <div className='flex mt-4 gap-6 max-[500px]:gap-4 overflow-x-auto scrollbar-hide h-full'>
          {spotlightCampaigns.map((campaign) => (
            <SpotLightCard
              key={campaign.id}
              name={campaign.name}
              description={campaign.description}
              spotLightImg={campaign.spotLightImg}
              participants={campaign.participants}
              wished={campaign.wished}
              supports={campaign.supports}
              memories={campaign.memories}
              chats={campaign.chats}
              raised={campaign.raised}
              target={campaign.target}
              organizerName={campaign.organizerName}
              organizerAvatar={campaign.organizerAvatar}
              organizerHometown={campaign.organizerHometown}
              topContributors={campaign.topContributors}
            />
          ))}
        </div>
      </div> */}

      <div>
        <div className='flex items-center justify-between gap-4 mt-4'>
          <TitleCard title='Feed' className='text-left' />
          <HomeFeedFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        <div className='max-w-[745px] mx-auto py-4 space-y-6'>
          <PostsImagesCarouselCard goToProfile={() => router.push("/dashboard/visitProfile")} />
          <PostsVideoCard goToProfile={() => router.push("/dashboard/visitProfile")} />
          <PostsImagesCarouselCard goToProfile={() => router.push("/dashboard/visitProfile")} />
          {feedCardData.map((feed) => (
            <FeedCard
              key={feed.id}
              userName={feed.userName}
              userAvatar={feed.userAvatar}
              timestamp={feed.timestamp}
              layout={feed.layout}
              title={feed.title}
              description={feed.description}
              actionTag={feed.actionTag}
              videoThumbnail={feed.videoThumbnail}
              videoUrl={feed.videoUrl}
              thumbnailImage={feed.thumbnailImage}
              mediaItems={feed.mediaItems}
              likes={feed.likes}
              comments={feed.comments}
              shares={feed.shares}
              memories={feed.memories}
              onUserClick={() => router.push("/dashboard/visitProfile")}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;