import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, Chip, IconButton, PageContainer, SafeAreaContainer, Switch, Text } from '@/components/ui';
import { setLanguage } from '@/i18n';
import { useAppStore, type Language, type ThemeMode } from '@/store';
import { useTheme, useThemeControls } from '@/theme';

const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];
const LANGUAGES: Language[] = ['en', 'ru'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
      <Text variant="caption" color="muted" style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {title}
      </Text>
      <Card>{children}</Card>
    </View>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mode, setMode } = useThemeControls();
  const language = useAppStore((s) => s.language);
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled);

  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer>
        <View style={styles.header}>
          <IconButton icon="chevron-back" accessibilityLabel={t('common.back')} onPress={() => router.back()} />
          <Text variant="title">{t('screens.settings.title')}</Text>
        </View>

        <Section title={t('screens.settings.appearance')}>
          <View style={styles.chipRow}>
            {THEME_MODES.map((m) => (
              <Chip
                key={m}
                label={t(`screens.settings.theme.${m}`)}
                selected={mode === m}
                onPress={() => setMode(m)}
              />
            ))}
          </View>
        </Section>

        <Section title={t('screens.settings.language')}>
          <View style={styles.chipRow}>
            {LANGUAGES.map((lng) => (
              <Chip
                key={lng}
                label={lng.toUpperCase()}
                selected={language === lng}
                onPress={() => setLanguage(lng)}
              />
            ))}
          </View>
        </Section>

        <Section title={t('screens.settings.notifications')}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Ionicons name="notifications-outline" size={20} color={theme.colors.foreground} />
              <Text variant="body">{t('screens.settings.notifications')}</Text>
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabel: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
