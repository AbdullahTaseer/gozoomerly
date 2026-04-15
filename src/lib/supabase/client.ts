import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * When env vars are missing (e.g. Vercel project without NEXT_PUBLIC_* set yet),
 * Next.js can still prerender client layouts. A hard throw here breaks `next build`.
 * We return a throwaway client so the bundle loads; API calls will fail until env is configured.
 */
const FALLBACK_URL = "https://example.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

let configuredClient: SupabaseClient | undefined;
let fallbackClient: SupabaseClient | undefined;
let warnedMissingEnv = false;

export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (url && key) {
    if (!configuredClient) {
      configuredClient = createBrowserClient(url, key);
    }
    return configuredClient;
  }

  if (!warnedMissingEnv) {
    warnedMissingEnv = true;
    console.warn(
      "[zoomerly] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set. " +
        "Using a placeholder Supabase client so builds/prerender do not crash. " +
        "Add both variables in Vercel → Project → Settings → Environment Variables (Production, Preview, Development)."
    );
  }

  if (!fallbackClient) {
    fallbackClient = createBrowserClient(FALLBACK_URL, FALLBACK_ANON_KEY);
  }
  return fallbackClient;
}

export function isSupabaseBrowserConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  );
}
