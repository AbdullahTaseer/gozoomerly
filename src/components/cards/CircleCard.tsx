import React from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type Props = {
  title: string;
  backgroundImage: string | StaticImport;
  avatars: (string | StaticImport)[];
  memberCount: number;
};

const CircleCard = ({ title, backgroundImage, avatars, memberCount }: Props) => {

  const avatarsToShow = avatars.slice(0, 3);
  const remainingCount = memberCount - avatarsToShow.length;

  return (
    <div className='relative w-full h-[320px] rounded-2xl overflow-hidden group cursor-pointer'>
      <Image src={backgroundImage} alt={title} fill className='object-cover transition-transform duration-300 group-hover:scale-105' />
      <div className='absolute inset-0 bg-black/60' />

      <div className='relative z-10 flex flex-col items-center justify-center h-full p-6 text-white'>
        <h3 className='text-2xl font-bold'>{title}</h3>
        <div className='flex items-center mt-2'>
          {avatarsToShow.map((avatar, index) => (
            <Image
              key={index}
              src={avatar}
              alt={`Member ${index + 1}`}
              width={32}
              height={32}
              className='rounded-full border-2 border-white -ml-2 first:ml-0'
            />
          ))}
          {remainingCount > 0 && (
            <div className='w-8 h-8 rounded-full border-2 border-white bg-gray-200 -ml-2 flex items-center justify-center text-black text-xs font-bold'>
              +{remainingCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircleCard;