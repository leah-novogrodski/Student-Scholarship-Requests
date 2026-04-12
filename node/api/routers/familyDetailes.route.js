import express from 'express'
import {
  getFamilyDetailes,
  getById,
    createFamilyDetailes,
    updateFamilyDetailes,
    deleteFamilyDetailes
} from '../controllers/familyDetailes.js'
const router = express.Router();

router.get('/', getFamilyDetailes);
router.get('/:id', getById);
router.post('/', createFamilyDetailes);
router.put('/:id', updateFamilyDetailes);
router.delete('/:id', deleteFamilyDetailes);
export default router;