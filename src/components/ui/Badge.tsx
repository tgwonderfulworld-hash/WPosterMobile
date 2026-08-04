import { StyleSheet, View } from 'react-native';

import { useTheme, type Theme } from '@/theme';

import { Text } from './Text';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps {
  label: string | number;
  tone?: BadgeTone;
}

function toneColors(theme: Theme, tone: BadgeTone) {
  const c = theme.colors;
  const map: Record<BadgeTone, { bg: string; fg: string }> = {
    neutral: { bg: c.surface, fg: c.muted },
    primary: { bg: c.primarySubtle, fg: c.primary },
    success: { bg: c.successSubtle, fg: c.success },
    warning: { bg: c.warningSubtle, fg: c.warning },
    danger: { bg: c.dangerSubtle, fg: c.danger },
    info: { bg: c.infoSubtle, fg: c.info },
  };
  return map[tone];
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const theme = useTheme();
  const { bg, fg } = toneColors(theme, tone);
  return (
    <View style={[styles.badge, { backgroundColor: bg, borderRadius: theme.radius.pill }]}>
      <Text variant="caption" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
});
