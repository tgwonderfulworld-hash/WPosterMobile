# Supabase (Backend, Auth, Data)

WPoster's backend is **Supabase** (Auth + Postgres + Storage), the **same project**
as WPoster Web. The mobile app is a second client of that project — no new backend,
no new database, no new auth system, no mocks.

## Configuration

Client config comes from `EXPO_PUBLIC_*` env vars in `.env` (gitignored), embedded
at build time:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx     # publishable/anon key ONLY
EXPO_PUBLIC_API_BASE_URL=                            # optional; defaults to <url>/functions/v1
```

> **Security:** only the publishable anon key ships in the client (protected by RLS).
> The `service_role` key and every server secret (OpenAI, Telegram, Meta, X, Brevo,
> OAuth, …) must **never** be added to the mobile app.

## Client

`src/services/supabase/client.ts` creates the client with:

- **storage:** `LargeSecureStore` — AES-256 key in **SecureStore**, ciphertext in
  **MMKV** (dodges iOS Keychain's ~2 KB limit; tokens never in plain text).
- `autoRefreshToken: true`, `persistSession: true`, `detectSessionInUrl: false`,
  `lock: processLock`.

`src/services/supabase/authListener.ts` starts/stops auto-refresh with the app
lifecycle (AppState).

## Auth

`@supabase/supabase-js` provides the real access/refresh-token flow. Feature code in
`src/features/auth`:

| Function | Supabase call |
| --- | --- |
| Sign in | `signInWithPassword` |
| Register | `signUp` (emailRedirectTo deep link) |
| Forgot password | `resetPasswordForEmail` |
| Update password | `updateUser` |
| Resend verification | `resend({ type: 'signup' })` |
| Sign out | `signOut` (clears session + React Query cache) |

Session bootstrap/restore: `useAuthBootstrap()` loads the persisted session on
launch and subscribes to `onAuthStateChange`, mirroring it into `authStore`.

## Data access

Reads issue the **same Supabase queries the Web app uses** (same tables, columns,
RLS) via the shared client — see `src/features/workspace/api.ts`:

| Table | Used for |
| --- | --- |
| `profiles` | user profile, `active_workspace_id` |
| `workspaces`, `workspace_members` | workspace list + active-workspace resolution |
| `connected_accounts` | connected social accounts |
| `posts` | dashboard KPIs (scheduled/draft/published/failed/today) + upcoming posts |

The active-workspace resolver is a faithful port of Web's
`getDefaultWorkspaceForUser` (profiles.active_workspace_id → membership → owned).

## REST / Edge (Axios)

`src/services/api/client.ts` is an Axios instance for anything beyond the SDK
(Next.js routes / Edge Functions). Its interceptor injects the live access token +
anon apikey and, on a 401, transparently refreshes the Supabase session once and
retries. All errors normalize through `toAppError` (`src/utils/errors.ts`).
