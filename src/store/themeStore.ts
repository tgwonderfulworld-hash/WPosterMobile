/** Persisted theme preference. `system` follows the OS; light/dark force it. */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandMmkvStorage } from '@/services/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'wposter.theme',
      storage: createJSONStorage(() => zustandMmkvStorage),
    },
  ),
);
