import { en, translations, type StringKey } from './strings.ts';
import { LANGUAGES } from './languages.ts';

export function t(lang: string, key: StringKey, vars?: Record<string, string | number>): string {
  let s = translations[lang]?.[key] ?? en[key];
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}
export const coverage = (lang: string) => {
  if (lang === 'en') return 1;
  const have = Object.keys(translations[lang] ?? {}).length;
  return have / Object.keys(en).length;
};
export const supported = (code: string) => LANGUAGES.some((l) => l.code === code);
/** Pick the best language from a device locale such as "hi-IN"; defaults to English. */
export function fromLocale(locale: string | undefined): string {
  const base = (locale ?? 'en').split('-')[0].toLowerCase();
  return supported(base) ? base : 'en';
}
