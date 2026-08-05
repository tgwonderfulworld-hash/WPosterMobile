import { FlashList } from '@shopify/flash-list';
import { useMemo, useState, useCallback } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

import { PlatformIconTile } from '@/components/platform';
import { Card, EmptyState, ErrorState, SafeAreaContainer, Skeleton, Text } from '@/components/ui';
import { ConnectedAccountRow } from '@/features/dashboard/ConnectedAccountRow';
import { DashboardHeader } from '@/features/dashboard/DashboardHeader';
import { FailedPostCard } from '@/features/dashboard/FailedPostCard';
import { NotificationRow } from '@/features/dashboard/NotificationRow';
import { StatTile } from '@/features/dashboard/StatTile';
import { UpcomingPostRow } from '@/features/dashboard/UpcomingPostRow';
import {
  useActiveWorkspaceId,
  useConnectedAccountQueueCounts,
  useConnectedAccounts,
  useFailedPosts,
  useUpcomingPosts,
  useWorkspaceNotifications,
  useWorkspaceStats,
  useWorkspaces,
} from '@/features/workspace';
import { WorkspaceSwitcher } from '@/features/workspace/components/WorkspaceSwitcher';
import { useTranslations } from '@/i18n';
import { useTheme } from '@/theme';
import { toAppError } from '@/utils/errors';

export default function DashboardScreen() {
  const t = useTranslations();
  const theme = useTheme();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const active = useActiveWorkspaceId();
  const workspaceId = active.data ?? undefined;
  const workspaces = useWorkspaces();
  const currentWorkspace = workspaces.data?.find((w) => w.id === workspaceId);

  const stats = useWorkspaceStats(workspaceId);
  const accounts = useConnectedAccounts(workspaceId);
  const queueCounts = useConnectedAccountQueueCounts(workspaceId);
  const upcoming = useUpcomingPosts(workspaceId);
  const failed = useFailedPosts(workspaceId);
  const notifications = useWorkspaceNotifications(workspaceId);

  const refreshing =
    stats.isRefetching ||
    accounts.isRefetching ||
    upcoming.isRefetching ||
    failed.isRefetching ||
    notifications.isRefetching;

  const onRefresh = useCallback(() => {
    void stats.refetch();
    void accounts.refetch();
    void queueCounts.refetch();
    void upcoming.refetch();
    void failed.refetch();
    void notifications.refetch();
  }, [stats, accounts, queueCounts, upcoming, failed, notifications]);

  const kpis = useMemo(
    () => [
      { icon: 'calendar-outline' as const, label: t('workspace.dashboard.scheduledPosts'), value: stats.data?.scheduled, tone: 'primary' as const },
      { icon: 'checkmark-circle-outline' as const, label: t('workspace.dashboard.publishedPosts'), value: stats.data?.published, tone: 'success' as const },
      { icon: 'create-outline' as const, label: t('workspace.dashboard.draftPosts'), value: stats.data?.draft, tone: 'muted' as const },
      { icon: 'alert-circle-outline' as const, label: t('workspace.dashboard.failedPosts'), value: stats.data?.failed, tone: 'danger' as const },
      { icon: 'today-outline' as const, label: t('workspace.posts.filterDateToday'), value: stats.data?.postsToday, tone: 'primary' as const },
      { icon: 'calendar-number-outline' as const, label: t('workspace.posts.filterDateThisWeek'), value: stats.data?.postsThisWeek, tone: 'muted' as const },
      { icon: 'stats-chart-outline' as const, label: t('workspace.posts.filterDateThisMonth'), value: stats.data?.postsThisMonth, tone: 'muted' as const },
    ],
    [t, stats.data],
  );

  const header = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <DashboardHeader onOpenSwitcher={() => setSwitcherOpen(true)} />

        {/* KPIs */}
        <View style={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <View key={kpi.label} style={styles.kpiCell}>
              <StatTile
                icon={kpi.icon}
                label={kpi.label}
                value={kpi.value}
                loading={stats.isLoading}
                tone={kpi.tone}
              />
            </View>
          ))}
        </View>
        {stats.isError ? <ErrorState error={toAppError(stats.error)} onRetry={() => stats.refetch()} /> : null}

        {/* Failed posts — only shown when there are any */}
        {failed.isError ? (
          <ErrorState error={toAppError(failed.error)} onRetry={() => failed.refetch()} />
        ) : (failed.data?.length ?? 0) > 0 ? (
          <View style={{ gap: 8 }}>
            <Text variant="subtitle" color="danger" style={styles.sectionTitle}>
              {t('workspace.dashboard.failedPosts')}
            </Text>
            <View style={{ gap: 8 }}>
              {failed.data!.map((post) => (
                <FailedPostCard key={post.id} post={post} />
              ))}
            </View>
          </View>
        ) : null}

        {/* Connected accounts */}
        <Text variant="subtitle" style={styles.sectionTitle}>
          {t('workspace.dashboard.connectedChannels')}
        </Text>
        {accounts.isError ? (
          <ErrorState error={toAppError(accounts.error)} onRetry={() => accounts.refetch()} />
        ) : accounts.isLoading ? (
          <View style={styles.accountsLoading}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} width={40} height={40} radius={theme.radius.medium} />
            ))}
          </View>
        ) : (accounts.data?.length ?? 0) === 0 ? (
          <Card variant="outlined" padding="md">
            <EmptyState icon="link-outline" title={t('workspace.dashboard.noChannelsConnected')} />
          </Card>
        ) : (
          <View style={{ gap: 8 }}>
            {accounts.data!.slice(0, 4).map((a) => (
              <ConnectedAccountRow key={a.id} account={a} queueCount={queueCounts.data?.[a.id] ?? 0} />
            ))}
            {accounts.data!.length > 4 ? (
              <View style={styles.moreAccountsRow}>
                {accounts.data!.slice(4, 10).map((a) => (
                  <PlatformIconTile key={a.id} platform={a.platform} size={32} />
                ))}
              </View>
            ) : null}
          </View>
        )}

        {/* Notifications */}
        <Text variant="subtitle" style={styles.sectionTitle}>
          {t('workspace.notifications.title')}
        </Text>
        {notifications.isError ? (
          <ErrorState error={toAppError(notifications.error)} onRetry={() => notifications.refetch()} />
        ) : notifications.isLoading ? (
          <View style={{ gap: 8 }}>
            {[0, 1].map((i) => (
              <Skeleton key={i} width="100%" height={48} radius={theme.radius.large} />
            ))}
          </View>
        ) : (notifications.data?.length ?? 0) === 0 ? (
          <Card variant="outlined" padding="md">
            <EmptyState icon="notifications-outline" title={t('workspace.notifications.empty')} />
          </Card>
        ) : (
          <Card variant="outlined" padding="md" style={{ gap: 4 }}>
            {notifications.data!.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </Card>
        )}

        {/* Upcoming */}
        <Text variant="subtitle" style={styles.sectionTitle}>
          {t('workspace.dashboard.recentPosts')}
        </Text>
      </View>
    ),
    [t, theme, kpis, stats, accounts, queueCounts.data, failed, notifications],
  );

  return (
    <SafeAreaContainer edges={['top']}>
      {upcoming.isError ? (
        <View style={styles.listContent}>
          {header}
          <ErrorState error={toAppError(upcoming.error)} onRetry={() => upcoming.refetch()} />
        </View>
      ) : (
        <FlashList
          data={upcoming.data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UpcomingPostRow post={item} workspaceName={currentWorkspace?.name} workspaceIcon={currentWorkspace?.icon} />
          )}
          ListHeaderComponent={header}
          ListEmptyComponent={
            upcoming.isLoading ? (
              <View style={{ gap: 8, paddingHorizontal: 20 }}>
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
      )}
      <WorkspaceSwitcher visible={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 20, paddingBottom: 32 },
  headerBlock: { gap: 16, paddingTop: 4, paddingBottom: 8 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCell: { width: '47%' },
  sectionTitle: { marginTop: 4 },
  accountsLoading: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  moreAccountsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
