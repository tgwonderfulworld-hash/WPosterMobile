import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

export interface SafeAreaContainerProps {
  children: ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  /** Background color role. Defaults to `background`. */
  background?: 'background' | 'surface' | 'card';
}

/** Full-screen container that respects safe-area insets and themes the bg. */
export function SafeAreaContainer({
  children,
  edges = ['top', 'bottom'],
  style,
  background = 'background',
}: SafeAreaContainerProps) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors[background] }}>
      <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}
