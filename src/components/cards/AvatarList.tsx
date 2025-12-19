import React from 'react';
import { avatarListData } from '@/lib/MockData';
import MainAvatar from "@/assets/svgs/avatar-list-main.svg";
import AvatarCard from '@/components/cards/AvatarCard';

const AvatarList = () => {
  return (
    <div className='mt-6 max-[769px]:hidden'>
      <div className='flex gap-4 overflow-x-auto scrollbar-hide'>
        <AvatarCard
          imgPath={MainAvatar}
          profileName='Your highlights'
          showAddBtn={true}
        />
        {avatarListData.map((avatar, i) => (
          <AvatarCard
            key={i}
            imgPath={avatar.imgPath}
            profileName={avatar.profileName}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarList;