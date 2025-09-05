// components/Header.tsx
"use client";
import { menuConfig } from "@/lib/menuConfig";
import { MenuOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout } from "antd";
import { useState } from "react";
import MenuMobile from "./MenuMobile";

const { Header: AntHeader } = Layout;

export default function Header({ setSelectedMenu, user, setUserId }) {
  const [action, setAction] = useState({
    showMenuMobile: false,
  });

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
          <Avatar src={user?.image} size={40} alt="Ảnh" />
          <span
            className="hidden sm:inline text-white text-lg font-medium cursor-pointer"
            onClick={() => handleChangePage("profile")}
          >
            {user?.username}
          </span>
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
