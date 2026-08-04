import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card, EmptyState, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useAuthStore } from '@/store';
import { useTheme } from '@/theme';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);

  const name =
    (user?.user_metadata?.full_name as string | undefined) ?? user?.email?.split('@')[0] ?? '';

  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer>
        <View style={{ paddingVertical: theme.spacing.lg, gap: 4 }}>
          <Text variant="caption" color="muted">
            {t('screens.dashboard.title')}
          </Text>
          <Text variant="heading">👋 {name}</Text>
        </View>

        <Card>
          <EmptyState icon="rocket-outline" title={t('screens.dashboard.empty')} />
        </Card>
      </PageContainer>
    </SafeAreaContainer>
  );
}
