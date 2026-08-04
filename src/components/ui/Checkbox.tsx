import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled = false, error = false }: CheckboxProps) {
  const theme = useTheme();
  const c = theme.colors;
  const borderColor = error ? c.danger : checked ? c.primary : c.borderStrong;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={[styles.row, { opacity: disabled ? 0.5 : 1 }]}
      hitSlop={6}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked ? c.primary : 'transparent',
            borderColor,
            borderRadius: theme.radius.small,
          },
        ]}
      >
        {checked ? <Ionicons name="checkmark" size={16} color={c.primaryForeground} /> : null}
      </View>
      {typeof label === 'string' ? (
        <Text variant="body" style={styles.label}>
          {label}
        </Text>
      ) : (
        label
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  box: { width: 22, height: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});
