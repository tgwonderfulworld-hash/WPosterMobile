/**
 * Global non-auth app state: language, notification preferences, and live
 * network status. Language + notifications are persisted; `isOnline` is runtime.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CalendarViewMode } from '@/features/calendar/dates';
import { zustandMmkvStorage } from '@/services/storage';

/** Supported languages — mirrors WPoster Web (src/i18n/routing.ts). */
export type Language = 'en' | 'ru' | 'de' | 'es' | 'fr';

interface AppState {
  /** null until the user picks one → first launch follows the device language. */
  language: Language | null;
  notificationsEnabled: boolean;
  /** Live connectivity (updated by the NetInfo listener). Not persisted. */
  isOnline: boolean;
  /** Calendar Month/Week/Day preference (ТЗ №4 §1) — persisted like other app prefs. */
  calendarView: CalendarViewMode;
  setLanguage: (language: Language) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setOnline: (isOnline: boolean) => void;
  setCalendarView: (view: CalendarViewMode) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: null,
      notificationsEnabled: true,
      isOnline: true,
      calendarView: 'month',
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setOnline: (isOnline) => set({ isOnline }),
      setCalendarView: (calendarView) => set({ calendarView }),
    }),
    {
      name: 'wposter.app',
      storage: createJSONStorage(() => zustandMmkvStorage),
      // Never persist runtime connectivity.
      partialize: ({ language, notificationsEnabled, calendarView }) => ({
        language,
        notificationsEnabled,
        calendarView,
      }),
    },
  ),
);
