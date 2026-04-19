import {  useState  } from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import DefaultAvatar from "@/assets/svgs/boy-avatar.svg";

type props = {
  imgSrc: string | StaticImport,
  name: string,
  data: string,
  btnTitle: string,
  onClickBtn?: () => void;
  /** Opens that user's profile (e.g. follower / following lists). */
  onNameClick?: () => void;
}

const FollowCard = ({ imgSrc, name, data, btnTitle, onClickBtn, onNameClick }: props) => {
  const [imgError, setImgError] = useState(false);
  const [fallbackSrc, setFallbackSrc] = useState<string | StaticImport>(imgSrc);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setFallbackSrc(DefaultAvatar);
    }
  };

  return (
    <div className='flex gap-3 items-center bg-[#F4F4F4] p-2 rounded-xl'>
      <div className='relative h-[50px] w-[50px] shrink-0'>
        {typeof fallbackSrc === 'string' && (fallbackSrc.startsWith('http') || fallbackSrc.startsWith('/')) ? (
          <img
            src={fallbackSrc}
            alt={name}
            className='rounded-full object-cover h-full w-full'
            onError={handleImageError}
          />
        ) : (
          <Image
            src={fallbackSrc}
            alt={name}
            fill
            className='rounded-full object-cover'
            sizes="50px"
            onError={handleImageError}
          />
        )}
      </div>
      <div className="flex-1 min-w-0 whitespace-nowrap">
        {onNameClick ? (
          <button
            type="button"
            onClick={onNameClick}
            className='font-semibold text-md max-[500px]:text-sm text-left w-full truncate hover:underline text-black cursor-pointer'
          >
            {name}
          </button>
        ) : (
          <p className='font-semibold text-md max-[500px]:text-sm'>{name}</p>
        )}
        <p className='font-light text-sm max-[500px]:text-xs text-ellipsis line-clamp-1 overflow-hidden'>{data}</p>
      </div>
      <p onClick={onClickBtn} className='ml-auto cursor-pointer hover:bg-black/80 bg-black px-6 py-2 text-sm text-white rounded-full'>{btnTitle}</p>
    </div>
  );
};

export default FollowCard;
