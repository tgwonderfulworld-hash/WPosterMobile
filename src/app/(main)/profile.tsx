import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, PageContainer, SafeAreaContainer, Text } from '@/components/ui';
import { useLogout } from '@/features/auth';
import {
  useActiveWorkspaceId,
  useUserProfile,
  useWorkspaces,
} from '@/features/workspace';
import { useTranslations } from '@/i18n';
import { useAuthStore } from '@/store';
import { useTheme } from '@/theme';

interface LinkRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
}

function LinkRow({ icon, label, value, onPress }: LinkRowProps) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress}>
      <Card variant="outlined" padding="md">
        <View style={styles.linkRow}>
          <Ionicons name={icon} size={22} color={theme.colors.foreground} />
          <Text variant="body" style={{ flex: 1 }}>
            {label}
          </Text>
          {value ? (
            <Text variant="small" color="muted" numberOfLines={1} style={styles.linkValue}>
              {value}
            </Text>
          ) : null}
          <Ionicons name="chevron-forward" size={20} color={theme.colors.subtle} />
        </View>
      </Card>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const t = useTranslations();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const profile = useUserProfile();
  const workspaces = useWorkspaces();
  const active = useActiveWorkspaceId();
  const logout = useLogout();

  const currentWorkspace = workspaces.data?.find((w) => w.id === active.data);
  const displayName =
    profile.data?.display_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    '';
  const avatarUrl =
    profile.data?.avatar_url ?? (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <SafeAreaContainer edges={['top']}>
      <PageContainer>
        <View style={{ paddingVertical: theme.spacing.lg }}>
          <Text variant="heading">{t('workspace.sidebar.profile')}</Text>
        </View>

        <Card>
          <View style={styles.userRow}>
            <Avatar name={displayName} uri={avatarUrl} size={56} />
            <View style={{ flex: 1 }}>
              <Text variant="subtitle" numberOfLines={1}>
                {displayName}
              </Text>
              <Text variant="small" color="muted" numberOfLines={1}>
                {user?.email}
              </Text>
            </View>
          </View>
        </Card>

        <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <LinkRow
            icon="briefcase-outline"
            label={t('workspace.sidebar.workspace')}
            value={currentWorkspace ? `${currentWorkspace.icon ?? ''} ${currentWorkspace.name}` : undefined}
            onPress={() => router.push('/(main)/dashboard')}
          />
          <LinkRow
            icon="link-outline"
            label={t('workspace.sidebar.connectedAccounts')}
            onPress={() => router.push('/(main)/connected-accounts')}
          />
          <LinkRow
            icon="settings-outline"
            label={t('workspace.sidebar.settings')}
            onPress={() => router.push('/(main)/settings')}
          />
        </View>

        <Button
          label={t('workspace.settings.logout')}
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
  linkValue: { maxWidth: 120 },
});
