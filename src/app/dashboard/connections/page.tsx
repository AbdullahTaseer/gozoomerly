'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import StatusCard from '@/components/cards/StatusCard';
import ConnectionFilter from '@/components/filters/ConnectionFilter';
import ConnectionCard from '@/components/cards/ConnectionCard';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import GlobalInput from '@/components/inputs/GlobalInput';
import storyBackground1 from "@/assets/svgs/gifts/gift-5.svg";
import storyBackground2 from "@/assets/svgs/gifts/gift-3.svg";
import storyBackground3 from "@/assets/svgs/gifts/gift-1.svg";
import MobileHeader from '@/components/navbar/MobileHeader';
import DashNavbar from '@/components/navbar/DashNavbar';
import { inviteContacts } from '@/lib/MockData';

const statusCards = [
  {
    type: 'add' as const,
    profileImage: ProfileAvatar,
  },
  {
    type: 'user' as const,
    name: 'Taylor',
    profileImage: ProfileAvatar,
    backgroundImage: storyBackground1,
  },
  {
    type: 'user' as const,
    name: 'Jamie',
    profileImage: ProfileAvatar,
    backgroundImage: storyBackground2,
  },
  {
    type: 'user' as const,
    name: 'Alex',
    profileImage: ProfileAvatar,
    backgroundImage: storyBackground3,
  },
  {
    type: 'user' as const,
    name: 'Taylor',
    profileImage: ProfileAvatar,
    backgroundImage: storyBackground3,
  },
  {
    type: 'user' as const,
    name: 'Jamie',
    profileImage: ProfileAvatar,
    backgroundImage: storyBackground2,
  },
  {
    type: 'user' as const,
    name: 'Alex',
    profileImage: ProfileAvatar,
    backgroundImage: storyBackground1,
  },
];

const connectionCards = [
  {
    profileImage: ProfileAvatar,
    name: 'Anna',
    username: '@alexjohnson',
    isFollowing: false
  },
  {
    profileImage: ProfileAvatar,
    name: 'Sarah Chen',
    username: '@sarah_chen',
  },
  {
    profileImage: ProfileAvatar,
    name: 'Alex',
    username: '@alex123',
    isFollowing: false
  },
  {
    profileImage: ProfileAvatar,
    name: 'Jordan',
    username: '@jodanj123',
  },
];

const Connections = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleAddStatus = () => {
    console.log('Add status clicked');
  };

  const handleStatusClick = (name?: string) => {
    console.log('Status clicked:', name);
  };

  const handleChatClick = (name: string) => {
    console.log('Chat clicked for:', name);
  };

  const handleInvite = (contact: { name: string; phone: string }) => {
    console.log('Inviting contact:', contact);
    alert(`Invite sent to ${contact.name} at ${contact.phone}`);
  };


  return (
    <>
      <DashNavbar />
      <MobileHeader title="Connections" />
      <div className='px-[7%] max-[769px]:px-4 pb-8'>
        <div className='mt-6'>
          <div className='flex gap-2 overflow-x-auto scrollbar-hide pb-2'>
            {statusCards.map((status, index) => (
              <StatusCard
                key={index}
                type={status.type}
                profileImage={status.profileImage}
                backgroundImage={status.backgroundImage}
                name={status.name}
                onClick={() =>
                  status.type === 'add'
                    ? handleAddStatus()
                    : handleStatusClick(status.name)
                }
              />
            ))}
          </div>
        </div>

        <div className='my-6 max-[500px]:my-4 flex justify-between max-[660px]:flex-col-reverse gap-4 max-[660px]:items-center'>
          <ConnectionFilter
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <div className='relative w-[300px] max-[430px]:w-full'>
            <Search size={18} className='absolute top-3 left-3' />
            <GlobalInput placeholder='Search circles...' height='42px' width='100%' borderRadius='100px' inputClassName="pl-10" />
          </div>
        </div>

        <div className='space-y-4 mt-4'>
          {connectionCards.map((connection, index) => (
            <ConnectionCard
              key={index}
              profileImage={connection.profileImage}
              name={connection.name}
              username={connection.username}
              isFollowing={connection.isFollowing}
              onClick={() => handleChatClick(connection.name)}
            />
          ))}
        </div>

        {/* Invite to Zoiax Section */}
        {inviteContacts.length > 0 && (
          <div className='mt-8'>
            <h3 className="text-black text-lg font-semibold mb-4">Invite to Zoiax</h3>
            <div className='space-y-4'>
              {inviteContacts.map((contact) => (
                <ConnectionCard
                  key={contact.id}
                  profileImage={ProfileAvatar}
                  name={contact.name}
                  username={contact.phone}
                  isFollowing={false}
                  buttonText="Invite"
                  onClick={() => handleInvite(contact)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Connections;
