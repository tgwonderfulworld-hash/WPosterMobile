import { FlashList } from '@shopify/flash-list';
import { RefreshControl, View } from 'react-native';

import { EmptyState } from '@/components/ui';
import { useTheme } from '@/theme';

import type { CalendarPost } from '../types';
import { PostCard } from './PostCard';

export interface DayViewProps {
  posts: CalendarPost[];
  refreshing: boolean;
  onRefresh: () => void;
  workspaceName?: string;
  workspaceIcon?: string;
  emptyLabel: string;
}

export function DayView({ posts, refreshing, onRefresh, workspaceName, workspaceIcon, emptyLabel }: DayViewProps) {
  const theme = useTheme();

  return (
    <FlashList
      data={posts}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      contentContainerStyle={{ paddingBottom: 32 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({ item }) => <PostCard post={item} workspaceName={workspaceName} workspaceIcon={workspaceIcon} />}
      ListEmptyComponent={<EmptyState icon="calendar-outline" title={emptyLabel} />}
    />
  );
}
