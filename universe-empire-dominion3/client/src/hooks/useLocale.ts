import { useState, useCallback, useEffect } from "react";
import { en, type LocaleStrings, type SupportedLocale, locales, t } from "../../../shared/locales/index";

const STORAGE_KEY = "ui-locale";

function getStoredLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Object.keys(locales).includes(stored)) return stored as SupportedLocale;
  } catch {}
  return "en";
}

export function useLocale() {
  const [locale, setLocaleState] = useState<SupportedLocale>(getStoredLocale);
  const [strings, setStrings] = useState<LocaleStrings>(en);

  useEffect(() => {
    if (locale === "en") {
      setStrings(en);
      return;
    }
    fetch(`/api/locale/${locale}`)
      .then(r => r.json())
      .then(data => setStrings(data as LocaleStrings))
      .catch(() => setStrings(en));
  }, [locale]);

  const setLocale = useCallback((code: SupportedLocale) => {
    setLocaleState(code);
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  }, []);

  const translate = useCallback((path: string, fallback?: string): string => {
    return t(locale, path, fallback);
  }, [locale]);

  return { locale, setLocale, strings, translate, supportedLocales: Object.entries(locales) as [SupportedLocale, { name: string; nativeName: string }][] };
}
