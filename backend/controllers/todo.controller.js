import todoService from '../services/todo.service.js';
import asyncHandle from '../utils/asyncHandle.js';
import { successResponse } from '../utils/mappers/response.mapper.js'
import { toPaginatedTodosDto, toTodoDto } from '../utils/mappers/todo.mapper.js';

const getAllTodos = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const { page, size, completed, keyword } = sanitizeGetAllTodoQuery(req.query);

  const result = await todoService.getAllTodos(userId, page, size, keyword, completed);
  return res.json(successResponse(toPaginatedTodosDto(result)));
});

const createTodo = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const todo = await todoService.createTodo(req.body, userId);
  return res.status(201).json(successResponse(toTodoDto(todo)));
});

const getTodoById = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const todo = await todoService.getTodoById(req.params.id, userId);
  return res.json(successResponse(toTodoDto(todo)));
});

const updateTodo = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const todo = await todoService.updateTodo(req.params.id, req.body, userId);
  return res.json(successResponse(toTodoDto(todo)));
});

const updateCompletionStatus = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const todo = await todoService.updateCompletionStatus(req.params.id, userId);
  return res.json(successResponse(toTodoDto(todo)));
});

const deleteTodo = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  await todoService.deleteTodo(req.params.id, userId);
  return res.status(204).send();
});

export default {
  getAllTodos,
  createTodo,
  getTodoById,
  updateTodo,
  updateCompletionStatus,
  deleteTodo,
};

function sanitizeGetAllTodoQuery(queries) {
  const { page, size, completed, keyword } = queries;

  return {
    page: parseInt(page) || 1,
    size: parseInt(size) || 10,
    completed: completed === 'true' ? true : completed === 'false' ? false : undefined,
    keyword: keyword || undefined,
  };
}
