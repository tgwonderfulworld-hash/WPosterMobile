/**
 * Global non-auth app state: language, notification preferences, and live
 * network status. Language + notifications are persisted; `isOnline` is runtime.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandMmkvStorage } from '@/services/storage';

/** Supported languages — mirrors WPoster Web (src/i18n/routing.ts). */
export type Language = 'en' | 'ru' | 'de' | 'es' | 'fr';

interface AppState {
  /** null until the user picks one → first launch follows the device language. */
  language: Language | null;
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
      language: null,
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
