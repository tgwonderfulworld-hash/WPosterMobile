import { StyleSheet, View, type ViewStyle } from 'react-native';

import { getPlatformLabel } from '@/lib/platforms/registry';
import { useTheme } from '@/theme';

import { Text } from '../ui/Text';
import { PlatformIcon, usePlatformTint } from './PlatformIcon';

export interface PlatformIconTileProps {
  platform: string;
  size?: number;
  style?: ViewStyle;
}

/** Tinted rounded tile containing the platform icon (Dashboard/Accounts avatars). */
export function PlatformIconTile({ platform, size = 40, style }: PlatformIconTileProps) {
  const theme = useTheme();
  const tint = usePlatformTint(platform);
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: theme.radius.medium,
          backgroundColor: tint.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <PlatformIcon platform={platform} size={size * 0.5} />
    </View>
  );
}

export interface PlatformBadgeProps {
  platform: string;
  showLabel?: boolean;
}

/** Compact pill: tint + icon + label. Picks up new registry platforms automatically. */
export function PlatformBadge({ platform, showLabel = true }: PlatformBadgeProps) {
  const theme = useTheme();
  const tint = usePlatformTint(platform);
  return (
    <View style={[styles.badge, { backgroundColor: tint.bg, borderRadius: theme.radius.pill }]}>
      <PlatformIcon platform={platform} size={14} />
      {showLabel ? (
        <Text variant="caption" style={{ color: tint.color }}>
          {getPlatformLabel(platform)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4 },
});
