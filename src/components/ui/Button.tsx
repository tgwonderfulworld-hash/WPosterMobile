/**
 * Primary action button. Supports variants, sizes, loading and disabled states,
 * optional leading/trailing icons and full-width layout. Colors come from theme.
 *
 * NOTE: uses an ARRAY style (not a `style={({pressed}) => ...}` function). Under
 * NativeWind's JSX interop (jsxImportSource) a function `style` on Pressable is
 * dropped, so we style with an array and use `android_ripple` for press feedback.
 */
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { useTheme, type Theme } from '@/theme';

import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

const SIZE: Record<ButtonSize, { height: number; paddingH: number; font: 'button' | 'body' }> = {
  sm: { height: 38, paddingH: 14, font: 'button' },
  md: { height: 48, paddingH: 18, font: 'button' },
  lg: { height: 56, paddingH: 22, font: 'button' },
};

function palette(theme: Theme, variant: ButtonVariant) {
  const c = theme.colors;
  switch (variant) {
    case 'primary':
      return { bg: c.primary, fg: c.primaryForeground, border: 'transparent' };
    case 'danger':
      return { bg: c.danger, fg: c.primaryForeground, border: 'transparent' };
    case 'secondary':
      return { bg: c.surface, fg: c.foreground, border: 'transparent' };
    case 'outline':
      return { bg: 'transparent', fg: c.foreground, border: c.borderStrong };
    case 'ghost':
      return { bg: 'transparent', fg: c.primary, border: 'transparent' };
  }
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const dims = SIZE[size];
  const isDisabled = disabled || loading;
  const p = palette(theme, variant);
  const rippleColor = variant === 'primary' || variant === 'danger' ? 'rgba(255,255,255,0.20)' : theme.colors.primarySubtle;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      android_ripple={{ color: rippleColor }}
      style={[
        styles.base,
        {
          height: dims.height,
          paddingHorizontal: dims.paddingH,
          borderRadius: theme.radius.medium,
          backgroundColor: p.bg,
          borderColor: p.border,
          borderWidth: variant === 'outline' ? StyleSheet.hairlineWidth * 2 : 0,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <Ionicons name={leftIcon} size={18} color={p.fg} /> : null}
          <Text variant={dims.font} style={{ color: p.fg }}>
            {label}
          </Text>
          {rightIcon ? <Ionicons name={rightIcon} size={18} color={p.fg} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
