import React from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type props = {
  imgSrc: string | StaticImport,
  name: string,
  data: string,
  btnTitle: string,
  onClickBtn?: () => void;
}

const FollowCard = ({ imgSrc, name, data, btnTitle, onClickBtn }: props) => {
  return (
    <div className='flex gap-3 items-center bg-[#F4F4F4] p-2 rounded-xl'>
      <Image src={imgSrc} height={50} width={50} alt={name} className='rounded-full shrink-0 overflow-hidden' />
      <div className="flex-1 min-w-0 whitespace-nowrap">
        <p className='font-semibold text-md max-[500px]:text-sm'>{name}</p>
        <p className='font-light text-sm max-[500px]:text-xs text-ellipsis line-clamp-1 overflow-hidden'>{data}</p>
      </div>
      <p onClick={onClickBtn} className='ml-auto cursor-pointer hover:bg-black/80 bg-black px-6 py-2 text-sm text-white rounded-full'>{btnTitle}</p>
    </div>
  );
};

export default FollowCard;
