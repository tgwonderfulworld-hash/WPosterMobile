import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

import { useTranslations } from '@/i18n';
import { useAuthStore } from '@/store';
import { useTheme } from '@/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

function icon(name: IoniconName, focusedName: IoniconName) {
  function TabBarIcon({
    color,
    size,
    focused,
  }: {
    color: ColorValue;
    size: number;
    focused: boolean;
  }) {
    return <Ionicons name={focused ? focusedName : name} size={size} color={color as string} />;
  }
  return TabBarIcon;
}

/** Main tab navigator. Requires an authenticated session. */
export default function MainLayout() {
  const status = useAuthStore((s) => s.status);
  const theme = useTheme();
  const t = useTranslations();

  if (status === 'loading') return null;
  if (status !== 'authenticated') return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subtle,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: t('workspace.sidebar.dashboard'), tabBarIcon: icon('grid-outline', 'grid') }}
      />
      <Tabs.Screen
        name="calendar"
        options={{ title: t('workspace.sidebar.calendar'), tabBarIcon: icon('calendar-outline', 'calendar') }}
      />
      <Tabs.Screen
        name="analytics"
        options={{ title: t('workspace.sidebar.analytics'), tabBarIcon: icon('stats-chart-outline', 'stats-chart') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t('workspace.sidebar.profile'), tabBarIcon: icon('person-outline', 'person') }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="connected-accounts" options={{ href: null }} />
    </Tabs>
  );
}
