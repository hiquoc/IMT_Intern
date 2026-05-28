import todoService from '../services/todo.service.js';
import asyncHandle from '../utils/asyncHandle.js';
import {successResponse} from '../utils/mappers/response.mapper.js'

const getAllTodos = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const completed = parseCompletedQuery(req.query.completed);
  const todos = await todoService.getAllTodos(completed, userId);
  return res.json(successResponse(todos));
});

const createTodo = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const todo = await todoService.createTodo(req.body, userId);
  return res.status(201).json(successResponse(todo));
});

const getTodoById = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const todo = await todoService.getTodoById(req.params.id,userId);
  return res.json(successResponse(todo));
});

const updateTodo = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  const todo = await todoService.updateTodo(req.params.id, req.body,userId);
  return res.json(successResponse(todo));
});

const updateCompletionStatus = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  await todoService.updateCompletionStatus(req.params.id,userId);
  return res.status(204).send();
});

const deleteTodo = asyncHandle(async (req, res, next) => {
  const userId = req.user.userId;
  await todoService.deleteTodo(req.params.id,userId);
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

function parseCompletedQuery(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}
