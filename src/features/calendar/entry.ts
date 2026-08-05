/**
 * Small presentation/search helpers — the mobile subset of WPoster Web's
 * `src/lib/calendar/entry.ts` (title resolution + search matching only; Web's
 * destination/media-type resolution isn't needed for the mobile card, which
 * already gets its platforms from the same `post_connected_accounts` join).
 */
import { getPlatformLabel } from '@/lib/platforms/registry';

import type { CalendarFilters, CalendarPost } from './types';

/** First non-empty line of body text, formatting stripped. */
export function firstMeaningfulLine(raw: string | null | undefined): string {
  if (!raw) return '';
  for (const line of raw.split(/\r?\n/)) {
    const clean = line.replace(/[*_`~[\]#>]/g, '').trim();
    if (clean) return clean;
  }
  return '';
}

/** Title priority: internal title → first line of content → localized fallback. */
export function resolvePostTitle(post: Pick<CalendarPost, 'title' | 'content'>, untitled: string): string {
  const title = (post.title ?? '').trim();
  if (title) return title;
  const line = firstMeaningfulLine(post.content);
  if (line) return line;
  return untitled;
}

function matchesSearch(post: CalendarPost, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if ((post.title ?? '').toLowerCase().includes(q)) return true;
  if ((post.content ?? '').toLowerCase().includes(q)) return true;
  return post.platforms.some((p) => getPlatformLabel(p).toLowerCase().includes(q));
}

/** Status + platform + search applied together (ТЗ №4 §5/§6 — filters combine, AND search). */
export function matchesCalendarFilters(post: CalendarPost, filters: CalendarFilters): boolean {
  if (!filters.statuses.includes(post.publish_status)) return false;
  if (filters.platforms.length > 0 && !post.platforms.some((p) => filters.platforms.includes(p))) return false;
  return matchesSearch(post, filters.search);
}
