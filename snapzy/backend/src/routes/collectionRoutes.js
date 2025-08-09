import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listCollections, createCollection, renameCollection, removeCollection, togglePostInCollection } from '../controllers/collectionController.js';

const router = Router();

router.get('/', requireAuth, listCollections);
router.post('/', requireAuth, createCollection);
router.put('/:id', requireAuth, renameCollection);
router.delete('/:id', requireAuth, removeCollection);
router.post('/:id/toggle', requireAuth, togglePostInCollection);

export default router;