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

export interface WorkspaceStats {
  connectedAccounts: number;
  scheduled: number;
  draft: number;
  published: number;
  failed: number;
  today: number;
}

/** Matches WPoster Web `ConnectedAccount` (connected-accounts/queries.ts). */
export interface ConnectedAccount {
  id: string;
  platform: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
  external_account_id: string | null;
  status: string;
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
  /** Derived from joined connected accounts (canonical platform slugs). */
  platforms: string[];
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
