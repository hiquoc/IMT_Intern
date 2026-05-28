export interface User{
    id: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        user: User;
    };
}
