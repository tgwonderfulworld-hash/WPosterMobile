import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Dismiss when tapping the backdrop (default true). */
  dismissOnBackdrop?: boolean;
}

/** Centered dialog with a themed scrim. For sheets, use <BottomSheet/>. */
export function Modal({ visible, onClose, title, children, dismissOnBackdrop = true }: ModalProps) {
  const theme = useTheme();
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]}
        onPress={dismissOnBackdrop ? onClose : undefined}
      >
        <Pressable
          style={[styles.card, { backgroundColor: theme.colors.card, borderRadius: theme.radius.large }, theme.shadows.lg]}
          onPress={(e) => e.stopPropagation()}
        >
          {title ? (
            <View style={styles.header}>
              <Text variant="subtitle" style={styles.title}>
                {title}
              </Text>
              <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={22} color={theme.colors.muted} />
              </Pressable>
            </View>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420, padding: 20, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1 },
});
