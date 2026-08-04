import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useLogout } from '@/features/auth';
import { useAuthStore } from '@/store';
import { useTheme } from '@/theme';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const name = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? '';

  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer>
        <View style={{ paddingVertical: theme.spacing.lg }}>
          <Text variant="heading">{t('screens.profile.title')}</Text>
        </View>

        <Card>
          <View style={styles.userRow}>
            <Avatar name={name} uri={user?.user_metadata?.avatar_url as string | undefined} size={56} />
            <View style={{ flex: 1 }}>
              <Text variant="subtitle" numberOfLines={1}>
                {name}
              </Text>
              <Text variant="small" color="muted" numberOfLines={1}>
                {user?.email}
              </Text>
            </View>
          </View>
        </Card>

        <Pressable onPress={() => router.push('/(main)/settings')} style={{ marginTop: theme.spacing.lg }}>
          <Card variant="outlined">
            <View style={styles.linkRow}>
              <Ionicons name="settings-outline" size={22} color={theme.colors.foreground} />
              <Text variant="body" style={{ flex: 1 }}>
                {t('screens.settings.title')}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.subtle} />
            </View>
          </Card>
        </Pressable>

        <Button
          label={t('screens.settings.signOut')}
          variant="outline"
          leftIcon="log-out-outline"
          onPress={() => logout.mutate()}
          loading={logout.isPending}
          fullWidth
          style={{ marginTop: theme.spacing.xl }}
        />
      </PageContainer>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
