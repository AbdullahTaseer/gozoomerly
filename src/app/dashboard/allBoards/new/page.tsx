'use client';

import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import TitleCard from '@/components/cards/TitleCard';
import GlobalInput from '@/components/inputs/GlobalInput';
import FilterSliderIcon from "@/assets/svgs/filter-slider.svg";
import { boardInvitations } from '@/lib/MockData';
import InvitationBoardCard from '@/components/cards/InvitationBoardCard';

const NewBoards = () => {

  return (
    <div className='px-[7%] max-[769px]:px-3'>
      <div className='py-4'>
        <div className='flex justify-between max-[870px]:flex-col gap-6'>
          <TitleCard title='Boards' className='text-left' />
          <div className='flex gap-4 items-center max-[870px]:mx-auto max-[870px]:hidden'>
            <div className='relative w-[260px]'>
              <Search size={18} className='absolute top-3 left-3' />
              <GlobalInput placeholder='Search...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
            </div>
            <Image src={FilterSliderIcon} alt='' height={45} width={45} />
          </div>
        </div>

        <div className='flex mt-6 gap-6 overflow-x-auto scrollbar-hide h-full'>
          {boardInvitations.length > 0 ? (
            boardInvitations.map((invitation) => (
              <InvitationBoardCard
                key={invitation.id}
                title={invitation.title}
                backgroundImage={invitation.backgroundImage}
                profileImage={invitation.profileImage}
                inviterName={invitation.inviterName}
                onAccept={() => console.log('Accept invitation', invitation.id)}
                onDecline={() => console.log('Decline invitation', invitation.id)}
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
  );
};

export default NewBoards;

