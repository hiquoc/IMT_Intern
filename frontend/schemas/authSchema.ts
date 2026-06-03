import { z } from "zod";
import i18n from "../lib/i18n";

const t = (key: string) => i18n.t(key);

export const loginSchema = z.object({
  email: z.string().email(() => t("errors.EMAIL_REQUIRED")),
  password: z.string().min(6, () => t("errors.PASSWORD_MIN_LENGTH")),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email(() => t("errors.EMAIL_REQUIRED")),
    password: z.string().min(6, () => t("errors.PASSWORD_MIN_LENGTH")),
    confirmPassword: z.string().min(1, () => t("errors.CONFIRM_PASSWORD_REQUIRED")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("errors.CONFIRM_PASSWORD_MISMATCH"),
    path: ["confirmPassword"],
  });

export type RegisterForm = z.infer<typeof registerSchema>;