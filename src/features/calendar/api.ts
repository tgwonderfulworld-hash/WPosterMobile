/**
 * Calendar data access — the SAME `posts` table, columns, and RLS the WPoster
 * Web calendar reads (src/app/[locale]/(app)/calendar/page.tsx), scoped to a
 * date range instead of a fixed limit. No new endpoint, no mock data.
 */
import { supabase } from '@/services/supabase';
import { normalizePlatformId } from '@/lib/platforms/registry';

import type { CalendarPost } from './types';

interface RawCalendarPostRow {
  id: string;
  title: string | null;
  content: string | null;
  publish_status: CalendarPost['publish_status'];
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
  image_urls: string[] | null;
  publish_error: string | null;
  post_connected_accounts?: { connected_accounts?: { platform?: string | null } | null }[] | null;
}

const CALENDAR_POST_SELECT =
  'id,title,content,publish_status,scheduled_at,published_at,created_at,updated_at,cover_image_url,image_urls,publish_error,post_connected_accounts(connected_accounts(platform))';

function derivePlatforms(row: RawCalendarPostRow): string[] {
  const set = new Set<string>();
  for (const link of row.post_connected_accounts ?? []) {
    const slug = normalizePlatformId(link.connected_accounts?.platform ?? null);
    if (slug) set.add(slug);
  }
  return Array.from(set);
}

/** Effective calendar date: published_at → scheduled_at → created_at (Web's `entryDateIso`). */
function deriveDateIso(row: RawCalendarPostRow): string {
  return row.published_at ?? row.scheduled_at ?? row.created_at;
}

function mapRow(row: RawCalendarPostRow): CalendarPost {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    publish_status: row.publish_status,
    scheduled_at: row.scheduled_at,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    cover_image_url: row.cover_image_url ?? row.image_urls?.[0] ?? null,
    publish_error: row.publish_error,
    platforms: derivePlatforms(row),
    dateIso: deriveDateIso(row),
  };
}

/**
 * Posts whose effective date falls in [startIso, endIso). Mirrors Web's OR
 * filter (published_at in range, OR unpublished-but-scheduled in range) and
 * adds a third branch for true drafts (no scheduled_at, no published_at) so
 * they still surface on their creation date — required by ТЗ №4 §2, which
 * Web's own query does not need (Web's Calendar never lists bare drafts).
 */
export async function getCalendarPosts(
  workspaceId: string,
  startIso: string,
  endIso: string,
): Promise<CalendarPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(CALENDAR_POST_SELECT)
    .eq('workspace_id', workspaceId)
    .or(
      `and(published_at.gte.${startIso},published_at.lt.${endIso}),` +
        `and(published_at.is.null,scheduled_at.gte.${startIso},scheduled_at.lt.${endIso}),` +
        `and(published_at.is.null,scheduled_at.is.null,created_at.gte.${startIso},created_at.lt.${endIso})`,
    )
    .returns<RawCalendarPostRow[]>();

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
