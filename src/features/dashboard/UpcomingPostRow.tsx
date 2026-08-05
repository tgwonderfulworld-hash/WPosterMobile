import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { PlatformBadge } from '@/components/platform';
import { Badge, Card, Text } from '@/components/ui';
import type { BadgeTone } from '@/components/ui';
import type { Post } from '@/features/workspace';
import { useFormatter, useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

const STATUS_KEY: Record<Post['publish_status'], string> = {
  draft: 'workspace.dashboard.publishStatus.draft',
  scheduled: 'workspace.dashboard.publishStatus.scheduled',
  publishing: 'workspace.dashboard.publishStatus.processing',
  published: 'workspace.dashboard.publishStatus.published',
  failed: 'workspace.dashboard.publishStatus.failed',
};

const STATUS_TONE: Record<Post['publish_status'], BadgeTone> = {
  draft: 'neutral',
  scheduled: 'info',
  publishing: 'warning',
  published: 'success',
  failed: 'danger',
};

export interface UpcomingPostRowProps {
  post: Post;
  workspaceName?: string;
  workspaceIcon?: string;
}

export function UpcomingPostRow({ post, workspaceName, workspaceIcon }: UpcomingPostRowProps) {
  const theme = useTheme();
  const t = useTranslations();
  const format = useFormatter();
  const when = post.scheduled_at
    ? format.dateTime(new Date(post.scheduled_at), { dateStyle: 'medium', timeStyle: 'short' })
    : '';

  return (
    <Card variant="outlined" padding="md" style={styles.row}>
      {post.cover_image_url ? (
        <Image source={{ uri: post.cover_image_url }} style={styles.thumb} contentFit="cover" transition={150} />
      ) : (
        <View style={[styles.thumb, styles.thumbFallback, { backgroundColor: theme.colors.surface }]} />
      )}

      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.titleRow}>
          <Text variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>
            {post.title || '—'}
          </Text>
          <Badge label={t(STATUS_KEY[post.publish_status])} tone={STATUS_TONE[post.publish_status]} />
        </View>

        <Text variant="caption" color="subtle">
          {when}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.platformRow}>
            {post.platforms.slice(0, 4).map((p) => (
              <PlatformBadge key={p} platform={p} showLabel={false} />
            ))}
          </View>
          {workspaceName ? (
            <Text variant="caption" color="muted" numberOfLines={1} style={styles.workspaceLabel}>
              {workspaceIcon} {workspaceName}
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  thumb: { width: 48, height: 48, borderRadius: 10 },
  thumbFallback: { alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  platformRow: { flexDirection: 'row', gap: 4 },
  workspaceLabel: { maxWidth: 120 },
});
