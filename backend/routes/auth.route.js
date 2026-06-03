import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
} from '../validations/auth.validation.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Success
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh session token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/refresh', authController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out current session
 *     tags: [Authentication]
 *     responses:
 *       204:
 *         description: Success
 */
router.post('/logout', authController.logout);

/**
 * @openapi
 * /auth/logout-other-sessions:
 *   post:
 *     summary: Log out other sessions
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/logout-other-sessions', authenticate, authController.logoutAllOtherSessions);

/**
 * @openapi
 * /auth/sessions:
 *   get:
 *     summary: Get all active sessions
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/sessions', authenticate, authController.getSessions);

export default router;
