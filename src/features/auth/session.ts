/**
 * Session manager. On startup it (1) loads any persisted Supabase session into
 * the auth store and (2) subscribes to auth-state changes so the UI always
 * reflects the real session — including silent token refreshes and sign-out.
 */
import { useEffect, useState } from 'react';

import { registerAuthRefresh, supabase } from '@/services/supabase';
import { queryClient } from '@/services/queryClient';
import { useAuthStore } from '@/store';
import { logger } from '@/utils/logger';

let started = false;

/** Idempotently wire the auth listener + lifecycle refresh. Returns cleanup. */
export function initAuthSession(): () => void {
  const setSession = useAuthStore.getState().setSession;

  const stopRefresh = registerAuthRefresh();

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    logger.debug('auth', 'state change', event);
    setSession(session);
    // On sign-out, drop any cached server state so nothing leaks between users.
    if (event === 'SIGNED_OUT') queryClient.clear();
  });

  return () => {
    data.subscription.unsubscribe();
    stopRefresh();
  };
}

/**
 * Boots the session once and reports when the initial check is done (used to
 * keep the splash screen up until we know whether the user is signed in).
 */
export function useAuthBootstrap(): { ready: boolean } {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const cleanup = started ? () => {} : initAuthSession();
    started = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        useAuthStore.getState().setSession(data.session);
      })
      .catch((error) => {
        logger.error('auth.bootstrap', error);
        if (mounted) useAuthStore.getState().markUnauthenticated();
      })
      .finally(() => {
        if (mounted) setReady(true);
      });

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  return { ready };
}
