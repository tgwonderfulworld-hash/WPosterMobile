/**
 * Workspace / dashboard data access. Each function issues the SAME Supabase
 * query the WPoster Web app uses (same tables, same columns, same RLS) via the
 * shared mobile Supabase client — no new endpoints, no mocks, no alternative
 * models. Web resolution logic (active workspace, counts) is replicated
 * faithfully from src/lib/workspaces and each domain's queries.ts.
 */
import { supabase } from '@/services/supabase';
import { normalizePlatformId } from '@/lib/platforms/registry';

import type {
  ConnectedAccount,
  Post,
  QueueCountsByAccount,
  UserProfile,
  Workspace,
  WorkspaceNotification,
  WorkspaceStats,
} from './types';

/**
 * Resolve the user's active workspace — port of Web's `getDefaultWorkspaceForUser`
 * (src/lib/workspaces/active-workspace.ts). Order: profiles.active_workspace_id
 * (validated against active membership) → owned/earliest active membership →
 * owned workspace fallback.
 */
export async function resolveActiveWorkspaceId(userId: string): Promise<string | null> {
  const { data: prof } = await supabase
    .from('profiles')
    .select('active_workspace_id')
    .eq('id', userId)
    .maybeSingle<{ active_workspace_id: string | null }>();

  const activeId = prof?.active_workspace_id ?? null;
  if (activeId) {
    const { data: m } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('workspace_id', activeId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    if (m) return activeId;
  }

  const { data: rows } = await supabase
    .from('workspace_members')
    .select('workspace_id, role, joined_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('joined_at', { ascending: true })
    .returns<{ workspace_id: string; role: string; joined_at: string }[]>();

  const list = rows ?? [];
  const chosen = list.find((r) => r.role === 'owner') ?? list[0];
  if (chosen) return chosen.workspace_id;

  const { data: owned } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<{ id: string }>();

  return owned?.id ?? null;
}

/** Workspaces the user is an active member of (for the switcher). */
export async function listWorkspaces(userId: string): Promise<Workspace[]> {
  const { data: members } = await supabase
    .from('workspace_members')
    .select('workspace_id, role')
    .eq('user_id', userId)
    .eq('status', 'active')
    .returns<{ workspace_id: string; role: Workspace['my_role'] }[]>();

  const ids = (members ?? []).map((m) => m.workspace_id);
  if (ids.length === 0) return [];

  const { data: ws } = await supabase
    .from('workspaces')
    .select('id,name,icon,color,logo_url,owner_user_id,default_language,default_timezone')
    .in('id', ids)
    .eq('is_archived', false)
    .order('created_at', { ascending: true })
    .returns<Workspace[]>();

  const roleById = new Map((members ?? []).map((m) => [m.workspace_id, m.role]));
  return (ws ?? []).map((w) => ({ ...w, my_role: roleById.get(w.id) }));
}

/** Update the active workspace server-side — same column Web resolves from. */
export async function setActiveWorkspace(userId: string, workspaceId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ active_workspace_id: workspaceId })
    .eq('id', userId);
  if (error) throw error;
}

/** Connected accounts for a workspace — port of Web `getWorkspaceConnectedAccounts`. */
export async function getConnectedAccounts(workspaceId: string): Promise<ConnectedAccount[]> {
  const { data } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .returns<ConnectedAccount[]>();
  return data ?? [];
}

/** Current user's profile row (Web `profiles` table). */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id,display_name,avatar_url,active_workspace_id,created_at,updated_at')
    .eq('id', userId)
    .maybeSingle<UserProfile>();
  return data ?? null;
}

async function countPosts(workspaceId: string, status?: string): Promise<number> {
  let query = supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId);
  if (status) query = query.eq('publish_status', status);
  const { count } = await query;
  return count ?? 0;
}

async function countPostsCreatedSince(workspaceId: string, sinceIso: string): Promise<number> {
  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .gte('created_at', sinceIso);
  return count ?? 0;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}
function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

/**
 * Dashboard KPI counts. `scheduled`/`published`/`draft`/`failed` mirror Web's
 * `getDashboardV2Data` (src/lib/analytics/dashboard-queries.ts) exactly — same
 * table, same `publish_status` filter, same all-time count. `postsToday`/
 * `postsThisWeek`/`postsThisMonth` extend Web's own time-windowed-count pattern
 * (Web only has `draftsToday`/`publishedThisWeek`, no "this month") to count ALL
 * posts by `created_at`, using the identical `head:true, count:'exact'` shape.
 */
export async function getWorkspaceStats(workspaceId: string): Promise<WorkspaceStats> {
  const [scheduled, published, draft, failed, postsToday, postsThisWeek, postsThisMonth] =
    await Promise.all([
      countPosts(workspaceId, 'scheduled'),
      countPosts(workspaceId, 'published'),
      countPosts(workspaceId, 'draft'),
      countPosts(workspaceId, 'failed'),
      countPostsCreatedSince(workspaceId, startOfToday().toISOString()),
      countPostsCreatedSince(workspaceId, daysAgo(7).toISOString()),
      countPostsCreatedSince(workspaceId, startOfMonth().toISOString()),
    ]);

  return { scheduled, published, draft, failed, postsToday, postsThisWeek, postsThisMonth };
}

interface RawPostRow {
  id: string;
  title: string | null;
  publish_status: Post['publish_status'];
  scheduled_at: string | null;
  published_at: string | null;
  updated_at: string;
  cover_image_url: string | null;
  image_urls: string[] | null;
  publish_error: string | null;
  post_connected_accounts?: { connected_accounts?: { platform: string | null } | null }[] | null;
}

const POST_ROW_SELECT =
  'id,title,publish_status,scheduled_at,published_at,updated_at,cover_image_url,image_urls,publish_error,post_connected_accounts(connected_accounts(platform))';

function derivePostPlatforms(row: RawPostRow): string[] {
  const set = new Set<string>();
  for (const link of row.post_connected_accounts ?? []) {
    const slug = normalizePlatformId(link.connected_accounts?.platform ?? null);
    if (slug) set.add(slug);
  }
  return Array.from(set);
}

function mapPostRow(row: RawPostRow): Post {
  return {
    id: row.id,
    title: row.title,
    publish_status: row.publish_status,
    scheduled_at: row.scheduled_at,
    published_at: row.published_at,
    updated_at: row.updated_at,
    cover_image_url: row.cover_image_url ?? row.image_urls?.[0] ?? null,
    publish_error: row.publish_error,
    platforms: derivePostPlatforms(row),
  };
}

/** Upcoming scheduled posts (soonest first) with their target platforms. */
export async function getUpcomingPosts(workspaceId: string, limit = 5): Promise<Post[]> {
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from('posts')
    .select(POST_ROW_SELECT)
    .eq('workspace_id', workspaceId)
    .eq('publish_status', 'scheduled')
    .gte('scheduled_at', nowIso)
    .order('scheduled_at', { ascending: true })
    .limit(limit)
    .returns<RawPostRow[]>();

  return (data ?? []).map(mapPostRow);
}

/** Posts that failed to publish (most recent first), with their failure reason. */
export async function getFailedPosts(workspaceId: string, limit = 5): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select(POST_ROW_SELECT)
    .eq('workspace_id', workspaceId)
    .eq('publish_status', 'failed')
    .order('updated_at', { ascending: false })
    .limit(limit)
    .returns<RawPostRow[]>();

  return (data ?? []).map(mapPostRow);
}

/**
 * Pending/processing publication counts per connected account. There is no
 * queue-count column on `connected_accounts` itself — this is a real,
 * non-invented aggregate over `post_connected_account_publications` (the same
 * table Web's `retryPublication` reads/writes), computed client-side since a
 * single small `IN`-filtered select is simpler than a Postgres view here.
 */
export async function getConnectedAccountQueueCounts(workspaceId: string): Promise<QueueCountsByAccount> {
  const { data } = await supabase
    .from('post_connected_account_publications')
    .select('connected_account_id')
    .eq('workspace_id', workspaceId)
    .in('status', ['pending', 'processing'])
    .returns<{ connected_account_id: string }[]>();

  const counts: QueueCountsByAccount = {};
  for (const row of data ?? []) {
    counts[row.connected_account_id] = (counts[row.connected_account_id] ?? 0) + 1;
  }
  return counts;
}

interface RawNotificationRow {
  id: string;
  type: string;
  level: WorkspaceNotification['level'];
  title: string;
  body: string;
  link_href: string | null;
  created_at: string;
}

/**
 * Recent workspace notifications (Web `workspace_notifications` /
 * `workspace_notification_reads` — Notification Center). RLS
 * (`workspace_notifications_select_members`) already scopes rows to workspace
 * members and `user_id is null or user_id = auth.uid()`; dismissed rows are
 * filtered out client-side via the per-user reads join, same as Web.
 */
export async function getWorkspaceNotifications(
  workspaceId: string,
  userId: string,
  limit = 10,
): Promise<WorkspaceNotification[]> {
  const { data: rows } = await supabase
    .from('workspace_notifications')
    .select('id,type,level,title,body,link_href,created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit)
    .returns<RawNotificationRow[]>();

  const list = rows ?? [];
  if (list.length === 0) return [];

  const { data: reads } = await supabase
    .from('workspace_notification_reads')
    .select('notification_id,read_at,dismissed_at')
    .eq('user_id', userId)
    .in(
      'notification_id',
      list.map((r) => r.id),
    )
    .returns<{ notification_id: string; read_at: string | null; dismissed_at: string | null }[]>();

  const readById = new Map((reads ?? []).map((r) => [r.notification_id, r]));

  return list
    .filter((row) => !readById.get(row.id)?.dismissed_at)
    .map((row) => ({ ...row, isRead: Boolean(readById.get(row.id)?.read_at) }));
}
