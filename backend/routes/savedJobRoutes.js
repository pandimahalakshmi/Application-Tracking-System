import express from 'express';
import { toggleSave, getSavedJobs, getSavedIds } from '../controllers/savedJobController.js';

const router = express.Router();

router.post('/toggle',           toggleSave);
router.get('/user/:userId',      getSavedJobs);
router.get('/ids/:userId',       getSavedIds);

export default router;
