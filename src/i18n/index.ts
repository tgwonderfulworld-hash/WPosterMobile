/**
 * i18n bootstrap (i18next + react-i18next). English is the default; Russian is
 * bundled and ready. Initial language = persisted preference → device locale →
 * English. Import this once (side effect) high in the app tree.
 */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { useAppStore, type Language } from '@/store';

import en from './locales/en.json';
import ru from './locales/ru.json';

export const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const;

export const supportedLanguages: Language[] = ['en', 'ru'];

function initialLanguage(): Language {
  const persisted = useAppStore.getState().language;
  if (persisted && supportedLanguages.includes(persisted)) return persisted;
  const device = getLocales()[0]?.languageCode as Language | undefined;
  return device && supportedLanguages.includes(device) ? device : 'en';
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage(),
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

/** Change language app-wide and persist the choice. */
export function setLanguage(language: Language): void {
  void i18n.changeLanguage(language);
  useAppStore.getState().setLanguage(language);
}

export default i18n;
