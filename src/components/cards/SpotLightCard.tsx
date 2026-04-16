import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type props = {
  description: string;
  spotLightImg: string | StaticImport;
  name: string;
  participants: number;
  organizerName?: string;
  organizerAvatar?: string | StaticImport;
  topContributors?: Array<string | StaticImport>;
  onClick?: () => void;
  priority?: boolean;
};

const SpotLightCard = ({
  description,
  spotLightImg,
  name,
  participants,
  topContributors = [],
  organizerName = '',
  organizerAvatar,
  onClick,
  priority = false,
}: props) => {
  const displayAvatars = topContributors.slice(0, 3);
  const extraCount = Math.max(0, participants - displayAvatars.length);

  return (
    <div
      onClick={onClick}
      className="group relative w-full h-[230px] rounded-[12px] overflow-hidden cursor-pointer shrink-0 shadow-lg"
    >
      <div className="absolute inset-0">
        <Image
          src={spotLightImg}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 550px) 100vw, (max-width: 900px) 50vw, 33vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between p-5">
        <div>
          <h2 className="text-white text-xl lg:text-2xl font-semibold text-ellipsis line-clamp-1 leading-tight mb-2">
            {name}
          </h2>
          <p className="text-white/95 text-base font-normal leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 mt-4">
          <div className="flex items-center gap-4 min-w-0">
            {organizerAvatar && (
              <div className="relative w-[32px] h-[32px] rounded-full overflow-hidden shrink-0 border-2 border-white/30">
                <Image
                  src={organizerAvatar}
                  alt={organizerName}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <p className="text-white font-semibold text-lg truncate">{organizerName || 'Organizer'}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex -space-x-3">
              {displayAvatars.map((avatar, i) => (
                <div
                  key={i}
                  className="relative w-[24px] h-[24px] rounded-full border-2 border-white overflow-hidden bg-gray-300 shrink-0"
                >
                  <Image
                    src={avatar}
                    alt=""
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
              {participants > 3 && extraCount > 0 && (
                <span className="bg-[#F9F5FF] border-2 text-pink-400 text-[10px] font-semibold w-[24px] h-[24px] px-2 rounded-full flex items-center justify-center">
                  +{extraCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotLightCard;
