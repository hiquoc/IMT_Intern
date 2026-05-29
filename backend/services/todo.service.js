import createHttpError from 'http-errors';
import prisma from '../libs/prisma.js';

async function getAllTodos(completed, userId) {
  return await prisma.todo.findMany({
    where: {
      userId,
      ...(completed !== undefined && {
        completed
      })
    }
    , orderBy: { createdAt: "asc" }
  });
}

async function createTodo(createTodoDto, userId) {
  return await prisma.todo.create({
    data: {
      ...createTodoDto,
      userId,
    },
  });
}

async function getTodoById(id, userId) {
  const todo = await prisma.todo.findFirst({
    where: { id, userId },
  });

  if (!todo) {
    throw createHttpError(404, `Todo item not found`);
  }

  return todo;
}

async function updateTodo(id, updateTodoDto, userId) {
  const todo = await prisma.todo.update({
    where: { id, userId },
    data: updateTodoDto,
  });

  if (!todo) {
    throw createHttpError(404, `Todo item not found`);
  }

  return todo;
}

async function updateCompletionStatus(id, userId) {
  const todo = await prisma.todo.findFirst({
    where: { id, userId },
  });
  if (!todo) 
    throw createHttpError(404, "Todo item not found");
  
  return prisma.todo.update({
    where: { id },
    data: {
      completed: !todo.completed,
    },
  });
}

async function deleteTodo(id, userId) {
  const todo = await prisma.todo.delete({
    where: { id, userId },
  });

  if (!todo) {
    throw createHttpError(404, `Todo item not found`);
  }
}

export default {
  getAllTodos,
  createTodo,
  getTodoById,
  updateTodo,
  updateCompletionStatus,
  deleteTodo,
};
