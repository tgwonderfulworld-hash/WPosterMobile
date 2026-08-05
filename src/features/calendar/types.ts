export type PublishStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

/**
 * Calendar presentation model — same real `posts` table WPoster Web's
 * calendar reads (src/lib/calendar/entry.ts), extended just enough for the
 * mobile grid/list/search: `content` for search-by-content, `created_at` as
 * the fallback "effective date" for drafts that have neither a scheduled nor
 * a published timestamp yet (mirrors Web's `entryDateIso`:
 * published_at ?? scheduled_at ?? created_at).
 */
export interface CalendarPost {
  id: string;
  title: string | null;
  content: string | null;
  publish_status: PublishStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
  publish_error: string | null;
  /** Canonical, de-duplicated platform slugs (Platform Registry order). */
  platforms: string[];
  /** Effective calendar date: published_at ?? scheduled_at ?? created_at. */
  dateIso: string;
}

export interface CalendarFilters {
  statuses: PublishStatus[];
  platforms: string[];
  search: string;
}

export const ALL_PUBLISH_STATUSES: PublishStatus[] = [
  'draft',
  'scheduled',
  'publishing',
  'published',
  'failed',
];

export function activeFilterCount(filters: CalendarFilters): number {
  let n = 0;
  if (filters.statuses.length !== ALL_PUBLISH_STATUSES.length) n += 1;
  if (filters.platforms.length > 0) n += 1;
  return n;
}
