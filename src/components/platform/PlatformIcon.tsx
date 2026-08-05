/**
 * Platform icons — the exact SVG paths from WPoster Web's
 * `src/components/shared/platform-icon.tsx`, rendered with react-native-svg.
 * No new artwork: same viewBox (0 0 24 24), same stroke geometry. Colors come
 * from the mobile tint map (parity with the Web registry's per-platform colour).
 */
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { normalizePlatformId, type PlatformSlug } from '@/lib/platforms/registry';
import { useTheme } from '@/theme';

/** Per-platform tint (icon color + soft container bg), matching Web's registry intent. */
const TINT: Record<PlatformSlug, { color: string; bg: string }> = {
  telegram: { color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)' },
  facebook: { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)' },
  instagram: { color: '#F472B6', bg: 'rgba(244, 114, 182, 0.12)' },
  threads: { color: '#A3A3A3', bg: 'rgba(163, 163, 163, 0.14)' },
  bluesky: { color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.12)' },
  tumblr: { color: '#818CF8', bg: 'rgba(129, 140, 248, 0.12)' },
  x: { color: '#E5E7EB', bg: 'rgba(229, 231, 235, 0.10)' },
  wordpress: { color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.12)' },
};

/** Tint for a platform. `x` follows the theme foreground (it's monochrome). */
export function usePlatformTint(platform: string): { color: string; bg: string } {
  const theme = useTheme();
  const slug = normalizePlatformId(platform);
  if (!slug) return { color: theme.colors.primary, bg: theme.colors.primarySubtle };
  if (slug === 'x') return { color: theme.colors.foreground, bg: theme.colors.surface };
  return TINT[slug];
}

export interface PlatformIconProps {
  platform: string;
  size?: number;
  color?: string;
}

export function PlatformIcon({ platform, size = 20, color }: PlatformIconProps) {
  const theme = useTheme();
  const slug = normalizePlatformId(platform);
  const stroke = color ?? (slug && slug !== 'x' ? TINT[slug].color : theme.colors.foreground);
  const s = {
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  const common = { width: size, height: size, viewBox: '0 0 24 24' };

  switch (slug) {
    case 'telegram':
      return (
        <Svg {...common}>
          <Path d="m22 2-7 20-4-9-9-4 20-7Z" {...s} />
          <Path d="M22 2 11 13" {...s} />
        </Svg>
      );
    case 'instagram':
      return (
        <Svg {...common}>
          <Rect x="2" y="2" width="20" height="20" rx="5" {...s} />
          <Circle cx="12" cy="12" r="4" {...s} />
          <Circle cx="17.5" cy="6.5" r="0.9" fill={stroke} />
        </Svg>
      );
    case 'facebook':
      return (
        <Svg {...common}>
          <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" {...s} />
        </Svg>
      );
    case 'threads':
      return (
        <Svg {...common}>
          <Path d="M19 8c-1.5-3.5-5-5.5-9-4.5C5.5 4.5 3 8 3 12s2.5 7.5 7 8.5c4.5 1 8-1 9.5-4.5" {...s} />
          <Circle cx="12" cy="12" r="3" {...s} />
          <Path d="M19 12c0 3.5-2.5 7-7 7" {...s} />
        </Svg>
      );
    case 'bluesky':
      return (
        <Svg {...common}>
          <Path d="M12 3.5C10.5 6.5 7 10.5 4 11.5c3 1 6 4 8 9 2-5 5-8 8-9-3-1-6.5-5-8-8z" {...s} />
        </Svg>
      );
    case 'x':
      return (
        <Svg {...common}>
          <Path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835-8.162-10.666h5.12l4.263 5.633L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
            fill={stroke}
          />
        </Svg>
      );
    case 'tumblr':
      return (
        <Svg {...common}>
          <Path d="M10 3v6H6v4h4v8h4v-8h4v-4h-4V5" {...s} />
        </Svg>
      );
    case 'wordpress':
      return (
        <Svg {...common}>
          <Circle cx="12" cy="12" r="10" {...s} />
          <Path d="M2 12h4m12 0h4M12 2v4m0 12v4" {...s} />
        </Svg>
      );
    default:
      return null;
  }
}
