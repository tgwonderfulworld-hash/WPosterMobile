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

const light: ThemeColors = {
  primary: '#2F6BF6',
  primaryHover: '#2559D8',
  primaryPressed: '#1E49B8',
  primaryForeground: '#FFFFFF',
  primarySubtle: '#EAF0FE',
  accent: '#7C3AED',
  accentSubtle: '#F1EAFE',

  background: '#FFFFFF',
  surface: '#F5F7FA',
  card: '#FFFFFF',
  border: '#E4E7EC',
  borderStrong: '#D0D5DD',
  foreground: '#101828',
  muted: '#475467',
  subtle: '#98A2B3',
  inverse: '#FFFFFF',

  success: '#16A34A',
  successSubtle: '#E7F6EC',
  warning: '#D97706',
  warningSubtle: '#FDF1E3',
  danger: '#DC2626',
  dangerSubtle: '#FDECEC',
  info: '#2F6BF6',
  infoSubtle: '#EAF0FE',

  overlay: 'rgba(16, 24, 40, 0.55)',
};

const dark: ThemeColors = {
  primary: '#4F7DF3',
  primaryHover: '#6B93F6',
  primaryPressed: '#3E68D8',
  primaryForeground: '#FFFFFF',
  primarySubtle: '#17213A',
  accent: '#9B6BF0',
  accentSubtle: '#241B3A',

  background: '#0B0E14',
  surface: '#12151D',
  card: '#171A22',
  border: '#262A34',
  borderStrong: '#363B47',
  foreground: '#F2F4F7',
  muted: '#98A2B3',
  subtle: '#667085',
  inverse: '#0B0E14',

  success: '#34D399',
  successSubtle: '#12271E',
  warning: '#FBBF24',
  warningSubtle: '#2A2213',
  danger: '#F87171',
  dangerSubtle: '#2C1717',
  info: '#60A5FA',
  infoSubtle: '#14243A',

  overlay: 'rgba(0, 0, 0, 0.65)',
};

/** Brand gradient stops (blue → indigo → violet) for splash/hero surfaces. */
export const gradients = {
  brand: ['#2F6BF6', '#5B4BE8', '#7C3AED'] as const,
  brandSubtle: ['#EAF0FE', '#F1EAFE'] as const,
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
