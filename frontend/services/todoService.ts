import type { Todo } from "../types/todo";
import api from "../lib/api";

export async function getTodos(completed?: boolean) {
    const params = completed !== undefined ? { completed: String(completed) } : {};
    const response = await api.get("/todos", { params });
    return response.data.data as Todo[];
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