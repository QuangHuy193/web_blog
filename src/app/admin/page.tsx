"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "antd";

import Header from "@/component/admin/Header";
import Sidebar from "@/component/admin/Sidebar";
import { sidebarMenuItems } from "@/lib/sidebarConfig";

const { Content } = Layout;

function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [menuKey, setMenuKey] = useState("posts");

  useEffect(() => {
    const token_local = localStorage.getItem("token");
    if (token_local) {
      setToken(token_local);
    }
  }, []);

  const renderContent = (token: string) => {
    const menu = sidebarMenuItems.find((item) => item.key === menuKey);
    if (!menu) return <h1>404 - Không tìm thấy trang</h1>;

    const Component = menu.component;

    if (menu.isLoading) {
      return <Component setIsLoading={setIsLoading} token={token} />;
    }

    return <Component token={token} />;
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <div className="fixed top-0 left-0 right-0 z-100">
          <Header onMenuClick={(key) => setMenuKey(key)} />
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
            {renderContent(token)}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default AdminPage;
