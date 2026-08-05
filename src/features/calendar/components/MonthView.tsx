import { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { postStatusColor } from '@/features/workspace/postStatus';
import { useLocale } from '@/i18n';
import { useTheme } from '@/theme';

import { getMonthGrid, isSameDay } from '../dates';
import type { CalendarPost } from '../types';

export interface MonthViewProps {
  monthAnchor: Date;
  postsByDay: Map<string, CalendarPost[]>;
  onSelectDay: (date: Date) => void;
  refreshing: boolean;
  onRefresh: () => void;
  weekStartsOn: 0 | 1;
}

const MAX_DOTS = 4;

export function MonthView({ monthAnchor, postsByDay, onSelectDay, refreshing, onRefresh, weekStartsOn }: MonthViewProps) {
  const theme = useTheme();
  const locale = useLocale();
  const grid = useMemo(() => getMonthGrid(monthAnchor, weekStartsOn), [monthAnchor, weekStartsOn]);
  const today = useMemo(() => new Date(), []);

  const weekdayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const base = grid[0].date;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return fmt.format(d);
    });
  }, [locale, grid]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.weekdayRow}>
        {weekdayNames.map((name, i) => (
          <View key={i} style={styles.cellFlex}>
            <Text variant="caption" color="subtle" align="center">
              {name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((day) => {
          const posts = postsByDay.get(day.key) ?? [];
          const isToday = isSameDay(day.date, today);
          const statuses = Array.from(new Set(posts.map((p) => p.publish_status))).slice(0, MAX_DOTS);

          return (
            <Pressable
              key={day.key}
              onPress={() => onSelectDay(day.date)}
              style={[styles.cellFlex, styles.cell]}
              accessibilityRole="button"
            >
              <View
                style={[
                  styles.dayNumberWrap,
                  isToday ? { backgroundColor: theme.colors.primary } : null,
                ]}
              >
                <Text
                  variant="caption"
                  weight={isToday ? '700' : undefined}
                  color={isToday ? 'primaryForeground' : day.inMonth ? 'foreground' : 'subtle'}
                >
                  {day.dayNumber}
                </Text>
              </View>
              {statuses.length > 0 ? (
                <View style={styles.dotsRow}>
                  {statuses.map((s) => (
                    <View key={s} style={[styles.dot, { backgroundColor: postStatusColor(theme, s) }]} />
                  ))}
                  {posts.length > MAX_DOTS ? (
                    <Text variant="caption" color="subtle" style={{ fontSize: 9 }}>
                      +{posts.length - MAX_DOTS}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 32 },
  weekdayRow: { flexDirection: 'row', marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellFlex: { width: `${100 / 7}%` },
  cell: { minHeight: 56, alignItems: 'center', paddingVertical: 6, gap: 4 },
  dayNumberWrap: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dotsRow: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
});
