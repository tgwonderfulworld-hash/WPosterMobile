import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export type IconButtonVariant = 'solid' | 'soft' | 'ghost';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  accessibilityLabel: string;
  style?: ViewStyle;
}

const DIM: Record<IconButtonSize, { box: number; icon: number }> = {
  sm: { box: 34, icon: 18 },
  md: { box: 42, icon: 22 },
  lg: { box: 52, icon: 26 },
};

// Array style (not a function) so NativeWind's JSX interop keeps it; ripple gives
// press feedback. See Button.tsx for the rationale.
export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const theme = useTheme();
  const dim = DIM[size];
  const c = theme.colors;
  const bg = variant === 'solid' ? c.primary : variant === 'soft' ? c.primarySubtle : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      android_ripple={{ color: c.primarySubtle, radius: dim.box / 2, borderless: true }}
      style={[
        styles.base,
        {
          width: dim.box,
          height: dim.box,
          borderRadius: theme.radius.medium,
          opacity: disabled ? 0.5 : 1,
          backgroundColor: bg,
        },
        style,
      ]}
    >
      <Ionicons
        name={icon}
        size={dim.icon}
        color={variant === 'solid' ? c.primaryForeground : c.foreground}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
