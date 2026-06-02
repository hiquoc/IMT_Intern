import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../../services/authService";
import { useAuthStore } from "../../stores/authStore";

export function useLogout() {
    const queryClient = useQueryClient();
    const authLogout = useAuthStore(
        state => state.logout);

    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            queryClient.clear();
            authLogout();
        }
    });
}