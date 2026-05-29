import type { ButtonHTMLAttributes } from "react";

interface Ibutton extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'blue' | 'green' | 'red',
    children: React.ReactNode,
    disabled?: boolean
}

export default function Button({ color = "blue", children, className, disabled = false, ...props }: Ibutton) {
    const colorClasses = {
        blue: "bg-blue-500 hover:bg-blue-600 text-white",
        green: "bg-green-500 hover:bg-green-600 text-white",
        red: "bg-red-500 hover:bg-red-600 text-white",
    };
    return (
        <button
            className={`
        px-4 py-2 rounded-md
        ${colorClasses[color]}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
}