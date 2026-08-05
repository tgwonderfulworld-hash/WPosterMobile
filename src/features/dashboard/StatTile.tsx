import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Card, Skeleton, Text } from '@/components/ui';
import { useTheme } from '@/theme';

export interface StatTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: number;
  loading?: boolean;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'muted';
}

export function StatTile({ icon, label, value, loading, tone = 'primary' }: StatTileProps) {
  const theme = useTheme();
  const c = theme.colors;
  const toneColor = {
    primary: c.primary,
    success: c.success,
    warning: c.warning,
    danger: c.danger,
    muted: c.muted,
  }[tone];

  return (
    <Card variant="outlined" padding="md" style={styles.tile}>
      <View style={[styles.iconWrap, { backgroundColor: c.surface }]}>
        <Ionicons name={icon} size={18} color={toneColor} />
      </View>
      {loading ? (
        <Skeleton width={40} height={26} />
      ) : (
        <Text variant="heading" style={styles.value}>
          {value ?? 0}
        </Text>
      )}
      <Text variant="caption" color="muted" numberOfLines={1}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, minWidth: 0, gap: 8 },
  iconWrap: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 24, lineHeight: 28 },
});
