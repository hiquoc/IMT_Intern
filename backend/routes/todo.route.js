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

router.get('/',authenticate, todoController.getAllTodos);
router.get('/:id',authenticate, todoController.getTodoById);
router.post('/',authenticate, validate(createTodoSchema), todoController.createTodo);
router.post('/:id/attachments', authenticate, uploadTodoAttachment, attachmentController.addAttachment);
router.put('/:id',authenticate, validate(updateTodoSchema), todoController.updateTodo);
router.patch('/:id',authenticate, todoController.updateCompletionStatus);
router.delete('/:id/attachments/:attachmentId', authenticate, attachmentController.deleteAttachment);
router.delete('/:id',authenticate, todoController.deleteTodo);

export default router;
