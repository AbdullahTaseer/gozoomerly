'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TitleCard from '@/components/cards/TitleCard';
import BoardCard from '@/components/cards/BoardCard';
import SpotLightCard from '@/components/cards/SpotLightCard';
import PostsVideoCard from '@/components/cards/PostsVideoCard';
import AvatarList from '@/components/cards/AvatarList';
import InviteModal from '@/components/modals/InviteModal';
import { spotlightCampaigns } from '@/lib/MockData';
import PostsImagesCarouselCard from '@/components/cards/PostsImagesCarouselCard';
import { fetchActiveBoards, type Board } from '@/lib/supabase/boards';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import GlobalModal from '@/components/modals/GlobalModal';

const Home = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<{ slug: string; title: string } | null>(null);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const { boards: fetchedBoards, error } = await fetchActiveBoards({ showAll: true });
      
      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log(`Found ${fetchedBoards?.length || 0} boards`);
        setBoards(fetchedBoards || []);
      }
    } catch (err) {
      console.error('Error loading boards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBoard = (board: Board) => {
    router.push(`/dashboard/boards/${board.slug}`);
  };

  const handleCreatorClick = (creatorId: string) => {
    router.push(`/dashboard/visitProfile/${creatorId}`);
  };

  const handleInviteClick = (board: Board) => {
    setSelectedBoard({
      slug: board.slug,
      title: board.title
    });
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setInviteModalOpen(false);
    setSelectedBoard(null);
  };


  const feedFilters = ['All', 'Friends', 'Family', 'Public', 'Private'];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className='px-[7%] max-[769px]:px-6'>
      <AvatarList />

      <div className='py-8'>
        <TitleCard title='Active Boards' className='text-left' />
        
        {loading ? (
          <div className='flex mt-4 gap-6 overflow-x-auto scrollbar-hide h-full'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='min-w-[340px] h-[400px] bg-gray-100 rounded-lg animate-pulse' />
            ))}
          </div>
        ) : boards.length > 0 ? (
          <div className='flex mt-4 gap-6 overflow-x-auto scrollbar-hide h-full'>
            {boards.slice(0, 4).map((board) => (
              <BoardCard
                key={board.id}
                title={board.title}
                avatar={(board as any).profiles?.profile_pic_url || ProfileAvatar}
                name={(board as any).profiles?.name || 'Unknown'}
                creatorId={board.creator_id}
                location={board.honoree_details?.hometown || 'No location'}
                date={formatDate(board.deadline_date || board.created_at)}
                description={board.description}
                fundTitle={board.goal_type === 'monetary' ? `$${board.goal_amount || 0} Goal` : 'Non-monetary goal'}
                raised={board.total_raised || 0}
                target={board.goal_amount || 0}
                invited={board.shares_count || 0}
                wishes={board.views_count || 0}
                gifters={board.contributors_count || 0}
                media={(board as any).media_count || 0}
                topContributors={[]}
                buttonText="View Board"
                onButtonClick={() => handleViewBoard(board)}
                onCreatorClick={() => handleCreatorClick(board.creator_id)}
                onInviteClick={() => handleInviteClick(board)}
                slug={board.slug}
                className='min-w-[340px] h-full'
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No active boards found</p>
            <button 
              onClick={() => router.push('/dashboard/boards')}
              className='mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600'
            >
              Create First Board
            </button>
          </div>
        )}
      </div>

      <div className='py-8'>
        <TitleCard title='Spotlight Campaigns' className='text-left' />
        <div className='flex mt-4 gap-6 overflow-x-auto scrollbar-hide h-full'>
          {spotlightCampaigns.map((campaign) => (
            <SpotLightCard
              key={campaign.id}
              name={campaign.name}
              description={campaign.description}
              spotLightImg={campaign.spotLightImg}
              participants={campaign.participants}
              gifted={campaign.gifted}
              wished={campaign.wished}
            />
          ))}
        </div>
      </div>

      <div>
        <div className='flex max-[550px]:flex-col justify-between gap-4'>
          <TitleCard title='Feed' className='text-left' />
          <div className='flex items-center gap-6 max-[500px]:gap-3 justify-center'>
            {feedFilters.map((item) => (
              <p
                key={item}
                onClick={() => setSelectedFilter(item)}
                className={`text-[20px] max-[768px]:text-[16px] cursor-pointer font-bold transition-colors
                  ${selectedFilter === item ? 'text-pink-500' : 'text-gray-700 hover:text-pink-400'}`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className='max-w-[745px] mx-auto py-6 space-y-6'>
          <PostsImagesCarouselCard goToProfile={() => router.push("/dashboard/visitProfile")} />
          <PostsVideoCard goToProfile={() => router.push("/dashboard/visitProfile")} />
          <PostsImagesCarouselCard goToProfile={() => router.push("/dashboard/visitProfile")} />
        </div>
      </div>

      {selectedBoard && (
        <InviteModal
          isOpen={inviteModalOpen}
          onClose={handleCloseInviteModal}
          boardSlug={selectedBoard.slug}
          boardTitle={selectedBoard.title}
        />
      )}

    </div>
  );
};

export default Home;