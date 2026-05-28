import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(6,"Password must at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(6,"Password must at least 6 characters"),
});