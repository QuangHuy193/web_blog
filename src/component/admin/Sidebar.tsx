import React from "react";
import { Layout, Menu } from "antd";
import { sidebarMenuItems } from "@/lib/sidebarConfig";

const { Sider } = Layout;

export default function Sidebar({ onMenuClick }) {
  return (
    <Sider
      width={200}
      style={{
        background: "#fff",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        minHeight: "100vh",
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["posts"]}
        style={{
          height: "100%",
          borderRight: 0,
        }}
        onClick={({ key }) => onMenuClick && onMenuClick(key)}
        items={sidebarMenuItems}
      />
    </Sider>
  );
}
