import type { Express, Request, Response } from 'express';
import {
  GOVERNMENT_BUILDING_CATEGORIES,
  GOVERNMENT_BUILDING_SUB_CATEGORIES,
  GOVERNMENT_BUILDING_CATEGORY_MAP,
  GOVERNMENT_BUILDING_SUB_CATEGORY_MAP,
  GOVERNMENT_BUILDING_RANKS,
  GOV_BUILDING_CATEGORY_COUNT,
  GOV_BUILDING_SUBCATEGORY_COUNT,
  calcGovBuildingStatValue,
  calcGovBuildingSubStatValue,
  getTierRangeLabel,
  getLevelRangeLabel,
  getGovBuildingRankForLevel,
  getSubCategoriesByClass,
  getSubCategoriesByType,
  getSubCategoriesForCategory,
  getGovBuildingClasses,
  getGovBuildingTypes,
  isGovBuildingClass,
  isGovBuildingType,
} from '../shared/config/governmentBuildingStructuresConfig';

export function registerGovernmentBuildingRoutes(app: Express) {
  /**
   * GET /api/government-buildings
   * Returns all 18 categories and their basic info plus counts.
   */
  app.get('/api/government-buildings', (_req: Request, res: Response) => {
    res.json({
      success: true,
      totalCategories: GOV_BUILDING_CATEGORY_COUNT,
      totalSubCategories: GOV_BUILDING_SUBCATEGORY_COUNT,
      categories: GOVERNMENT_BUILDING_CATEGORIES,
      classes: getGovBuildingClasses(),
      types: getGovBuildingTypes(),
    });
  });

  /**
   * GET /api/government-buildings/categories
   * Returns all 18 categories with their sub-category IDs.
   */
  app.get('/api/government-buildings/categories', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: GOV_BUILDING_CATEGORY_COUNT,
      categories: GOVERNMENT_BUILDING_CATEGORIES,
    });
  });

  /**
   * GET /api/government-buildings/categories/:categoryId
   * Returns a single category with its full sub-category data.
   */
  app.get('/api/government-buildings/categories/:categoryId', (req: Request, res: Response) => {
    const categoryId = String(req.params.categoryId || '');
    const category = GOVERNMENT_BUILDING_CATEGORY_MAP[categoryId];

    if (!category) {
      res.status(404).json({ success: false, message: `Category '${categoryId}' not found.` });
      return;
    }

    const subCategories = getSubCategoriesForCategory(categoryId);

    res.json({
      success: true,
      category,
      subCategories,
    });
  });

  /**
   * GET /api/government-buildings/sub-categories
   * Returns all 32 sub-categories.
   */
  app.get('/api/government-buildings/sub-categories', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: GOV_BUILDING_SUBCATEGORY_COUNT,
      subCategories: GOVERNMENT_BUILDING_SUB_CATEGORIES,
    });
  });

  /**
   * GET /api/government-buildings/sub-categories/:subCategoryId
   * Returns a single sub-category with all its data.
   */
  app.get('/api/government-buildings/sub-categories/:subCategoryId', (req: Request, res: Response) => {
    const subCategoryId = String(req.params.subCategoryId || '');
    const subCategory = GOVERNMENT_BUILDING_SUB_CATEGORY_MAP[subCategoryId];

    if (!subCategory) {
      res.status(404).json({ success: false, message: `Sub-category '${subCategoryId}' not found.` });
      return;
    }

    res.json({
      success: true,
      subCategory,
    });
  });

  /**
   * GET /api/government-buildings/sub-categories/by-class/:class
   * Returns all sub-categories belonging to a given class.
   */
  app.get('/api/government-buildings/sub-categories/by-class/:class', (req: Request, res: Response) => {
    const cls = String(req.params.class || '');

    if (!isGovBuildingClass(cls)) {
      res.status(400).json({ success: false, message: `Invalid class '${cls}'. Valid values: ${getGovBuildingClasses().join(', ')}.` });
      return;
    }

    const subCategories = getSubCategoriesByClass(cls);

    res.json({
      success: true,
      class: cls,
      total: subCategories.length,
      subCategories,
    });
  });

  /**
   * GET /api/government-buildings/sub-categories/by-type/:type
   * Returns all sub-categories of a given building type.
   */
  app.get('/api/government-buildings/sub-categories/by-type/:type', (req: Request, res: Response) => {
    const type = String(req.params.type || '');

    if (!isGovBuildingType(type)) {
      res.status(400).json({ success: false, message: `Invalid type '${type}'. Valid values: ${getGovBuildingTypes().join(', ')}.` });
      return;
    }

    const subCategories = getSubCategoriesByType(type);

    res.json({
      success: true,
      type,
      total: subCategories.length,
      subCategories,
    });
  });

  /**
   * GET /api/government-buildings/ranks
   * Returns all 10 government building ranks.
   */
  app.get('/api/government-buildings/ranks', (_req: Request, res: Response) => {
    res.json({
      success: true,
      total: GOVERNMENT_BUILDING_RANKS.length,
      ranks: GOVERNMENT_BUILDING_RANKS,
    });
  });

  /**
   * GET /api/government-buildings/ranks/for-level/:level
   * Returns the rank earned at a specific building level.
   */
  app.get('/api/government-buildings/ranks/for-level/:level', (req: Request, res: Response) => {
    const level = parseInt(String(req.params.level || '1'), 10);

    if (isNaN(level) || level < 1 || level > 999) {
      res.status(400).json({ success: false, message: 'Level must be an integer between 1 and 999.' });
      return;
    }

    const rank = getGovBuildingRankForLevel(level);

    res.json({
      success: true,
      level,
      levelLabel: getLevelRangeLabel(level),
      rank,
    });
  });

  /**
   * GET /api/government-buildings/stats/:subCategoryId
   * Returns computed stat values for a sub-category at a given level and tier.
   * Query params: level (1-999), tier (1-99)
   */
  app.get('/api/government-buildings/stats/:subCategoryId', (req: Request, res: Response) => {
    const subCategoryId = String(req.params.subCategoryId || '');
    const subCategory = GOVERNMENT_BUILDING_SUB_CATEGORY_MAP[subCategoryId];

    if (!subCategory) {
      res.status(404).json({ success: false, message: `Sub-category '${subCategoryId}' not found.` });
      return;
    }

    const level = Math.max(1, Math.min(999, parseInt(String(req.query.level ?? '1'), 10) || 1));
    const tier  = Math.max(1, Math.min(99,  parseInt(String(req.query.tier  ?? '1'), 10) || 1));

    const computedStats = subCategory.stats.map(stat => ({
      id: stat.id,
      name: stat.name,
      description: stat.description,
      value: calcGovBuildingStatValue(stat, level, tier),
      subStats: stat.subStats.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        value: calcGovBuildingSubStatValue(sub, level, tier),
      })),
    }));

    res.json({
      success: true,
      subCategoryId,
      level,
      tier,
      tierLabel: getTierRangeLabel(tier),
      levelLabel: getLevelRangeLabel(level),
      rank: getGovBuildingRankForLevel(level),
      computedStats,
    });
  });
}
