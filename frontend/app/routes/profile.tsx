import { useMemo } from "react";
import { useAuthStore } from "../../stores/authStore";
import useSession from "../../hooks/auth/useSession";
import { useTranslation } from "react-i18next";
import { Button, Card, Empty, List, Space, Spin, Tag, Typography } from "antd";

export default function Profile() {
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const { sessions, isLoading, logoutOtherSessions } = useSession();

    const sortedSessions = useMemo(() => {
        return [...sessions].sort((a, b) => {
            return a.current ? -1 : 1;
        });
    }, [sessions]);

    return (
        <main className="min-h-[calc(100vh-64px)] bg-gray-100 p-6">
            <div className="mx-auto max-w-4xl">
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Card title={t("profile.title")}>
                        <Typography.Text>
                            <Typography.Text strong>{t("profile.emailLabel")}:</Typography.Text>{" "}
                            {user?.email ?? t("profile.noEmail")}
                        </Typography.Text>
                    </Card>

                    <Card
                        title={t("profile.sessions")}
                        extra={
                            <Button
                                danger
                                type="primary"
                                onClick={() => logoutOtherSessions.mutate()}
                                disabled={logoutOtherSessions.isPending}
                                loading={logoutOtherSessions.isPending}
                            >
                                {t("profile.logoutOtherSessions")}
                            </Button>
                        }
                    >
                        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
                            {t("profile.sessionsDescription")}
                        </Typography.Paragraph>

                        {isLoading ? (
                            <div style={{ textAlign: "center", padding: 24 }}>
                                <Spin tip={t("profile.loadingSessions")} />
                            </div>
                        ) : sortedSessions.length === 0 ? (
                            <Empty description={t("profile.noSessions")} />
                        ) : (
                            <List
                                dataSource={sortedSessions}
                                renderItem={(session) => {
                                    const createdAt = session.createdAt
                                        ? new Date(Number(session.createdAt) || session.createdAt)
                                        : null;

                                    return (
                                        <List.Item>
                                            <Card
                                                size="small"
                                                style={{
                                                    width: "100%",
                                                    borderColor: session.current ? "#52c41a" : "#f0f0f0",
                                                    background: session.current ? "#f6ffed" : "#fff",
                                                }}
                                            >
                                                <Space direction="vertical" style={{ width: "100%" }} size="small">
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography.Text strong>
                                                            {session.current ? t("profile.currentSession") : t("profile.deviceLoggedIn")}
                                                        </Typography.Text>
                                                        {session.current && (
                                                            <Tag color="green">{t("profile.currentSession")}</Tag>
                                                        )}
                                                    </div>

                                                    <Typography.Text type="secondary">
                                                        <Typography.Text strong>{t("profile.ip")}:</Typography.Text>{" "}
                                                        {session.ip || t("profile.unknown")}
                                                    </Typography.Text>

                                                    <Typography.Text type="secondary">
                                                        <Typography.Text strong>{t("profile.lastActive")}:</Typography.Text>{" "}
                                                        {createdAt
                                                            ? createdAt.toLocaleString("vi-VN")
                                                            : t("profile.unknown")}
                                                    </Typography.Text>
                                                </Space>
                                            </Card>
                                        </List.Item>
                                    );
                                }}
                            />
                        )}
                    </Card>
                </Space>
            </div>
        </main>
    );
}