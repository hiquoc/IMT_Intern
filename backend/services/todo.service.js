import createHttpError from 'http-errors';
import prisma from '../libs/prisma.js';
import cloudinary from '../configs/cloudinary.config.js';

async function getAllTodos(userId, page = 1, size = 5, keyword, completed) {
  const p = parseInt(page, 10) || 1;
  const s = parseInt(size, 10) || 5;

  const where = {
    userId,
    ...(completed !== undefined && {
      completed
    }),
    ...(keyword && {
      title: {
        contains: keyword,
        mode: 'insensitive'
      }
    })
  };

  const [total, items] = await prisma.$transaction([
    prisma.todo.count({ where }),
    prisma.todo.findMany({
      where,
      skip: (p - 1) * s,
      take: s,
      include: {
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / s));

  return {
    items,
    total,
    page: p,
    size: s,
    totalPages
  };
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
    include: {
      attachments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!todo) {
    throw createHttpError(404, 'TODO_NOT_FOUND');
  }

  return todo;
}

async function updateTodo(id, updateTodoDto, userId) {
  const todo = await prisma.todo.update({
    where: { id, userId },
    data: updateTodoDto,
  });

  if (!todo) {
    throw createHttpError(404, 'TODO_NOT_FOUND');
  }

  return todo;
}

async function updateCompletionStatus(id, userId) {
  const todo = await prisma.todo.findFirst({
    where: { id, userId },
  });
  if (!todo)
    throw createHttpError(404, "TODO_NOT_FOUND");

  return prisma.todo.update({
    where: { id },
    data: {
      completed: !todo.completed,
    },
  });
}

async function deleteTodo(id, userId) {
  const todo = await prisma.todo.findUnique({
    where: { id, userId },
    include: {
      attachments: true,
    },
  });
  if (!todo) {
    throw createHttpError(404, 'TODO_NOT_FOUND');
  }

  await Promise.all(
    todo.attachments.map((attachment) =>
      cloudinary.uploader.destroy(attachment.publicId, {
        resource_type: attachment.resourceType,
      })
    )
  );

  await prisma.todo.delete({
    where: { id },
  });
}

export default {
  getAllTodos,
  createTodo,
  getTodoById,
  updateTodo,
  updateCompletionStatus,
  deleteTodo,
};
