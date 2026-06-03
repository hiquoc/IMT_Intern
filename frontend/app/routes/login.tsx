import { loginSchema, type LoginForm } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "../../components/ui/customToast";
import useLogin from "../../hooks/auth/useLogin";
import Button from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";

export default function Login() {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const loginMutation = useLogin();

    const onSubmit = async (data: LoginForm) => {
        loginMutation.mutate(data);
    };

    const onInvalid = (errors: FieldErrors<LoginForm>) => {
        toast.error(Object.values(errors)[0]?.message || t("auth.invalidLoginInfo"));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>
                <h2 className="text-2xl font-bold text-center">{t("auth.login")}</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit, onInvalid)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            {t("auth.email")}
                        </label>
                        <input
                            {...register("email")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {t("auth.password")}
                        </label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                        {loginMutation.isPending ? t("auth.loggingIn") : t("auth.login")}
                    </Button>
                </form>
                <div className="text-center text-sm text-gray-600">
                    {t("auth.noAccount")}{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        {t("auth.register")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
