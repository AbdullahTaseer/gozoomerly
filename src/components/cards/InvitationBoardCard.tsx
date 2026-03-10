import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type InvitationBoardCardProps = {
  title: string;
  backgroundImage: string | StaticImport;
  profileImage: string | StaticImport;
  inviterName: string;
  onAccept?: () => void;
  onDecline?: () => void;
  gradientClass?: string;
}

const InvitationBoardCard = ({
  title,
  backgroundImage,
  profileImage,
  inviterName,
  onAccept,
  onDecline,
  gradientClass = 'bg-gradient-to-br from-[#cf6c71]/80 to-[#d9777c]/80'
}: InvitationBoardCardProps) => {

  return (
    <div className='relative rounded-[13px] overflow-hidden flex flex-col justify-between'>
      <div className='absolute inset-0'>
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className='object-cover'
        />
        <div className={`absolute inset-0 ${gradientClass}`} />
      </div>

      <div className='relative z-10 p-4 flex flex-col justify-between h-full'>
        <h2 className='text-white text-2xl font-bold'>{title}</h2>

        <div className='flex items-center gap-4 mt-4'>
          <div className='relative shrink-0'>
            <div className='w-13 h-13 rounded-full border-2 border-pink-300 p-0.5'>
              <Image
                src={profileImage}
                alt={inviterName}
                width={52}
                height={52}
                className='rounded-full object-cover w-full h-full'
              />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <p className='text-white text-lg'>Invited by {inviterName}</p>
            <div className='bg-gray-800/80 text-white text-xs font-semibold px-3 py-1 rounded-full w-fit'>
              Invitation
            </div>
          </div>
        </div>

        <div className='flex gap-3 mt-6'>
          <button
            onClick={onAccept}
            className='flex-1 bg-white cursor-pointer text-black font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors'
          >
            Accept
          </button>
          <button
            onClick={onDecline}
            className='flex-1 bg-transparent cursor-pointer border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white/10 transition-colors'
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationBoardCard;