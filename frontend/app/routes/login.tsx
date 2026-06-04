import { loginSchema, type LoginForm } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors, Controller } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "../../components/ui/toast";
import useLogin from "../../hooks/auth/useLogin";
import { useTranslation } from "react-i18next";
import { Button, Card, Form, Input, Typography } from "antd";

export default function Login() {
    const { t } = useTranslation();
    const { register, handleSubmit, watch, control } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const loginMutation = useLogin();

    const email = watch("email");
    console.log("Current email value:", email); // Debugging log

    const password = watch("password");
    console.log("Current password value:", password); // Debugging log

    const onSubmit = async (data: LoginForm) => {
        loginMutation.mutate(data);
    };

    const onInvalid = (errors: FieldErrors<LoginForm>) => {
        toast.error(Object.values(errors)[0]?.message || t("auth.invalidLoginInfo"));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card style={{ width: "100%", maxWidth: 420 }}>
                <Typography.Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
                    {t("auth.login")}
                </Typography.Title>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit, onInvalid)}>
                    <Form.Item label={t("auth.email")}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} size="large" />
                            )}
                        />
                    </Form.Item>
                    <Form.Item label={t("auth.password")}>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input.Password {...field} size="large" />
                            )}
                        />
                    </Form.Item>
                    <Button
                        block
                        disabled={loginMutation.isPending}
                        htmlType="submit"
                        loading={loginMutation.isPending}
                        size="large"
                        type="primary"
                    >
                        {t("auth.login")}
                    </Button>
                </Form>
                <Typography.Paragraph type="secondary" style={{ margin: "24px 0 0", textAlign: "center" }}>
                    {t("auth.noAccount")}{" "}
                    <Link to="/register">
                        {t("auth.register")}
                    </Link>
                </Typography.Paragraph>
            </Card>
        </div >
    );
}
