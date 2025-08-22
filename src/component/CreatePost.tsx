"use client";
import { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { notifyError, notifySuccess } from "./Toast";

function CreatePost({ setSelectedMenu }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // Lấy user từ localStorage
      const user_local = localStorage.getItem("user");
      if (user_local) {
        const u = JSON.parse(user_local); // parse chứ không stringify
        values.author_id = u.id;
      }

      // Lấy file ảnh từ Antd Upload
      const file = values.image?.[0]?.originFileObj;
      if (file) {
        // Upload ảnh lên server
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const resImage = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const dataImage = await resImage.json();
        //   console.log(dataImage.data);
        if (dataImage.success) {
          // Gán lại giá trị image cho post (chỉ lưu link/path thôi)
          values.image = dataImage.filePath;
        } else {
          notifyError("Ảnh bị lỗi khi upload");
          return;
        }
      } else {
        values.image = "";
      }

      // Gửi dữ liệu bài post
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      //   console.log(data.data);

      if (data.success) {
        notifySuccess("Đăng bài thành công");
        form.resetFields();
      } else {
        notifyError("Không thể đăng bài viết!");
      }
    } catch (error) {
      console.error(error);
      notifyError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
      setSelectedMenu("posts");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Tạo bài viết mới</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Nội dung bài viết */}
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Bạn đang nghĩ gì vậy?"
            className="rounded-xl"
          />
        </Form.Item>

        {/* Ảnh bài viết */}
        <Form.Item
          name="image"
          label="Ảnh"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            return Array.isArray(e) ? e : e?.fileList;
          }}
        >
          <Upload
            listType="picture-card"
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Chỉ được chọn file ảnh (jpg, png, gif...)");
                return Upload.LIST_IGNORE;
              }
              return false; // ngăn upload tự động
            }}
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Chọn ảnh</div>
            </div>
          </Upload>
        </Form.Item>

        {/* Nút đăng */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-500"
          >
            Đăng bài viết
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreatePost;
