import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Chip, IconButton, PageContainer, SafeAreaContainer, Switch, Text } from '@/components/ui';
import {
  LANGUAGE_LABELS,
  SUPPORTED_LOCALES,
  setAppLocale,
  useLocale,
  useTranslations,
} from '@/i18n';
import { useAppStore, type ThemeMode } from '@/store';
import { useTheme, useThemeControls } from '@/theme';

const THEME_MODES: { mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: 'system', icon: 'phone-portrait-outline' },
  { mode: 'light', icon: 'sunny-outline' },
  { mode: 'dark', icon: 'moon-outline' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
      <Text variant="caption" color="muted" style={styles.sectionLabel}>
        {title}
      </Text>
      <Card>{children}</Card>
    </View>
  );
}

export default function SettingsScreen() {
  const t = useTranslations();
  const theme = useTheme();
  const { mode, setMode } = useThemeControls();
  const locale = useLocale();
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);

  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer>
        <View style={styles.header}>
          <IconButton icon="chevron-back" accessibilityLabel={t('workspace.settings.cancel')} onPress={() => router.back()} />
          <Text variant="title">{t('workspace.sidebar.settings')}</Text>
        </View>

        <Section title={t('workspace.settings.themeLabel')}>
          <View style={styles.themeRow}>
            {THEME_MODES.map(({ mode: m, icon }) => {
              const selected = mode === m;
              return (
                <Pressable
                  key={m}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setMode(m)}
                  style={[
                    styles.themeChip,
                    {
                      backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                      borderRadius: theme.radius.medium,
                    },
                  ]}
                >
                  <Ionicons
                    name={icon}
                    size={22}
                    color={selected ? theme.colors.primaryForeground : theme.colors.muted}
                  />
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={t('mobile.language.title')}>
          <View style={styles.chipRow}>
            {SUPPORTED_LOCALES.map((lng) => (
              <Chip
                key={lng}
                label={LANGUAGE_LABELS[lng]}
                selected={locale === lng}
                onPress={() => setAppLocale(lng)}
              />
            ))}
          </View>
        </Section>

        <Section title={t('workspace.sidebar.notifications')}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Ionicons name="notifications-outline" size={20} color={theme.colors.foreground} />
              <Text variant="body">{t('workspace.sidebar.notifications')}</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </View>
        </Section>
      </PageContainer>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  sectionLabel: { textTransform: 'uppercase', letterSpacing: 0.6 },
  themeRow: { flexDirection: 'row', gap: 10 },
  themeChip: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
