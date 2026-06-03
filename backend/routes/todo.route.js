import { Router } from 'express';
import todoController from '../controllers/todo.controller.js';
import attachmentController from '../controllers/attachment.controller.js';
import validate from '../middlewares/validate.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';
import { uploadTodoAttachment } from '../middlewares/upload.middleware.js';
import {
  createTodoSchema,
  updateTodoSchema,
} from '../validations/todo.validation.js';

const router = Router();

/**
 * @openapi
 * /todos:
 *   get:
 *     summary: Get paginated list of todos
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', authenticate, todoController.getAllTodos);

/**
 * @openapi
 * /todos/{id}:
 *   get:
 *     summary: Get todo by ID
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', authenticate, todoController.getTodoById);

/**
 * @openapi
 * /todos:
 *   post:
 *     summary: Create a todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodoInput'
 *     responses:
 *       201:
 *         description: Success
 */
router.post('/', authenticate, validate(createTodoSchema), todoController.createTodo);

/**
 * @openapi
 * /todos/{id}/attachments:
 *   post:
 *     summary: Upload an attachment to a todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Success
 */
router.post('/:id/attachments', authenticate, uploadTodoAttachment, attachmentController.addAttachment);

/**
 * @openapi
 * /todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodoInput'
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/:id', authenticate, validate(updateTodoSchema), todoController.updateTodo);

/**
 * @openapi
 * /todos/{id}:
 *   patch:
 *     summary: Toggle completion of a todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Success
 */
router.patch('/:id', authenticate, todoController.updateCompletionStatus);

/**
 * @openapi
 * /todos/{id}/attachments/{attachmentId}:
 *   delete:
 *     summary: Delete a todo attachment
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Success
 */
router.delete('/:id/attachments/:attachmentId', authenticate, attachmentController.deleteAttachment);

/**
 * @openapi
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Success
 */
router.delete('/:id', authenticate, todoController.deleteTodo);

export default router;
