import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { BottomSheet, Loader, Text } from '@/components/ui';
import { useTranslations } from '@/i18n';
import { useTheme } from '@/theme';

import { useActiveWorkspaceId, useSwitchWorkspace, useWorkspaces } from '../hooks';
import type { Workspace } from '../types';

export interface WorkspaceRowProps {
  workspace: Workspace;
  active: boolean;
  onPress: () => void;
}

/** A single selectable workspace row — shared by the Dashboard switcher and the Calendar filter sheet. */
export function WorkspaceRow({ workspace, active, onPress }: WorkspaceRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: active ? theme.colors.primarySubtle : 'transparent',
          borderRadius: theme.radius.medium,
        },
      ]}
    >
      <View style={[styles.iconTile, { backgroundColor: workspace.color || theme.colors.surface }]}>
        <Text variant="body">{workspace.icon || '🏢'}</Text>
      </View>
      <Text variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
        {workspace.name}
      </Text>
      {active ? <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} /> : null}
    </Pressable>
  );
}

export function WorkspaceSwitcher({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const t = useTranslations();
  const workspaces = useWorkspaces();
  const active = useActiveWorkspaceId();
  const switchWorkspace = useSwitchWorkspace();

  const onSelect = (id: string) => {
    if (id !== active.data) switchWorkspace.mutate(id);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text variant="subtitle">{t('mobile.workspaceSwitcher.title')}</Text>
      {workspaces.isLoading ? (
        <Loader variant="inline" />
      ) : (workspaces.data?.length ?? 0) === 0 ? (
        <Text variant="body" color="muted">
          {t('mobile.workspaceSwitcher.empty')}
        </Text>
      ) : (
        <View style={styles.list}>
          {workspaces.data!.map((ws) => (
            <WorkspaceRow
              key={ws.id}
              workspace={ws}
              active={ws.id === active.data}
              onPress={() => onSelect(ws.id)}
            />
          ))}
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: 4, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 },
  iconTile: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
