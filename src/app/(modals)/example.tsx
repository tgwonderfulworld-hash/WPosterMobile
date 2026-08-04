import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button, PageContainer, SafeAreaContainer, Text } from '@/components/ui';

/** Placeholder modal — demonstrates the (modals) presentation group. */
export default function ExampleModal() {
  const { t } = useTranslation();
  return (
    <SafeAreaContainer>
      <PageContainer scroll={false}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
          <Text variant="title" align="center">
            {t('common.appName')}
          </Text>
          <Button label={t('common.close')} onPress={() => router.back()} fullWidth />
        </View>
      </PageContainer>
    </SafeAreaContainer>
  );
}
