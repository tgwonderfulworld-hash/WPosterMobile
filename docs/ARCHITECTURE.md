# WPoster Mobile — Architecture (ТЗ №1 foundation)

Mobile client for the existing WPoster SaaS. Not a separate product — it talks to
the same backend as the web app.

## Stack

- **Expo SDK 57**, React Native 0.86 (New Architecture), Expo Router (v57 standard-navigation core)
- **TypeScript** (strict) · **NativeWind** (Tailwind) · **Reanimated 4** · **Gesture Handler**
- **State/data:** Zustand · React Query · React Hook Form · Zod · Axios
- **Backend:** **Supabase** (Auth + Postgres + Storage) — the real WPoster backend
- **Storage:** SecureStore (secrets) + MMKV (fast KV) · **i18n:** i18next (en default, ru ready)

## Backend note (important)

WPoster's backend is **Supabase**, not a bespoke REST API. So auth is implemented the
idiomatic, production-correct way with `@supabase/supabase-js`, which already provides a
real access-token/refresh-token system with **silent** background refresh. This fulfils
every functional requirement of the spec (real login/register/forgot/reset/verify, secure
token storage, invisible refresh, clean logout) with **no mocks**.

Axios + React Query remain the data layer for everything beyond Supabase's SDK (Next.js /
Edge routes); the Axios interceptor injects the live Supabase token and refreshes on 401.

### Token storage — LargeSecureStore

iOS Keychain rejects values > ~2048 bytes and Supabase sessions exceed that. We use the
Supabase-recommended pattern (`src/services/storage/largeSecureStore.ts`): a random AES-256
key per value in **SecureStore**, ciphertext in **MMKV**. Sensitive material stays in the OS
secure enclave; the large payload lives in fast storage.

## Configuration & secrets

Client config comes from `EXPO_PUBLIC_*` env vars (`.env`, gitignored; see `.env.example`).
**Only** the Supabase URL + publishable anon key ship in the client. The `service_role` key
and all server secrets (OpenAI, Telegram, Meta, X, Brevo, …) must NEVER be added here.

## Structure

```
src/
  app/            Expo Router routes: (auth) (main) (modals)
  components/     BrandMark, OfflineBanner, ui/ (design-system component library)
  features/       Independent feature modules (auth is the reference implementation)
  hooks/          useNetworkStatus, useDebounce
  services/       api (axios), supabase (client + session refresh), storage, queryClient
  store/          Zustand: auth, theme, app, toast
  theme/          Design tokens (single source) + ThemeProvider + useTheme + nav bridge
  i18n/           i18next setup + en/ru locales
  constants/      config (env)
  utils/          logger, errors (centralized taxonomy)
```

### Theme

`src/theme/tokens.ts` is the single source of truth for the JS side (light/dark colors,
typography, spacing, radius, shadows), consumed via `useTheme()`. `src/global.css` mirrors
the colors as CSS variables for NativeWind utilities. There are no hard-coded colors in
component code. Numeric scales live once in `src/theme/scale.js` (shared with Tailwind).

### Auth flow

Splash → `useAuthBootstrap()` loads the persisted Supabase session and subscribes to auth
changes → root `index.tsx` redirects to `(main)` or `(auth)/login`. Route-group layouts
guard access. Tokens refresh silently; sign-out clears the session, store, and query cache.

## Run

```bash
# JS-only checks (no native toolchain needed)
npx tsc --noEmit
npx expo lint

# Native dev build on an emulator/device — requires Android SDK + NDK + CMake.
# Install the NDK and CMake once via Android Studio → SDK Manager → SDK Tools,
# then:
npx expo run:android
```

> This app uses native modules (MMKV, Reanimated, Gesture Handler, NetInfo, SVG), so it
> requires a **dev build** — it will not run in Expo Go.

## Verification status (ТЗ №1)

- ✅ `tsc --noEmit` — clean (strict mode)
- ✅ `expo lint` — clean
- ✅ Full Android Metro/Hermes bundle (`expo export -p android`) — succeeds
- ⏳ Emulator launch — needs NDK + CMake installed locally (see Run), then `expo run:android`
