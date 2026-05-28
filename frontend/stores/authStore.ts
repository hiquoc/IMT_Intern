import { create } from "zustand";
import type { User } from "../types/auth";
import { persist } from "zustand/middleware";

interface AuthState {
    user: User | null;
    token: string | null;
    setLogin: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setLogin: (user, token) =>
                set({
                    user,
                    token
                }),

            logout: () =>
                set({
                    user: null,
                    token: null
                })

        }),
        {
            name: "auth-storage"
        }
    )
);