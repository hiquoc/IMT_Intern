import z from "zod";

export const newTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tên công việc không được để trống")
    .max(100, "Tên công việc quá dài"),
});

export type newTodoForm=z.infer<typeof newTodoSchema>;