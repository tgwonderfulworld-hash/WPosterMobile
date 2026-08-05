# WPoster Mobile — Architecture

Mobile client for the existing WPoster SaaS. **Not a separate product** — it is a
second client of the same platform as [WPoster Web](https://wposter.app), sharing
one backend, one auth system, one design system, one localization, one Platform
Registry, and one set of data models.

> **Single source of truth = WPoster Web** (`wonderful-os-v2`). Nothing is
> duplicated; when Web and Mobile diverge, Mobile is brought to Web's architecture.

## Stack

- **Expo SDK 57**, React Native 0.86 (New Architecture: Fabric + Bridgeless), Expo Router (v57 standard-navigation core)
- **TypeScript** (strict) · **NativeWind** (Tailwind) · **Reanimated 4** · **Gesture Handler** · **FlashList**
- **State/data:** Zustand · React Query · React Hook Form · Zod · Axios
- **Backend:** **Supabase** (Auth + Postgres + Storage) — the real WPoster backend
- **Storage:** SecureStore (secrets) + MMKV (fast KV)
- **i18n:** **use-intl** (next-intl's core) with the same message files as Web (en/ru/de/es/fr)

## Core principles

1. **Mirror Web, don't reinvent.** Design tokens, i18n keys, Platform Registry and
   data queries are ported from Web and kept in sync.
2. **No mocks.** All data comes from the live Supabase project via RLS-protected queries.
3. **No hard-coded strings or colors** in component code — everything flows through
   the theme (`useTheme`) and i18n (`t()`).
4. **Feature modules are independent** (`src/features/<name>`); `auth` and `workspace`
   are the reference implementations.

## Backend (Supabase)

WPoster's backend is **Supabase**, not a bespoke REST API. Auth uses
`@supabase/supabase-js`, which provides a real access/refresh-token system with
**silent** background refresh (login/register/forgot/reset/verify, secure storage,
invisible refresh, clean logout — no mocks). Axios + React Query are the data layer
for anything beyond the SDK (Next.js / Edge routes); the Axios interceptor injects
the live token and refreshes on 401. See [SUPABASE.md](SUPABASE.md).

### Token storage — LargeSecureStore

iOS Keychain rejects values > ~2048 bytes and Supabase sessions exceed that. We use
the Supabase-recommended pattern (`src/services/storage/largeSecureStore.ts`): a
random AES-256 key per value in **SecureStore**, ciphertext in **MMKV**.

## Configuration & secrets

Client config comes from `EXPO_PUBLIC_*` env vars (`.env`, gitignored; see
`.env.example`). **Only** the Supabase URL + publishable anon key ship in the
client. The `service_role` key and all server secrets must NEVER be added here.

## Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Routes | `src/app` | Expo Router screens — see [ROUTING.md](ROUTING.md) |
| UI kit | `src/components/ui` | Themed, reusable components |
| Platform UI | `src/components/platform` | Platform icons/badges (react-native-svg) |
| Features | `src/features/*` | `auth`, `workspace`, `dashboard` (api + hooks + components) |
| Registry | `src/lib/platforms` | Platform Registry (verbatim port of Web) |
| Services | `src/services` | supabase, api (axios), storage, queryClient |
| State | `src/store` | Zustand: auth, theme, app, toast |
| Theme | `src/theme` | Design tokens — see [THEME.md](THEME.md) |
| i18n | `src/i18n` | use-intl setup + messages — see [I18N.md](I18N.md) |
| Utils | `src/utils` | logger, centralized error taxonomy |

See [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) for the full tree.

## Auth & session flow

Native splash → `useAuthBootstrap()` loads the persisted Supabase session and
subscribes to auth changes → root `index.tsx` redirects to `(main)` or
`(auth)/login`. Route-group layouts guard access. Tokens refresh silently
(AppState-aware); sign-out clears the session, store, and React Query cache.

## Data flow (dashboard example)

`useActiveWorkspaceId()` resolves the active workspace (port of Web's resolver) →
`useWorkspaceStats() / useConnectedAccounts() / useUpcomingPosts()` query the real
Supabase tables → screens render with Skeleton / Error / offline states. Switching
workspace is an **optimistic** update that invalidates workspace-scoped queries and
prefetches the new workspace's data.

## Verification status

- ✅ TypeScript (strict) — clean
- ✅ ESLint — clean
- ✅ Expo Doctor — 20/20
- ✅ Metro/Hermes bundle — clean
- ✅ Native Android build (NDK 27, CMake 3.22.1, JDK 21) — **BUILD SUCCESSFUL**, runs on emulator (New Architecture), no red screen, no JS warnings
- ✅ i18n audit — all 5 languages complete, no missing/fallback keys
