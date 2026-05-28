import type { LoginRequest, RegisterRequest } from "../types/auth";
import api from "../lib/api";

export async function loginApi(data: LoginRequest) {
    const response = await api.post("/auth/login", data);
    return response.data.data;
}

export async function registerApi(data: RegisterRequest) {
    const response = await api.post("/auth/register", data);
    return response.data.data;
}