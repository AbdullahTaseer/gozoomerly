import React from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type DynamicBoardCardProps = {
  title: string;
  avatar: string | StaticImport;
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
  memories?: number;
  chats?: number;
  topContributors?: Array<string | StaticImport>;
  primaryColor?: string;
  gradient?: string[];
  onNameClick?: () => void;
  onCreatorClick?: () => void;
  onInviteClick?: () => void;
  slug?: string;
  className?: string;
};

const DynamicBoardCard: React.FC<DynamicBoardCardProps> = ({
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
  memories,
  chats,
  topContributors = [],
  primaryColor,
  gradient,
  onNameClick,
  slug,
  className,
}) => {
  const progress = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  const formatLocationDate = () => {
    const parts = [];
    if (location) parts.push(`Home Town : ${location}`);
    if (date) parts.push(`Birthday : ${date}`);
    return parts.join(' ');
  };

  const defaultPrimaryColor = '#F59E0B';
  const defaultGradient = ['#FCD34D', '#F59E0B'];
  const gradientColors = gradient && gradient.length >= 2
    ? gradient
    : defaultGradient;

  const topSectionStyle = {
    backgroundColor: primaryColor || defaultPrimaryColor,
  };

  const progressBgColor = gradientColors[0] || defaultGradient[0];
  const progressFillColor = gradientColors[1] || gradientColors[0] || defaultGradient[1];

  return (
    <div className={`${className} bg-white rounded-xl overflow-hidden shadow-lg shrink-0 flex flex-col`}>
      <div
        className="text-white p-6 relative overflow-hidden"
        style={topSectionStyle}
      >
        <div className="absolute inset-0 opacity-20 z-0">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10">
          <h3 className="text-[28px] font-bold mb-4">{title}</h3>

          <div className="flex items-start gap-3 mb-4">
            <div className="relative h-14 w-14 shrink-0 z-10">
              <Image
                src={avatar}
                alt={name}
                fill
                className="rounded-full object-cover border-2 border-white/50"
              />
            </div>
            <div className="flex-1">
              <p
                className={`font-semibold text-lg mb-1 ${onNameClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                onClick={onNameClick}
              >
                {name}
              </p>
              {(location || date) && (
                <p className="text-sm text-white/90">
                  {formatLocationDate()}
                </p>
              )}
            </div>
          </div>

          <p className="text-white text-sm leading-relaxed line-clamp-3 h-16 mb-4">
            {description}
          </p>

          <div className="mt-4">
            <div className="w-full h-3 rounded-full overflow-hidden relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: progressBgColor, opacity: 0.5 }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progressFillColor
                }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Raised: ${raised.toLocaleString()}</span>
              <span>Target: ${target.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Dark Grey Background */}
      <div className="bg-[#2A2A2A] text-white p-6 flex-1 flex flex-col">
        {/* Statistics */}
        <div className="flex items-center justify-around gap-4">
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold">{participants ?? 0}</p>
            <p className="text-xs text-gray-300 mt-1">Participants</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold">{wishes ?? 0}</p>
            <p className="text-xs text-gray-300 mt-1">Wishes</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold">{gifters ?? 0}</p>
            <p className="text-xs text-gray-300 mt-1">Giftes</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-semibold">{memories ?? media ?? 0}</p>
            <p className="text-xs text-gray-300 mt-1">Memories</p>
          </div>
          {/* <div className="flex flex-col items-center">
            <p className="text-lg font-semibold">{chats ?? 0}</p>
            <p className="text-xs text-gray-300 mt-1">Chats</p>
          </div> */}
        </div>

        {/* Top Contributors */}
        {/* <div className="space-y-3 mb-6">
          <p className="text-lg font-bold">Top Contributors</p>
          {topContributors.length > 0 ? (
            <div className="flex items-center ml-5">
              {topContributors.slice(0, 10).map((contributor, index) => (
                <div
                  key={index}
                  className="relative border-2 border-[#2A2A2A] rounded-full -ml-4 h-10 w-10 shrink-0 hover:scale-110 hover:z-20 transition-transform duration-300"
                >
                  <Image
                    src={contributor}
                    alt={`Contributor ${index + 1}`}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ))}
              {topContributors.length > 10 && (
                <div className="w-10 -ml-4 h-10 shrink-0 rounded-full bg-pink-500 flex items-center justify-center relative z-10 border-2 border-[#2A2A2A]">
                  <span className="text-white text-xs font-semibold">+{topContributors.length - 10}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center">No Contributor</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default DynamicBoardCard;
