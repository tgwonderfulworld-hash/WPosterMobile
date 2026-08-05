import { StyleSheet, View } from 'react-native';

import { BottomSheet, Button, Chip, Divider, Loader, Text } from '@/components/ui';
import { WorkspaceRow } from '@/features/workspace/components/WorkspaceSwitcher';
import { POST_STATUS_LABEL_KEY } from '@/features/workspace/postStatus';
import { useActiveWorkspaceId, useSwitchWorkspace, useWorkspaces } from '@/features/workspace';
import { useTranslations } from '@/i18n';
import { getEnabledPlatforms } from '@/lib/platforms/registry';

import { ALL_PUBLISH_STATUSES, type CalendarFilters } from '../types';

export interface CalendarFiltersSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: CalendarFilters;
  onChangeFilters: (next: CalendarFilters) => void;
}

/** Workspace / Platform / Status filters — combine together (ТЗ №4 §5). */
export function CalendarFiltersSheet({ visible, onClose, filters, onChangeFilters }: CalendarFiltersSheetProps) {
  const t = useTranslations();
  const workspaces = useWorkspaces();
  const active = useActiveWorkspaceId();
  const switchWorkspace = useSwitchWorkspace();
  const platforms = getEnabledPlatforms();

  const toggleStatus = (status: (typeof ALL_PUBLISH_STATUSES)[number]) => {
    const has = filters.statuses.includes(status);
    const next = has ? filters.statuses.filter((s) => s !== status) : [...filters.statuses, status];
    onChangeFilters({ ...filters, statuses: next.length > 0 ? next : filters.statuses });
  };

  const togglePlatform = (platform: string) => {
    const has = filters.platforms.includes(platform);
    const next = has ? filters.platforms.filter((p) => p !== platform) : [...filters.platforms, platform];
    onChangeFilters({ ...filters, platforms: next });
  };

  const reset = () => {
    onChangeFilters({ statuses: ALL_PUBLISH_STATUSES, platforms: [], search: filters.search });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={['75%']} scrollable>
      <Text variant="subtitle">{t('mobile.calendar.filtersTitle')}</Text>

      <Text variant="caption" color="muted" style={styles.sectionLabel}>
        {t('workspace.sidebar.workspaces')}
      </Text>
      {workspaces.isLoading ? (
        <Loader variant="inline" />
      ) : (
        <View style={styles.workspaceList}>
          {(workspaces.data ?? []).map((ws) => (
            <WorkspaceRow
              key={ws.id}
              workspace={ws}
              active={ws.id === active.data}
              onPress={() => {
                if (ws.id !== active.data) switchWorkspace.mutate(ws.id);
              }}
            />
          ))}
        </View>
      )}

      <Divider spacing={4} />

      <Text variant="caption" color="muted" style={styles.sectionLabel}>
        {t('workspace.posts.filterPlatform')}
      </Text>
      <View style={styles.chipWrap}>
        {platforms.map((p) => (
          <Chip
            key={p.id}
            label={p.label}
            selected={filters.platforms.includes(p.id)}
            onPress={() => togglePlatform(p.id)}
          />
        ))}
      </View>

      <Divider spacing={4} />

      <Text variant="caption" color="muted" style={styles.sectionLabel}>
        {t('workspace.posts.status')}
      </Text>
      <View style={styles.chipWrap}>
        {ALL_PUBLISH_STATUSES.map((status) => (
          <Chip
            key={status}
            label={t(POST_STATUS_LABEL_KEY[status])}
            selected={filters.statuses.includes(status)}
            onPress={() => toggleStatus(status)}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Button label={t('workspace.posts.filterReset')} variant="outline" onPress={reset} style={{ flex: 1 }} />
        <Button label={t('mobile.common.done')} onPress={onClose} style={{ flex: 1 }} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  workspaceList: { gap: 2 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
});
