// components/Header.tsx
"use client";
import { menuConfig } from "@/lib/menuConfig";
import { MenuOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout } from "antd";
import { useEffect, useState } from "react";
import MenuMobile from "./MenuMobile";
import CustomMenu from "./CustomMenu";
import Tippy from "@tippyjs/react";
import { handleRefresh } from "@/lib/function";
import { LIMIT } from "@/lib/constaints";

const { Header: AntHeader } = Layout;

export default function Header({
  setSelectedMenu,
  user,
  setUserId,
  token,
  setSelectedPost,
}) {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState({
    showMenuMobile: false,
    refreshNotification: true,
    loadingNotification: false,
    hasMore: true,
  });

  const fetchNotification = async (page, refresh = false) => {
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
      setAction((prev) => ({ ...prev, loadingNotification: false }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotification(page, true);
  }, [action.refreshNotification]);

  const hanlleNotification = async (noti) => {
    console.log(noti.post_id);
    if (noti.type === "post") {
      setUserId(user.id);
      setSelectedMenu("myPost");
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

  const handleChangePage = (menu: string, isClose: boolean = false) => {
    if (menu === "myPost" || menu === "deletedPost") {
      setUserId(user.id);
    } else {
      setUserId("");
    }
    setSelectedMenu(menu);
    if (isClose) {
      handleCloseMenuMobile();
    }
  };

  const handleShowMenuMobile = () => {
    setAction((prev) => ({ ...prev, showMenuMobile: true }));
  };

  const handleCloseMenuMobile = () => {
    setAction((prev) => ({ ...prev, showMenuMobile: false }));
  };

  const handleSeenPreNoti = async (page, setPage) => {
    setAction((prev) => ({ ...prev, loadingNotification: true }));
    fetchNotification(page + 1);
    setPage((prev) => prev + 1);
  };

  return (
    <AntHeader className="!bg-blue-500">
      <div className="flex justify-between items-center h-full w-full">
        {/* Logo */}
        <div
          className="text-white text-lg font-bold cursor-pointer"
          onClick={() => handleChangePage("posts")}
        >
          FaceNotebook
        </div>

        {/* Menu giữa */}
        <div className="hidden md:flex items-center gap-4 justify-center flex-1">
          {menuConfig.map((menu) => {
            if (menu.display) {
              return (
                <Button
                  key={menu.key}
                  type="primary"
                  className="bg-white text-blue-500 font-medium min-w-[110px]"
                  onClick={() => handleChangePage(menu.key)}
                >
                  {menu.icon} {menu.label}
                </Button>
              );
            }
          })}
        </div>

        {/* Avatar + Username */}
        <div className="hidden md:flex items-center gap-3">
          <Tippy content="Ảnh đại diện">
            <Avatar src={user?.image} size={40} alt="Ảnh" />
          </Tippy>
          <Tippy content="Tên người dùng">
            <span
              className="hidden sm:inline text-white text-lg font-medium cursor-pointer"
              onClick={() => handleChangePage("profile")}
            >
              {user?.username}
            </span>
          </Tippy>
          {notifications ? (
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
              action={action}
              handleSeenPreNoti={() => handleSeenPreNoti(page, setPage)}
              handleRefresh={() => handleRefresh(setPage, setAction)}
              isClick={true}
            />
          ) : (
            <CustomMenu
              variant="notifi"
              triggerIcon={<div className="text-2xl">🔔</div>}
              isClick={true}
            />
          )}
        </div>

        <div className="block md:hidden">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="!text-xl !p-2 hover:!bg-gray-100 rounded-lg"
            onClick={handleShowMenuMobile}
          ></Button>
        </div>
        {action.showMenuMobile && (
          <MenuMobile
            onClose={handleCloseMenuMobile}
            onChangePage={handleChangePage}
          />
        )}
      </div>
    </AntHeader>
  );
}
