import { Layout, Typography, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Header } = Layout;
const { Title } = Typography;

export default function DashboardHeader({ onMenuClick }) {
  const [user, setUser] = useState("");
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);
  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo + tiêu đề */}
      <Title level={4} style={{ margin: 0 }}>
        📊 Dashboard
      </Title>

      {/* Khu vực user info */}
      <Space>
        <Avatar size="large" src={user?.image} />
        <span className="cursor-pointer" onClick={() => onMenuClick("profile")}>
          {user ? user.username : "admin"}
        </span>
      </Space>
    </Header>
  );
}
