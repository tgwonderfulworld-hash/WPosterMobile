/**
 * Typography primitive. All text in the app goes through this so font sizes,
 * weights and colors come from the theme — never hard-coded.
 */
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/theme';
import type { ThemeColors, TypographyVariant } from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  /** Semantic color role from the theme. Defaults to `foreground`. */
  color?: keyof ThemeColors;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  weight?: '400' | '500' | '600' | '700';
}

export function Text({
  variant = 'body',
  color = 'foreground',
  align,
  weight,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const base = theme.typography[variant];
  return (
    <RNText
      style={[
        base,
        { color: theme.colors[color], fontFamily: theme.fontFamily.sans },
        align ? { textAlign: align } : null,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    />
  );
}
