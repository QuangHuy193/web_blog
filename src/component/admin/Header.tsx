import { Layout, Typography, Avatar, Space } from "antd";
import { useEffect, useState } from "react";
import CustomMenu from "../CustomMenu";
import Tippy from "@tippyjs/react";

const { Header } = Layout;
const { Title } = Typography;

export default function DashboardHeader({ onMenuClick }) {
  const [user, setUser] = useState("");
  const [token, setToken] = useState();
  const [notifications, setNotifications] = useState([]);

  const fetchNotification = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(`/api/notifications/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }

    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }

    fetchNotification();
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
        📊 Trang quản trị
      </Title>

      {/* Khu vực user info */}
      <Space>
        <Tippy content="Ảnh đại diện">
          <Avatar size="large" src={user?.image} />
        </Tippy>
        <Tippy content="Tên người dùng">
          <span
            className="hidden sm:inline text-lg font-medium cursor-pointer"
            onClick={() => onMenuClick("profile")}
          >
            {user ? user.username : "admin"}
          </span>
        </Tippy>

        {notifications && notifications.length > 0 ? (
          <CustomMenu
            items={notifications.map((noti) => ({
              label: noti.content,
              status: noti.status,
              action: () => hanlleNotification(noti.id),
            }))}
            variant="notifi"
            triggerIcon={
              <div className="relative">
                <div className=" text-2xl">🔔</div>
                {notifications.some((noti) => noti.status === "new") && (
                  <span className="text-red-500 absolute bottom-0 right-0">
                    ●
                  </span>
                )}
              </div>
            }
            isClick={true}
          />
        ) : (
          <CustomMenu
            items={[{ label: "Bạn không có thông báo nào", status: "seen" }]}
            variant="notifi"
            triggerIcon={<div className="text-2xl">🔔</div>}
            isClick={true}
          />
        )}
      </Space>
    </Header>
  );
}
