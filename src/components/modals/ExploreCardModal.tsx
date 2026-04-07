'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Heart, MessageCircle, Share2, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PublicBoardMemberPreview } from '@/hooks/useGetPublicBoards';
import WishModal from '@/components/modals/WishModal';
import ShareButtons from '@/components/buttons/ShareButtons';
import { authService } from '@/lib/supabase/auth';
import { getBoardMedia } from '@/lib/supabase/boards';

type ExploreCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  boardId?: string | null;
  honoreeName?: string;
  title: string;
  image: string;
  avatars?: string[];
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

type ExploreModalMediaItem = {
  id: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  filename?: string;
};

const FALLBACK_MODAL_IMAGE =
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80';

function normalizeMediaType(value: unknown): ExploreModalMediaItem['mediaType'] {
  const t = String(value || '').toLowerCase();
  if (t.includes('video')) return 'video';
  if (t.includes('audio')) return 'audio';
  if (t.includes('document') || t.includes('pdf') || t.includes('doc')) return 'document';
  return 'image';
}

function readString(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function readNestedString(row: Record<string, unknown>, containers: string[], keys: string[]): string {
  for (const containerKey of containers) {
    const container = row[containerKey];
    if (!container || typeof container !== 'object') continue;
    const value = readString(container as Record<string, unknown>, keys);
    if (value) return value;
  }
  return '';
}

function getSafeModalImageSrc(src: string): string {
  return typeof src === 'string' && src.trim() ? src : FALLBACK_MODAL_IMAGE;
}

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
  const [mediaItems, setMediaItems] = useState<ExploreModalMediaItem[]>([]);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setLocalLikesCount(likesCount);
  }, [isOpen, likesCount]);

  useEffect(() => {
    if (!isOpen) {
      setMediaItems([]);
      setMediaIndex(0);
      return;
    }

    let cancelled = false;

    const loadMedia = async () => {
      if (!boardId) {
        setMediaItems([]);
        setMediaIndex(0);
        return;
      }

      setIsMediaLoading(true);
      const user = await authService.getUser();
      const viewerId = user?.id;
      if (!viewerId) {
        setMediaItems([]);
        setMediaIndex(0);
        setIsMediaLoading(false);
        return;
      }

      const { data, error } = await getBoardMedia({
        boardId,
        viewerId,
        limit: 20,
        offset: 0,
        scope: 'all',
        orderBy: 'created_at',
        orderDir: 'desc',
      });

      if (cancelled || error) {
        setIsMediaLoading(false);
        return;
      }

      const parsed = data
        .map((item, idx) => {
          const row = item as Record<string, unknown>;
          const directUrl = readString(row, [
            'cdn_url',
            'cdnUrl',
            'url',
            'file_url',
            'fileUrl',
            'public_url',
            'publicUrl',
            'media_url',
            'mediaUrl',
            'source_url',
            'sourceUrl',
            'signed_url',
            'signedUrl',
            'download_url',
            'downloadUrl',
          ]);
          const nestedUrl = readNestedString(
            row,
            ['media', 'asset', 'file', 'attachment'],
            [
              'cdn_url',
              'cdnUrl',
              'url',
              'file_url',
              'fileUrl',
              'public_url',
              'publicUrl',
              'media_url',
              'mediaUrl',
              'source_url',
              'sourceUrl',
              'signed_url',
              'signedUrl',
              'download_url',
              'downloadUrl',
            ]
          );
          const thumbnailUrl = readString(row, [
            'thumbnail_url',
            'thumbnailUrl',
            'thumbnail',
            'thumb_url',
            'thumbUrl',
            'preview_url',
            'previewUrl',
          ]) || readNestedString(row, ['media', 'asset', 'file', 'attachment'], [
            'thumbnail_url',
            'thumbnailUrl',
            'thumbnail',
            'thumb_url',
            'thumbUrl',
            'preview_url',
            'previewUrl',
          ]);
          const filename = readString(row, ['filename', 'file_name', 'name', 'title']);
          const id = readString(row, ['id', 'media_id']) || `${idx}`;
          const mediaType = normalizeMediaType(
            row.media_type ?? row.mime_type ?? row.content_type ?? row.media_kind ?? row.file_type
          );
          const url = directUrl || nestedUrl || thumbnailUrl;

          if (!url) return null;
          return { id, mediaType, url, thumbnailUrl, filename } as ExploreModalMediaItem;
        })
        .filter(Boolean) as ExploreModalMediaItem[];

      setMediaItems(parsed);
      setMediaIndex(0);
      setIsMediaLoading(false);
    };

    loadMedia();

    return () => {
      cancelled = true;
    };
  }, [isOpen, boardId]);

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

  const displayAvatars = avatars.slice(0, 4);
  const slideOpen = isOpen && isAnimating;
  const participantCount = participants.length + extraCount;
  const canOpenParticipantsList = participantCount > 0;
  const canEngage = !!boardId;
  const currentMedia = mediaItems[mediaIndex];
  const hasCarousel = mediaItems.length > 1;
  const fallbackImageSrc = getSafeModalImageSrc(image);
  const goPrevMedia = useCallback(() => {
    if (!mediaItems.length) return;
    setMediaIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  }, [mediaItems.length]);

  const goNextMedia = useCallback(() => {
    if (!mediaItems.length) return;
    setMediaIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  }, [mediaItems.length]);

  useEffect(() => {
    if (!isOpen || !hasCarousel) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrevMedia();
      if (event.key === 'ArrowRight') goNextMedia();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, hasCarousel, goPrevMedia, goNextMedia]);

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
      <div className="relative flex items-center justify-center px-4 bg-white min-h-[3rem]">
        {boardId ? (
          <button
            type="button"
            onClick={goToBoardComments}
            className="font-bold text-xl text-black capitalize text-center max-w-[calc(100%-3.5rem)] line-clamp-2 cursor-pointer rounded-lg px-2 py-1 -mx-2 transition-opacity hover:opacity-80 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            aria-label={`Open board: ${title}`}
          >
            {title}
          </button>
        ) : (
          <h2 className="font-bold text-xl text-black capitalize text-center max-w-[calc(100%-3.5rem)] line-clamp-2">
            {title}
          </h2>
        )}
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} className="text-black" strokeWidth={2} />
        </button>
      </div>

      <div className="relative flex bg-[#1a1a1a] mt-5 h-[550px] min-[769px]:rounded-2xl overflow-hidden">
        {isMediaLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
            <div className="h-8 w-8 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {currentMedia ? (
          <>
            {currentMedia.mediaType === 'image' && (
              <img src={currentMedia.url} alt={currentMedia.filename || title} className="h-full w-full object-contain" />
            )}
            {currentMedia.mediaType === 'video' && (
              <video
                src={currentMedia.url}
                className="h-full w-full object-contain"
                controls
                playsInline
                preload="metadata"
              />
            )}
            {currentMedia.mediaType === 'audio' && (
              <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-white px-6 text-center">
                <p className="text-sm text-white/80">{currentMedia.filename || 'Audio file'}</p>
                <audio src={currentMedia.url} controls className="w-full max-w-md" preload="metadata" />
              </div>
            )}
            {currentMedia.mediaType === 'document' && (
              <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-white px-6 text-center">
                {currentMedia.thumbnailUrl ? (
                  <img src={currentMedia.thumbnailUrl} alt={currentMedia.filename || 'Document preview'} className="max-h-[60%] rounded-lg object-contain" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-white/15 flex items-center justify-center text-3xl">DOC</div>
                )}
                <p className="text-sm text-white/80">{currentMedia.filename || 'Document file'}</p>
                <a
                  href={currentMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-white/90"
                >
                  Open document
                </a>
              </div>
            )}
          </>
        ) : (
          <Image
            src={fallbackImageSrc}
            alt={title}
            unoptimized
            priority
            fill
            className='h-full object-contain'
          />
        )}

        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrevMedia();
              }}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/60 bg-black/55 text-white flex items-center justify-center hover:bg-black/70 pointer-events-auto"
              aria-label="Previous media"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNextMedia();
              }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/60 bg-black/55 text-white flex items-center justify-center hover:bg-black/70 pointer-events-auto"
              aria-label="Next media"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/45 rounded-full px-2 py-1">
              {mediaItems.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaIndex(idx);
                  }}
                  className={`h-1.5 w-1.5 rounded-full ${idx === mediaIndex ? 'bg-white' : 'bg-white/50'}`}
                  aria-label={`Go to media ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}


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
