import { View } from 'react-native';

import { EmptyState, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

export default function CalendarScreen() {
  const t = useTranslations();
  const theme = useTheme();
  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer scroll={false}>
        <View style={{ paddingVertical: theme.spacing.lg }}>
          <Text variant="heading">{t('workspace.sidebar.calendar')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="calendar-outline" title={t('comingSoon')} />
        </View>
      </PageContainer>
    </SafeAreaContainer>
  );
}
