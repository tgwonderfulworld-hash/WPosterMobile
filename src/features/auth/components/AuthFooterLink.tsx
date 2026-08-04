import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/theme';

export interface AuthFooterLinkProps {
  prompt: string;
  action: string;
  onPress: () => void;
}

/** "Don't have an account?  Create one" style footer link. */
export function AuthFooterLink({ prompt, action, onPress }: AuthFooterLinkProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Text variant="body" color="muted">
        {prompt}
      </Text>
      <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button">
        <Text variant="bodyStrong" style={{ color: theme.colors.primary }}>
          {action}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
