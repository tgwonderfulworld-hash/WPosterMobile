import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, IconButton, Skeleton, Text } from '@/components/ui';
import { useActiveWorkspaceId, useUserProfile, useWorkspaces } from '@/features/workspace';
import { useTranslations } from '@/i18n';
import { useAuthStore } from '@/store';
import { useTheme } from '@/theme';

/** Top-of-dashboard identity row: avatar, name, current workspace, Profile button. */
export function DashboardHeader({ onOpenSwitcher }: { onOpenSwitcher: () => void }) {
  const t = useTranslations();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const profile = useUserProfile();
  const workspaces = useWorkspaces();
  const active = useActiveWorkspaceId();

  const displayName =
    profile.data?.display_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    '';
  const avatarUrl = profile.data?.avatar_url ?? (user?.user_metadata?.avatar_url as string | undefined) ?? null;
  const currentWorkspace = workspaces.data?.find((w) => w.id === active.data);

  return (
    <View style={styles.container}>
      <View style={styles.identityRow}>
        <Pressable
          style={styles.identity}
          onPress={() => router.push('/(main)/profile')}
          accessibilityRole="button"
        >
          <Avatar uri={avatarUrl} name={displayName} size={48} />
          <View style={{ flex: 1 }}>
            <Text variant="caption" color="muted">
              {t('workspace.dashboard.welcome')}
            </Text>
            <Text variant="heading" numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </Pressable>
        <IconButton
          icon="person-circle-outline"
          variant="soft"
          accessibilityLabel={t('workspace.sidebar.profile')}
          onPress={() => router.push('/(main)/profile')}
        />
      </View>

      <Pressable
        onPress={onOpenSwitcher}
        accessibilityRole="button"
        style={[styles.pill, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      >
        <View style={[styles.pillIcon, { backgroundColor: currentWorkspace?.color || theme.colors.surface }]}>
          <Text variant="caption">{currentWorkspace?.icon || '🏢'}</Text>
        </View>
        {active.isLoading || workspaces.isLoading ? (
          <Skeleton width={110} height={16} />
        ) : (
          <Text variant="bodyStrong" numberOfLines={1} style={styles.pillLabel}>
            {currentWorkspace?.name ?? '—'}
          </Text>
        )}
        <Ionicons name="chevron-expand" size={16} color={theme.colors.subtle} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, paddingTop: 12 },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  pillIcon: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pillLabel: { maxWidth: 180 },
});
