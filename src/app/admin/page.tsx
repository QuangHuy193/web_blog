"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "antd";

import Header from "@/component/admin/Header";
import Sidebar from "@/component/admin/Sidebar";
import { sidebarMenuItems } from "@/lib/sidebarConfig";
import { CaretUpOutlined } from "@ant-design/icons";

const { Content } = Layout;

function AdminPage() {
  const [token, setToken] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [menuKey, setMenuKey] = useState("posts");
  const [showGoTop, setShowGoTop] = useState(false);

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

  useEffect(() => {
    const token_local = localStorage.getItem("token");
    if (token_local) {
      setToken(token_local);
    }
  }, []);

  const handleGoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderContent = (token: string, selectedPost: string) => {
    const menu = sidebarMenuItems.find((item) => item.key === menuKey);
    if (!menu) return <h1>404 - Không tìm thấy trang</h1>;

    const Component = menu.component;

    return <Component token={token} selectedPost={selectedPost} />;
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <div className="fixed top-0 left-0 right-0 z-100">
          <Header
            onMenuClick={(key) => setMenuKey(key)}
            setSelectedPost={setSelectedPost}
          />
        </div>

        <div className="fixed top-[64px] left-0 bottom-0 w-[200px] z-99 bg-[#fff] shadow-[2px_0_8px_rgba(0,0,0,0.1)]">
          <Sidebar onMenuClick={(key) => setMenuKey(key)} />
        </div>

        {/* Content cuộn */}
        <Layout className="mt-16 ml-[200px] p-5 bg-[#f5f5f5] overflow-auto ">
          <Content
            style={{
              background: "#fff",
              padding: 20,
              minHeight: "100%",
            }}
          >
            {renderContent(token, selectedPost)}
          </Content>
        </Layout>
      </Layout>
      {showGoTop && (
        <div
          className="cursor-pointer flex justify-center rounded-full w-10 h-10 bg-blue-400 fixed right-3 bottom-3"
          onClick={handleGoTop}
        >
          <CaretUpOutlined className="text-3xl" />
        </div>
      )}
    </>
  );
}

export default AdminPage;
