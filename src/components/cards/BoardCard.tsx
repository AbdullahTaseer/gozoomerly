import React from "react";
import Image from "next/image";
import GlobalButton from "../buttons/GlobalButton";

export type Contributor = {
  iconSrc: string;
  label: string;
  amount: number;
};

export type BoardCardProps = {
  title: string;
  avatar: string;
  name: string;
  creatorId?: string;
  location?: string;
  date?: string;
  description?: string;
  fundTitle?: string;
  raised?: number;
  target?: number;
  invited?: number;
  participants?: number;
  wishes?: number;
  gifters?: number;
  media?: number;
  topContributors?: Contributor[];
  buttonText?: string;
  onButtonClick?: () => void;
  onCreatorClick?: () => void;
  onInviteClick?: () => void;
  slug?: string;
  className?: string
};

const BoardCard: React.FC<BoardCardProps> = ({
  title,
  avatar,
  name,
  creatorId,
  location,
  date,
  description,
  fundTitle,
  raised = 0,
  target = 0,
  invited,
  participants,
  wishes,
  gifters,
  media,
  topContributors = [],
  buttonText = "View Full Board",
  onButtonClick,
  onCreatorClick,
  onInviteClick,
  slug,
  className,
}) => {
  const progress = target > 0 ? Math.round((raised / target) * 100) : 0;

  return (
    <div className={`${className} bg-[#18171F] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[550px]`}>
      <h3 className="text-[24px] max-[1250px]:text-[20px] max-[400px]:text-[16px]">{title}</h3>

      <div className="flex items-center gap-3 mt-2">
        <div className="relative h-[55px] w-[55px]">
          <Image src={avatar} alt={title} fill className="rounded-full object-cover shrink-0" />
        </div>
        <div>
          <p
            className={`font-medium text-[20px] max-[400px]:text-[16px] ${onCreatorClick ? 'cursor-pointer hover:text-pink-400 transition-colors' : ''}`}
            onClick={onCreatorClick}
          >
            {name}
          </p>
          {(location || date) && (
            <div className="text-sm text-gray-100 flex flex-col">
              {location && <span>Location: {location}</span>}
              {date && <span>Date: {date}</span>}
            </div>
          )}
        </div>
      </div>

      {(description || fundTitle) && (
        <div className="bg-[#23232A] p-4 rounded-lg mt-4">
          {description && <p className="text-sm min-h-[40px]">{description}</p>}
          {fundTitle && <p className="text-sm font-semibold mt-3">{fundTitle}</p>}

          {target > 0 && (
            <>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-100 mt-1">
                <span>Raised: ${raised.toLocaleString()}</span>
                <span>Target: ${target.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      )}

      {(invited || participants || wishes || gifters || media) && (
        <div className="flex justify-between gap-1 flex-wrap text-center text-sm mt-4">
          {invited !== undefined && <div><p>{invited}</p><p>Invited</p></div>}
          {participants !== undefined && <div><p>{participants}</p><p>Participants</p></div>}
          {wishes !== undefined && <div><p>{wishes}</p><p>Wishes</p></div>}
          {gifters !== undefined && <div><p>{gifters}</p><p>Gifters</p></div>}
          {media !== undefined && <div><p>{media >= 500 ? `${media}+` : media}</p><p>Media</p></div>}
        </div>
      )}

      {topContributors.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Top Contributors</p>
          <div className="flex gap-3 mt-2 flex-wrap">
            {topContributors.map((c, i) => (
              <button
                key={i}
                className="px-3 flex gap-2 items-center py-1 text-xs rounded-full border border-[#303030] bg-[#303030]"
              >
                <Image src={c.iconSrc} height={22} width={22} alt={c.label} />
                {c.label} - ${c.amount}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-6">
        {onInviteClick && (
          <GlobalButton
            title="Invite Someone"
            className="w-full"
            onClick={onInviteClick}
            bgColor="#e5e5e5"
            hover={{ color: 'white' }}
            color="#333"
          />
        )}
        <GlobalButton title={buttonText} className="w-full" onClick={onButtonClick} />
      </div>
    </div>
  );
};

export default BoardCard;
