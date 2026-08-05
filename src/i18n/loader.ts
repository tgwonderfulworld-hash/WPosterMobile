/**
 * i18n loader — locale resolution + message loading, kept separate from the
 * barrel (index.ts) so `provider.tsx` can import it WITHOUT creating an
 * index ↔ provider require cycle.
 *
 * Web uses next-intl; its framework-agnostic core is `use-intl`, which consumes
 * the SAME message files with the SAME keys/namespaces/ICU syntax. We load the
 * exact `messages/{locale}.json` copied from Web (source of truth, auto-syncable)
 * plus a small `mobile.*` overlay for RN-only microcopy, nest them with Web's
 * transform, and feed `use-intl`. Only the active locale is nested (lazy).
 */
import { getLocales } from 'expo-localization';

import { useAppStore, type Language } from '@/store';
import { logger } from '@/utils/logger';

import { nestMessages } from './nest';

/** Supported locales — mirrors Web `src/i18n/routing.ts` (default: en). */
export const SUPPORTED_LOCALES: Language[] = ['en', 'ru', 'de', 'es', 'fr'];
export const DEFAULT_LOCALE: Language = 'en';

/** Native language names for the settings switcher (mirrors Web LANGUAGE_OPTIONS). */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
};

/** Flag glyphs for the language switcher UI (display-only, not translation data). */
export const LANGUAGE_FLAGS: Record<Language, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
  de: '🇩🇪',
  es: '🇪🇸',
  fr: '🇫🇷',
};

type Dict = Record<string, unknown>;

// Static per-locale loaders (Metro needs literal require paths). Only the active
// locale is actually evaluated + nested.
const WEB_MESSAGES: Record<Language, () => Dict> = {
  en: () => require('./messages/en.json'),
  ru: () => require('./messages/ru.json'),
  de: () => require('./messages/de.json'),
  es: () => require('./messages/es.json'),
  fr: () => require('./messages/fr.json'),
};
const MOBILE_OVERLAY: Record<Language, () => Dict> = {
  en: () => require('./mobile/en.json'),
  ru: () => require('./mobile/ru.json'),
  de: () => require('./mobile/de.json'),
  es: () => require('./mobile/es.json'),
  fr: () => require('./mobile/fr.json'),
};

const cache = new Map<Language, Dict>();

/** Nested messages for a locale (Web JSON + `mobile` overlay), memoized. */
export function getMessages(locale: Language): Dict {
  const cached = cache.get(locale);
  if (cached) return cached;
  const web = nestMessages(WEB_MESSAGES[locale]());
  web.mobile = MOBILE_OVERLAY[locale]();
  cache.set(locale, web);
  return web;
}

export function isSupportedLocale(value: string): value is Language {
  return (SUPPORTED_LOCALES as string[]).includes(value);
}

/** First-launch detection: persisted preference → device language → English. */
export function resolveInitialLocale(): Language {
  const persisted = useAppStore.getState().language;
  if (persisted && isSupportedLocale(persisted)) return persisted;
  const device = getLocales()[0]?.languageCode ?? '';
  return isSupportedLocale(device) ? device : DEFAULT_LOCALE;
}

/** Change the app language at runtime (no restart) and persist it. */
export function setAppLocale(locale: Language): void {
  useAppStore.getState().setLanguage(locale);
}

/** IntlProvider error hook — never crash a screen over a missing key. */
export function onIntlError(error: unknown): void {
  logger.debug('i18n', String(error));
}
