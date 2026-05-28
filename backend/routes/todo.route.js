import { Router } from 'express';
import todoController from '../controllers/todo.controller.js';
import validate from '../middlewares/validate.middleware.js';
import authenticate from '../middlewares/auth.middleware.js';
import {
  createTodoSchema,
  updateTodoSchema,
} from '../validations/todo.validation.js';

const router = Router();

router.get('/',authenticate, todoController.getAllTodos);
router.get('/:id',authenticate, todoController.getTodoById);
router.post('/',authenticate, validate(createTodoSchema), todoController.createTodo);
router.put('/:id',authenticate, validate(updateTodoSchema), todoController.updateTodo);
router.patch('/:id',authenticate, todoController.updateCompletionStatus);
router.delete('/:id',authenticate, todoController.deleteTodo);

export default router;
