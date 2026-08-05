import { StyleSheet, View } from 'react-native';

import { Button, IconButton, Text } from '@/components/ui';
import { useFormatter, useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

import type { CalendarViewMode } from '../dates';

export interface CalendarNavBarProps {
  view: CalendarViewMode;
  anchor: Date;
  weekDays: Date[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

/** Prev / Today / Next + the current period's label (ТЗ №4 §1). */
export function CalendarNavBar({ view, anchor, weekDays, onPrev, onNext, onToday }: CalendarNavBarProps) {
  const theme = useTheme();
  const t = useTranslations();
  const format = useFormatter();

  const label =
    view === 'month'
      ? format.dateTime(anchor, { month: 'long', year: 'numeric' })
      : view === 'day'
        ? format.dateTime(anchor, { weekday: 'long', month: 'long', day: 'numeric' })
        : `${format.dateTime(weekDays[0], { month: 'short', day: 'numeric' })} – ${format.dateTime(
            weekDays[weekDays.length - 1],
            { month: 'short', day: 'numeric' },
          )}`;

  return (
    <View style={styles.row}>
      <View style={styles.navGroup}>
        <IconButton
          icon="chevron-back"
          size="sm"
          variant="soft"
          accessibilityLabel={t('workspace.calendar.previous')}
          onPress={onPrev}
        />
        <IconButton
          icon="chevron-forward"
          size="sm"
          variant="soft"
          accessibilityLabel={t('workspace.calendar.next')}
          onPress={onNext}
        />
      </View>
      <Text variant="subtitle" numberOfLines={1} style={{ flex: 1, color: theme.colors.foreground }}>
        {label}
      </Text>
      <Button label={t('workspace.calendar.today')} variant="ghost" size="sm" onPress={onToday} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navGroup: { flexDirection: 'row', gap: 6 },
});
