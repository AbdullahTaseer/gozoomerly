'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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

      const topic = `notification-toast:${user.id}:${
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
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
                <button
                  type="button"
                  className="max-w-sm w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    toast.dismiss(t.id);
                    if (href) router.push(href);
                  }}
                >
                  <p className="font-semibold text-gray-900 text-sm leading-snug">
                    {title}
                  </p>
                  {body ? (
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {body}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs font-medium text-pink-600">
                    Tap to open
                  </p>
                </button>
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
