import { Layout, Typography, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

export default function DashboardHeader() {
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
        <Avatar size="large" icon={<UserOutlined />} />
        <span>Admin</span>
      </Space>
    </Header>
  );
}
