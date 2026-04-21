'use client';

import { useEffect, useRef } from 'react';
import { AuthService } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/client';


type OneSignalLike = {
  init?: (opts: Record<string, unknown>) => Promise<void>;
  login?: (externalId: string) => Promise<void>;
  logout?: () => Promise<void>;
};

declare global {
  interface Window {
    OneSignal?: OneSignalLike;
    OneSignalDeferred?: Array<(os: OneSignalLike) => void>;
    __oneSignalInitPromise?: Promise<OneSignalLike>;
  }
}

const DEFAULT_APP_ID = '9f0dbde1-7405-4216-92fa-4548b752486d';
const DEFAULT_SAFARI_WEB_ID =
  'web.onesignal.auto.212e621b-efc2-4b2a-9d36-9f4cd158ecec';


function getOneSignalReady(): Promise<OneSignalLike> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('SSR'));
  }
  if (window.__oneSignalInitPromise) return window.__oneSignalInitPromise;

  const appId =
    process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID?.trim() || DEFAULT_APP_ID;
  const safariWebId =
    process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID?.trim() ||
    DEFAULT_SAFARI_WEB_ID;

  const promise = new Promise<OneSignalLike>((resolve, reject) => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.init?.({
          appId,
          safari_web_id: safariWebId,
          notifyButton: { enable: true },
          allowLocalhostAsSecureOrigin: true,
        });
        resolve(OneSignal);
      } catch (err) {
        // Common in dev: OneSignal app is locked to the production origin
        // (e.g. "Can only be used on: https://gozoomerly.com"). Log once
        // without scaring the console and reject so callers short-circuit.
        const msg = err instanceof Error ? err.message : String(err);
        const isOriginLock = /Can only be used on:/i.test(msg);
        if (isOriginLock && process.env.NODE_ENV !== 'production') {
          console.info(
            '[OneSignal] disabled on this origin (dashboard is locked to the production URL). ' +
              'Enable "Local Testing" in OneSignal Web Configuration to test on localhost.'
          );
        } else {
          console.warn('[OneSignal] init failed:', err);
        }
        reject(err);
      }
    });
  });

  window.__oneSignalInitPromise = promise;
  return promise;
}

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  const currentExternalId = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    getOneSignalReady().catch(() => {
      /* already logged */
    });

    const auth = new AuthService();
    const supabase = createClient();

    const syncExternalId = async (userId: string | null) => {
      let OneSignal: OneSignalLike;
      try {
        OneSignal = await getOneSignalReady();
      } catch {
        return;
      }

      try {
        if (userId && userId !== currentExternalId.current) {
          await OneSignal.login?.(userId);
          currentExternalId.current = userId;
        } else if (!userId && currentExternalId.current) {
          await OneSignal.logout?.();
          currentExternalId.current = null;
        }
      } catch (err) {
        console.warn('[OneSignal] login/logout failed:', err);
      }
    };

    (async () => {
      const user = await auth.getUser();
      syncExternalId(user?.id ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      syncExternalId(session?.user?.id ?? null);
    });

    return () => {
      try {
        sub.subscription.unsubscribe();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return <>{children}</>;
}

export default OneSignalProvider;
