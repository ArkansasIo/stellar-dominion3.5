import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';

export type LanguageCode = 'en' | 'ru' | 'de' | 'fr' | 'es' | 'it' | 'ja';

export interface LanguageDefinition {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isRTL: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isRTL: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isRTL: false },
];

const TRANSLATIONS_DIR = path.resolve(process.cwd(), 'server/translations');

function resolveKey(key: string, lang: LanguageCode, translations: Map<string, Map<string, string>>): string | undefined {
  for (const [domain, strings] of translations) {
    if (strings.has(key)) return `${domain}.${key}`;
  }
  return undefined;
}

export class I18nService {
  private static instance: I18nService;
  private translations: Map<string, Map<string, string>> = new Map();
  private loaded: Set<string> = new Set();

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  private makeKey(lang: LanguageCode, domain: string): string {
    return `${lang}:${domain}`;
  }

  async loadLanguage(lang: LanguageCode, domain: string): Promise<void> {
    const key = this.makeKey(lang, domain);
    if (this.loaded.has(key)) return;

    const filePath = path.join(TRANSLATIONS_DIR, lang, `${domain}.json`);
    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as Record<string, string>;
      if (!this.translations.has(lang)) {
        this.translations.set(lang, new Map());
      }
      const langMap = this.translations.get(lang)!;
      for (const [k, v] of Object.entries(data)) {
        langMap.set(`${domain}.${k}`, v);
      }
      this.loaded.add(key);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        console.warn(`[i18n] Translation file not found: ${filePath}`);
      } else {
        console.error(`[i18n] Error loading ${filePath}:`, err.message);
      }
    }
  }

  t(key: string, lang: LanguageCode, ...params: any[]): string {
    const langMap = this.translations.get(lang);
    if (!langMap) return params.length > 0 ? this.substitute(key, params) : key;

    let value = langMap.get(key);
    if (!value) {
      const resolved = resolveKey(key, lang, this.translations);
      if (!resolved) return params.length > 0 ? this.substitute(key, params) : key;
      value = langMap.get(resolved) ?? key;
    }

    return params.length > 0 ? this.substitute(value, params) : value;
  }

  private substitute(template: string, params: any[]): string {
    return template.replace(/{(\d+)}/g, (_match, index) => {
      const i = parseInt(index, 10);
      return i < params.length ? String(params[i]) : `{${i}}`;
    });
  }

  has(key: string, lang: LanguageCode): boolean {
    const langMap = this.translations.get(lang);
    if (!langMap) return false;
    return langMap.has(key) || resolveKey(key, lang, this.translations) !== undefined;
  }

  getAll(lang: LanguageCode): Record<string, string> {
    const langMap = this.translations.get(lang);
    if (!langMap) return {};
    const result: Record<string, string> = {};
    for (const [k, v] of langMap) {
      result[k] = v;
    }
    return result;
  }

  setTranslation(key: string, lang: LanguageCode, value: string): void {
    if (!this.translations.has(lang)) {
      this.translations.set(lang, new Map());
    }
    this.translations.get(lang)!.set(key, value);
  }

  deleteTranslation(key: string, lang: LanguageCode): void {
    const langMap = this.translations.get(lang);
    if (langMap) {
      langMap.delete(key);
    }
  }

  getKeys(lang: LanguageCode): string[] {
    const langMap = this.translations.get(lang);
    return langMap ? Array.from(langMap.keys()) : [];
  }

  async loadAllLanguages(): Promise<void> {
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    for (const code of codes) {
      const dir = path.join(TRANSLATIONS_DIR, code);
      if (!existsSync(dir)) {
        console.warn(`[i18n] Language directory not found: ${dir}`);
        continue;
      }
      let files: string[];
      try {
        files = await readdir(dir);
      } catch {
        continue;
      }
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      for (const file of jsonFiles) {
        const domain = file.replace(/\.json$/, '');
        await this.loadLanguage(code as LanguageCode, domain);
      }
    }
  }

  getStats(): { language: LanguageCode; loaded: number; missing: number; total: number }[] {
    const stats: { language: LanguageCode; loaded: number; missing: number; total: number }[] = [];
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);

    const referenceKeys = this.translations.get('en');
    const totalKeys = referenceKeys ? referenceKeys.size : 0;

    for (const code of codes) {
      const langMap = this.translations.get(code as LanguageCode);
      const loaded = langMap ? langMap.size : 0;
      const missing = Math.max(0, totalKeys - loaded);
      stats.push({
        language: code as LanguageCode,
        loaded,
        missing,
        total: Math.max(totalKeys, loaded),
      });
    }

    return stats;
  }

  middleware(): (req: any, res: any, next: any) => void {
    return (req: Request, _res: Response, next: NextFunction) => {
      let lang: LanguageCode = 'en';
      if (req.session?.language && SUPPORTED_LANGUAGES.some(l => l.code === req.session.language)) {
        lang = req.session.language as LanguageCode;
      } else if (req.headers['accept-language']) {
        const header = req.headers['accept-language'] as string;
        const parsed = header.split(',')[0]?.split('-')[0]?.toLowerCase() || 'en';
        if (SUPPORTED_LANGUAGES.some(l => l.code === parsed)) {
          lang = parsed as LanguageCode;
        }
      }

      (req as any).lang = lang;
      (req as any).__ = (key: string, ...args: any[]) => this.t(key, lang, ...args);

      next();
    };
  }
}

export const __ = (key: string, lang: LanguageCode, ...args: any[]): string => {
  return I18nService.getInstance().t(key, lang, ...args);
};
