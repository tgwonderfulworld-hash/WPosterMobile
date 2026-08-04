import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChangeText, placeholder, onSubmit, autoFocus }: SearchBarProps) {
  const theme = useTheme();
  const c = theme.colors;
  return (
    <View style={[styles.container, { backgroundColor: c.surface, borderRadius: theme.radius.medium }]}>
      <Ionicons name="search" size={18} color={c.subtle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.subtle}
        selectionColor={c.primary}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        autoCorrect={false}
        style={[styles.input, { color: c.foreground, fontFamily: theme.fontFamily.sans }]}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear">
          <Ionicons name="close-circle" size={18} color={c.subtle} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 44 },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
});
