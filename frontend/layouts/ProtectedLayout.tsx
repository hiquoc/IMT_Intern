import { useEffect, useState } from "react";
import Header from "../components/ui/header";
import { useAuthStore } from "../stores/authStore";
import { Navigate, Outlet } from "react-router";


export default function ProtectedLayout() {
    const token = useAuthStore((state) => state.token);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(useAuthStore.persist.hasHydrated());
    }, []);

    if(!hydrated) {
        return null;
    }
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}