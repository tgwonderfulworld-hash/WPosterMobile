# Routing (Expo Router)

Navigation uses **Expo Router v57** (file-based, on the standard-navigation core).
Primitives (`Stack`, `Redirect`, `Link`, themes) come from `expo-router`; tabs from
`expo-router/js-tabs`.

## Route map

```
src/app/
├── _layout.tsx          Root: providers (GestureHandler, SafeArea, QueryClient,
│                        Theme, Intl) + splash gate + session bootstrap.
│                        Stack: (auth) · (main) · (modals[modal])
├── index.tsx            "/"  → Redirect to (main)/dashboard or (auth)/login by session
│
├── (auth)/              Unauthenticated group — guard redirects to app if signed in
│   ├── _layout.tsx      Stack (slide animation) + auth guard
│   ├── login.tsx            /login
│   ├── register.tsx         /register
│   ├── forgot-password.tsx  /forgot-password
│   ├── reset-password.tsx   /reset-password       (deep-link target)
│   └── verify-email.tsx     /verify-email         (deep-link target)
│
├── (main)/              Authenticated group — guard redirects to /login if not signed in
│   ├── _layout.tsx      Tabs + auth guard
│   ├── dashboard.tsx        tab · /(main)/dashboard
│   ├── calendar.tsx         tab · /(main)/calendar
│   ├── analytics.tsx        tab · /(main)/analytics
│   ├── profile.tsx          tab · /(main)/profile
│   ├── settings.tsx         hidden (href:null) · /(main)/settings
│   └── connected-accounts.tsx  hidden (href:null) · /(main)/connected-accounts
│
└── (modals)/            Modal presentation group
    ├── _layout.tsx      Stack (presentation: 'modal')
    └── example.tsx      placeholder modal
```

## Guards & session

- **Root** (`_layout.tsx`): keeps the native splash up until `useAuthBootstrap()`
  resolves the session, then renders the navigator. `index.tsx` redirects by
  `authStore.status`.
- **(auth)/_layout.tsx**: if `status === 'authenticated'` → `Redirect` to the app.
- **(main)/_layout.tsx**: if not authenticated → `Redirect` to `/(auth)/login`;
  while `loading` → render nothing (splash covers).

## Tabs

`(main)` is a `Tabs` navigator (from `expo-router/js-tabs`) with 4 visible tabs
(Dashboard, Calendar, Analytics, Profile) using Ionicons + theme tint. `settings`
and `connected-accounts` are registered with `href: null` (reachable via
`router.push`, not shown as tabs).

## Deep links

Scheme: `wpostermobile://`. Email flows redirect back to `/verify-email` and
`/reset-password` (via `expo-linking` `createURL`).

## Navigating in code

```ts
import { router } from 'expo-router';
router.push('/register');
router.push('/(main)/connected-accounts');
router.replace('/login');
```
