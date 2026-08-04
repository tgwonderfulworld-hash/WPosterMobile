import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { EmptyState, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useTheme } from '@/theme';

export default function CalendarScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer scroll={false}>
        <View style={{ paddingVertical: theme.spacing.lg }}>
          <Text variant="heading">{t('screens.calendar.title')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState icon="calendar-outline" title={t('screens.calendar.empty')} />
        </View>
      </PageContainer>
    </SafeAreaContainer>
  );
}
