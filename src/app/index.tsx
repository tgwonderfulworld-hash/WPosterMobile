import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store';

/** Entry route: send the user to the app or to auth once the session resolves. */
export default function Index() {
  const status = useAuthStore((s) => s.status);

  // Still resolving — the native splash is covering the screen.
  if (status === 'loading') return null;

  return <Redirect href={status === 'authenticated' ? '/(main)/dashboard' : '/(auth)/login'} />;
}
