'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BoardCard from '@/components/cards/BoardCard';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import GlobalButton from '@/components/buttons/GlobalButton';
import InviteModal from '@/components/modals/InviteModal';
import { getUserBoards } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';

const Boards = () => {
  const router = useRouter();
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<{ slug: string; title: string } | null>(null);
  
  useEffect(() => {
    fetchUserBoards();
  }, []);
  
  const fetchUserBoards = async () => {
    try {
      const user = await authService.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      
      const { data, error } = await getUserBoards(user.id);
      if (error) {
        setError('Failed to load boards');
        return;
      }
      
      setBoards(data || []);
    } catch (err) {
      console.error('Error fetching boards:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteClick = (board: any) => {
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
  
  return (
    <div className='px-[7%] max-[769px]:px-6 pb-4'>
      <div className='flex justify-between items-center max-[870px]:flex-col gap-6'>
        <TitleCard title='Boards' className='text-left' />
        <div className='flex gap-4 items-center'>
          <div className='relative w-[260px]'>
            <Search size={18} className='absolute top-3 left-3' />
            <GlobalInput placeholder='Search boards...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
          </div>
          <GlobalButton
            title='Create Campaign'
            onClick={() => router.push('/compaign')}
            height='42px'
            className='min-w-[140px]'
          />
        </div>
      </div>
      <div className='grid grid-cols-3 max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1 mt-6 gap-6 h-full'>
        {loading ? (
          <div className='col-span-3 text-center py-8'>Loading boards...</div>
        ) : error ? (
          <div className='col-span-3 text-center py-8 text-red-500'>{error}</div>
        ) : boards.length === 0 ? (
          <div className='col-span-3 text-center py-8'>
            <p className='text-gray-500 mb-4'>You haven't created any boards yet</p>
            <GlobalButton 
              title='Create Your First Campaign' 
              onClick={() => router.push('/compaign')}
            />
          </div>
        ) : (
          boards.map((board) => (
            <BoardCard
              key={board.id}
              title={board.title}
              avatar='/default-avatar.jpg'
              name={board.profiles?.name || 'Unknown'}
              location=''
              date={new Date(board.created_at).toLocaleDateString()}
              description={board.description || ''}
              fundTitle={board.goal_type === 'monetary' ? `$${board.goal_amount || 0} Goal` : 'Non-monetary goal'}
              raised={board.total_raised || 0}
              target={board.goal_amount || 0}
              invited={0}
              participants={board.contributors_count || 0}
              wishes={board.wishes_count || 0}
              gifters={board.contributors_count || 0}
              media={0}
              topContributors={[]}
              buttonText="View Board"
              onButtonClick={() => router.push(`/dashboard/boards/${board.slug}`)}
              onInviteClick={() => handleInviteClick(board)}
              slug={board.slug}
            />
          ))
        )}
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

export default Boards;