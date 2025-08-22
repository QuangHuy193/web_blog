"use client";
import { notifyError, notifySuccess } from "@/component/Toast";
import { User } from "@/lib/contains";
import { LogoutOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  Layout,
  Space,
  Tooltip,
  Typography,
} from "antd";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const { Content } = Layout;
const { Title, Text } = Typography;

function UserInfo() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState({});
  const [loadingAction, setLoadingAction] = useState({
    //Khi bấm cập nhật
    updateInfo: false,
    //khi bấm đổi mật khẩu
    changePassword: false,
    //khi mở giao diện đổi mật khẩu
    showChangePass: false,
    //khi sửa ảnh
    changeImage: false,
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
      setFormData({
        username: JSON.parse(user).username,
        image: JSON.parse(user).image,
        email: JSON.parse(user).email,
      });
    }
  }, []);

  const handleCancel = (field: keyof User) => {
    form.setFieldsValue({ [field]: user[field] });
    form.resetFields([field]);

    setFormData((prev) => ({
      ...prev,
      [field]: user[field],
    }));
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingAction((prev) => ({ ...prev, changeImage: true }));
    const file = e.target.files?.[0];
    if (!file) return;

    // Tạo formData để gửi file lên server
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (data.success) {
        // data.filePath = "/uploads/ten_anh.png"
        setFormData((prev) => ({
          ...prev,
          image: data.filePath,
        }));
      } else {
        notifyError("Upload thất bại!");
      }
    } catch (err) {
      console.error(err);
      notifyError("Có lỗi khi upload!");
    }
  };

  const handleCancelImage = async () => {
    if (formData?.image && formData.image !== user?.image) {
      try {
        await fetch(`/api/upload/?path=${encodeURIComponent(formData.image)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Không xóa được ảnh tạm:", err);
      }
    }
    // reset lại form về ảnh cũ
    setFormData((prev) => ({
      ...prev,
      image: user?.image,
    }));
    setLoadingAction((prev) => ({ ...prev, changeImage: false }));
  };

  // Khi bấm "Lưu thay đổi" ở dưới
  const handleSaveAll = async () => {
    try {
      setLoadingAction((prev) => ({ ...prev, updateInfo: true }));
      // Gọi API PUT với dữ liệu trong formData
      const res = await fetch(`/api/users/info/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.data));
        //Cập nhật lại user để hiển thị
        setUser((prev) => (prev ? { ...prev, ...formData } : prev));
        setFormData({
          username: data.data.username,
          image: data.data.image,
          email: data.data.email,
        });
        setLoadingAction((prev) => ({ ...prev, changeImage: false }));
        notifySuccess("Cập nhật thành công!");
      } else {
        console.log(data.error);
        notifyError(data.error);
      }
      setLoadingAction((prev) => ({ ...prev, updateInfo: false }));
    } catch (error) {
      console.error(error);
      notifyError("Cập nhật thất bại!");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("user", "");
        router.push("/login");
      }
    });
  };

  return (
    <Layout>
      <Content className="p-6 bg-gray-50 min-h-screen flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl relative ">
          <Tooltip title={"Đăng xuất"}>
            <button
              onClick={handleLogout}
              className="cursor-pointer absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
            >
              <LogoutOutlined />
            </button>
          </Tooltip>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <Avatar src={formData.image || user?.image} size={120} alt="Ảnh" />

            <input
              type="file"
              accept="image/*"
              id="avatarInput"
              className="hidden"
              onChange={handleImageChange}
            />
            {loadingAction.changeImage ? (
              <Button
                danger
                type="link"
                className="mt-2"
                onClick={handleCancelImage}
              >
                Hủy
              </Button>
            ) : (
              <Button
                type="link"
                className="mt-2"
                onClick={() => document.getElementById("avatarInput")?.click()}
              >
                Sửa ảnh đại diện
              </Button>
            )}
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
                      handleSaveField("username", formData.username)
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
                    onClick={() => handleSaveField("email", formData.email)}
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
              {loadingAction.updateInfo ? "Đang cập nhật..." : " Lưu thay đổi"}
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
              {loadingAction.showChangePass ? (
                <Button
                  type="link"
                  className="!text-red-600"
                  onClick={() =>
                    setLoadingAction((prev) => ({
                      ...prev,
                      showChangePass: false,
                    }))
                  }
                >
                  Hủy
                </Button>
              ) : (
                <Button
                  type="link"
                  onClick={() =>
                    setLoadingAction((prev) => ({
                      ...prev,
                      showChangePass: true,
                    }))
                  }
                >
                  Đổi mật khẩu
                </Button>
              )}
            </div>

            {loadingAction.showChangePass && (
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
                    {loadingAction.changePassword
                      ? "Đang cập nhật..."
                      : "Đổi mật khẩu"}
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
