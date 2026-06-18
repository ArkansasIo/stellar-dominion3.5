/**
 * Game Assets Routes
 * REST API endpoints for asset management, bundling, and distribution
 */

import { Router } from 'express';
import { isAuthenticated } from './basicAuth';
import GameAssetsService from './services/gameAssetsService';

const router = Router();

/**
 * Get all assets
 * GET /api/assets
 */
router.get('/', async (req, res) => {
  try {
    const assets = await GameAssetsService.getAllAssets();
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get assets by category
 * GET /api/assets/category/:category
 */
router.get('/category/:category', async (req, res) => {
  try {
    const assets = await GameAssetsService.getAssetsByCategory(req.params.category);
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Search assets
 * GET /api/assets/search
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Search query required' });
    const assets = await GameAssetsService.searchAssets(q as string);
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Delete asset
 * DELETE /api/assets/:assetId
 */
router.delete('/:assetId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const success = await GameAssetsService.deleteAsset(req.params.assetId);
    res.json({ success });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Update asset metadata
 * PUT /api/assets/:assetId
 */
router.put('/:assetId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const asset = await GameAssetsService.updateAssetMetadata(req.params.assetId, req.body);
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get asset download URL
 * GET /api/assets/:assetId/download
 */
router.get('/:assetId/download', async (req, res) => {
  try {
    const { platform } = req.query;
    const url = await GameAssetsService.getAssetDownloadUrl(req.params.assetId, platform as string);
    res.json({ success: true, data: { url } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get all asset bundles
 * GET /api/assets/bundles
 */
router.get('/bundles', async (req, res) => {
  try {
    const bundles = await GameAssetsService.getAllAssetBundles();
    res.json({ success: true, data: bundles });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get asset bundle by ID
 * GET /api/assets/bundles/:bundleId
 */
router.get('/bundles/:bundleId', async (req, res) => {
  try {
    const bundle = await GameAssetsService.getAssetBundle(req.params.bundleId);
    if (!bundle) return res.status(404).json({ success: false, error: 'Bundle not found' });
    res.json({ success: true, data: bundle });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Create new asset bundle
 * POST /api/assets/bundles/create
 */
router.post('/bundles/create', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { name, description, assetIds, platform } = req.body;
    const bundle = await GameAssetsService.createAssetBundle(name, description, assetIds, platform);
    res.json({ success: true, data: bundle });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Update asset bundle
 * PUT /api/assets/bundles/:bundleId
 */
router.put('/bundles/:bundleId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const bundle = await GameAssetsService.updateAssetBundle(req.params.bundleId, req.body);
    res.json({ success: true, data: bundle });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Delete asset bundle
 * DELETE /api/assets/bundles/:bundleId
 */
router.delete('/bundles/:bundleId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const success = await GameAssetsService.deleteAssetBundle(req.params.bundleId);
    res.json({ success });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Package asset bundle
 * POST /api/assets/bundles/:bundleId/package
 */
router.post('/bundles/:bundleId/package', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const result = await GameAssetsService.packageAssetBundle(req.params.bundleId);
    res.json({ success: result.success, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get bundle download URL
 * GET /api/assets/bundles/:bundleId/download
 */
router.get('/bundles/:bundleId/download', async (req, res) => {
  try {
    const { platform } = req.query;
    const url = await GameAssetsService.getBundleDownloadUrl(req.params.bundleId, platform as string);
    res.json({ success: true, data: { url } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get asset manifest
 * GET /api/assets/manifest
 */
router.get('/manifest', async (req, res) => {
  try {
    const manifest = await GameAssetsService.getAssetManifest();
    res.json({ success: true, data: manifest });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Generate asset manifest
 * POST /api/assets/manifest/generate
 */
router.post('/manifest/generate', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const manifest = await GameAssetsService.generateAssetManifest();
    res.json({ success: true, data: manifest });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get asset usage statistics
 * GET /api/assets/statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const stats = await GameAssetsService.getAssetUsageStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get asset catalog by category
 * GET /api/assets/catalogs/:category
 */
router.get('/catalogs/:category', async (req, res) => {
  try {
    const catalog = await GameAssetsService.getAssetCatalog(req.params.category);
    res.json({ success: true, data: catalog });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Clear asset cache
 * POST /api/assets/cache/clear
 */
router.post('/cache/clear', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { assetOrBundleId } = req.body;
    const result = await GameAssetsService.clearAssetCache(assetOrBundleId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Validate asset integrity
 * GET /api/assets/:assetId/validate
 */
router.get('/:assetId/validate', async (req, res) => {
  try {
    const result = await GameAssetsService.validateAssetIntegrity(req.params.assetId);
    res.json({ success: result.valid, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Optimize asset for platform
 * POST /api/assets/:assetId/optimize
 */
router.post('/:assetId/optimize', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const { platform } = req.body;
    const asset = await GameAssetsService.optimizeAssetForPlatform(req.params.assetId, platform);
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get preset bundle
 * GET /api/assets/preset/:preset/:platform
 */
router.get('/preset/:preset/:platform', async (req, res) => {
  try {
    const { preset, platform } = req.params;
    const bundle = await GameAssetsService.getPresetBundle(preset, platform as 'web' | 'mobile' | 'desktop');
    res.json({ success: true, data: bundle });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Generate asset report
 * GET /api/assets/report
 */
router.get('/report', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const report = await GameAssetsService.generateAssetReport();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Sync assets to CDN
 * POST /api/assets/sync-cdn
 */
router.post('/sync-cdn', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const result = await GameAssetsService.syncAssetsToCDN();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get cache statistics
 * GET /api/assets/cache/statistics
 */
router.get('/cache/statistics', async (req, res) => {
  try {
    const stats = await GameAssetsService.getCacheStatistics();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get version history for asset
 * GET /api/assets/:assetId/versions
 */
router.get('/:assetId/versions', async (req, res) => {
  try {
    const history = await GameAssetsService.getVersionHistory(req.params.assetId);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Rollback asset to previous version
 * POST /api/assets/:assetId/rollback/:version
 */
router.post('/:assetId/rollback/:version', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const asset = await GameAssetsService.rollbackAssetVersion(req.params.assetId, req.params.version);
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

/**
 * Get asset by ID
 * GET /api/assets/:assetId
 */
router.get('/:assetId', async (req, res) => {
  try {
    const asset = await GameAssetsService.getAsset(req.params.assetId);
    if (!asset) return res.status(404).json({ success: false, error: 'Asset not found' });
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
