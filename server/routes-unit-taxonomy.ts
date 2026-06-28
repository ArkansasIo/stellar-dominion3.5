import type { Express, Request, Response } from 'express';
import {
  UNIT_JOB_CATEGORIES,
  UNIT_JOB_SUB_CATEGORIES,
  UNIT_JOB_TAXONOMY,
  UNIT_TIER_CLASSES,
  UNIT_LEVEL_BANDS,
  UNIT_LEVEL_SYSTEM,
  getCategoriesByDomain,
  getCategoryById,
  getSubCategoriesByCategory,
  getTaxonomyByDomain,
  getTaxonomyByCategory,
  getTaxonomyEntry,
  getTierClass,
  getTaxonomyMeta,
  type UnitJobDomain,
} from '../shared/config/unitJobTaxonomyConfig';

const VALID_DOMAINS: UnitJobDomain[] = ['civilization', 'military', 'government'];
const ERROR_INVALID_DOMAIN = 'Invalid domain. Must be civilization, military, or government';

function isValidDomain(value: unknown): value is UnitJobDomain {
  return VALID_DOMAINS.includes(value as UnitJobDomain);
}

export function registerUnitTaxonomyRoutes(app: Express) {
  /**
   * GET /api/unit-taxonomy/meta
   * Returns aggregate metadata: category/sub-category counts, tier range, level range, domains
   */
  app.get('/api/unit-taxonomy/meta', (_req: Request, res: Response) => {
    res.json({ success: true, meta: getTaxonomyMeta() });
  });

  /**
   * GET /api/unit-taxonomy/categories
   * Returns all 18 categories
   */
  app.get('/api/unit-taxonomy/categories', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: UNIT_JOB_CATEGORIES.length,
      categories: UNIT_JOB_CATEGORIES,
    });
  });

  /**
   * GET /api/unit-taxonomy/categories/:domain
   * Returns categories filtered by domain (civilization | military | government)
   */
  app.get('/api/unit-taxonomy/categories/:domain', (req: Request, res: Response) => {
    const { domain } = req.params;
    if (!isValidDomain(domain)) {
      return res.status(400).json({ success: false, message: ERROR_INVALID_DOMAIN });
    }
    const categories = getCategoriesByDomain(domain);
    res.json({ success: true, domain, total: categories.length, categories });
  });

  /**
   * GET /api/unit-taxonomy/subcategories
   * Returns all 32 sub-categories
   */
  app.get('/api/unit-taxonomy/subcategories', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: UNIT_JOB_SUB_CATEGORIES.length,
      subCategories: UNIT_JOB_SUB_CATEGORIES,
    });
  });

  /**
   * GET /api/unit-taxonomy/subcategories/:categoryId
   * Returns sub-categories for a specific category
   */
  app.get('/api/unit-taxonomy/subcategories/:categoryId', (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const category = getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const subCategories = getSubCategoriesByCategory(categoryId);
    res.json({ success: true, category, total: subCategories.length, subCategories });
  });

  /**
   * GET /api/unit-taxonomy/tiers
   * Returns all 99 tier class definitions (1-99)
   */
  app.get('/api/unit-taxonomy/tiers', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: UNIT_TIER_CLASSES.length,
      minTier: 1,
      maxTier: 99,
      tiers: UNIT_TIER_CLASSES,
    });
  });

  /**
   * GET /api/unit-taxonomy/tiers/:tier
   * Returns tier class info for a specific tier (1-99)
   */
  app.get('/api/unit-taxonomy/tiers/:tier', (req: Request, res: Response) => {
    const tier = Number(req.params.tier);
    if (!Number.isInteger(tier) || tier < 1 || tier > 99) {
      return res.status(400).json({ success: false, message: 'Tier must be an integer between 1 and 99' });
    }
    res.json({ success: true, tierClass: getTierClass(tier) });
  });

  /**
   * GET /api/unit-taxonomy/levels
   * Returns the level band definitions for the 1-999 level system
   */
  app.get('/api/unit-taxonomy/levels', (_req: Request, res: Response) => {
    res.json({
      success: true,
      maxLevel: UNIT_LEVEL_SYSTEM.maxLevel,
      totalBands: UNIT_LEVEL_BANDS.length,
      bands: UNIT_LEVEL_BANDS,
    });
  });

  /**
   * GET /api/unit-taxonomy/levels/:level
   * Returns band info and stat multiplier for a specific level (1-999)
   */
  app.get('/api/unit-taxonomy/levels/:level', (req: Request, res: Response) => {
    const level = Number(req.params.level);
    if (!Number.isInteger(level) || level < 1 || level > 999) {
      return res.status(400).json({ success: false, message: 'Level must be an integer between 1 and 999' });
    }
    const band = UNIT_LEVEL_SYSTEM.getLevelBand(level);
    const multiplier = UNIT_LEVEL_SYSTEM.getLevelMultiplier(level);
    res.json({ success: true, level, band, statMultiplier: multiplier });
  });

  /**
   * GET /api/unit-taxonomy/entries
   * Returns all taxonomy entries (32 entries, one per sub-category)
   */
  app.get('/api/unit-taxonomy/entries', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: UNIT_JOB_TAXONOMY.length,
      entries: UNIT_JOB_TAXONOMY,
    });
  });

  /**
   * GET /api/unit-taxonomy/entries/domain/:domain
   * Returns taxonomy entries filtered by domain
   */
  app.get('/api/unit-taxonomy/entries/domain/:domain', (req: Request, res: Response) => {
    const { domain } = req.params;
    if (!isValidDomain(domain)) {
      return res.status(400).json({ success: false, message: ERROR_INVALID_DOMAIN });
    }
    const entries = getTaxonomyByDomain(domain);
    res.json({ success: true, domain, total: entries.length, entries });
  });

  /**
   * GET /api/unit-taxonomy/entries/category/:categoryId
   * Returns taxonomy entries for a specific category
   */
  app.get('/api/unit-taxonomy/entries/category/:categoryId', (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const category = getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const entries = getTaxonomyByCategory(categoryId);
    res.json({ success: true, category, total: entries.length, entries });
  });

  /**
   * GET /api/unit-taxonomy/entries/:id
   * Returns a single taxonomy entry by ID
   */
  app.get('/api/unit-taxonomy/entries/:id', (req: Request, res: Response) => {
    const entry = getTaxonomyEntry(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Taxonomy entry not found' });
    }
    res.json({ success: true, entry });
  });
}
