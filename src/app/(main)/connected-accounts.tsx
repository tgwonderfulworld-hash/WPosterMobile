import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PlatformIconTile } from '@/components/platform';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  IconButton,
  SafeAreaContainer,
  Skeleton,
  Text,
} from '@/components/ui';
import {
  useActiveWorkspaceId,
  useConnectedAccounts,
  type ConnectedAccount,
} from '@/features/workspace';
import { getPlatformLabel } from '@/lib/platforms/registry';
import { useTranslations } from '@/i18n';
import { toAppError } from '@/utils/errors';
import { useTheme } from '@/theme';

function AccountRow({ account }: { account: ConnectedAccount }) {
  const t = useTranslations();
  const connected = account.status === 'connected';
  const title = account.display_name || account.handle || getPlatformLabel(account.platform);

  return (
    <Card variant="outlined" padding="md" style={styles.row}>
      {account.avatar_url ? (
        <Image source={{ uri: account.avatar_url }} style={styles.avatar} contentFit="cover" transition={150} />
      ) : (
        <PlatformIconTile platform={account.platform} size={44} />
      )}
      <View style={{ flex: 1, gap: 3 }}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color="muted" numberOfLines={1}>
          {getPlatformLabel(account.platform)}
          {account.handle ? ` · @${account.handle}` : ''}
        </Text>
      </View>
      <Badge
        label={connected ? t('workspace.integrations.connected') : t('workspace.integrations.disconnectedStatus')}
        tone={connected ? 'success' : 'danger'}
      />
    </Card>
  );
}

export default function ConnectedAccountsScreen() {
  const t = useTranslations();
  const theme = useTheme();
  const active = useActiveWorkspaceId();
  const accounts = useConnectedAccounts(active.data ?? undefined);

  return (
    <SafeAreaContainer edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" accessibilityLabel={t('workspace.settings.cancel')} onPress={() => router.back()} />
        <Text variant="title">{t('workspace.sidebar.connectedAccounts')}</Text>
      </View>

      {accounts.isError ? (
        <ErrorState error={toAppError(accounts.error)} onRetry={() => accounts.refetch()} />
      ) : (
        <FlashList
          data={accounts.data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AccountRow account={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            accounts.isLoading ? (
              <View style={{ gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} width="100%" height={72} radius={theme.radius.large} />
                ))}
              </View>
            ) : (
              <EmptyState icon="link-outline" title={t('workspace.dashboard.noChannelsConnected')} />
            )
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
});
