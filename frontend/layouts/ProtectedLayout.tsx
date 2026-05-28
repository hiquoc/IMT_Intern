import Header from "../components/ui/header";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { useState } from "react";

export default function ProtectedLayout() {
    const authenticated = useAuthStore((state) => state.token);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(useAuthStore.persist.hasHydrated());
    }, []);

    if (!hydrated) {
        return null;
    }

    if (!authenticated) {
        return (
            <Navigate to="/login" replace />
        );
    }
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}