// app/page.tsx (Home)
"use client";
import { Layout } from "antd";
import Header from "@/component/Header";
import PostList from "@/component/PostList";

const { Content } = Layout;

export default function HomePage() {
  return (
    <Layout>
      <Header />
      <Content className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Bảng tin</h1>
        <PostList />
      </Content>
    </Layout>
  );
}
