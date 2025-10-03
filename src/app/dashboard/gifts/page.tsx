import React from 'react';
import Likes_1 from "@/assets/pngs/likes-1.svg";
import Likes_2 from "@/assets/pngs/Likes-2.svg";
import LikeAvatar from "@/assets/svgs/likes-ava-1.svg";
import LikeAvatar2 from "@/assets/svgs/avatar-list-icon-1.svg";
import SmallGift from "@/assets/svgs/small-gift.svg";
import Money from "@/assets/svgs/Money.svg";

import TitleCard from '@/components/cards/TitleCard';
import LikesCommentsGiftsCard from '@/components/cards/LikesCommentsGiftsCard';

const giftsData = [
  {
    imgSrc: Likes_1,
    whoLikeAvatar: LikeAvatar,
    name: "Raisb",
    time: "1d",
    wishMessage: "🎉 Happy Birthday! May your day be overflowing..",
    whoGiftsAvatar: LikeAvatar2,
    whoGiftsName: 'Alex johnson',
    giftArray: [{
      icon: SmallGift,
      money: '200'
    },
    {
      icon: Money
    }]
  },
  {
    imgSrc: Likes_2,
    whoLikeAvatar: LikeAvatar2,
    name: "Ayesha",
    time: "3h",
    wishMessage: "Wishing you endless happiness and love 💖",
    whoGiftsAvatar: LikeAvatar,
    whoGiftsName: 'Alex johnson',
    giftArray: [{
      icon: SmallGift,
    },
    {
      icon: Money,
      money: '400'
    }]
  },
];

const GiftsPage = () => {
  return (
    <div className="px-[7%] max-[768px]:px-6 pb-4">
      <TitleCard title="Gifts" className="text-left" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {giftsData.map((gift, index) => (
          <LikesCommentsGiftsCard
            key={index}
            imgSrc={gift.imgSrc}
            whoLikeAvatar={gift.whoLikeAvatar}
            name={gift.name}
            time={gift.time}
            wishMessage={gift.wishMessage}
            whoGiftsAvatar={gift.whoGiftsAvatar}
            whoGiftsName={gift.whoGiftsName}
            giftsArray={gift.giftArray}
          />
        ))}
      </div>
    </div>
  );
};

export default GiftsPage;