// components/Header.tsx
"use client";
import { menuConfig } from "@/lib/menuConfig";
import { MenuOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout } from "antd";
import { useEffect, useState } from "react";
import MenuMobile from "./MenuMobile";
import CustomMenu from "./CustomMenu";
import Tippy from "@tippyjs/react";

const { Header: AntHeader } = Layout;

export default function Header({ setSelectedMenu, user, setUserId, token }) {
  const [notifications, setNotifications] = useState([]);
  const [action, setAction] = useState({
    showMenuMobile: false,
  });

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
    fetchNotification();
  }, []);

  const hanlleNotification = (id) => {
    console.log("đã xem thông báo có id là ", id);
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
              items={[{ label: "Bạn không có thông báo nào" }]}
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
