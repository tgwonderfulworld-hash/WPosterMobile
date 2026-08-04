/**
 * Bridges our design tokens into the navigation Theme used by Expo Router (v57's
 * standard-navigation core, re-exported from `expo-router`) so native headers,
 * backgrounds and default text colors match the app theme.
 */
import { DarkTheme, DefaultTheme } from 'expo-router';

import type { Theme } from './tokens';

export function toNavigationTheme(theme: Theme): typeof DefaultTheme {
  const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: theme.scheme === 'dark',
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.foreground,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
  };
}
