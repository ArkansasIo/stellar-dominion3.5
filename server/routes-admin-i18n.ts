import { Router, type Request, type Response } from 'express';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { isAuthenticated } from './basicAuth';
import { requireAdminPermission } from './routes-admin';
import { I18nService, SUPPORTED_LANGUAGES, type LanguageCode } from './services/i18nService';

const i18n = I18nService.getInstance();
const TRANSLATIONS_DIR = path.resolve(process.cwd(), 'server/translations');

export function registerAdminI18nRoutes(app: Router): void {
  app.get('/api/admin/i18n/languages', isAuthenticated, async (_req: Request, res: Response) => {
    try {
      res.json({ languages: SUPPORTED_LANGUAGES });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Failed to list languages' });
    }
  });

  app.get('/api/admin/i18n/:lang', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { lang } = req.params;
      if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
        return res.status(400).json({ message: `Unsupported language: ${lang}` });
      }
      const translations = i18n.getAll(lang as LanguageCode);
      res.json({ language: lang, translations });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Failed to get translations' });
    }
  });

  app.put('/api/admin/i18n/:lang/:key(*)', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, 'manage');
      if (!access) return;

      const { lang, key } = req.params;
      const { value } = req.body;

      if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
        return res.status(400).json({ message: `Unsupported language: ${lang}` });
      }
      if (!value || typeof value !== 'string') {
        return res.status(400).json({ message: 'value is required and must be a string' });
      }

      i18n.setTranslation(key, lang as LanguageCode, value);
      res.json({ success: true, key, language: lang, value });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Failed to update translation' });
    }
  });

  app.delete('/api/admin/i18n/:lang/:key(*)', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, 'manage');
      if (!access) return;

      const { lang, key } = req.params;
      if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
        return res.status(400).json({ message: `Unsupported language: ${lang}` });
      }

      i18n.deleteTranslation(key, lang as LanguageCode);
      res.json({ success: true, key, language: lang });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Failed to delete translation' });
    }
  });

  app.get('/api/admin/i18n/:lang/stats', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { lang } = req.params;
      if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
        return res.status(400).json({ message: `Unsupported language: ${lang}` });
      }

      const keys = i18n.getKeys(lang as LanguageCode);
      const allStats = i18n.getStats();
      const langStats = allStats.find(s => s.language === lang);

      res.json({
        language: lang,
        totalKeys: keys.length,
        stats: langStats || { language: lang, loaded: 0, missing: 0, total: 0 },
      });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Failed to get stats' });
    }
  });

  app.post('/api/admin/i18n/:lang/import', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const access = await requireAdminPermission(req, res, 'manage');
      if (!access) return;

      const { lang } = req.params;
      if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
        return res.status(400).json({ message: `Unsupported language: ${lang}` });
      }

      const { file, data } = req.body;

      if (file && typeof file === 'string') {
        const filePath = path.join(TRANSLATIONS_DIR, lang, file);
        if (!existsSync(filePath)) {
          return res.status(404).json({ message: `File not found: ${filePath}` });
        }
        const content = await readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content) as Record<string, string>;
        for (const [k, v] of Object.entries(parsed)) {
          i18n.setTranslation(k, lang as LanguageCode, v);
        }
        return res.json({ success: true, language: lang, source: file, count: Object.keys(parsed).length });
      }

      if (data && typeof data === 'object') {
        for (const [k, v] of Object.entries(data)) {
          if (typeof v === 'string') {
            i18n.setTranslation(k, lang as LanguageCode, v);
          }
        }
        return res.json({ success: true, language: lang, count: Object.keys(data).length });
      }

      return res.status(400).json({ message: 'Provide either a "file" name or "data" object' });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Failed to import translations' });
    }
  });

  app.get('/api/admin/i18n/stats', isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const stats = i18n.getStats();
      const details: Record<string, { total: number; loaded: number; missing: number }> = {};
      for (const s of stats) {
        details[s.language] = { total: s.total, loaded: s.loaded, missing: s.missing };
      }
      res.json({ stats, details });
    } catch (error: any) {
      res.status(500).json({ message: error?.message || 'Failed to get global stats' });
    }
  });
}
