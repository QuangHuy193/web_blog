// app/page.tsx (Home)
"use client";
import { Layout } from "antd";
import Header from "@/component/Header";
import { useEffect, useState } from "react";
import { menuConfig } from "@/lib/menuConfig";

const { Content } = Layout;

export default function HomePage() {
  const [selectedMenu, setSelectedMenu] = useState("posts");
  const [editingPost, setEditingPost] = useState(null);
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");

  const currentMenu = menuConfig.find((item) => item.key === selectedMenu);

  useEffect(() => {
    const u_local = localStorage.getItem("user");

    if (u_local) {
      setUser(JSON.parse(u_local));
    }
  }, []);

  return (
    <Layout>
      <Header
        setSelectedMenu={setSelectedMenu}
        user={user}
        setUserId={setUserId}
      />
      <Content className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">{currentMenu.label || ""}</h1>
        {currentMenu?.component({
          setSelectedMenu: setSelectedMenu,
          user: user,
          userId: userId,
          editingPost: editingPost,
          setEditingPost: setEditingPost,
        })}
      </Content>
    </Layout>
  );
}
