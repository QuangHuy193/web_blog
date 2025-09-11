"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { notifyError, notifySuccess } from "./Toast";

function CreatePost({ setSelectedMenu, user, editingPost, token }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPost) {
      form.setFieldsValue({
        content: editingPost.content,
        image: editingPost.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                url: editingPost.image,
              },
            ]
          : [],
      });
    }
  }, [editingPost, form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      if (user) {
        values.author_id = user.id;
      }

      // Lấy file ảnh từ Antd Upload
      const file = values.image?.[0]?.originFileObj;

      if (file) {
        // Upload ảnh lên server
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const resImage = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataUpload,
        });

        const dataImage = await resImage.json();
        if (dataImage.success) {
          // Gán lại giá trị image cho post (chỉ lưu link/path thôi)
          values.image = dataImage.filePath;
        } else {
          notifyError("Ảnh bị lỗi khi upload");
          return;
        }
      } else {
        if (!editingPost) {
          values.image = "";
        } else {
          values.image = editingPost.image;
        }
      }

      if (editingPost) {
        const res = await fetch(`/api/posts/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();

        if (data.success) {
          notifySuccess("Cập nhật bài viết thành công");
          form.resetFields();
        } else {
          notifyError("Không thể cập nhật bài viết!");
        }
      } else {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();

        if (data.success) {
          notifySuccess("Đăng bài thành công");
          form.resetFields();
        } else {
          notifyError("Không thể đăng bài viết!");
        }
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
            {editingPost ? "Cập nhật bài viết" : "Đăng bài viết"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreatePost;
