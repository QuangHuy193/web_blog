"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Button, Card } from "antd";
import Link from "next/link";
import { notifyError, notifySuccess } from "../../component/Toast";
import { User } from "@/lib/interface";

export default function RegisterPage() {
  const router = useRouter();

  const onFinish = async (values: User) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role: "user" }),
      });
      const data = await res.json();

      if (!data.success) {
        notifyError(data.error || "Đăng ký thất bại");
        return;
      }

      notifySuccess("Đăng ký thành công, vui lòng đăng nhập");
      router.push("/login");
    } catch (err) {
      notifyError("Lỗi server");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Đăng ký" className="w-96 shadow-lg rounded-xl">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tên người dùng"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
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
            Đăng ký
          </Button>
        </Form>
        <p className="mt-3 text-center">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-blue-500">
            Đăng nhập
          </Link>
        </p>
      </Card>
    </div>
  );
}
