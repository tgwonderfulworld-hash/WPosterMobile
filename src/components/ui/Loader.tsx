import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export interface LoaderProps {
  /** `inline` renders just the spinner; `screen` centers it and fills space. */
  variant?: 'inline' | 'screen';
  size?: 'small' | 'large';
  label?: string;
}

export function Loader({ variant = 'inline', size = 'small', label }: LoaderProps) {
  const theme = useTheme();
  const spinner = <ActivityIndicator size={size} color={theme.colors.primary} />;

  if (variant === 'inline') return spinner;

  return (
    <View style={styles.screen}>
      {spinner}
      {label ? (
        <Text variant="body" color="muted" style={styles.label}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  label: { marginTop: 4 },
});
