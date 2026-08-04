import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export interface DividerProps {
  /** Optional centered label ("or"). */
  label?: string;
  spacing?: number;
}

export function Divider({ label, spacing = 16 }: DividerProps) {
  const theme = useTheme();
  const line = { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.border };

  if (!label) return <View style={[line, { marginVertical: spacing }]} />;

  return (
    <View style={[styles.row, { marginVertical: spacing }]}>
      <View style={line} />
      <Text variant="caption" color="subtle" style={styles.label}>
        {label}
      </Text>
      <View style={line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { textTransform: 'uppercase', letterSpacing: 0.6 },
});
