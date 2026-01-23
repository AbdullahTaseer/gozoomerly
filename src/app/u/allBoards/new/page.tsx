'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import InvitationBoardCard from '@/components/cards/InvitationBoardCard';
import { useGetUserInvitations } from '@/hooks/useGetUserInvitations';
import { authService } from '@/lib/supabase/auth';
import ProfileAvatar from "@/assets/svgs/avatar-list-icon-1.svg";
import MobileHeader from '@/components/navbar/MobileHeader';

const NewInvites = () => {
  const {
    invitations,
    isLoading: invitationsLoading,
    fetchUserInvitations,
    acceptInvitation,
    declineInvitation
  } = useGetUserInvitations();

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const user = await authService.getUser();
      if (!user) return;

      await fetchUserInvitations({
        p_user_id: user.id,
        p_limit: 1000,
        p_offset: 0
      });
    } catch (err) {
      console.error('Failed to load invitations:', err);
    }
  };

  return (
    <>
      <MobileHeader title='New Invites' />
      <div className='px-[7%] max-[769px]:px-3'>
        <div className='py-4'>
          <div className='flex justify-between max-[870px]:flex-col gap-6'>
            <TitleCard title='New Invites' className='text-left' />
            <div className='flex gap-4 items-center max-[870px]:mx-auto max-[870px]:hidden'>
              <div className='relative w-[260px]'>
                <Search size={18} className='absolute top-3 left-3' />
                <GlobalInput placeholder='Search...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
              </div>
              <Image src={FilterSliderIcon} alt='' height={45} width={45} />
            </div>
          </div>

          <div className='flex mt-6 gap-6 overflow-x-auto scrollbar-hide h-full flex-wrap max-[769px]:flex-col'>
            {invitationsLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='min-w-[350px] h-[220px] bg-gray-100 rounded-[13px] animate-pulse' />
              ))
            ) : invitations.length > 0 ? (
              invitations.map((invitation: any) => (
                <InvitationBoardCard
                  key={invitation.id}
                  title={invitation.board?.title || 'Board Invitation'}
                  backgroundImage={invitation.board?.cover_image || ProfileAvatar}
                  profileImage={invitation.invited_by?.Profile_Picture || ProfileAvatar}
                  inviterName={invitation.invited_by?.name || 'Unknown'}
                  gradientClass='bg-gradient-to-br from-[#cf6c71]/80 to-[#d9777c]/80'
                  onAccept={async () => {
                    await acceptInvitation(invitation.id);
                    await loadInvitations();
                  }}
                  onDecline={async () => {
                    await declineInvitation(invitation.id);
                    await loadInvitations();
                  }}
                />
              ))
            ) : (
              <div className='text-center py-12 w-full'>
                <p className='text-gray-500'>No invitations found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewInvites;

