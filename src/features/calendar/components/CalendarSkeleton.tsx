import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui';
import { useTheme } from '@/theme';

import type { CalendarViewMode } from '../dates';

export interface CalendarSkeletonProps {
  view: CalendarViewMode;
}

export function CalendarSkeleton({ view }: CalendarSkeletonProps) {
  const theme = useTheme();

  if (view === 'month') {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 35 }, (_, i) => (
          <View key={i} style={styles.cell}>
            <Skeleton width={36} height={36} radius={theme.radius.medium} />
          </View>
        ))}
      </View>
    );
  }

  const rows = view === 'week' ? 5 : 4;
  return (
    <View style={{ gap: 10 }}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} width="100%" height={76} radius={theme.radius.large} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: { width: `${100 / 7 - 1}%`, alignItems: 'center', paddingVertical: 6 },
});
