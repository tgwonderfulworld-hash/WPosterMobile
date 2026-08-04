import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

export interface PageContainerProps {
  children: ReactNode;
  /** Wrap content in a ScrollView (default true). */
  scroll?: boolean;
  /** Avoid the keyboard (useful for forms). */
  keyboardAvoiding?: boolean;
  contentStyle?: ViewStyle;
  /** Horizontal padding uses theme spacing `xl` by default. */
  padded?: boolean;
}

const MAX_WIDTH = 640;

export function PageContainer({
  children,
  scroll = true,
  keyboardAvoiding = false,
  contentStyle,
  padded = true,
}: PageContainerProps) {
  const theme = useTheme();
  const inner: ViewStyle = {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: padded ? theme.spacing.xl : 0,
    ...contentStyle,
  };

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{ flexGrow: 1 }, inner]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, inner]}>{children}</View>
  );

  if (!keyboardAvoiding) return body;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {body}
    </KeyboardAvoidingView>
  );
}
