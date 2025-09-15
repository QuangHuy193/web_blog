"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Button, Card } from "antd";
import Link from "next/link";
import { notifyError, notifySuccess } from "../../component/Toast";
import { User } from "@/lib/interface";
import { useState } from "react";
import LoadingToast from "@/component/LoadingToast";

export default function LoginPage() {
  const router = useRouter();
  const [action, setAction] = useState({
    login: false,
  });

  const onFinish = async (values: User) => {
    try {
      setAction((prev) => ({ ...prev, login: true }));
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!data.success) {
        notifyError(data.error || "Đăng nhập thất bại!");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("token", data.token);
      if (data.data.role === "user") {
        await router.push("/home");
        setTimeout(() => {
          notifySuccess("Đăng nhập thành công");
        }, 500);
      } else if (data.data.role === "admin") {
        await router.push("/admin");
        setTimeout(() => {
          notifySuccess("Đăng nhập thành công");
        }, 500);
      }
    } catch (err) {
      notifyError("Lỗi server");
    } finally {
      setAction((prev) => ({ ...prev, login: false }));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {action.login && <LoadingToast title="Đang đăng nhập..." />}
      <Card title="Đăng nhập" className="w-96 shadow-lg rounded-xl">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải từ 8 ký tự trở lên!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {action.login ? "Đang đăng nhập..." : " Đăng nhập"}
          </Button>
        </Form>
        <p className="mt-3 text-center">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-blue-500">
            Đăng ký
          </Link>
        </p>
      </Card>
    </div>
  );
}
