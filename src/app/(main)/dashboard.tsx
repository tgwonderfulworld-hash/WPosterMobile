import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { PlatformBadge, PlatformIconTile } from '@/components/platform';
import { Card, EmptyState, SafeAreaContainer, Skeleton, Text } from '@/components/ui';
import { StatTile } from '@/features/dashboard/StatTile';
import {
  useActiveWorkspaceId,
  useConnectedAccounts,
  useUpcomingPosts,
  useWorkspaces,
  useWorkspaceStats,
  type Post,
} from '@/features/workspace';
import { WorkspaceSwitcher } from '@/features/workspace/components/WorkspaceSwitcher';
import { useFormatter, useTranslations } from '@/i18n';
import { useAuthStore } from '@/store';
import { useTheme } from '@/theme';

function WorkspacePill({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const active = useActiveWorkspaceId();
  const workspaces = useWorkspaces();
  const current = workspaces.data?.find((w) => w.id === active.data);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
    >
      <View style={[styles.pillIcon, { backgroundColor: current?.color || theme.colors.surface }]}>
        <Text variant="caption">{current?.icon || '🏢'}</Text>
      </View>
      {active.isLoading || workspaces.isLoading ? (
        <Skeleton width={110} height={16} />
      ) : (
        <Text variant="bodyStrong" numberOfLines={1} style={styles.pillLabel}>
          {current?.name ?? '—'}
        </Text>
      )}
      <Ionicons name="chevron-expand" size={16} color={theme.colors.subtle} />
    </Pressable>
  );
}

function PostRow({ post }: { post: Post }) {
  const theme = useTheme();
  const format = useFormatter();
  const when = post.scheduled_at
    ? format.dateTime(new Date(post.scheduled_at), { dateStyle: 'medium', timeStyle: 'short' })
    : '';

  return (
    <Card variant="outlined" padding="md" style={styles.postRow}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {post.title || '—'}
        </Text>
        <View style={styles.postMeta}>
          <Ionicons name="time-outline" size={13} color={theme.colors.subtle} />
          <Text variant="caption" color="subtle">
            {when}
          </Text>
        </View>
      </View>
      <View style={styles.platformRow}>
        {post.platforms.slice(0, 4).map((p) => (
          <PlatformBadge key={p} platform={p} showLabel={false} />
        ))}
      </View>
    </Card>
  );
}

export default function DashboardScreen() {
  const t = useTranslations();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const active = useActiveWorkspaceId();
  const workspaceId = active.data ?? undefined;
  const stats = useWorkspaceStats(workspaceId);
  const accounts = useConnectedAccounts(workspaceId);
  const upcoming = useUpcomingPosts(workspaceId);

  const name =
    (user?.user_metadata?.full_name as string | undefined) ?? user?.email?.split('@')[0] ?? '';

  const refreshing = stats.isRefetching || accounts.isRefetching || upcoming.isRefetching;
  const onRefresh = () => {
    void stats.refetch();
    void accounts.refetch();
    void upcoming.refetch();
  };

  const header = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color="muted">
              {t('workspace.dashboard.welcome')}
            </Text>
            <Text variant="heading" numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>

        <WorkspacePill onPress={() => setSwitcherOpen(true)} />

        {/* KPIs */}
        <View style={styles.statsRow}>
          <StatTile
            icon="calendar-outline"
            label={t('workspace.dashboard.scheduledPosts')}
            value={stats.data?.scheduled}
            loading={stats.isLoading}
            tone="primary"
          />
          <StatTile
            icon="create-outline"
            label={t('workspace.dashboard.draftPosts')}
            value={stats.data?.draft}
            loading={stats.isLoading}
            tone="muted"
          />
        </View>
        <View style={styles.statsRow}>
          <StatTile
            icon="checkmark-circle-outline"
            label={t('workspace.dashboard.publishedPosts')}
            value={stats.data?.published}
            loading={stats.isLoading}
            tone="success"
          />
          <StatTile
            icon="alert-circle-outline"
            label={t('workspace.dashboard.failedPosts')}
            value={stats.data?.failed}
            loading={stats.isLoading}
            tone="danger"
          />
        </View>

        {/* Connected accounts */}
        <Text variant="subtitle" style={styles.sectionTitle}>
          {t('workspace.dashboard.connectedChannels')}
        </Text>
        <Card variant="outlined" padding="md">
          {accounts.isLoading ? (
            <View style={styles.accountsRow}>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} width={40} height={40} radius={theme.radius.medium} />
              ))}
            </View>
          ) : (accounts.data?.length ?? 0) === 0 ? (
            <Pressable onPress={() => router.push('/(main)/connected-accounts')}>
              <Text variant="body" color="muted">
                {t('workspace.dashboard.noChannelsConnected')}
              </Text>
            </Pressable>
          ) : (
            <Pressable style={styles.accountsRow} onPress={() => router.push('/(main)/connected-accounts')}>
              {accounts.data!.slice(0, 6).map((a) => (
                <PlatformIconTile key={a.id} platform={a.platform} size={40} />
              ))}
              {accounts.data!.length > 6 ? (
                <View style={[styles.moreTile, { backgroundColor: theme.colors.surface }]}>
                  <Text variant="caption" color="muted">
                    +{accounts.data!.length - 6}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          )}
        </Card>

        {/* Upcoming */}
        <Text variant="subtitle" style={styles.sectionTitle}>
          {t('workspace.dashboard.recentPosts')}
        </Text>
      </View>
    ),
    [t, name, stats.data, stats.isLoading, accounts.data, accounts.isLoading, theme],
  );

  return (
    <SafeAreaContainer edges={['top']}>
      <FlashList
        data={upcoming.data ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostRow post={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          upcoming.isLoading ? (
            <View style={{ gap: 8 }}>
              {[0, 1].map((i) => (
                <Skeleton key={i} width="100%" height={64} radius={theme.radius.large} />
              ))}
            </View>
          ) : (
            <EmptyState icon="rocket-outline" title={t('workspace.dashboard.noPostsYet')} />
          )
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      />
      <WorkspaceSwitcher visible={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 20, paddingBottom: 32 },
  headerBlock: { gap: 12, paddingTop: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  pillIcon: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pillLabel: { maxWidth: 180 },
  statsRow: { flexDirection: 'row', gap: 12 },
  sectionTitle: { marginTop: 8 },
  accountsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  moreTile: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  postRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  platformRow: { flexDirection: 'row', gap: 4 },
});
