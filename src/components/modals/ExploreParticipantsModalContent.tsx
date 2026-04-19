'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Users } from 'lucide-react';
import type { PublicBoardMemberPreview } from '@/hooks/useGetPublicBoards';

export type ExploreParticipantsModalContentProps = {
  isOpen: boolean;
  onClose: () => void;
  participants: PublicBoardMemberPreview[];
  extraCount?: number;
  onCloseExploreCard?: () => void;
};

const ExploreParticipantsModalContent = ({
  isOpen,
  onClose,
  participants,
  extraCount = 0,
  onCloseExploreCard,
}: ExploreParticipantsModalContentProps) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="explore-participants-title"
      className="flex w-full min-w-0 flex-col"
    >

      <ul className="max-h-[min(60vh,440px)] min-[770px]:max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain px-2 py-2">
        {participants.map((p, idx) => {
          const label = p.name?.trim() || 'Participant';
          const rowClass =
            'flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-left transition-colors hover:bg-gray-200';
          const avatar = (
            <div className="relative w-11 h-11 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-200 shrink-0">
              {p.profile_pic_url ? (
                <Image
                  src={p.profile_pic_url}
                  alt=""
                  width={44}
                  height={44}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : null}
            </div>
          );
          return (
            <li key={p.id || `participant-${idx}`}>
              {p.id ? (
                <Link
                  href={`/u/visitProfile/${p.id}`}
                  className={rowClass}
                  onClick={() => {
                    onClose();
                    onCloseExploreCard?.();
                  }}
                >
                  {avatar}
                  <span className="font-medium text-gray-900 truncate">{label}</span>
                </Link>
              ) : (
                <div className={rowClass}>
                  {avatar}
                  <span className="font-medium text-gray-900 truncate">{label}</span>
                </div>
              )}
            </li>
          );
        })}
        {extraCount > 0 && (
          <li className="px-3 py-3 mt-1 text-center text-sm text-gray-500 border-t border-gray-100">
            +{extraCount} more {extraCount === 1 ? 'participant' : 'participants'}
          </li>
        )}
      </ul>
    </div>
  );
};

export default ExploreParticipantsModalContent;
