import { StyleSheet, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import type { Post } from '@/features/workspace';
import { useFormatter, useTranslations } from '@/i18n';
import { toast } from '@/store';
import { useTheme } from '@/theme';

export interface FailedPostCardProps {
  post: Post;
}

/**
 * Web retries a failed post via a server action (`retryPublication`, a Next.js
 * "use server" function operating on `post_connected_account_publications`
 * with a service-role client) — there is no REST endpoint for it, and Web's
 * other Next.js API routes authenticate via SSR cookies, not the Bearer token
 * mobile sends, so none of them are callable from this app. Retrying/editing
 * client-side against the real tables would need service-role access, which
 * must never ship in a mobile client. Both actions are real but not yet
 * reachable from mobile — they surface an honest toast instead of pretending
 * to work.
 */
export function FailedPostCard({ post }: FailedPostCardProps) {
  const theme = useTheme();
  const t = useTranslations();
  const format = useFormatter();
  const when = format.dateTime(new Date(post.updated_at), { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <Card variant="outlined" padding="md" style={[styles.card, { borderColor: theme.colors.dangerSubtle }]}>
      <Text variant="bodyStrong" numberOfLines={1}>
        {post.title || '—'}
      </Text>
      <Text variant="caption" color="danger" numberOfLines={2}>
        {post.publish_error || t('mobile.net.unknown')}
      </Text>
      <Text variant="caption" color="subtle">
        {when}
      </Text>
      <View style={styles.actions}>
        <Button
          label={t('mobile.common.retry')}
          variant="outline"
          size="sm"
          onPress={() => toast.info(t('mobile.dashboard.retryUnavailable'))}
        />
        <Button
          label={t('workspace.dashboard.postsManager.edit')}
          variant="ghost"
          size="sm"
          onPress={() => toast.info(t('mobile.dashboard.editUnavailable'))}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
