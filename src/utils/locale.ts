import es from '../i18n/es';
import en from '../i18n/en';

const dictionaries = { es, en } as const;
export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];

export function useTranslations(locale: string | undefined): Dictionary {
  const key = (locale ?? 'es') as Locale;
  return dictionaries[key] ?? dictionaries.es;
}
