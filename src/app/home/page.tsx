// app/page.tsx (Home)
"use client";
import { Layout } from "antd";
import Header from "@/component/Header";
import { useState } from "react";
import { menuConfig } from "@/lib/menuConfig";

const { Content } = Layout;

export default function HomePage() {
  const [selectedMenu, setSelectedMenu] = useState("posts");

  const currentMenu = menuConfig.find((item) => item.key === selectedMenu);

  return (
    <Layout>
      <Header setSelectedMenu={setSelectedMenu} />
      <Content className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">{currentMenu.label || ""}</h1>
        {currentMenu?.component({ customProp: "demo" })}
      </Content>
    </Layout>
  );
}
