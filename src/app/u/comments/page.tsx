import Likes_1 from "@/assets/pngs/likes-1.svg";
import Likes_2 from "@/assets/pngs/Likes-2.svg";
import LikeAvatar from "@/assets/svgs/likes-ava-1.svg";
import LikeAvatar2 from "@/assets/svgs/avatar-list-icon-1.svg";

import TitleCard from '@/components/cards/TitleCard';
import LikesCommentsGiftsCard from '@/components/cards/LikesCommentsGiftsCard';
import DashNavbar from '@/components/navbar/DashNavbar';

const commentsData = [
  {
    imgSrc: Likes_1,
    whoLikeAvatar: LikeAvatar,
    name: "Raisb",
    time: "1d",
    wishMessage: "🎉 Happy Birthday! May your day be overflowing..",
    whoCommentsAvatar: LikeAvatar2,
    whoCommentName: 'Alex johnson',
    comment: 'Wishing you a day filled with love 🎉'
  },
  {
    imgSrc: Likes_2,
    whoLikeAvatar: LikeAvatar2,
    name: "Ayesha",
    time: "3h",
    wishMessage: "Wishing you endless happiness and love 💖",
    whoCommentsAvatar: LikeAvatar,
    whoCommentName: 'Alex johnson',
    comment: 'Wishing you a day filled with love 🎉'
  },
];

const CommentsPage = () => {
  return (
    <>
      <DashNavbar hide={false} />
      <div className="px-[7%] max-[768px]:px-6 pb-4">
        <TitleCard title="Comments" className="text-left" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commentsData.map((comment, index) => (
            <LikesCommentsGiftsCard
              key={index}
              imgSrc={comment.imgSrc}
              whoLikeAvatar={comment.whoLikeAvatar}
              name={comment.name}
              time={comment.time}
              wishMessage={comment.wishMessage}
              whoCommentsAvatar={comment.whoCommentsAvatar}
              whoCommentsName={comment.whoCommentName}
              comment={comment.comment}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CommentsPage;