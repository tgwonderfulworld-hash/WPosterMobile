import '@/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OfflineBanner } from '@/components/OfflineBanner';
import { ToastHost } from '@/components/ui';
import { useAuthBootstrap } from '@/features/auth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { queryClient } from '@/services/queryClient';
import { ThemeProvider, toNavigationTheme, useTheme } from '@/theme';

// Keep the splash visible until we've resolved the session.
void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const theme = useTheme();
  const { ready } = useAuthBootstrap();
  useNetworkStatus();

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  return (
    <NavigationThemeProvider value={toNavigationTheme(theme)}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
      </Stack>
      <OfflineBanner />
      <ToastHost />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
