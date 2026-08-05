import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { SearchBar, Text } from '@/components/ui';
import { useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

export interface CalendarFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

/** Search + Filters trigger row (ТЗ №4 §5/§6). */
export function CalendarFilterBar({ search, onSearchChange, activeFilterCount, onOpenFilters }: CalendarFilterBarProps) {
  const t = useTranslations();
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <SearchBar value={search} onChangeText={onSearchChange} placeholder={t('workspace.calendar.searchPlaceholder')} />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('mobile.calendar.filtersTitle')}
        onPress={onOpenFilters}
        style={[styles.filterButton, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.medium }]}
      >
        <Ionicons name="options-outline" size={20} color={theme.colors.foreground} />
        {activeFilterCount > 0 ? (
          <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
            <Text variant="caption" style={{ color: theme.colors.primaryForeground, fontSize: 10, lineHeight: 12 }}>
              {activeFilterCount}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
});
