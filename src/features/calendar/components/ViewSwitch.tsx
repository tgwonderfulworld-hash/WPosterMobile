import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui';
import { useTranslations } from '@/i18n';

import type { CalendarViewMode } from '../dates';

const MODES: CalendarViewMode[] = ['month', 'week', 'day'];
const LABEL_KEY: Record<CalendarViewMode, string> = {
  month: 'workspace.calendar.month',
  week: 'workspace.calendar.week',
  day: 'workspace.calendar.day',
};

export interface ViewSwitchProps {
  value: CalendarViewMode;
  onChange: (view: CalendarViewMode) => void;
}

/** Month / Week / Day segmented control (ТЗ №4 §1). */
export function ViewSwitch({ value, onChange }: ViewSwitchProps) {
  const t = useTranslations();
  return (
    <View style={styles.row}>
      {MODES.map((mode) => (
        <Chip key={mode} label={t(LABEL_KEY[mode])} selected={value === mode} onPress={() => onChange(mode)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
});
