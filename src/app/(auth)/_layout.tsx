import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store';

/** Auth stack. If already signed in, bounce to the app. */
export default function AuthLayout() {
  const status = useAuthStore((s) => s.status);

  if (status === 'authenticated') return <Redirect href="/(main)/dashboard" />;

  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
