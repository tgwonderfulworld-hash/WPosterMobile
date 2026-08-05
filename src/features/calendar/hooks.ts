/** React Query hooks for the Calendar screen — real Supabase data, no mocks. */
import { keepPreviousData, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getCalendarPosts } from './api';
import { addDays, addMonths, addWeeks, type CalendarViewMode, getRangeForView } from './dates';
import { calendarKeys } from './queryKeys';

export interface CalendarRange {
  start: Date;
  end: Date;
}

export function useCalendarPosts(workspaceId: string | undefined, range: CalendarRange) {
  const startIso = range.start.toISOString();
  const endIso = range.end.toISOString();

  return useQuery({
    queryKey: calendarKeys.posts(workspaceId ?? 'none', startIso, endIso),
    queryFn: () => getCalendarPosts(workspaceId!, startIso, endIso),
    enabled: !!workspaceId,
    // Keep showing the previous range's posts while the new one loads, so
    // switching Month/Week/Day or paging never flashes a blank/loading screen.
    placeholderData: keepPreviousData,
  });
}

function prefetchCalendarRange(client: QueryClient, workspaceId: string, range: CalendarRange): void {
  const startIso = range.start.toISOString();
  const endIso = range.end.toISOString();
  void client.prefetchQuery({
    queryKey: calendarKeys.posts(workspaceId, startIso, endIso),
    queryFn: () => getCalendarPosts(workspaceId, startIso, endIso),
  });
}

function neighborAnchors(view: CalendarViewMode, anchor: Date): [Date, Date] {
  if (view === 'day') return [addDays(anchor, -1), addDays(anchor, 1)];
  if (view === 'week') return [addWeeks(anchor, -1), addWeeks(anchor, 1)];
  return [addMonths(anchor, -1), addMonths(anchor, 1)];
}

/** Warm the previous/next period's cache once the current one has data (ТЗ №4 §12). */
export function useCalendarPrefetchNeighbors(
  workspaceId: string | undefined,
  view: CalendarViewMode,
  anchor: Date,
  weekStartsOn: 0 | 1,
  ready: boolean,
): void {
  const client = useQueryClient();

  useEffect(() => {
    if (!workspaceId || !ready) return;
    const [prevAnchor, nextAnchor] = neighborAnchors(view, anchor);
    prefetchCalendarRange(client, workspaceId, getRangeForView(view, prevAnchor, weekStartsOn));
    prefetchCalendarRange(client, workspaceId, getRangeForView(view, nextAnchor, weekStartsOn));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, workspaceId, view, anchor.getTime(), weekStartsOn, ready]);
}
