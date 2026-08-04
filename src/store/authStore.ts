/**
 * Reactive mirror of the Supabase auth session for the UI. The source of truth
 * is Supabase (it owns/persists/refreshes tokens); this store is hydrated from
 * `supabase.auth` on boot and kept in sync by the auth state listener. It is NOT
 * persisted here — tokens never live in plain storage.
 */
import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  /** Apply a session (or null) and derive status + user from it. */
  setSession: (session: Session | null) => void;
  /** Mark the initial session check as finished with no session. */
  markUnauthenticated: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  session: null,
  user: null,
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      status: session ? 'authenticated' : 'unauthenticated',
    }),
  markUnauthenticated: () => set({ status: 'unauthenticated', session: null, user: null }),
  reset: () => set({ status: 'unauthenticated', session: null, user: null }),
}));
