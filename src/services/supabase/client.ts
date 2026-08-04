/**
 * Supabase client — the real WPoster backend (Auth + Postgres + Storage).
 *
 * Session persistence uses LargeSecureStore (AES key in SecureStore, ciphertext
 * in MMKV). `autoRefreshToken` makes token refresh happen silently in the
 * background; combined with the AppState wiring in `authListener.ts`, refresh is
 * paused while the app is backgrounded and resumed on foreground. There are no
 * mocks — every auth call hits the live project.
 */
import 'react-native-url-polyfill/auto';

import { createClient, processLock } from '@supabase/supabase-js';

import { config } from '@/constants/config';
import { largeSecureStore } from '@/services/storage';

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: largeSecureStore,
    // Persist and silently refresh the session so the user never sees a re-login
    // caused by an expired access token.
    autoRefreshToken: true,
    persistSession: true,
    // Mobile has no URL to parse a session from (that's a web OAuth concern).
    detectSessionInUrl: false,
    // Serialize concurrent refreshes across the app.
    lock: processLock,
  },
});
