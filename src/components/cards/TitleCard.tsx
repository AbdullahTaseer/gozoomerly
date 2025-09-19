import React from 'react';

type props = {
  title: string;
  color?: string;
}

const TitleCard = ({ title, color = "black" }: props) => {
  return (
    <div style={{ color: color }} className="text-center relative text-[55px] max-[900px]:text-[42px] max-[600px]:text-[32px] font-bold">{title}</div>
  );
};

export default TitleCard;