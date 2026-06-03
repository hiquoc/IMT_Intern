import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterForm } from "../../schemas/authSchema";
import { toast } from "../../components/ui/customToast";
import { Link } from "react-router";
import useRegister from "../../hooks/auth/useRegister";
import Button from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";

export default function Register() {
    const { t } = useTranslation();
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

    const onSubmit = async ({ email, password }: RegisterForm) => {
        registerMutation.mutate({ email, password });
    };

    const onInvalid = (errors: FieldErrors<RegisterForm>) => {
        toast.error(Object.values(errors)[0]?.message || t("auth.invalidRegisterInfo"));
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>
                <h2 className="text-2xl font-bold text-center">{t("auth.register")}</h2>
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
                            {...register("password")}
                            type="password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            {t("auth.confirmPassword")}
                        </label>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                    >
                        {registerMutation.isPending ? t("auth.registering") : t("auth.register")}
                    </Button>
                </form>
                <div className="text-center text-sm text-gray-600">
                    {t("auth.hasAccount")}{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        {t("auth.login")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
