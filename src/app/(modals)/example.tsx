import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, IconButton, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useTranslations } from '@/i18n';

/** Placeholder modal — demonstrates the (modals) presentation group. */
export default function ExampleModal() {
  const t = useTranslations();
  return (
    <SafeAreaContainer>
      <PageContainer scroll={false}>
        <View style={{ alignItems: 'flex-end', paddingTop: 8 }}>
          <IconButton icon="close" accessibilityLabel={t('workspace.settings.cancel')} onPress={() => router.back()} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
          <Text variant="title" align="center">
            {t('comingSoon')}
          </Text>
          <Button label={t('workspace.settings.cancel')} onPress={() => router.back()} fullWidth />
        </View>
      </PageContainer>
    </SafeAreaContainer>
  );
}
