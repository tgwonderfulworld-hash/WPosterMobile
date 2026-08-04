/**
 * Runtime configuration sourced from EXPO_PUBLIC_* env vars (embedded at build
 * time by Expo). Only publishable values live here — never server secrets.
 */
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Surface misconfiguration loudly in development; in production the auth layer
  // will fail fast with a friendly error instead of silently misbehaving.
  const message =
    'Missing Supabase env vars. Copy .env.example to .env and set ' +
    'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.';
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn(`[WPoster:config] ${message}`);
  }
}

/** Base URL for the WPoster REST API. Defaults to Supabase Edge Functions. */
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  (SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : '');

export const config = {
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  apiBaseUrl: API_BASE_URL,
  /** Default request timeout (ms) for the REST/Axios layer. */
  requestTimeoutMs: 20_000,
} as const;

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
