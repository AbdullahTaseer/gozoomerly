'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Heart, MessageCircle, Share2, MapPin, Users } from 'lucide-react';
import type { PublicBoardMemberPreview } from '@/hooks/useGetPublicBoards';
import WishModal from '@/components/modals/WishModal';
import ShareButtons from '@/components/buttons/ShareButtons';

type ExploreCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Public board id — required for like (wish), comment navigation, and share link. */
  boardId?: string | null;
  /** Honoree display name for the wish flow. */
  honoreeName?: string;
  title: string;
  image: string;
  avatars?: string[];
  /** Full participant rows for the list sheet (ids enable profile links). */
  participants?: PublicBoardMemberPreview[];
  extraCount?: number;
  creatorId?: string | null;
  creatorName?: string;
  creatorAvatar?: string;
  timeAgo?: string;
  location?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
};

const ExploreCardModal = ({
  isOpen,
  onClose,
  boardId = null,
  honoreeName = '',
  title,
  image,
  avatars = [],
  participants = [],
  extraCount = 0,
  creatorId = null,
  creatorName = 'Sarah Chen',
  creatorAvatar,
  timeAgo = '2h ago',
  location = 'Brooklyn, NY',
  likesCount = 234,
  commentsCount = 12,
  sharesCount = 12,
}: ExploreCardModalProps) => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [participantsListOpen, setParticipantsListOpen] = useState(false);
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  useEffect(() => {
    if (isOpen) setLocalLikesCount(likesCount);
  }, [isOpen, likesCount]);

  useEffect(() => {
    if (!isOpen) setParticipantsListOpen(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setWishModalOpen(false);
      setShareModalOpen(false);
    }
  }, [isOpen]);

  const shareUrl =
    typeof window !== 'undefined' && boardId
      ? `${window.location.origin}/u/boards/${boardId}`
      : '';

  const handleWishSuccess = useCallback(() => {
    setLocalLikesCount((c) => c + 1);
  }, []);

  const openWish = useCallback(() => {
    if (boardId) setWishModalOpen(true);
  }, [boardId]);

  const openShare = useCallback(() => {
    if (boardId) setShareModalOpen(true);
  }, [boardId]);

  const goToBoardComments = useCallback(() => {
    if (!boardId) return;
    onClose();
    router.push(`/u/boards/${boardId}`);
  }, [boardId, onClose, router]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      return () => cancelAnimationFrame(id);
    } else {
      document.body.style.overflow = '';
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayAvatars = avatars.slice(0, 4);
  const slideOpen = isOpen && isAnimating;
  const participantCount = participants.length + extraCount;
  const canOpenParticipantsList = participantCount > 0;
  const canEngage = !!boardId;

  const ModalContent = () => {
    const creatorRow = (
      <>
        <div className="relative w-11 h-11 rounded-full border-2 border-white/80 overflow-hidden shrink-0">
          {creatorAvatar ? (
            <Image
              src={creatorAvatar}
              alt={creatorName}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-[#c41e3a]" />
          )}
        </div>
        <div className={`flex flex-col gap-0.5 pb-0.5 ${creatorId ? 'min-w-0' : ''}`}>
          <p className={`text-white font-semibold text-sm ${creatorId ? 'truncate' : ''}`}>{creatorName}</p>
          <p className="text-white/90 text-xs">{timeAgo}</p>
          <div className="flex items-center gap-1.5 text-white/90 text-xs mt-0.5">
            <MapPin size={12} className="shrink-0" />
            <span>{location}</span>
          </div>
        </div>
      </>
    );

    const creatorSection = creatorId ? (
      <Link
        href={`/u/visitProfile/${creatorId}`}
        onClick={onClose}
        className="absolute bottom-5 left-4 z-10 flex items-end gap-3 rounded-xl py-1 pr-3 -ml-1 pl-1 pointer-events-auto text-left transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {creatorRow}
      </Link>
    ) : (
      <div className="absolute bottom-5 left-4 z-10 flex items-end gap-3 pointer-events-auto">
        {creatorRow}
      </div>
    );

    return (
    <>
      <div className="relative flex items-center justify-center px-4 bg-white">
        <h2 className="font-bold text-xl text-black capitalize">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} className="text-black" strokeWidth={2} />
        </button>
      </div>

      <div className="relative flex bg-[#1a1a1a] mt-5 h-[550px] min-[769px]:rounded-2xl overflow-hidden">

        <Image
          src={image}
          alt={title}
          unoptimized
          priority
          fill
          className='h-full object-contain'
        />


        <div className="absolute top-4 left-4 right-4 flex items-start gap-4 pointer-events-none z-10">
          <div className="flex items-center">
            <button
              type="button"
              disabled={!canOpenParticipantsList}
              onClick={(e) => {
                e.stopPropagation();
                setParticipantsListOpen(true);
              }}
              className={`pointer-events-auto flex items-center rounded-full pr-1 py-0.5 -ml-0.5 pl-0.5 transition-opacity ${
                canOpenParticipantsList
                  ? 'cursor-pointer hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                  : 'cursor-default opacity-60'
              }`}
              aria-label={canOpenParticipantsList ? 'View participants' : 'No participants'}
            >
              <div className="flex -space-x-3">
                {displayAvatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="relative w-9 h-9 rounded-full border-[3px] border-white overflow-hidden bg-gray-300 shadow-sm"
                    style={{ zIndex: i + 1 }}
                  >
                    <Image
                      src={avatar}
                      alt=""
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                ))}
                {extraCount > 0 && (
                  <span
                    className="relative w-9 h-9 rounded-full border-[3px] border-white bg-white/95 flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm"
                    style={{ zIndex: displayAvatars.length + 1 }}
                  >
                    +{extraCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {creatorSection}

        <div className="absolute right-0 top-0 bottom-0 w-14 flex flex-col items-center justify-center gap-8 pointer-events-auto max-[769px]:hidden">
          <button
            type="button"
            disabled={!canEngage}
            onClick={(e) => {
              e.stopPropagation();
              openWish();
            }}
            className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Add a wish"
          >
            <Heart size={24} className="text-white" strokeWidth={2} fill="transparent" />
            <span className="text-xs font-medium">{localLikesCount}</span>
          </button>
          <button
            type="button"
            disabled={!canEngage}
            onClick={(e) => {
              e.stopPropagation();
              goToBoardComments();
            }}
            className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Open board to view wishes and comments"
          >
            <MessageCircle size={22} className="text-white" strokeWidth={2} />
            <span className="text-xs font-medium">{commentsCount}</span>
          </button>
          <button
            type="button"
            disabled={!canEngage}
            onClick={(e) => {
              e.stopPropagation();
              openShare();
            }}
            className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Share board"
          >
            <Share2 size={22} className="text-white" strokeWidth={2} />
            <span className="text-xs font-medium">{sharesCount}</span>
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 min-[770px]:hidden pointer-events-auto">
          <button
            type="button"
            disabled={!canEngage}
            onClick={(e) => {
              e.stopPropagation();
              openWish();
            }}
            className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Add a wish"
          >
            <Heart size={24} fill="white" className="drop-shadow-md" />
            <span className="text-xs font-medium drop-shadow-md">{localLikesCount}</span>
          </button>
          <button
            type="button"
            disabled={!canEngage}
            onClick={(e) => {
              e.stopPropagation();
              goToBoardComments();
            }}
            className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Open board to view wishes and comments"
          >
            <MessageCircle size={22} className="text-white drop-shadow-md" strokeWidth={2} />
            <span className="text-xs font-medium drop-shadow-md">{commentsCount}</span>
          </button>
          <button
            type="button"
            disabled={!canEngage}
            onClick={(e) => {
              e.stopPropagation();
              openShare();
            }}
            className="flex flex-col items-center gap-1 text-white cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Share board"
          >
            <Share2 size={22} className="text-white drop-shadow-md" strokeWidth={2} />
            <span className="text-xs font-medium drop-shadow-md">{sharesCount}</span>
          </button>
        </div>
      </div>
    </>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[1010] bg-black/50 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`max-[769px]:block hidden fixed bottom-0 left-0 right-0 z-[1011] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${slideOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain">
          <ModalContent />
        </div>
      </div>

      <div
        className={`min-[769px]:flex hidden fixed inset-0 z-[1011] items-center justify-center p-4 sm:p-6 pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl p-4 border max-h-[650px] w-[650px] border-gray-200 overflow-hidden pointer-events-auto transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalContent />
        </div>
      </div>

      {participantsListOpen && (
        <>
          <div
            className="fixed inset-0 z-[1020] bg-black/50 backdrop-blur-sm"
            onClick={() => setParticipantsListOpen(false)}
            aria-hidden
          />
          <div
            className="fixed z-[1021] left-0 right-0 bottom-0 sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md max-h-[min(75vh,560px)] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="explore-participants-title"
          >
            <div className="sm:hidden flex justify-center pt-2 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Users size={22} className="text-gray-700 shrink-0" strokeWidth={2} />
                <h3 id="explore-participants-title" className="font-semibold text-lg text-gray-900 truncate">
                  Participants
                </h3>
                <span className="text-sm text-gray-500 shrink-0">({participantCount})</span>
              </div>
              <button
                type="button"
                onClick={() => setParticipantsListOpen(false)}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close participants list"
              >
                <X size={20} className="text-gray-700" strokeWidth={2} />
              </button>
            </div>
            <ul className="overflow-y-auto overscroll-contain px-2 py-2 flex-1 min-h-0">
              {participants.map((p, idx) => {
                const label = p.name?.trim() || 'Participant';
                const rowClass =
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-left transition-colors hover:bg-gray-50';
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
                          setParticipantsListOpen(false);
                          onClose();
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
        </>
      )}

      {wishModalOpen && boardId && (
        <WishModal
          isOpen={wishModalOpen}
          onClose={() => setWishModalOpen(false)}
          boardId={boardId}
          honoreeName={honoreeName || title}
          onSubmit={handleWishSuccess}
        />
      )}

      {shareModalOpen && boardId && shareUrl && (
        <>
          <div
            className="fixed inset-0 z-[1030] bg-black/60 backdrop-blur-sm"
            onClick={() => setShareModalOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-labelledby="explore-share-title"
            className="fixed z-[1031] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw-2rem,480px)] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 id="explore-share-title" className="text-lg font-bold text-black truncate pr-2">
                Share {title}
              </h3>
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close share"
              >
                <X size={20} className="text-gray-800" strokeWidth={2} />
              </button>
            </div>
            <ShareButtons shareUrl={shareUrl} title={title} />
          </div>
        </>
      )}
    </>
  );
};

export default ExploreCardModal;
