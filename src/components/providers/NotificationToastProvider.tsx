'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/supabase/auth';
import type { NotificationRow } from '@/types/notification';
import type { RealtimeChannel } from '@supabase/supabase-js';

function hrefFromNotification(row: NotificationRow): string | null {
  const data = row.data as { url?: string } | null;
  if (data?.url && typeof data.url === 'string') return data.url;
  if (row.board_id) return `/u/boards/${row.board_id}`;
  return '/u/notifications';
}

type InAppNotificationToastCardProps = {
  title: string;
  body: string | null;
  /** Card click: dismiss toast and navigate to the notification target. */
  onOpen: () => void;
  /** Close icon: dismiss toast only. */
  onDismiss: () => void;
};

function InAppNotificationToastCard({
  title,
  body,
  onOpen,
  onDismiss,
}: InAppNotificationToastCardProps) {
  return (
    <div
      className={[
        'relative isolate max-w-[min(100vw-1.5rem,22rem)] w-full overflow-hidden rounded-2xl',
        'border border-pink-100/90 bg-white',
        'shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18),0_4px_20px_-4px_rgba(219,39,119,0.14)]',
        'ring-1 ring-black/[0.04]',
      ].join(' ')}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-200/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-pink-400/[0.07] blur-2xl"
        aria-hidden
      />

      <button
        type="button"
        aria-label="Dismiss"
        className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-all hover:bg-gray-100/90 hover:text-gray-900 active:scale-95"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
      >
        <X className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </button>

      <button
        type="button"
        className="group relative flex w-full gap-3.5 p-4 pb-4 pr-14 text-left transition-[transform,box-shadow] active:scale-[0.992] max-[380px]:gap-3 max-[380px]:p-3.5"
        onClick={onOpen}
      >
        <span
          className={[
            'relative flex h-[2.25rem] w-[2.25rem] shrink-0 items-center justify-center rounded-2xl',
            'bg-gradient-to-br from-pink-50 via-white to-rose-50',
            'ring-1 ring-pink-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
            'transition-transform duration-200 group-hover:scale-[1.03]',
          ].join(' ')}
          aria-hidden
        >
          <Bell className="h-[1.15rem] w-[1.15rem] text-pink-600 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]" strokeWidth={2.25} />
        </span>

        <div className="min-w-0 flex-1 border-l border-pink-100/70 pl-3.5 max-[380px]:pl-3">
          <div className="flex items-start justify-between gap-2">
            <div className="block min-w-0 flex-1">
              <span className="block font-semibold tracking-tight text-[0.9375rem] leading-snug text-gray-900 line-clamp-2 max-[380px]:text-sm">
                {title}
              </span>
              {body ? (
                <p className="mt-1.5 block text-[0.8125rem] leading-snug text-gray-600 line-clamp-1 overflow-hidden text-ellipsis max-[380px]:text-xs">
                  {body}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </button>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-pink-50/[0.35] to-transparent"
        aria-hidden
      />
    </div>
  );
}

export function NotificationToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(createClient());
  const authRef = useRef(new AuthService());

  useEffect(() => {
    let mounted = true;
    const supabase = supabaseRef.current;

    const run = async () => {
      const user = await authRef.current.getUser();
      if (!mounted || !user?.id) return;

      const topic = `notification-toast:${user.id}:${typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)
        }`;

      const channel = supabase
        .channel(topic)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const row = payload.new as NotificationRow;
            if (!row?.id) return;

            if (pathnameRef.current === '/u/notifications') {
              return;
            }

            const href = hrefFromNotification(row);
            const title = row.title || 'New notification';
            const body = row.body?.trim() || null;

            toast.custom(
              (t) => (
                <InAppNotificationToastCard
                  title={title}
                  body={body}
                  onOpen={() => {
                    toast.dismiss(t.id);
                    if (href) router.push(href);
                  }}
                  onDismiss={() => toast.dismiss(t.id)}
                />
              ),
              {
                id: `notification:${row.id}`,
                duration: 6000,
                position: 'top-center',
              }
            );
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    void run();

    return () => {
      mounted = false;
      const ch = channelRef.current;
      if (ch) {
        try {
          ch.unsubscribe();
        } catch {
          /* ignore */
        }
        supabase.removeChannel(ch);
        channelRef.current = null;
      }
    };
  }, [router]);

  return <>{children}</>;
}

export default NotificationToastProvider;
