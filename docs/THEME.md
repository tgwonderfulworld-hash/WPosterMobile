# Theme & Design System

The mobile design system is synced **1:1 with WPoster Web** (`src/app/globals.css`,
the `--app-*` variables). Web is dark-first; the same semantic roles map onto the
mobile tokens.

## Sources of truth

| File | Role |
| --- | --- |
| `src/theme/tokens.ts` | **Single source of truth** for the JS side (colors, typography, spacing, radius, shadows, gradients) — consumed via `useTheme()` |
| `src/theme/scale.js` | Raw numeric scales (spacing/radius/fontSize) shared with Tailwind — imported by both `tokens.ts` and `tailwind.config.js` |
| `src/global.css` | CSS-variable mirror for NativeWind utilities (light + dark) |

There are **no hard-coded colors** in component code — everything reads from `useTheme()`.

## Colors (from Web)

| Role | Light | Dark |
| --- | --- | --- |
| primary | `#3B82F6` | `#3B82F6` |
| background | `#E4EBF5` | `#0B0F19` |
| surface (raised) | `#F0F4FF` | `#1A2130` |
| card | `#FFFFFF` | `#111827` |
| foreground | `#0F172A` | `#FFFFFF` |
| muted | `#475569` | `rgba(255,255,255,.6)` |
| success / warning / danger | `#22C55E` / `#F59E0B` / `#EF4444` | same |

**Brand gradient** (`--grad`): `#3B82F6 → #4F46E5 → #7C3AED`.

**Radius:** small 8 · medium 12 · large 16 · xl 24 · pill (matches Web `--radius-sm` 12 / `--radius` 24).

## Using the theme

```tsx
import { useTheme } from '@/theme';

function Example() {
  const theme = useTheme();
  return <View style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.large }} />;
}
```

Typography: `<Text variant="heading|title|subtitle|body|caption|button" color="foreground|muted|...">`.

## Light / Dark switching

- `ThemeProvider` (`src/theme/ThemeProvider.tsx`) resolves the active scheme from the
  persisted **mode** (`system` | `light` | `dark`) + the OS color scheme, and keeps
  NativeWind's color scheme in sync.
- Mode is stored in **`themeStore`** (Zustand + MMKV `persist`) → **persisted across restarts**.
- Change it in **Settings → Appearance** (`useThemeControls().setMode(...)`).
- The navigation bar/header theme is bridged via `toNavigationTheme(theme)`.

## Adding/adjusting a token

1. Edit `src/theme/tokens.ts` (JS side).
2. Mirror the value in `src/global.css` (CSS-variable side) so NativeWind utilities match.
3. Numeric scales (spacing/radius/font size) → edit `src/theme/scale.js` only (shared).
