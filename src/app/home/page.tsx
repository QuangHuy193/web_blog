// app/page.tsx (Home)
"use client";
import { Layout } from "antd";
import Header from "@/component/Header";
import { useEffect, useState } from "react";
import { menuConfig } from "@/lib/menuConfig";
import { CaretUpOutlined } from "@ant-design/icons";

const { Content } = Layout;

export default function HomePage() {
  const [selectedMenu, setSelectedMenu] = useState("posts");
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState("");
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [showGoTop, setShowGoTop] = useState(false);

  const currentMenu = menuConfig.find((item) => item.key === selectedMenu);

  useEffect(() => {
    const u_local = localStorage.getItem("user");
    const t_local = localStorage.getItem("token");

    if (u_local) {
      setUser(JSON.parse(u_local));
    }

    if (t_local) {
      setToken(t_local);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowGoTop(true);
      } else {
        setShowGoTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Layout>
      {token && (
        <Header
          setSelectedMenu={setSelectedMenu}
          user={user}
          setUserId={setUserId}
          token={token}
          setSelectedPost={setSelectedPost}
        />
      )}

      <Content className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">{currentMenu.label || ""}</h1>
        {token &&
          currentMenu?.component({
            setSelectedMenu: setSelectedMenu,
            user: user,
            userId: userId,
            editingPost: editingPost,
            selectedMenu: selectedMenu,
            setEditingPost: setEditingPost,
            token: token,
            selectedPost: selectedPost,
          })}
      </Content>
      {showGoTop && (
        <div
          className="cursor-pointer flex justify-center rounded-full w-10 h-10 bg-blue-400 fixed right-3 bottom-3"
          onClick={handleGoTop}
        >
          <CaretUpOutlined className="text-3xl" />
        </div>
      )}
    </Layout>
  );
}
