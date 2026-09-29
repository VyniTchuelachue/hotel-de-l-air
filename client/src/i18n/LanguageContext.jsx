import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.js';
import fr from './fr.js';

const dictionaries = { fr, en };
const STORAGE_KEY = 'hda-lang';

const LanguageContext = createContext(null);

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => node?.[part], dict);
}

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved in dictionaries) return saved;
  } catch {
    // Storage unavailable (private mode): fall back to French.
  }
  return 'fr';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore: the choice just won't be remembered.
    }
  }, [lang]);

  /** t('home.title') → string/array/object; function entries are called with the extra args. */
  const t = useCallback(
    (key, ...args) => {
      const value = lookup(dictionaries[lang], key) ?? lookup(fr, key);
      if (value === undefined) {
        if (import.meta.env.DEV) console.warn(`Missing translation: ${key}`);
        return key;
      }
      return typeof value === 'function' ? value(...args) : value;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
