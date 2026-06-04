import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterForm } from "../../schemas/authSchema";
import { toast } from "../../components/ui/toast";
import { Link } from "react-router";
import useRegister from "../../hooks/auth/useRegister";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";
import { Button, Card, Form, Input, Space, Typography } from "antd";

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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card style={{ width: "100%", maxWidth: 440 }}>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <LanguageSwitcher />
                    </div>
                    <Typography.Title level={2} style={{ margin: 0, textAlign: "center" }}>
                        {t("auth.register")}
                    </Typography.Title>
                </Space>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit, onInvalid)} style={{ marginTop: 24 }}>
                    <Form.Item label={t("auth.email")}>
                        <Input
                            {...register("email")}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item label={t("auth.password")}>
                        <Input.Password
                            {...register("password")}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item label={t("auth.confirmPassword")}>
                        <Input.Password
                            {...register("confirmPassword")}
                            size="large"
                        />
                    </Form.Item>
                    <Button
                        block
                        disabled={registerMutation.isPending}
                        htmlType="submit"
                        loading={registerMutation.isPending}
                        size="large"
                        type="primary"
                    >
                        {t("auth.register")}
                    </Button>
                </Form>
                <Typography.Paragraph type="secondary" style={{ margin: "24px 0 0", textAlign: "center" }}>
                    {t("auth.hasAccount")}{" "}
                    <Link to="/login">
                        {t("auth.login")}
                    </Link>
                </Typography.Paragraph>
            </Card>
        </div>
    );
}
