import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { PlatformBadge, PlatformIcon } from '@/components/platform';
import { Badge, Card, Text } from '@/components/ui';
import { POST_STATUS_LABEL_KEY, POST_STATUS_TONE } from '@/features/workspace/postStatus';
import { useFormatter, useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

import { resolvePostTitle } from '../entry';
import type { CalendarPost } from '../types';

export interface PostCardProps {
  post: CalendarPost;
  /** Denser layout for Month day-sheets / Week columns. */
  compact?: boolean;
  workspaceName?: string;
  workspaceIcon?: string;
}

/** The calendar publication card — ТЗ №4 §3: image, title, platforms, time, status, workspace. */
export function PostCard({ post, compact = false, workspaceName, workspaceIcon }: PostCardProps) {
  const theme = useTheme();
  const t = useTranslations();
  const format = useFormatter();

  const title = resolvePostTitle(post, t('workspace.calendar.untitledPost'));
  const when = format.dateTime(new Date(post.dateIso), { dateStyle: compact ? undefined : 'medium', timeStyle: 'short' });
  const thumbSize = compact ? 40 : 52;

  return (
    <Card variant="outlined" padding={compact ? 'sm' : 'md'} style={styles.row}>
      {post.cover_image_url ? (
        <Image
          source={{ uri: post.cover_image_url }}
          style={[styles.thumb, { width: thumbSize, height: thumbSize }]}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View
          style={[
            styles.thumb,
            styles.thumbFallback,
            { width: thumbSize, height: thumbSize, backgroundColor: theme.colors.surface },
          ]}
        >
          {post.platforms[0] ? (
            <PlatformIcon platform={post.platforms[0]} size={thumbSize * 0.45} />
          ) : (
            <Ionicons name="document-text-outline" size={thumbSize * 0.45} color={theme.colors.subtle} />
          )}
        </View>
      )}

      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.titleRow}>
          <Text variant={compact ? 'body' : 'bodyStrong'} numberOfLines={1} style={{ flex: 1 }}>
            {title}
          </Text>
          <Badge label={t(POST_STATUS_LABEL_KEY[post.publish_status])} tone={POST_STATUS_TONE[post.publish_status]} />
        </View>

        <Text variant="caption" color="subtle">
          {when}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.platformRow}>
            {post.platforms.slice(0, compact ? 3 : 4).map((p) => (
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
  thumb: { borderRadius: 10 },
  thumbFallback: { alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  platformRow: { flexDirection: 'row', gap: 4 },
  workspaceLabel: { maxWidth: 120 },
});
