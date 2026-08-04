import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme';

export interface CardProps extends ViewProps {
  /** `elevated` casts a shadow; `outlined` uses a border; `filled` uses surface. */
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ variant = 'elevated', padding = 'md', style, ...rest }: CardProps) {
  const theme = useTheme();
  const pad = padding === 'none' ? 0 : theme.spacing[padding === 'sm' ? 'md' : padding === 'lg' ? 'xl' : 'lg'];

  return (
    <View
      style={[
        {
          backgroundColor: variant === 'filled' ? theme.colors.surface : theme.colors.card,
          borderRadius: theme.radius.large,
          padding: pad,
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: theme.colors.border,
        },
        variant === 'elevated' ? theme.shadows.sm : null,
        style,
      ]}
      {...rest}
    />
  );
}
