import { useContext } from 'react';

import { ThemeContext } from './ThemeProvider';
import type { Theme } from './tokens';

/** Access the active theme tokens. Must be used under <ThemeProvider>. */
export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx.theme;
}

/** Access theme mode controls (for a theme switcher in Settings). */
export function useThemeControls() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeControls must be used within <ThemeProvider>');
  const { mode, setMode, scheme } = ctx;
  return { mode, setMode, scheme };
}
