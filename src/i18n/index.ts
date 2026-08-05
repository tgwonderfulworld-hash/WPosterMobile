/**
 * i18n barrel. Loader logic lives in `./loader` (imported by the provider) to
 * avoid an index ↔ provider require cycle. See loader.ts for the architecture.
 */
export type { Language } from '@/store';

export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LANGUAGE_LABELS,
  LANGUAGE_FLAGS,
  getMessages,
  isSupportedLocale,
  resolveInitialLocale,
  setAppLocale,
  onIntlError,
} from './loader';

export { AppIntlProvider } from './provider';
export { useTranslations, useLocale, useNow, useTimeZone, useFormatter } from 'use-intl';
