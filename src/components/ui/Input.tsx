import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Error message (already translated). Puts the field in the error state. */
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Optional trailing element (e.g. password reveal toggle). */
  rightAccessory?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, leftIcon, rightAccessory, containerStyle, editable = true, onFocus, onBlur, ...rest },
  ref,
) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const c = theme.colors;

  const borderColor = error ? c.danger : focused ? c.primary : c.border;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text variant="caption" color="muted" style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          {
            backgroundColor: editable ? c.surface : c.card,
            borderColor,
            borderRadius: theme.radius.medium,
            opacity: editable ? 1 : 0.6,
          },
        ]}
      >
        {leftIcon ? <Ionicons name={leftIcon} size={20} color={c.subtle} style={styles.leftIcon} /> : null}
        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor={c.subtle}
          selectionColor={c.primary}
          style={[styles.input, { color: c.foreground, fontFamily: theme.fontFamily.sans }]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightAccessory ? <View style={styles.rightAccessory}>{rightAccessory}</View> : null}
      </View>

      {error ? (
        <Text variant="caption" color="danger" style={styles.helper}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="subtle" style={styles.helper}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

/** Convenience trailing toggle for reveal-password buttons. */
export function InputIconToggle({
  active,
  onToggle,
  accessibilityLabel,
}: {
  active: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
}) {
  const theme = useTheme();
  return (
    <Pressable onPress={onToggle} accessibilityRole="button" accessibilityLabel={accessibilityLabel} hitSlop={8}>
      <Ionicons name={active ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.subtle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { marginLeft: 2 },
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 14, minHeight: 50 },
  leftIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, paddingVertical: 12 },
  rightAccessory: { marginLeft: 8 },
  helper: { marginLeft: 2 },
});
