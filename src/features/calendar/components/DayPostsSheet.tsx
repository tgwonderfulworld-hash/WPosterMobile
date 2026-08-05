import { StyleSheet, View } from 'react-native';

import { BottomSheet, EmptyState, Text } from '@/components/ui';
import { useFormatter, useTranslations } from '@/i18n';

import type { CalendarPost } from '../types';
import { PostCard } from './PostCard';

export interface DayPostsSheetProps {
  visible: boolean;
  onClose: () => void;
  date: Date | null;
  posts: CalendarPost[];
  workspaceName?: string;
  workspaceIcon?: string;
}

/** Tapping a Month day opens this sheet with everything scheduled that day (ТЗ №4 §4). */
export function DayPostsSheet({ visible, onClose, date, posts, workspaceName, workspaceIcon }: DayPostsSheetProps) {
  const t = useTranslations();
  const format = useFormatter();

  return (
    <BottomSheet<CalendarPost>
      visible={visible}
      onClose={onClose}
      header={
        date ? (
          <Text variant="subtitle">{format.dateTime(date, { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        ) : null
      }
      list={{
        data: posts,
        keyExtractor: (item) => item.id,
        renderItem: ({ item }) => (
          <View style={styles.item}>
            <PostCard post={item} workspaceName={workspaceName} workspaceIcon={workspaceIcon} />
          </View>
        ),
        estimatedItemSize: 96,
        ListEmptyComponent: <EmptyState icon="calendar-outline" title={t('workspace.calendar.noPostsThisDay')} />,
      }}
    />
  );
}

const styles = StyleSheet.create({
  item: { paddingBottom: 10 },
});
