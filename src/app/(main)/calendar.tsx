import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ErrorState, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import {
  ALL_PUBLISH_STATUSES,
  activeFilterCount,
  addDays,
  addMonths,
  addWeeks,
  type CalendarFilters,
  getRangeForView,
  getWeekDays,
  matchesCalendarFilters,
  toDateKey,
  useCalendarPosts,
  useCalendarPrefetchNeighbors,
  type CalendarPost,
} from '@/features/calendar';
import {
  CalendarFilterBar,
  CalendarFiltersSheet,
  CalendarNavBar,
  CalendarSkeleton,
  DayPostsSheet,
  DayView,
  MonthView,
  ViewSwitch,
  WeekView,
} from '@/features/calendar/components';
import { useActiveWorkspaceId, useWorkspaces } from '@/features/workspace';
import { useDebounce } from '@/hooks/useDebounce';
import { useTranslations } from '@/i18n';
import { useAppStore } from '@/store';
import { toAppError } from '@/utils/errors';

const WEEK_STARTS_ON: 0 | 1 = 1;

export default function CalendarScreen() {
  const t = useTranslations();

  const view = useAppStore((s) => s.calendarView);
  const setView = useAppStore((s) => s.setCalendarView);

  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    statuses: ALL_PUBLISH_STATUSES,
    platforms: [],
    search: '',
  });

  const debouncedSearch = useDebounce(filters.search, 300);
  const effectiveFilters = useMemo<CalendarFilters>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const active = useActiveWorkspaceId();
  const workspaceId = active.data ?? undefined;
  const workspaces = useWorkspaces();
  const currentWorkspace = workspaces.data?.find((w) => w.id === workspaceId);

  const range = useMemo(() => getRangeForView(view, anchorDate, WEEK_STARTS_ON), [view, anchorDate]);
  const weekDays = useMemo(() => getWeekDays(anchorDate, WEEK_STARTS_ON), [anchorDate]);

  const query = useCalendarPosts(workspaceId, range);
  useCalendarPrefetchNeighbors(workspaceId, view, anchorDate, WEEK_STARTS_ON, query.isSuccess);

  const filteredPosts = useMemo(
    () => (query.data ?? []).filter((post) => matchesCalendarFilters(post, effectiveFilters)),
    [query.data, effectiveFilters],
  );

  const postsByDay = useMemo(() => {
    const map = new Map<string, CalendarPost[]>();
    for (const post of filteredPosts) {
      const key = toDateKey(new Date(post.dateIso));
      const list = map.get(key);
      if (list) list.push(post);
      else map.set(key, [post]);
    }
    for (const list of map.values()) list.sort((a, b) => a.dateIso.localeCompare(b.dateIso));
    return map;
  }, [filteredPosts]);

  const onPrev = () => {
    setAnchorDate((d) => (view === 'month' ? addMonths(d, -1) : view === 'week' ? addWeeks(d, -1) : addDays(d, -1)));
  };
  const onNext = () => {
    setAnchorDate((d) => (view === 'month' ? addMonths(d, 1) : view === 'week' ? addWeeks(d, 1) : addDays(d, 1)));
  };
  const onToday = () => setAnchorDate(new Date());

  const refreshing = query.isRefetching;
  const onRefresh = () => void query.refetch();

  const selectedDayPosts = selectedDay ? (postsByDay.get(toDateKey(selectedDay)) ?? []) : [];
  const dayViewPosts = postsByDay.get(toDateKey(anchorDate)) ?? [];
  const emptyLabel = t('workspace.calendar.noPostsThisDay');

  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer scroll={false}>
        <View style={styles.header}>
          <Text variant="heading">{t('workspace.calendar.title')}</Text>
          {currentWorkspace ? (
            <Text variant="caption" color="muted">
              {currentWorkspace.icon} {currentWorkspace.name}
            </Text>
          ) : null}

          <ViewSwitch value={view} onChange={setView} />
          <CalendarNavBar
            view={view}
            anchor={anchorDate}
            weekDays={weekDays}
            onPrev={onPrev}
            onNext={onNext}
            onToday={onToday}
          />
          <CalendarFilterBar
            search={filters.search}
            onSearchChange={(search) => setFilters((f) => ({ ...f, search }))}
            activeFilterCount={activeFilterCount(effectiveFilters)}
            onOpenFilters={() => setFiltersOpen(true)}
          />
        </View>

        <View style={styles.body}>
          {query.isLoading ? (
            <CalendarSkeleton view={view} />
          ) : query.isError ? (
            <ErrorState error={toAppError(query.error)} onRetry={() => query.refetch()} />
          ) : view === 'month' ? (
            <MonthView
              monthAnchor={anchorDate}
              postsByDay={postsByDay}
              onSelectDay={setSelectedDay}
              refreshing={refreshing}
              onRefresh={onRefresh}
              weekStartsOn={WEEK_STARTS_ON}
            />
          ) : view === 'week' ? (
            <WeekView
              weekDays={weekDays}
              postsByDay={postsByDay}
              refreshing={refreshing}
              onRefresh={onRefresh}
              workspaceIcon={currentWorkspace?.icon}
              workspaceName={currentWorkspace?.name}
              emptyLabel={emptyLabel}
            />
          ) : (
            <DayView
              posts={dayViewPosts}
              refreshing={refreshing}
              onRefresh={onRefresh}
              workspaceIcon={currentWorkspace?.icon}
              workspaceName={currentWorkspace?.name}
              emptyLabel={emptyLabel}
            />
          )}
        </View>
      </PageContainer>

      <DayPostsSheet
        visible={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        date={selectedDay}
        posts={selectedDayPosts}
        workspaceName={currentWorkspace?.name}
        workspaceIcon={currentWorkspace?.icon}
      />

      <CalendarFiltersSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChangeFilters={setFilters}
      />
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: 10, paddingTop: 4, paddingBottom: 12 },
  body: { flex: 1 },
});
