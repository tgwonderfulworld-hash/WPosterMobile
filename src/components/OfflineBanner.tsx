import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '@/store';
import { useTheme } from '@/theme';

import { Text } from './ui/Text';

/** Slim banner shown while the device is offline. Auto-hides on reconnect. */
export function OfflineBanner() {
  const isOnline = useAppStore((s) => s.isOnline);
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      pointerEvents="none"
      style={[styles.container, { paddingTop: insets.top + 6, backgroundColor: theme.colors.foreground }]}
    >
      <View style={styles.row}>
        <Ionicons name="cloud-offline-outline" size={16} color={theme.colors.background} />
        <Text variant="caption" style={{ color: theme.colors.background }}>
          {t('offline.banner')}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, paddingBottom: 8, zIndex: 900 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
