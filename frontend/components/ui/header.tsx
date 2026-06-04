import { Link } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { useLogout } from "../../hooks/auth/useLogout";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button, Layout, Space, Typography } from "antd";

export default function Header() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <Layout.Header
      style={{
        alignItems: "center",
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        height: 64,
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <Typography.Title level={4} style={{ margin: 0 }}>
        <Link to="/" style={{ color: "black" }}>
          {t("header.title")}
        </Link>
      </Typography.Title>
      <Space size="middle" wrap>
        {user && (
          <Typography.Text >{user.email}</Typography.Text>
        )}
        <LanguageSwitcher />
        <Link to="/profile">
          <Button type="primary">{t("header.profile")}</Button>
        </Link>
        <Button danger type="primary" disabled={!user} onClick={handleLogout}>
          {t("header.logout")}
        </Button>
      </Space>
    </Layout.Header >
  );
}
