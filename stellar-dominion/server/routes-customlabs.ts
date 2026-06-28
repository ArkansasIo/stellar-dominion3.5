/**
 * Custom Lab Creation Routes
 * Endpoints for lab creation, upgrades, and management
 */

import { Router } from 'express';
import { isAuthenticated } from './basicAuth';
import { CustomLabService } from './services/customLabService';

const router = Router();

/**
 * POST /api/labs/create
 * Create a new custom lab
 */
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { name, specialization, theme } = req.body;

    if (!name || !specialization || !theme) {
      return res.status(400).json({
        success: false,
        error: 'Name, specialization, and theme are required',
      });
    }

    const lab = await CustomLabService.createLab(userId, name, specialization, theme);

    res.json({
      success: true,
      data: lab,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create lab',
    });
  }
});

/**
 * GET /api/labs
 * Get all player's labs with bonuses
 */
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const labs = await CustomLabService.getLabsWithBonuses(userId);

    res.json({
      success: true,
      data: labs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch labs',
    });
  }
});

/**
 * GET /api/labs/:labId
 * Get specific lab details
 */
router.get('/:labId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;

    const lab = await CustomLabService.getLabById(userId, labId);

    if (!lab) {
      return res.status(404).json({
        success: false,
        error: 'Lab not found',
      });
    }

    const bonuses = await CustomLabService.getLabBonuses(userId, labId);
    const upkeep = await CustomLabService.getLabUpkeep(userId, labId);

    res.json({
      success: true,
      data: { ...lab, bonuses, upkeep },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch lab',
    });
  }
});

/**
 * POST /api/labs/:labId/upgrade
 * Upgrade lab size
 */
router.post('/:labId/upgrade', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;
    const { newSize } = req.body;

    if (!newSize) {
      return res.status(400).json({
        success: false,
        error: 'New size is required',
      });
    }

    const success = await CustomLabService.upgradeLab(userId, labId, newSize);

    res.json({
      success,
      message: success ? 'Lab upgraded successfully' : 'Upgrade failed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to upgrade lab',
    });
  }
});

/**
 * POST /api/labs/:labId/modules
 * Add module to lab
 */
router.post('/:labId/modules', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;
    const { moduleType } = req.body;

    if (!moduleType) {
      return res.status(400).json({
        success: false,
        error: 'Module type is required',
      });
    }

    const success = await CustomLabService.addModule(userId, labId, moduleType);

    res.json({
      success,
      message: success ? 'Module added successfully' : 'Failed to add module',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add module',
    });
  }
});

/**
 * POST /api/labs/:labId/staff
 * Hire staff member
 */
router.post('/:labId/staff', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;
    const { position, staffName } = req.body;

    if (!position || !staffName) {
      return res.status(400).json({
        success: false,
        error: 'Position and staff name are required',
      });
    }

    const success = await CustomLabService.hireStaff(userId, labId, position, staffName);

    res.json({
      success,
      message: success ? 'Staff hired successfully' : 'Failed to hire staff',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to hire staff',
    });
  }
});

/**
 * PUT /api/labs/:labId/customization
 * Update lab customization
 */
router.put('/:labId/customization', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;
    const { color, name, description } = req.body;

    const success = await CustomLabService.updateCustomization(userId, labId, {
      color,
      name,
      description,
    });

    res.json({
      success,
      message: success ? 'Customization updated' : 'Update failed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update customization',
    });
  }
});

/**
 * POST /api/labs/:labId/research
 * Set active research in lab
 */
router.post('/:labId/research', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;
    const { techId } = req.body;

    if (!techId) {
      return res.status(400).json({
        success: false,
        error: 'Tech ID is required',
      });
    }

    const success = await CustomLabService.setActiveResearch(userId, labId, techId);

    res.json({
      success,
      message: success ? 'Research set successfully' : 'Failed to set research',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to set research',
    });
  }
});

/**
 * POST /api/labs/:labId/staff/:staffName/train
 * Train staff member
 */
router.post('/:labId/staff/:staffName/train', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId, staffName } = req.params;

    const success = await CustomLabService.trainStaff(userId, labId, staffName);

    res.json({
      success,
      message: success ? 'Staff trained successfully' : 'Failed to train staff',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to train staff',
    });
  }
});

/**
 * DELETE /api/labs/:labId
 * Delete a lab
 */
router.delete('/:labId', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;

    const success = await CustomLabService.deleteLab(userId, labId);

    res.json({
      success,
      message: success ? 'Lab deleted successfully' : 'Lab not found',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete lab',
    });
  }
});

/**
 * GET /api/labs/:labId/bonuses
 * Get lab bonuses summary
 */
router.get('/:labId/bonuses', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;

    const bonuses = await CustomLabService.getLabBonuses(userId, labId);

    res.json({
      success: true,
      data: bonuses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bonuses',
    });
  }
});

/**
 * GET /api/labs/:labId/upkeep
 * Get lab upkeep cost
 */
router.get('/:labId/upkeep', isAuthenticated, async (req, res) => {
  try {
    const userId = (req.session as any)?.userId;
    const { labId } = req.params;

    const upkeep = await CustomLabService.getLabUpkeep(userId, labId);

    res.json({
      success: true,
      data: { upkeep },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch upkeep',
    });
  }
});

export default router;
