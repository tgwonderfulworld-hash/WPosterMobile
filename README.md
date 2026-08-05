# WPoster Mobile

The official mobile client for **WPoster** — a second client of the existing
WPoster platform (not a separate product). It shares the same Supabase backend,
authentication, design system, localization, and Platform Registry as
[WPoster Web](https://wposter.app).

> Built with Expo SDK 57 · React Native 0.86 (New Architecture) · Expo Router ·
> TypeScript (strict) · Supabase · React Query · Zustand · NativeWind · use-intl.

---

## Requirements

The app uses native modules (MMKV, Reanimated, Gesture Handler, NetInfo, SVG,
BottomSheet, SecureStore), so it **requires a development build** — it does not
run in Expo Go.

| Tool | Version |
| --- | --- |
| Node.js | ≥ 20 (tested on 24) |
| JDK | **21** (Temurin/Adoptium) — required by the Android Gradle Plugin; JDK 24/25 break the CMake step |
| Android SDK Platform | **android-36** |
| Android Build-Tools | **36.0.0** |
| Android NDK | **27.1.12297006** (required by RN 0.86) |
| CMake | **3.22.1** |
| Gradle | 9.3.1 (via wrapper — auto-downloaded) |

Install the Android bits via **Android Studio → SDK Manager → SDK Tools**
(NDK Side-by-side + CMake) or:

```bash
sdkmanager "platforms;android-36" "build-tools;36.0.0" "ndk;27.1.12297006" "cmake;3.22.1"
```

Set environment variables (adjust paths):

```bash
export ANDROID_HOME="$HOME/AppData/Local/Android/Sdk"   # Windows: %LOCALAPPDATA%\Android\Sdk
export JAVA_HOME="/path/to/jdk-21"
```

---

## Getting started

```bash
# 1. Install JS dependencies
npm install

# 2. Configure the backend (see "Supabase" below)
cp .env.example .env
#   then fill EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY

# 3. Build & run the dev client on a connected device / emulator
npm run android          # = expo run:android  (first build compiles native C++, ~10 min)
```

Subsequent runs only need Metro (the native app is already installed):

```bash
npx expo start --dev-client       # start Metro, then press "a" for Android
```

---

## Supabase

WPoster's backend is **Supabase** (Auth + Postgres + Storage) — the **same
project** as the web app. The mobile client connects with `@supabase/supabase-js`
and a **LargeSecureStore** adapter (AES key in SecureStore, ciphertext in MMKV)
so tokens are never stored in plain text.

Only the **publishable** credentials go in the client, via `.env`
(`EXPO_PUBLIC_*`, embedded at build time):

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
```

**Never** put the `service_role` key or any server secret here. See
[docs/SUPABASE.md](docs/SUPABASE.md).

---

## Metro / development

```bash
npx expo start --dev-client            # start the bundler
npx expo start --dev-client --clear    # start with a cleared cache
```

On a physical device, forward the Metro port: `adb reverse tcp:8081 tcp:8081`.

---

## Android build

```bash
# Debug build + install on the running emulator/device
npm run android                    # expo run:android

# Debug APK only
npx expo prebuild --platform android
cd android && ./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

### Release build

```bash
# Recommended: EAS Build (cloud, handles signing)
npx eas build --platform android --profile production

# Local release APK/AAB (requires a keystore configured in android/)
cd android && ./gradlew assembleRelease   # or bundleRelease for an AAB
```

> Before release: replace the default bundle id `com.anonymous.WPosterMobile`
> with the production id and configure EAS + signing.

---

## Quality checks

```bash
npx tsc --noEmit                     # TypeScript (strict)
npx expo lint                        # ESLint
npx expo-doctor                      # environment / dependency validation
npx expo export --platform android   # verify the Metro/Hermes bundle
```

---

## Languages

Localization mirrors the web app: **use-intl** (next-intl's core) reading the
**same message files** with the same keys and namespaces. Supported: **English,
Русский, Deutsch, Español, Français**.

- On first launch the app detects the **device language**; if unsupported it
  falls back to English.
- Change the language in **Settings → Language**. It applies **immediately (no
  restart)** and is persisted.

See [docs/I18N.md](docs/I18N.md).

---

## Theme (Light / Dark)

Colors, spacing, radius, shadows, typography and gradients are synced 1:1 with
the web design system. Theme mode is **System / Light / Dark**, changed in
**Settings → Appearance**; the choice is persisted (MMKV). See
[docs/THEME.md](docs/THEME.md).

---

## Documentation

| Doc | Contents |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | High-level architecture, stack, principles |
| [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md) | Directory layout & conventions |
| [docs/THEME.md](docs/THEME.md) | Design tokens & theming |
| [docs/I18N.md](docs/I18N.md) | Localization architecture |
| [docs/SUPABASE.md](docs/SUPABASE.md) | Backend, auth, data access |
| [docs/ROUTING.md](docs/ROUTING.md) | Expo Router navigation map |

---

## Project status

ТЗ №1 (foundation) and ТЗ №2 (Web-infrastructure integration) are complete and
verified on Android. Release point: tag `v0.2.0-mobile-foundation`.
