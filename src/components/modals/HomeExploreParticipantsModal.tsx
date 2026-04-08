'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import ModalOrBottomSlider from './ModalOrBottomSlider';
import type { PublicBoardMemberPreview } from '@/hooks/useGetPublicBoards';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  participants?: PublicBoardMemberPreview[];
  totalMembers?: number;
};

const HomeExploreParticipantsModal = ({
  isOpen,
  onClose,
  participants = [],
  totalMembers = 0,
}: Props) => {
  const previewCount = participants.length;
  const remainingCount = Math.max(0, totalMembers - previewCount);
  const participantCount = previewCount + remainingCount;

  return (
    <ModalOrBottomSlider
      isOpen={isOpen}
      onClose={onClose}
      title="Participants"
      desktopClassName="sm:max-w-md"
    >
      <div className="flex items-center gap-2 min-w-0 mb-2 px-1">
        <Users size={20} className="text-black shrink-0" strokeWidth={2} />
        <span className="text-sm text-black shrink-0">({participantCount})</span>
      </div>
      <ul className="overflow-y-auto overscroll-contain max-h-[min(62vh,500px)]">
        {participants.map((p, idx) => {
          const label = p.name?.trim() || 'Participant';
          const rowClass =
            'flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-left transition-colors hover:bg-gray-50';
          return (
            <li key={p.id || `participant-${idx}`}>
              {p.id ? (
                <Link href={`/u/visitProfile/${p.id}`} className={rowClass} onClick={onClose}>
                  <div className="relative w-11 h-11 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-200 shrink-0">
                    {p.profile_pic_url ? (
                      <img src={p.profile_pic_url} alt="" className="object-cover w-full h-full" />
                    ) : null}
                  </div>
                  <span className="font-medium text-gray-900 truncate">{label}</span>
                </Link>
              ) : (
                <div className={rowClass}>
                  <div className="relative w-11 h-11 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-200 shrink-0">
                    {p.profile_pic_url ? (
                      <img src={p.profile_pic_url} alt="" className="object-cover w-full h-full" />
                    ) : null}
                  </div>
                  <span className="font-medium text-gray-900 truncate">{label}</span>
                </div>
              )}
            </li>
          );
        })}
        {remainingCount > 0 ? (
          <li className="px-3 py-3 mt-1 text-center text-sm text-gray-500 border-t border-gray-100">
            +{remainingCount} more participants
          </li>
        ) : null}
      </ul>
    </ModalOrBottomSlider>
  );
};

export default HomeExploreParticipantsModal;
