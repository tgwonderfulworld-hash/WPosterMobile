/**
 * Workspace / dashboard data access. Each function issues the SAME Supabase
 * query the WPoster Web app uses (same tables, same columns, same RLS) via the
 * shared mobile Supabase client — no new endpoints, no mocks, no alternative
 * models. Web resolution logic (active workspace, counts) is replicated
 * faithfully from src/lib/workspaces and each domain's queries.ts.
 */
import { supabase } from '@/services/supabase';
import { normalizePlatformId } from '@/lib/platforms/registry';

import type { ConnectedAccount, Post, UserProfile, Workspace, WorkspaceStats } from './types';

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

function startOfToday(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
function endOfToday(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

/** Dashboard KPI counts — same count queries Web uses (settings-queries.ts style). */
export async function getWorkspaceStats(workspaceId: string): Promise<WorkspaceStats> {
  const [connectedAccounts, scheduled, draft, published, failed, todayCount] = await Promise.all([
    (async () => {
      const { count } = await supabase
        .from('connected_accounts')
        .select('id', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId);
      return count ?? 0;
    })(),
    countPosts(workspaceId, 'scheduled'),
    countPosts(workspaceId, 'draft'),
    countPosts(workspaceId, 'published'),
    countPosts(workspaceId, 'failed'),
    (async () => {
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .eq('publish_status', 'scheduled')
        .gte('scheduled_at', startOfToday())
        .lte('scheduled_at', endOfToday());
      return count ?? 0;
    })(),
  ]);

  return { connectedAccounts, scheduled, draft, published, failed, today: todayCount };
}

interface RawUpcomingPost {
  id: string;
  title: string | null;
  publish_status: Post['publish_status'];
  scheduled_at: string | null;
  published_at: string | null;
  post_connected_accounts?: { connected_accounts?: { platform: string | null } | null }[] | null;
}

function derivePostPlatforms(row: RawUpcomingPost): string[] {
  const set = new Set<string>();
  for (const link of row.post_connected_accounts ?? []) {
    const slug = normalizePlatformId(link.connected_accounts?.platform ?? null);
    if (slug) set.add(slug);
  }
  return Array.from(set);
}

/** Upcoming scheduled posts (soonest first) with their target platforms. */
export async function getUpcomingPosts(workspaceId: string, limit = 5): Promise<Post[]> {
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from('posts')
    .select(
      'id,title,publish_status,scheduled_at,published_at,post_connected_accounts(connected_accounts(platform))',
    )
    .eq('workspace_id', workspaceId)
    .eq('publish_status', 'scheduled')
    .gte('scheduled_at', nowIso)
    .order('scheduled_at', { ascending: true })
    .limit(limit)
    .returns<RawUpcomingPost[]>();

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    publish_status: row.publish_status,
    scheduled_at: row.scheduled_at,
    published_at: row.published_at,
    platforms: derivePostPlatforms(row),
  }));
}
