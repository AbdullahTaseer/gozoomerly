import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type props = {
  description: string;
  spotLightImg: string | StaticImport;
  name: string;
  participants: number;
  wished: number;
  supports?: number;
  memories?: number;
  chats?: number;
  raised?: number;
  target?: number;
  organizerName?: string;
  organizerAvatar?: string | StaticImport;
  organizerHometown?: string;
  topContributors?: Array<string | StaticImport>;
}

const SpotLightCard = ({
  description,
  spotLightImg,
  name,
  participants,
  wished,
  supports = 0,
  memories = 0,
  chats = 0,
  raised = 0,
  target = 0,
  organizerName = '',
  organizerAvatar,
  organizerHometown = '',
  topContributors = []
}: props) => {
  const progress = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  return (
    <div className='w-[400px] bg-[#18171F] text-white space-y-4 p-4 rounded-[12px]'>
      <h2 className='text-[24px] line-clamp-1'>Campaign for {name}!</h2>

      <div className='bg-[#18171F] p-4 rounded-[12px] relative overflow-hidden'>
        <div className='absolute inset-0 opacity-20 z-0'>
          <Image
            src={spotLightImg}
            alt={name}
            fill
            className='object-cover'
          />
        </div>

        <div className='relative z-10 flex flex-col gap-4'>
          {organizerName && (
            <div className='flex items-center gap-3'>
              {organizerAvatar && (
                <Image
                  src={organizerAvatar}
                  alt={organizerName}
                  width={56}
                  height={56}
                  className='rounded-full border-3 border-white/50 object-cover shrink-0'
                />
              )}
              <div>
                <p className='text-lg font-bold'>{organizerName}</p>
                {organizerHometown && (
                  <p className='text-sm text-gray-300'>Home Town : {organizerHometown}</p>
                )}
              </div>
            </div>
          )}

          <p className='text-white line-clamp-4 text-sm font-medium leading-relaxed'>
            {description}
          </p>

          {(raised > 0 || target > 0) && (
            <div className='mt-2'>
              <div className='flex justify-between text-sm mb-2'>
                <span>Raised: ${raised.toLocaleString()}</span>
                <span>Target: ${target.toLocaleString()}</span>
              </div>
              <div className='w-full bg-[#676f5e] h-3 rounded-full'>
                <div
                  className='h-3 rounded-full bg-[#c7f5c8]'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex items-center justify-around gap-4'>
        <div className='flex flex-col items-center'>
          <p className='text-lg font-semibold'>{participants}</p>
          <p className='text-xs'>Participants</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-lg font-semibold'>{wished}</p>
          <p className='text-xs'>Wishes</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-lg font-semibold'>{supports}</p>
          <p className='text-xs'>Supports</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-lg font-semibold'>{memories}</p>
          <p className='text-xs'>Memories</p>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-lg font-semibold'>{chats}</p>
          <p className='text-xs'>Chats</p>
        </div>
      </div>

      {topContributors.length > 0 && (
        <div className='space-y-3'>
          <p className='text-lg font-bold'>Top Contributors</p>
          <div className='flex items-center ml-5'>
            {topContributors.slice(0, 12).map((contributor, index) => (
              <div key={index} className='relative border rounded-full -ml-4 h-10 w-10 shrink-0 hover:scale-120 hover:z-20 duration-300'>
                <Image
                  src={contributor}
                  alt={`Contributor ${index + 1}`}
                  fill
                  className='rounded-full object-cover'
                />
              </div>
            ))}
            {topContributors.length > 12 && (
              <div className='w-10 -ml-4 h-10 shrink-0 rounded-full bg-pink-400 flex items-center justify-center relative z-10'>
                <span className='text-white text-xs font-semibold'>+{topContributors.length - 12}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotLightCard;