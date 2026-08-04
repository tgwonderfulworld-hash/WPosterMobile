import { Stack } from 'expo-router';

/** Modal presentation group (composer, quick actions, etc. land here later). */
export default function ModalsLayout() {
  return <Stack screenOptions={{ headerShown: false, presentation: 'modal' }} />;
}
