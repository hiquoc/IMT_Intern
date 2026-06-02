import { useAuthStore } from "../stores/authStore";
import { Navigate, Outlet } from "react-router";

export default function GuestLayout() {
    const token = useAuthStore((state) => state.token);

    if (token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}