import { Router } from 'express';
import todoRoutes from './todo.route.js';
import authRoutes from './auth.route.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

export default router;
