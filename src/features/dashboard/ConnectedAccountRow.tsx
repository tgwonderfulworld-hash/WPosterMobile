import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { PlatformIconTile } from '@/components/platform';
import { Badge, Card, Text } from '@/components/ui';
import type { BadgeTone } from '@/components/ui';
import type { ConnectedAccount, ConnectedAccountStatus } from '@/features/workspace';
import { useFormatter, useTranslations } from '@/i18n';
import { getPlatformLabel } from '@/lib/platforms/registry';

const STATUS_TONE: Record<ConnectedAccountStatus, BadgeTone> = {
  connected: 'success',
  disconnected: 'neutral',
  error: 'danger',
  expired: 'warning',
};

const STATUS_KEY: Record<ConnectedAccountStatus, string> = {
  connected: 'workspace.integrations.connected',
  disconnected: 'workspace.integrations.disconnectedStatus',
  error: 'workspace.integrations.disconnectedStatus',
  expired: 'workspace.integrations.disconnectedStatus',
};

export interface ConnectedAccountRowProps {
  account: ConnectedAccount;
  queueCount?: number;
}

/** Dashboard preview row — logo, name, status, last-updated, errors, queue count. */
export function ConnectedAccountRow({ account, queueCount = 0 }: ConnectedAccountRowProps) {
  const t = useTranslations();
  const format = useFormatter();
  const title = account.display_name || account.handle || getPlatformLabel(account.platform);
  const needsAttention = account.status === 'error' || account.status === 'expired';

  return (
    <Card variant="outlined" padding="md" style={styles.row}>
      {account.avatar_url ? (
        <Image source={{ uri: account.avatar_url }} style={styles.avatar} contentFit="cover" transition={150} />
      ) : (
        <PlatformIconTile platform={account.platform} size={40} />
      )}

      <View style={{ flex: 1, gap: 3 }}>
        <View style={styles.titleRow}>
          <Text variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>
            {title}
          </Text>
          <Badge label={t(STATUS_KEY[account.status])} tone={STATUS_TONE[account.status]} />
        </View>

        {account.updated_at ? (
          <Text variant="caption" color="muted" numberOfLines={1}>
            {t('workspace.dashboard.updatedDate', {
              date: format.dateTime(new Date(account.updated_at), { dateStyle: 'medium' }),
            })}
          </Text>
        ) : null}

        {needsAttention && account.disconnect_reason ? (
          <Text variant="caption" color="danger" numberOfLines={2}>
            {account.disconnect_reason}
          </Text>
        ) : null}

        {queueCount > 0 ? (
          <Text variant="caption" color="primary">
            {t('mobile.dashboard.queuedCount', { count: queueCount })}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
