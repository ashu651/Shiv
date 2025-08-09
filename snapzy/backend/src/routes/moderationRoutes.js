import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createReport, listReports, updateReport, adminStats } from '../controllers/moderationController.js';

const router = Router();

router.post('/report', requireAuth, createReport);
router.get('/reports', requireAuth, listReports);
router.put('/reports/:id', requireAuth, updateReport);
router.get('/stats', requireAuth, adminStats);

export default router;