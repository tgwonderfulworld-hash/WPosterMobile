/**
 * Resolves the active theme from the persisted preference + OS scheme, keeps
 * NativeWind's color scheme in sync (so utility classes' `dark:` variants work),
 * and exposes the token `Theme` via context. This is the single place the app
 * decides light vs dark.
 */
import { colorScheme as nativewindColorScheme } from 'nativewind';
import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { useThemeStore, type ThemeMode } from '@/store';

import { createTheme, type ColorScheme, type Theme } from './tokens';

interface ThemeContextValue {
  theme: Theme;
  scheme: ColorScheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(mode: ThemeMode, system: ColorScheme): ColorScheme {
  return mode === 'system' ? system : mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = (useColorScheme() ?? 'light') as ColorScheme;
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const scheme = resolveScheme(mode, systemScheme);

  // Keep NativeWind (utility classes) aligned with our resolved scheme.
  useEffect(() => {
    nativewindColorScheme.set(mode);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: createTheme(scheme), scheme, mode, setMode }),
    [scheme, mode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
