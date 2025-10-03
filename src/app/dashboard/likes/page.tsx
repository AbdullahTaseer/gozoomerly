import React from 'react';
import Likes_1 from "@/assets/pngs/likes-1.svg";
import Likes_2 from "@/assets/pngs/Likes-2.svg";
import Likes_3 from "@/assets/pngs/Likes-3.svg";
import Likes_4 from "@/assets/pngs/Likes-4.svg";
import Likes_5 from "@/assets/pngs/Likes-5.svg";
import Likes_6 from "@/assets/pngs/Likes-6.svg";
import LikeAvatar from "@/assets/svgs/likes-ava-1.svg";
import LikeAvatar2 from "@/assets/svgs/avatar-list-icon-1.svg";

import TitleCard from '@/components/cards/TitleCard';
import LikesCommentsGiftsCard from '@/components/cards/LikesCommentsGiftsCard';

const likesData = [
  {
    imgSrc: Likes_1,
    whoLikeAvatar: LikeAvatar,
    name: "Raisb",
    time: "1d",
    wishMessage: "🎉 Happy Birthday! May your day be overflowing..",
  },
  {
    imgSrc: Likes_2,
    whoLikeAvatar: LikeAvatar2,
    name: "Ayesha",
    time: "3h",
    wishMessage: "Wishing you endless happiness and love 💖",
  },
  {
    imgSrc: Likes_3,
    whoLikeAvatar: LikeAvatar2,
    name: "Hamza",
    time: "2d",
    wishMessage: "Many many happy returns of the day! 🎂",
  },
  {
    imgSrc: Likes_4,
    whoLikeAvatar: LikeAvatar,
    name: "Sana",
    time: "5h",
    wishMessage: "Have an amazing birthday! 🎁",
  },
  {
    imgSrc: Likes_5,
    whoLikeAvatar: LikeAvatar,
    name: "Ali",
    time: "6d",
    wishMessage: "Enjoy your special day to the fullest 🥳",
  },
  {
    imgSrc: Likes_6,
    whoLikeAvatar: LikeAvatar2,
    name: "Maria",
    time: "12h",
    wishMessage: "Sending lots of love on your birthday ❤️",
  },
];

const LikesPage = () => {
  return (
    <div className="px-[7%] max-[768px]:px-6 pb-4">
      <TitleCard title="Likes" className="text-left" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {likesData.map((like, index) => (
          <LikesCommentsGiftsCard
            key={index}
            imgSrc={like.imgSrc}
            whoLikeAvatar={like.whoLikeAvatar}
            name={like.name}
            time={like.time}
            wishMessage={like.wishMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default LikesPage;