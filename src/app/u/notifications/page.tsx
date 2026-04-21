'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bell, Check, Star } from 'lucide-react';
import DashNavbar from '@/components/navbar/DashNavbar';
import MobileHeader from '@/components/navbar/MobileHeader';
import SkeletonListItem from '@/components/skeletons/SkeletonListItem';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationWithActor } from '@/types/notification';

function formatWhen(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const time = d.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (sameDay) return `${time}, Today`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
  if (isYesterday) return `${time}, Yesterday`;

  const date = d.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });
  return `${time}, ${date}`;
}

function getHref(n: NotificationWithActor): string | null {
  const url =
    (n.data && typeof n.data === 'object' && (n.data as { url?: string }).url) ||
    null;
  if (url) return url;
  if (n.board_id) return `/u/boards/${n.board_id}`;
  if (n.actor_id) return `/u/visitProfile/${n.actor_id}`;
  return null;
}

const Notifications = () => {
  const router = useRouter();
  const { notifications, loading, unreadCount, markRead, markAllRead } =
    useNotifications(50);

  const handleRowClick = async (n: NotificationWithActor) => {
    if (!n.is_read) await markRead(n.id);
    const href = getHref(n);
    if (href) router.push(href);
  };

  return (
    <div className="text-black">
      <DashNavbar />
      <MobileHeader
        title="Notifications"
        showBack
        onBackClick={() => router.push('/u/home')}
      />

      <div className="px-[5%] max-[768px]:px-4 py-5">
        <div className="flex justify-between items-center mb-6 max-[769px]:mb-4">
          <span className="text-3xl max-[769px]:hidden font-bold">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-sm font-medium text-pink-600 hover:underline ml-auto"
            >
              <Check size={16} />
              Mark all read
            </button>
          )}
        </div>

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell size={40} className="mb-3" />
            <p className="text-sm">You&apos;re all caught up.</p>
          </div>
        )}

        {!loading &&
          notifications.map((n) => {
            const actorName = n.actor?.name || null;
            const avatar = n.actor?.profile_pic_url || null;
            const isUnread = !n.is_read;

            return (
              <button
                key={n.id}
                type="button"
                onClick={() => handleRowClick(n)}
                className={`w-full text-left p-4 flex items-center gap-4 rounded-[8px] mt-4 transition-colors ${
                  isUnread ? 'bg-pink-50' : 'bg-[#F7F7F7] hover:bg-[#efefef]'
                }`}
              >
                <div className="bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center overflow-hidden shrink-0">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={actorName || 'avatar'}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Star />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[20px] max-[768px]:text-[16px] leading-tight truncate">
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                      {n.body}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatWhen(n.created_at)}
                  </p>
                </div>
                {isUnread && (
                  <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-pink-500" />
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default Notifications;
