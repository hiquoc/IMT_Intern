import { useEffect, useState } from "react";
import { create } from "zustand"

type ToastType = "success" | "error";

type ToastState = {
    message: string;
    type: ToastType;
    visible: boolean;

    success: (message: string) => void;
    error: (message: string) => void;
    clear: () => void;
};

const useToastStore = create<ToastState>((set) => ({
    message: "",
    type: "success",
    visible: false,

    success: (message) =>
        set({
            message,
            type: "success",
            visible: true,
        }),

    error: (message) =>
        set({
            message,
            type: "error",
            visible: true,
        }),

    clear: () =>
        set({
            visible: false,
        }),
}))

export const toast = {
    success: (message: string) =>
        useToastStore.getState().success(message),

    error: (message: string) =>
        useToastStore.getState().error(message),
};

export function CustomToastHost() {
    const { message, type, visible, clear } = useToastStore();
    useEffect(() => {
        if (!visible) return;

        const timer = setTimeout(() => {
            clear()
        }, 3000);

        return () => clearTimeout(timer);

    }, [visible, clear]);

    if (!visible) return null;

    const colorMap = {
        error: "bg-red-100 text-red-700 border-red-300",
        success: "bg-green-100 text-green-700 border-green-300",
    };

    return (
        <div className={
            `fixed top-4 right-4 z-50 px-4 py-2 rounded-md border
             shadow-md text-sm ${colorMap[type]}
             `}
        >
            {message}
        </div>
    );
}