import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language } from '@/types';
import { en, type TranslationKey } from './en';
import { ar } from './ar';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: 'rtl' | 'ltr';
};

const I18nContext = createContext<I18nContextValue | null>(null);

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, ar };

function detectInitialLanguage(): Language {
  const stored = getItem<Language | null>(STORAGE_KEYS.language, null);
  if (stored === 'ar' || stored === 'en') return stored;
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.startsWith('ar') ? 'ar' : 'en';
  }
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setItem(STORAGE_KEYS.language, lang);
  }, []);

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language]);

  const t = useCallback((key: TranslationKey): string => {
    return dictionaries[language][key] ?? en[key] ?? key;
  }, [language]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
