import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BottomSheet, Text } from '@/components/ui';
import {
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  setAppLocale,
  useLocale,
  useTranslations,
} from '@/i18n';
import { useTheme } from '@/theme';

/**
 * Single language switcher used everywhere a locale can be changed (auth screens,
 * Settings). Reads/writes the same MMKV-persisted store as the rest of the app via
 * `useLocale()`/`setAppLocale()` — there is no separate switcher state.
 */
export function LanguageSwitcher() {
  const theme = useTheme();
  const t = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const currentFlag = isSupportedLocale(locale) ? LANGUAGE_FLAGS[locale] : '🌐';

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('mobile.language.title')}
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.pill,
          },
        ]}
      >
        <Text variant="caption">{currentFlag}</Text>
        <Text variant="caption" color="muted">
          {t('mobile.language.title')}
        </Text>
        <Ionicons name="chevron-down" size={12} color={theme.colors.muted} />
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text variant="subtitle" style={{ marginBottom: theme.spacing.xs }}>
          {t('mobile.language.title')}
        </Text>
        <View style={{ gap: theme.spacing.xxs }}>
          {SUPPORTED_LOCALES.map((lng) => {
            const selected = locale === lng;
            return (
              <Pressable
                key={lng}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setAppLocale(lng);
                  setOpen(false);
                }}
                style={[
                  styles.row,
                  {
                    backgroundColor: selected ? theme.colors.primarySubtle : 'transparent',
                    borderRadius: theme.radius.medium,
                  },
                ]}
              >
                <Text variant="body">{LANGUAGE_FLAGS[lng]}</Text>
                <Text variant="body" style={{ flex: 1 }}>
                  {LANGUAGE_LABELS[lng]}
                </Text>
                {selected ? <Ionicons name="checkmark" size={20} color={theme.colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    alignSelf: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
