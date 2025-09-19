import React from 'react';

type props = {
  title: string;
  color?: string;
}

const TitleCard = ({ title, color = "black" }: props) => {
  return (
    <div style={{ color: color }} className="text-center relative text-[55px] max-[1024px]:text-[46px] max-[768px]:text-[32px] font-bold">{title}</div>
  );
};

export default TitleCard;