// components/Header.tsx
"use client";
import { menuConfig } from "@/lib/menuConfig";
import { Avatar, Button, Layout } from "antd";
import { useEffect, useState } from "react";

const { Header: AntHeader } = Layout;

export default function Header({ setSelectedMenu }) {
  const [user, setUser] = useState(null);

  const handleClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Lỗi parse user:", err);
      }
    }
  }, []);
  return (
    <AntHeader className="!bg-blue-500 px-4">
      <div className="flex justify-between items-center h-full w-full">
        {/* Logo */}
        <div
          className="text-white text-lg font-bold cursor-pointer"
          onClick={() => handleClick("posts")}
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
                  onClick={() => handleClick(menu.key)}
                >
                  {menu.icon} {menu.label}
                </Button>
              );
            }
          })}
        </div>

        {/* Avatar + Username */}
        <div className="flex items-center gap-3">
          <Avatar src={user?.image} size={40} alt="Ảnh" />
          <span
            className="hidden sm:inline text-white text-lg font-medium cursor-pointer"
            onClick={() => handleClick("profile")}
          >
            {user?.username}
          </span>
        </div>
      </div>
    </AntHeader>
  );
}
