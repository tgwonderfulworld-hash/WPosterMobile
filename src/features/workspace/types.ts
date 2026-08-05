/**
 * Data models — mirror WPoster Web's types (src/lib/workspaces/types.ts,
 * connected-accounts/queries.ts, profiles/queries.ts). Same tables, same shapes.
 * Mobile never defines an alternative model.
 */
export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'author' | 'viewer';

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  color: string;
  logo_url: string | null;
  owner_user_id: string;
  default_language: string;
  default_timezone: string;
  /** Joined from workspace_members for the current user. */
  my_role?: WorkspaceRole;
}

/**
 * Dashboard KPI counts. `scheduled`/`published`/`draft`/`failed` are all-time
 * counts by `publish_status` (mirrors Web's `getDashboardV2Data` in
 * src/lib/analytics/dashboard-queries.ts). `postsToday`/`postsThisWeek`/
 * `postsThisMonth` are NOT a 1:1 port — Web only has `draftsToday` (drafts
 * created today) and `publishedThisWeek` (published, updated in last 7 days),
 * no "this month" concept at all. These three count ALL posts by `created_at`
 * window (any status), using the exact same table/columns/count-query shape
 * Web already uses for its own time-windowed counts, just generalized to
 * satisfy "Posts Today / This Week / This Month" as distinct volume metrics
 * from the 4 status KPIs above.
 */
export interface WorkspaceStats {
  scheduled: number;
  published: number;
  draft: number;
  failed: number;
  postsToday: number;
  postsThisWeek: number;
  postsThisMonth: number;
}

/** Real status values from the `connected_accounts` CHECK constraint (Web migration). */
export type ConnectedAccountStatus = 'connected' | 'disconnected' | 'error' | 'expired';

/** Matches WPoster Web `ConnectedAccount` (connected-accounts/queries.ts). */
export interface ConnectedAccount {
  id: string;
  platform: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
  external_account_id: string | null;
  status: ConnectedAccountStatus;
  created_at: string;
  updated_at: string | null;
  disconnected_at?: string | null;
  disconnect_reason?: string | null;
  platform_metadata?: Record<string, unknown> | null;
}

export type PublishStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export interface Post {
  id: string;
  title: string | null;
  publish_status: PublishStatus;
  scheduled_at: string | null;
  published_at: string | null;
  updated_at: string;
  /** `cover_image_url ?? image_urls[0] ?? null` — same derivation Web uses. */
  cover_image_url: string | null;
  /** Post-level failure message (Web `posts.publish_error`); set when `publish_status === 'failed'`. */
  publish_error: string | null;
  /** Derived from joined connected accounts (canonical platform slugs). */
  platforms: string[];
}

/** Per-account count of publications still pending/processing (from
 * `post_connected_account_publications`, NOT a column on `connected_accounts`
 * itself — there is no such rollup in the real schema). */
export type QueueCountsByAccount = Record<string, number>;

/** Real notification levels from the `workspace_notifications` CHECK constraint. */
export type NotificationLevel = 'info' | 'success' | 'warning' | 'error' | 'critical';

/** Matches WPoster Web `NotificationItem` (src/lib/notifications/list.ts). */
export interface WorkspaceNotification {
  id: string;
  type: string;
  level: NotificationLevel;
  title: string;
  body: string;
  link_href: string | null;
  created_at: string;
  isRead: boolean;
}

/** Matches WPoster Web `UserProfile` (profiles/queries.ts) + active workspace. */
export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  active_workspace_id: string | null;
  created_at: string;
  updated_at: string;
}
