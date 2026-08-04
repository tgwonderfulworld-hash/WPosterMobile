/**
 * Drives Supabase auto-refresh from the app lifecycle: refresh runs while the
 * app is foregrounded and pauses when backgrounded (saving battery / avoiding
 * needless network). Call `registerAuthRefresh()` once at startup.
 */
import { AppState, type AppStateStatus } from 'react-native';

import { supabase } from './client';

let subscribed = false;

export function registerAuthRefresh(): () => void {
  if (subscribed) return () => {};
  subscribed = true;

  const handle = (state: AppStateStatus) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  };

  // Start immediately if we're already active.
  if (AppState.currentState === 'active') supabase.auth.startAutoRefresh();

  const sub = AppState.addEventListener('change', handle);
  return () => {
    sub.remove();
    subscribed = false;
  };
}
