/**
 * Subscribes to connectivity and (a) mirrors it into the app store for the
 * OfflineBanner and (b) drives React Query's onlineManager so queries/mutations
 * pause offline and auto-resume when the connection returns.
 */
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAppStore } from '@/store';

export function useNetworkStatus(): void {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected) && state.isInternetReachable !== false;
      useAppStore.getState().setOnline(online);
      onlineManager.setOnline(online);
    });
    return unsubscribe;
  }, []);
}
