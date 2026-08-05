import { View } from 'react-native';

import { EmptyState, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

export default function AnalyticsScreen() {
  const t = useTranslations();
  const theme = useTheme();
  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer scroll={false}>
        <View style={{ paddingVertical: theme.spacing.lg }}>
          <Text variant="heading">{t('workspace.sidebar.analytics')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="stats-chart-outline" title={t('comingSoon')} />
        </View>
      </PageContainer>
    </SafeAreaContainer>
  );
}
