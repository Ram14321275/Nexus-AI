import express from 'express';
import { generateRoadmap, getUserRoadmaps } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getUserRoadmaps);

export default router;
