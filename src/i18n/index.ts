/**
 * i18n — WPoster Web's architecture on mobile.
 *
 * Web uses next-intl; its framework-agnostic core is `use-intl`, which runs in
 * React Native and consumes the SAME message files with the SAME keys,
 * namespaces and ICU syntax. We load the exact `messages/{locale}.json` copied
 * from Web (source of truth, auto-syncable) plus a small `mobile.*` overlay for
 * RN-only microcopy, nest them with Web's transform, and feed `use-intl`.
 *
 * Adding a language in Web = drop its JSON here and add the code below; no screen
 * changes. Only the active locale's messages are nested (lazy), for performance.
 */
import { getLocales } from 'expo-localization';

import { useAppStore, type Language } from '@/store';
import { logger } from '@/utils/logger';

import { nestMessages } from './nest';

export type { Language } from '@/store';

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

export { AppIntlProvider } from './provider';
export { useTranslations, useLocale, useNow, useTimeZone, useFormatter } from 'use-intl';
