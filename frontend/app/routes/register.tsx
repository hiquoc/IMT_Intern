import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterForm } from "../../schemas/authSchema";
import { toast } from "../../components/ui/customToast";
import { Link } from "react-router";
import useRegister from "../../hooks/auth/useRegister";
import type { RegisterRequest } from "../../types/auth";

export default function Register() {
    const { register, handleSubmit } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const registerMutation = useRegister();

    async function onSubmit(data: RegisterForm) {
        const payload: RegisterRequest = {
            email: data.email,
            password: data.password,
        };
        registerMutation.mutate(payload);
    }
    function onInvalid(errors: FieldErrors<RegisterForm>) {
        const firstError = errors.confirmPassword?.message || errors.email?.message || errors.password?.message || "Thông tin đăng ký không hợp lệ";
        toast.error(firstError);
    }
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Đăng ký</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit, onInvalid)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input {...register("email")} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input {...register("password")} type="password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                        <input {...register("confirmPassword")} type="password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" disabled={registerMutation.isPending} className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                        {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </form>
                <div className="text-center text-sm text-gray-600">
                    Đã có tài khoản? <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}
