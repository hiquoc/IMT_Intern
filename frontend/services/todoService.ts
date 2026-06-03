import type { Attachment, Todo } from "../types/todo";
import api from "../lib/api";

export interface PaginatedTodos {
    items: Todo[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
}

export async function getTodos(page?: number, size?: number, keyword?: string, completed?: boolean) {
    const params = {
        page: page ? String(page) : undefined,
        size: size ? String(size) : undefined,
        ...(keyword ? { keyword } : {}),
        ...(completed !== undefined ? { completed: String(completed) } : {})
    };
    const response = await api.get("/todos", { params });
    return response.data.data as PaginatedTodos;
}

export async function createTodo(title: string) {
    const response = await api.post("/todos", { title });
    return response.data.data as Todo;
}

export async function updateTodo(id: string, title: string) {
    const response = await api.put(`/todos/${id}`, { title });
    return response.data.data as Todo;
}

export async function toggleTodoComplete(id: string) {
    const response = await api.patch(`/todos/${id}`, {});
    return response.data;
}

export async function deleteTodo(id: string) {
    await api.delete(`/todos/${id}`);
}

export async function uploadTodoAttachment(todoId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/todos/${todoId}/attachments`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data as Attachment;
}

export async function deleteTodoAttachment(todoId: string, attachmentId: number) {
    await api.delete(`/todos/${todoId}/attachments/${attachmentId}`);
}
