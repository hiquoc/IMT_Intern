import { Button as AntButton } from "antd";
import type { ButtonHTMLAttributes } from "react";

interface Ibutton extends ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'blue' | 'green' | 'red',
    children: React.ReactNode,
    disabled?: boolean
}

export default function Button({ color = "blue", children, className, disabled = false, type, ...props }: Ibutton) {
    const antColor = {
        blue: "primary",
        green: "default",
        red: "primary",
    } as const;

    const colorStyle = {
        blue: undefined,
        green: { borderColor: "#52c41a", color: "#389e0d" },
        red: undefined,
    };

    return (
        <AntButton
            danger={color === "red"}
            disabled={disabled}
            htmlType={type}
            type={antColor[color]}
            className={className}
            style={colorStyle[color]}
            {...props}
        >
            {children}
        </AntButton>
    );
}
