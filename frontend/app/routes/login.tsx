import { loginSchema, type LoginForm } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "../../components/ui/customToast";
import useLogin from "../../hooks/auth/useLogin";

export default function Login() {
    const { register, handleSubmit } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const loginMutation = useLogin();

    async function onSubmit(data: LoginForm) {
        loginMutation.mutate(data);
    }
    function onInvalid(errors: FieldErrors<LoginForm>) {
        toast.error(errors.email?.message || errors.password?.message || "Thông tin đăng nhập không hợp lệ");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit, onInvalid)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register("email")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" disabled={loginMutation.isPending} className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                        {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
                <div className="text-center text-sm text-gray-600">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-500 hover:underline">Đăng ký</Link>
                </div>
            </div>
        </div>
    );
}
