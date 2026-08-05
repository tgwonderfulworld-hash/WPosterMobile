/**
 * Design tokens — the single source of truth for the JS/StyleSheet side of the
 * app (consumed via `useTheme()`). The CSS/NativeWind side mirrors these values
 * in `src/global.css`. Numeric scales (spacing/radius/font size) come from the
 * shared `scale.js` so there is exactly one source for those numbers.
 *
 * Colors are derived from the WPoster brand mark (a blue → indigo → violet
 * gradient). There are NO hard-coded colors anywhere else in the app — every
 * component reads from here.
 */
import { Platform, type TextStyle } from 'react-native';

import scale from './scale';

/** Semantic color roles. Same shape for light and dark so themes are swappable. */
export interface ThemeColors {
  /** Brand / primary interactive color. */
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  /** Foreground used on top of `primary` (e.g. button label). */
  primaryForeground: string;
  /** Low-emphasis primary background (tints, selected states). */
  primarySubtle: string;

  /** Secondary brand accent (violet). */
  accent: string;
  accentSubtle: string;

  /** App background (screens). */
  background: string;
  /** Slightly raised background (grouped sections, inputs). */
  surface: string;
  /** Card / elevated surface. */
  card: string;

  border: string;
  borderStrong: string;

  /** Primary text. */
  foreground: string;
  /** Secondary text. */
  muted: string;
  /** Tertiary / placeholder text and disabled icons. */
  subtle: string;
  /** Text/icon on inverted (dark-on-light or light-on-dark) surfaces. */
  inverse: string;

  success: string;
  successSubtle: string;
  warning: string;
  warningSubtle: string;
  danger: string;
  dangerSubtle: string;
  info: string;
  infoSubtle: string;

  /** Scrim behind modals / bottom sheets. */
  overlay: string;
}

// ── Values mirror WPoster Web's design tokens (src/app/globals.css). Web is
// dark-first; `--app-*` variables map onto these semantic roles 1:1 so Mobile
// and Web render the same palette. Do not diverge — sync any change from Web.

// Light theme = Web `[data-theme-app=light]`.
const light: ThemeColors = {
  primary: '#3B82F6',
  primaryHover: '#2563EB',
  primaryPressed: '#1D4ED8',
  primaryForeground: '#FFFFFF',
  primarySubtle: 'rgba(59, 130, 246, 0.10)',
  accent: '#7C3AED',
  accentSubtle: 'rgba(124, 58, 237, 0.10)',

  background: '#E4EBF5', // --app-bg
  surface: '#F0F4FF', // --app-surface-ink (raised sections / inputs)
  card: '#FFFFFF', // --app-surface
  border: 'rgba(59, 130, 246, 0.16)', // --app-border
  borderStrong: 'rgba(59, 130, 246, 0.28)',
  foreground: '#0F172A', // --app-text-primary
  muted: '#475569', // --app-text-secondary
  subtle: '#64748B', // --app-text-muted
  inverse: '#0B0F19',

  success: '#22C55E', // --app-ok
  successSubtle: 'rgba(34, 197, 94, 0.12)',
  warning: '#F59E0B', // --app-warn
  warningSubtle: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444', // --app-err
  dangerSubtle: 'rgba(239, 68, 68, 0.10)',
  info: '#3B82F6',
  infoSubtle: 'rgba(59, 130, 246, 0.08)',

  overlay: 'rgba(15, 23, 42, 0.45)',
};

// Dark theme = Web `:root` (default).
const dark: ThemeColors = {
  primary: '#3B82F6', // --app-primary / --app-accent
  primaryHover: '#60A5FA',
  primaryPressed: '#2563EB',
  primaryForeground: '#FFFFFF',
  primarySubtle: 'rgba(59, 130, 246, 0.12)', // --app-accent-bg
  accent: '#7C3AED',
  accentSubtle: 'rgba(124, 58, 237, 0.16)',

  background: '#0B0F19', // --app-bg
  surface: '#1A2130', // raised (approx --app-surface-raised over --app-surface)
  card: '#111827', // --app-surface
  border: 'rgba(255, 255, 255, 0.08)', // --app-border
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  foreground: '#FFFFFF', // --app-text-primary
  muted: 'rgba(255, 255, 255, 0.60)', // --app-text-secondary
  subtle: 'rgba(255, 255, 255, 0.38)', // --app-text-muted
  inverse: '#FFFFFF',

  success: '#22C55E',
  successSubtle: 'rgba(34, 197, 94, 0.14)',
  warning: '#F59E0B',
  warningSubtle: 'rgba(245, 158, 11, 0.14)',
  danger: '#EF4444',
  dangerSubtle: 'rgba(239, 68, 68, 0.14)',
  info: '#3B82F6',
  infoSubtle: 'rgba(59, 130, 246, 0.12)',

  overlay: 'rgba(3, 7, 18, 0.70)',
};

/** Brand gradient (Web `--grad`): blue → indigo → violet, 135deg. */
export const gradients = {
  brand: ['#3B82F6', '#4F46E5', '#7C3AED'] as const,
  brandSubtle: ['rgba(59,130,246,0.12)', 'rgba(124,58,237,0.12)'] as const,
};

export const spacing = scale.spacing;
export const radius = scale.radius;
export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;

/** Typography scale. `weight` values are RN-compatible strings. */
export type TypographyVariant =
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'button'
  | 'small';

export const typography: Record<
  TypographyVariant,
  Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'>
> = {
  heading: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  subtitle: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  button: { fontSize: 15, lineHeight: 20, fontWeight: '600' },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
};

export const fontFamily = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace', rounded: 'ui-rounded' },
  default: { sans: 'normal', mono: 'monospace', rounded: 'normal' },
  web: { sans: 'var(--font-display)', mono: 'var(--font-mono)', rounded: 'var(--font-rounded)' },
})!;

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  gradients: typeof gradients;
  fontFamily: typeof fontFamily;
  /** Elevation presets (RN shadow + Android elevation). */
  shadows: ReturnType<typeof buildShadows>;
}

/** Shadows depend on scheme (softer / darker in dark mode). */
function buildShadows(scheme: ColorScheme) {
  const shadowColor = scheme === 'dark' ? '#000000' : '#101828';
  const make = (elevation: number, opacity: number, radiusPx: number, y: number) => ({
    shadowColor,
    shadowOffset: { width: 0, height: y },
    shadowOpacity: opacity,
    shadowRadius: radiusPx,
    elevation,
  });
  return {
    none: { shadowColor: 'transparent', shadowOpacity: 0, elevation: 0 },
    sm: make(2, scheme === 'dark' ? 0.4 : 0.06, 4, 1),
    md: make(6, scheme === 'dark' ? 0.5 : 0.1, 12, 4),
    lg: make(12, scheme === 'dark' ? 0.6 : 0.14, 24, 10),
  } as const;
}

export const palette = { light, dark } as const;

export function createTheme(scheme: ColorScheme): Theme {
  return {
    scheme,
    colors: palette[scheme],
    spacing,
    radius,
    typography,
    gradients,
    fontFamily,
    shadows: buildShadows(scheme),
  };
}

export const themes = {
  light: createTheme('light'),
  dark: createTheme('dark'),
} as const;
