import { z } from "zod";
import i18n from "../lib/i18n";

const t = (key: string) => i18n.t(key);

export const newTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, () => t("errors.TITLE_REQUIRED"))
    .max(100, () => t("errors.TITLE_TOO_LONG")),
});

export type newTodoForm = z.infer<typeof newTodoSchema>;