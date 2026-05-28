import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  completed: z.boolean().default(false),
});

export const updateTodoSchema = z
  .object({
    title: z.string().min(1, 'Title must be a non-empty string').optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field (title or completed) must be provided',
  });
