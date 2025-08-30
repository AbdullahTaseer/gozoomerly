import React from 'react';
import GlobalButton from '../buttons/GlobalButton';

const YourBoardIsLive = () => {
  return (
    <div className="bg-white border border-pink-200 rounded-2xl p-6 mx-auto space-y-6">
      <div>
        <p className="text-center text-[20px] max-[600px]:text-[16px] font-bold">
          Your board is live! 🥳
        </p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Every wish, photo, video, and gift will gather here in one place and Sean will receive it all at midnight on their birthday, beautifully wrapped in our BirthdayText story.
          You can invite more people anytime and watch the love grow.
        </p>
      </div>
      profile profile________________profile profile________________profile profile
      <GlobalButton
        title="Invite More People"
        height="44px"
        className="mt-6"
      />
    </div>
  );
};

export default YourBoardIsLive;