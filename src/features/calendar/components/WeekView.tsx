import { FlashList } from '@shopify/flash-list';
import { useMemo } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useFormatter, useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

import { toDateKey } from '../dates';
import type { CalendarPost } from '../types';
import { PostCard } from './PostCard';

type WeekItem =
  | { kind: 'header'; key: string; date: Date; count: number }
  | { kind: 'post'; key: string; post: CalendarPost }
  | { kind: 'empty'; key: string };

export interface WeekViewProps {
  weekDays: Date[];
  postsByDay: Map<string, CalendarPost[]>;
  refreshing: boolean;
  onRefresh: () => void;
  workspaceName?: string;
  workspaceIcon?: string;
  emptyLabel: string;
}

export function WeekView({
  weekDays,
  postsByDay,
  refreshing,
  onRefresh,
  workspaceName,
  workspaceIcon,
  emptyLabel,
}: WeekViewProps) {
  const theme = useTheme();
  const format = useFormatter();
  const t = useTranslations();

  const items = useMemo<WeekItem[]>(() => {
    const out: WeekItem[] = [];
    for (const date of weekDays) {
      const key = toDateKey(date);
      const posts = postsByDay.get(key) ?? [];
      out.push({ kind: 'header', key: `h-${key}`, date, count: posts.length });
      if (posts.length === 0) {
        out.push({ kind: 'empty', key: `e-${key}` });
      } else {
        for (const post of posts) out.push({ kind: 'post', key: post.id, post });
      }
    }
    return out;
  }, [weekDays, postsByDay]);

  return (
    <FlashList
      data={items}
      keyExtractor={(item) => item.key}
      getItemType={(item) => item.kind}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      contentContainerStyle={{ paddingBottom: 32 }}
      renderItem={({ item }) => {
        if (item.kind === 'header') {
          return (
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
              <Text variant="bodyStrong">{format.dateTime(item.date, { weekday: 'long', day: 'numeric', month: 'short' })}</Text>
              {item.count > 0 ? (
                <Text variant="caption" color="muted">
                  {item.count} {t(item.count === 1 ? 'workspace.calendar.post' : 'workspace.calendar.posts')}
                </Text>
              ) : null}
            </View>
          );
        }
        if (item.kind === 'empty') {
          return (
            <Text variant="caption" color="subtle" style={styles.emptyRow}>
              {emptyLabel}
            </Text>
          );
        }
        return (
          <View style={styles.postRow}>
            <PostCard post={item.post} compact workspaceName={workspaceName} workspaceIcon={workspaceIcon} />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 8 },
  emptyRow: { paddingVertical: 8, paddingBottom: 16 },
  postRow: { paddingBottom: 8 },
});
