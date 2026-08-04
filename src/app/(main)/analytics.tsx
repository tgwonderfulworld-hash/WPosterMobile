import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyState, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useTheme } from '@/theme';

export default function AnalyticsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer scroll={false}>
        <View style={{ paddingVertical: theme.spacing.lg }}>
          <Text variant="heading">{t('screens.analytics.title')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="stats-chart-outline" title={t('screens.analytics.empty')} />
        </View>
      </PageContainer>
    </SafeAreaContainer>
  );
}
