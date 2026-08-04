import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore, type ToastItem, type ToastVariant } from '@/store';
import { useTheme, type Theme } from '@/theme';

import { Text } from './Text';

function variantStyle(theme: Theme, variant: ToastVariant) {
  const c = theme.colors;
  const map: Record<ToastVariant, { fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
    success: { fg: c.success, icon: 'checkmark-circle' },
    info: { fg: c.info, icon: 'information-circle' },
    warning: { fg: c.warning, icon: 'warning' },
    error: { fg: c.danger, icon: 'alert-circle' },
  };
  return map[variant];
}

function ToastRow({ item }: { item: ToastItem }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const dismiss = useToastStore((s) => s.dismiss);
  const s = variantStyle(theme, item.variant);

  useEffect(() => {
    const id = setTimeout(() => dismiss(item.id), item.durationMs);
    return () => clearTimeout(id);
  }, [item.id, item.durationMs, dismiss]);

  return (
    <Animated.View entering={FadeInUp.springify().damping(18)} exiting={FadeOutUp}>
      <Pressable
        onPress={() => dismiss(item.id)}
        style={[styles.toast, { backgroundColor: theme.colors.card, borderRadius: theme.radius.medium }, theme.shadows.md]}
      >
        <Ionicons name={s.icon} size={20} color={s.fg} />
        <Text variant="small" color="foreground" style={styles.message}>
          {t(item.message)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/** Renders the global toast queue. Mount once, near the root. */
export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + 8 }]}>
      {toasts.map((item) => (
        <ToastRow key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 16, right: 16, gap: 8, zIndex: 1000 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  message: { flex: 1 },
});
