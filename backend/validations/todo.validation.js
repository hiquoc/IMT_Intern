import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'TITLE_REQUIRED'),
  completed: z.boolean().default(false),
});

export const updateTodoSchema = z
  .object({
    title: z.string().min(1, 'TITLE_REQUIRED').optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'EMPTY_UPDATE',
  });


