import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Heart, Trash2 } from 'lucide-react';

type props = {
  imgSrc: string | StaticImport;
  whoLikeAvatar: string | StaticImport;
  name: string;
  time: string;
  wishMessage: string;
  /** When set, the heart is clickable to remove your like from this wish. */
  onUnlike?: () => void;
  isUnliking?: boolean;
  /**
   * Fires when any non-interactive part of the card is clicked. Intended for
   * navigating to the underlying board detail. Nested buttons (unlike, delete
   * comment, etc.) stop propagation so they keep working independently.
   */
  onCardClick?: () => void;
  comment?: string;
  whoCommentsAvatar?: string | StaticImport;
  whoCommentsName?: string;
  whoGiftsAvatar?: string | StaticImport;
  whoGiftsName?: string;
  giftsArray?: {
    icon: string | StaticImport;
    money?: string;
  }[];
}

const LikesCommentsGiftsCard = ({

  imgSrc,
  whoLikeAvatar,
  name,
  time,
  wishMessage,
  onUnlike,
  isUnliking = false,
  onCardClick,
  comment,
  whoCommentsAvatar,
  whoCommentsName,
  whoGiftsAvatar,
  whoGiftsName,
  giftsArray = [],

}: props) => {
  const isClickable = typeof onCardClick === 'function';

  const handleCardActivate = (event: React.MouseEvent | React.KeyboardEvent) => {
    if (!isClickable) return;
    if (event.type === 'keydown') {
      const key = (event as React.KeyboardEvent).key;
      if (key !== 'Enter' && key !== ' ') return;
      event.preventDefault();
    }
    onCardClick?.();
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleCardActivate : undefined}
      onKeyDown={isClickable ? handleCardActivate : undefined}
      className={`rounded-[5px] ${whoCommentsAvatar || whoGiftsAvatar ? "bg-[#F7F7F7]" : "bg-white"} ${isClickable ? "cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#F43C83] focus-visible:outline-offset-2" : ""}`}
    >
      <Image src={imgSrc} alt='img' className='rounded-[5px] w-full' />
      <div className='flex justify-between mt-2 items-center p-2'>
        <div className='flex items-center gap-2'>
          <div className='relative h-11 w-11 rounded-full shrink-0 overflow-hidden'>
            <Image src={whoLikeAvatar} alt='img' fill className='object-cover' sizes="44px" />
          </div>
          <span className='flex items-center gap-1'>
            <p className='font-semibold line-clamp-1 text-ellipsis'>{name}</p>
            <p>birthday</p>
            <p className='text-sm'>{time}</p>
          </span>
        </div>
        {onUnlike ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUnlike();
            }}
            disabled={isUnliking}
            aria-label={isUnliking ? 'Removing like' : 'Unlike'}
            className="shrink-0 rounded-md p-1 text-[#F43C83] hover:opacity-80 disabled:opacity-50"
          >
            <Heart color="#F43C83" fill="#F43C83" className={isUnliking ? 'opacity-60' : ''} />
          </button>
        ) : (
          <Heart color="#F43C83" fill="#F43C83" />
        )}
      </div>
      <p className='pl-2'>{wishMessage}</p>

      {whoCommentsAvatar &&
        <div className='px-6 py-2'>
          <div className='flex gap-2 items-center'>
            <div className='relative h-8 w-8 rounded-full shrink-0 overflow-hidden'>
              <Image src={whoCommentsAvatar} alt='img' fill className='object-cover' sizes="44px" />
            </div>
            <span className='flex items-center gap-4'>
              <p className='font-semibold text-sm'>{whoCommentsName}</p>
              <Trash2
                className='cursor-pointer'
                size={15}
                onClick={(e) => e.stopPropagation()}
              />
            </span>
          </div>
          <p className='text-sm mt-2 ml-1'>{comment}</p>
        </div>
      }

      {whoGiftsAvatar &&
        <div className='px-6 py-2'>
          <div className='flex gap-2 items-center'>
            <Image src={whoGiftsAvatar} alt='img' height={30} width={30} className='rounded-full shrink-0 object-fill' />
            <p className='font-semibold text-sm'>{whoGiftsName}</p>
          </div>
          <div className='flex gap-2 flex-wrap mt-2'>
            {giftsArray.map((gift, i) => (
              <div key={i} className='bg-white rounded-lg h-[60px] w-[60px] flex justify-center flex-col items-center'>
                <Image src={gift.icon} height={35} width={35} alt='icon' />
                {gift.money && <p className='text-[10px]'>${gift.money}</p>}
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default LikesCommentsGiftsCard;