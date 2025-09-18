import { Layout, Typography, Avatar, Space } from "antd";
import { useEffect, useState } from "react";
import CustomMenu from "../CustomMenu";
import Tippy from "@tippyjs/react";
import { handleRefresh } from "@/lib/function";
import { LIMIT } from "@/lib/constaints";

const { Header } = Layout;
const { Title } = Typography;

export default function DashboardHeader({ onMenuClick, setSelectedPost }) {
  const [user, setUser] = useState("");
  const [token, setToken] = useState();
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [action, setAction] = useState({
    refershNotification: false,
    hasMore: true,
  });

  const fetchNotification = async (page, refresh) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(
        `/api/notifications/${user.id}?limit=${LIMIT}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        if (data.data.length < LIMIT) {
          setAction((prev) => ({ ...prev, hasMore: false }));
        }
        if (page === 1) {
          setNotifications(data.data);
        } else {
          if (refresh) {
            setNotifications(data.data);
          } else {
            setNotifications((prev) => [...prev, ...data.data]);
          }
        }
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
  }, []);

  useEffect(() => {
    fetchNotification(page, true);
  }, [action.refreshNotification]);

  const hanlleNotification = async (noti) => {
    if (noti.type === "post") {
      onMenuClick("posts");
      console.log("setSelectedPost: ", noti.post_id);
      setSelectedPost(noti.post_id);
    }
    if (noti.status === "new") {
      try {
        await fetch(`/api/admin/notifications/${noti.id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        handleRefresh(setPage, setAction);
      } catch (error) {}
    }
  };

  const handleSeenPreNoti = async (page, setPage) => {
    setAction((prev) => ({ ...prev, loadingNotification: true }));
    fetchNotification(page + 1);
    setPage((prev) => prev + 1);
  };

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
              action: () => hanlleNotification(noti),
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
            handleSeenPreNoti={() => handleSeenPreNoti(page, setPage)}
            handleRefresh={() => handleRefresh(setPage, setAction)}
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
