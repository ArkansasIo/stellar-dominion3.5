import { en, type LocaleStrings } from "./en";

export type LocaleKey = keyof LocaleStrings;
export type SupportedLocale = "en" | "de" | "fr" | "es" | "it" | "pl" | "pt";

export const locales: Record<SupportedLocale, { name: string; nativeName: string }> = {
  en: { name: "English", nativeName: "English" },
  de: { name: "German", nativeName: "Deutsch" },
  fr: { name: "French", nativeName: "Français" },
  es: { name: "Spanish", nativeName: "Español" },
  it: { name: "Italian", nativeName: "Italiano" },
  pl: { name: "Polish", nativeName: "Polski" },
  pt: { name: "Portuguese", nativeName: "Português" },
};

const localeData: Partial<Record<SupportedLocale, LocaleStrings>> = {
  en,
};

export function getLocale(locale: SupportedLocale): LocaleStrings {
  return localeData[locale] || en;
}

export function t(locale: SupportedLocale, path: string, fallback?: string): string {
  const data = getLocale(locale);
  const parts = path.split(".");
  let current: any = data;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return fallback || path;
    current = current[part];
  }
  return typeof current === "string" ? current : fallback || path;
}

export { en, type LocaleStrings };
