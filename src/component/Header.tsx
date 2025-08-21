// components/Header.tsx
"use client";
import { Avatar, Layout } from "antd";
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
    <AntHeader className="!bg-blue-500">
      <div className="flex justify-between items-center h-full w-full">
        <div
          className="text-white text-lg font-bold cursor-pointer"
          onClick={() => handleClick("posts")}
        >
          FaceNotebook
        </div>
        <div className="flex items-center gap-3">
          <Avatar src={user?.image} size={40} alt="Ảnh" />
          <span
            className="text-white text-lg font-medium cursor-pointer"
            onClick={() => handleClick("profile")}
          >
            {user?.username}
          </span>
        </div>
      </div>
    </AntHeader>
  );
}
