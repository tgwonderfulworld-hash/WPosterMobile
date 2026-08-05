/**
 * Wraps the app in use-intl's IntlProvider with the active locale + nested
 * messages. The locale comes from the app store (persisted) or, on first launch,
 * device detection. Changing the store's language re-renders this provider, so
 * language switches take effect immediately — no restart.
 */
import { getCalendars } from 'expo-localization';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { IntlProvider } from 'use-intl';

import { useAppStore } from '@/store';

import { getMessages, onIntlError, resolveInitialLocale } from './loader';

const deviceTimeZone = getCalendars()[0]?.timeZone ?? 'UTC';

export function AppIntlProvider({ children }: { children: ReactNode }) {
  const language = useAppStore((s) => s.language);
  const locale = language ?? resolveInitialLocale();

  const messages = useMemo(() => getMessages(locale), [locale]);

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      timeZone={deviceTimeZone}
      onError={onIntlError}
      getMessageFallback={({ key }) => key}
    >
      {children}
    </IntlProvider>
  );
}
