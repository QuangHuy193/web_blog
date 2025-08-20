"use client";
import Header from "@/component/Header";
import { notifyError, notifySuccess } from "@/component/Toast";
import { User } from "@/lib/contains";
import { Avatar, Button, Form, Input, Layout, Space, Typography } from "antd";
import { useEffect, useState } from "react";

const { Content } = Layout;
const { Title, Text } = Typography;

function UserInfo() {
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState<Partial<User>>({});
  const [showChangePass, setShowChangePass] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleCancel = (field: keyof User) => {
    form.setFieldsValue({ [field]: user[field] });
    form.resetFields([field]);

    setFormData((prev) => ({ ...prev, [field]: user.field }));
    setEditingField(null);
  };

  const handleSaveField = async (field: keyof User, value: string) => {
    try {
      // validate riêng field đó
      await form.validateFields([field]);

      setFormData((prev) => ({ ...prev, [field]: value }));
      setEditingField(null);
    } catch (err) {
      console.log("Field chưa hợp lệ:", err);
    }
  };

  // Khi bấm "Lưu thay đổi" ở dưới
  const handleSaveAll = async () => {
    try {
      //   // Gọi API PUT với dữ liệu trong formData
      //   await fetch(`/api/users/info/${user?.id}`, {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(formData),
      //   });

      //   // Cập nhật lại user để hiển thị
      //   setUser((prev) => (prev ? { ...prev, ...formData } : prev));
      //   setFormData({});
      notifySuccess("Cập nhật thành công!");
    } catch (error) {
      console.error(error);
      notifyError("Cập nhật thất bại!");
    }
  };

  return (
    <Layout>
      <Header />
      <Content className="p-6 bg-gray-50 min-h-screen flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl">
          <Title level={2} className="mb-6 text-center">
            Thông tin cá nhân
          </Title>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <Avatar src={user?.image} size={120} alt="Ảnh" />
            <Button type="link" className="mt-2">
              Sửa ảnh đại diện
            </Button>
          </div>

          {/* Form thông tin */}
          <Form layout="vertical" form={form}>
            {/* Tên người dùng */}
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 text-base">
                  Tên người dùng
                </span>
              }
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng" },
              ]}
            >
              {editingField === "username" ? (
                <Space>
                  <Input
                    defaultValue={formData.username || user?.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="primary"
                    onClick={() =>
                      handleSaveField(
                        "username",
                        formData.username || user?.username || ""
                      )
                    }
                  >
                    Lưu
                  </Button>
                  <Button onClick={() => handleCancel("username")}>Hủy</Button>
                </Space>
              ) : (
                <Space>
                  <Text>
                    {formData.username || user?.username || "Chưa có tên"}
                  </Text>
                  <Button
                    type="link"
                    onClick={() => setEditingField("username")}
                  >
                    Sửa
                  </Button>
                </Space>
              )}
            </Form.Item>

            {/* Email */}
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 text-base">
                  Email
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              {editingField === "email" ? (
                <Space>
                  <Input
                    defaultValue={formData.email || user?.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="primary"
                    onClick={() =>
                      handleSaveField(
                        "email",
                        formData.email || user?.email || ""
                      )
                    }
                  >
                    Lưu
                  </Button>
                  <Button onClick={() => handleCancel("email")}>Hủy</Button>
                </Space>
              ) : (
                <Space>
                  <Text>{formData.email || user?.email || "Chưa có tên"}</Text>
                  <Button type="link" onClick={() => setEditingField("email")}>
                    Sửa
                  </Button>
                </Space>
              )}
            </Form.Item>
          </Form>
          {/* Nút lưu thông tin */}
          <div className="flex justify-end mt-6">
            <Button type="primary" size="large" onClick={handleSaveAll}>
              Lưu thay đổi
            </Button>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-200"></div>

          {/* Đổi mật khẩu */}
          <div>
            <div className="flex justify-between">
              <Title level={4} className="mb-4">
                Quân mật khẩu?
              </Title>
              {showChangePass ? (
                <Button
                  type="link"
                  className="!text-red-600"
                  onClick={() => setShowChangePass(false)}
                >
                  Hủy
                </Button>
              ) : (
                <Button type="link" onClick={() => setShowChangePass(true)}>
                  Đổi mật khẩu
                </Button>
              )}
            </div>

            {showChangePass && (
              <Form layout="vertical">
                <Form.Item label="Mật khẩu hiện tại">
                  <Input.Password className="custom-input-userInfoPage" />
                </Form.Item>
                <Form.Item label="Mật khẩu mới">
                  <Input.Password className="custom-input-userInfoPage" />
                </Form.Item>
                <Form.Item label="Xác nhận mật khẩu mới">
                  <Input.Password className="custom-input-userInfoPage" />
                </Form.Item>
                <div className="flex justify-end">
                  <Button type="primary" danger>
                    Đổi mật khẩu
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default UserInfo;
