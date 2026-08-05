import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import type { NotificationLevel, WorkspaceNotification } from '@/features/workspace';
import { useFormatter } from '@/i18n';
import { useTheme, type ThemeColors } from '@/theme';

const LEVEL_ICON: Record<NotificationLevel, keyof typeof Ionicons.glyphMap> = {
  critical: 'alert-circle',
  error: 'close-circle',
  warning: 'warning',
  success: 'checkmark-circle',
  info: 'information-circle',
};

const LEVEL_COLOR: Record<NotificationLevel, keyof ThemeColors> = {
  critical: 'danger',
  error: 'danger',
  warning: 'warning',
  success: 'success',
  info: 'info',
};

export function NotificationRow({ notification }: { notification: WorkspaceNotification }) {
  const theme = useTheme();
  const format = useFormatter();
  const color = theme.colors[LEVEL_COLOR[notification.level]];
  const when = format.dateTime(new Date(notification.created_at), { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <View style={styles.row}>
      <Ionicons name={LEVEL_ICON[notification.level]} size={20} color={color} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyStrong" weight={notification.isRead ? '500' : '700'} numberOfLines={1}>
          {notification.title}
        </Text>
        {notification.body ? (
          <Text variant="caption" color="muted" numberOfLines={2}>
            {notification.body}
          </Text>
        ) : null}
        <Text variant="caption" color="subtle">
          {when}
        </Text>
      </View>
      {!notification.isRead ? <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
});
