/**
 * Global non-auth app state: language, notification preferences, and live
 * network status. Language + notifications are persisted; `isOnline` is runtime.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandMmkvStorage } from '@/services/storage';

export type Language = 'en' | 'ru';

interface AppState {
  language: Language;
  notificationsEnabled: boolean;
  /** Live connectivity (updated by the NetInfo listener). Not persisted. */
  isOnline: boolean;
  setLanguage: (language: Language) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setOnline: (isOnline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      notificationsEnabled: true,
      isOnline: true,
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setOnline: (isOnline) => set({ isOnline }),
    }),
    {
      name: 'wposter.app',
      storage: createJSONStorage(() => zustandMmkvStorage),
      // Never persist runtime connectivity.
      partialize: ({ language, notificationsEnabled }) => ({ language, notificationsEnabled }),
    },
  ),
);
