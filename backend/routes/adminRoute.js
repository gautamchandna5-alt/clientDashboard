import express from 'express';
import { createUser } from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-user', verifyToken, requireRole('ADMIN'), createUser);

export default router;