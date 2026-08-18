import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dictionaries, fill, type Content, type Lang } from './index';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** The active dictionary. Named `t` because it appears in nearly every line of JSX. */
  t: Content;
  /** Interpolates {placeholders}: `f(t.careers.rolesTitle, { n: 5 })`. */
  f: typeof fill;
  dir: 'ltr' | 'rtl';
};

const LangContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'shipli:lang';

function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'fr' || value === 'ar';
}

/**
 * Reads the visitor's stored choice, then falls back to the browser.
 *
 * French leads the fallback chain on purpose: a Moroccan browser most often
 * reports fr-MA or ar-MA, and French is the working language of business here.
 * Anything else lands on English rather than guessing.
 */
function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLang(stored)) return stored;
  const nav = window.navigator.language?.toLowerCase() ?? '';
  if (nav.startsWith('ar')) return 'ar';
  if (nav.startsWith('fr')) return 'fr';
  return 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = dictionaries[lang];

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    const root = document.documentElement;
    root.lang = t.meta.locale;
    // Drives every [dir="rtl"] rule in index.css, plus the browser's own
    // bidirectional text handling inside paragraphs that mix Arabic and Latin.
    root.dir = t.meta.dir;
  }, [lang, t]);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t, f: fill, dir: t.meta.dir }),
    [lang, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}

/** Shorthand for the common case where a component only needs the copy. */
export function useT(): Content {
  return useLang().t;
}
