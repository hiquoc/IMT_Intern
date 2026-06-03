import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email('EMAIL_REQUIRED'),
  password: z.string().min(6, 'PASSWORD_MIN_LENGTH'),
});

export const loginSchema = z.object({
  email: z.email('EMAIL_REQUIRED'),
  password: z.string().min(6, 'PASSWORD_MIN_LENGTH'),
});
