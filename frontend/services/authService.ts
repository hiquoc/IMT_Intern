import type { LoginRequest, RegisterRequest } from "../types/auth";
import api from "../lib/api";
import axios from "axios";

export async function loginApi(data: LoginRequest) {
    const response = await api.post("/auth/login", data);
    return response.data.data;
}

export async function registerApi(data: RegisterRequest) {
    const response = await api.post("/auth/register", data);
    return response.data.data;
}

export async function refreshTokenApi() {
    const response = await axios.post(
        "http://localhost:3000/auth/refresh",
        {},
        {
            withCredentials: true,
        }
    );
    return response.data.data;
}

export async function logoutApi() {
    await api.post("/auth/logout");
}

export async function logoutOtherSessionsApi() {
    await api.post("/auth/logout-other-sessions");
}

export async function getSessionsApi() {
    const response = await api.get("/auth/sessions");
    return response.data.data;
}