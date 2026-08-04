import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useTheme, type Theme } from '@/theme';

import { Text } from './Text';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  message: string;
}

function toneStyle(theme: Theme, tone: AlertTone) {
  const c = theme.colors;
  const map: Record<AlertTone, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
    info: { bg: c.infoSubtle, fg: c.info, icon: 'information-circle' },
    success: { bg: c.successSubtle, fg: c.success, icon: 'checkmark-circle' },
    warning: { bg: c.warningSubtle, fg: c.warning, icon: 'warning' },
    error: { bg: c.dangerSubtle, fg: c.danger, icon: 'alert-circle' },
  };
  return map[tone];
}

/** Inline, non-dismissable status banner (for form-level errors, notices). */
export function Alert({ tone = 'info', title, message }: AlertProps) {
  const theme = useTheme();
  const s = toneStyle(theme, tone);
  return (
    <View style={[styles.container, { backgroundColor: s.bg, borderRadius: theme.radius.medium }]}>
      <Ionicons name={s.icon} size={20} color={s.fg} style={styles.icon} />
      <View style={styles.body}>
        {title ? (
          <Text variant="bodyStrong" style={{ color: s.fg }}>
            {title}
          </Text>
        ) : null}
        <Text variant="small" style={{ color: s.fg }}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 12, gap: 10, alignItems: 'flex-start' },
  icon: { marginTop: 1 },
  body: { flex: 1, gap: 2 },
});
