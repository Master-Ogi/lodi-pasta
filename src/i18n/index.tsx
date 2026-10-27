import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react';
import type { Language } from '../types';
import type { Dictionary } from './types';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../utils/storage';
import { en } from './en';
import { he } from './he';
import { pl } from './pl';

export const DICTIONARIES: Record<Language, Dictionary> = { en, he, pl };
export const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'he', label: 'עב' },
  { id: 'pl', label: 'PL' },
];

function initialLanguage(): Language {
  const saved = loadJSON<string>(STORAGE_KEYS.lang, '');
  if (saved === 'en' || saved === 'he' || saved === 'pl') return saved;
  const browser = typeof navigator === 'undefined' ? '' : navigator.language.slice(0, 2);
  return browser === 'he' || browser === 'pl' ? browser : 'en';
}

interface I18nValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(initialLanguage);
  const t = DICTIONARIES[lang];

  // Layout effect: flip direction before paint so RTL never flashes as LTR.
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    saveJSON(STORAGE_KEYS.lang, lang);
  }, [lang, t.dir]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside <I18nProvider>');
  return ctx;
}
