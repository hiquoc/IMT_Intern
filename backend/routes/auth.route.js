import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
} from '../validations/auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-other-sessions', authenticate, authController.logoutAllOtherSessions);
router.get('/sessions', authenticate, authController.getSessions);

export default router;
