"use client";

import { Card, Avatar, Button, Tooltip, Form, Input } from "antd";
import {
  LikeOutlined,
  SmileOutlined,
  HeartOutlined,
  MehOutlined,
  FrownOutlined,
  ThunderboltOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import type {
  Comment,
  PostWithExtras,
  Reaction,
  ReactionWithUser,
} from "@/lib/contains";
import { useState } from "react";
import Image from "next/image";
import { notifyError, notifySuccess } from "./Toast";
import { useForm } from "antd/es/form/Form";

export default function PostComponent({
  id,
  author_id,
  content,
  image,
  user,
  created_at,
  comments,
  reactions,
}: PostWithExtras) {
  const [reactionList, setReactionList] = useState<Reaction[]>(reactions);
  const [showComments, setShowComments] = useState(false);
  const [form] = Form.useForm();

  // Đếm số lượng reaction theo type
  const reactionCounts = reactionList.reduce<Record<Reaction["type"], number>>(
    (acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    },
    { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 }
  );

  // Hàm gom tên user theo type
  const getReactionUsernames = (
    reactions: ReactionWithUser[],
    type: string
  ) => {
    return reactions
      .filter((r) => r.type === type)
      .map((r) => r.user?.username)
      .join(", ");
  };

  const onFinish = async (values: Comment) => {
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!data.success) {
        notifyError(data.error || "Không thể đăng bình luận!");
        return;
      }

      notifySuccess("Đã đăng bình luận");
      form.setFieldValue("content", "");
    } catch (err) {
      notifyError("Lỗi server");
    }
  };
  return (
    <Card className="!mb-4 !shadow">
      <Card.Meta
        avatar={
          <Avatar
            src={user?.image}
            size={48} // chỉnh kích thước avatar
            alt={user?.username}
          />
        }
        title={user?.username}
        description={new Date(created_at).toLocaleString()}
      />

      <p className="mt-2">{content}</p>

      {image && (
        <div className="mt-3">
          <Image
            src={image}
            alt="Post image"
            width={800} // đặt chiều rộng cố định hoặc theo design
            height={400} // đặt chiều cao
          />
        </div>
      )}

      {/* Hiển thị reactions */}
      <div className="flex gap-2 mt-3">
        <Tooltip
          title={getReactionUsernames(reactions, "like") || "Chưa có ai"}
        >
          <Button icon={<LikeOutlined />} type="text">
            {reactionCounts.like}
          </Button>
        </Tooltip>

        <Tooltip
          title={getReactionUsernames(reactions, "love") || "Chưa có ai"}
        >
          <Button icon={<HeartOutlined />} type="text">
            {reactionCounts.love}
          </Button>
        </Tooltip>

        <Tooltip
          title={getReactionUsernames(reactions, "haha") || "Chưa có ai"}
        >
          <Button icon={<SmileOutlined />} type="text">
            {reactionCounts.haha}
          </Button>
        </Tooltip>

        <Tooltip title={getReactionUsernames(reactions, "wow") || "Chưa có ai"}>
          <Button icon={<ThunderboltOutlined />} type="text">
            {reactionCounts.wow}
          </Button>
        </Tooltip>

        <Tooltip title={getReactionUsernames(reactions, "sad") || "Chưa có ai"}>
          <Button icon={<FrownOutlined />} type="text">
            {reactionCounts.sad}
          </Button>
        </Tooltip>

        <Tooltip
          title={getReactionUsernames(reactions, "angry") || "Chưa có ai"}
        >
          <Button icon={<MehOutlined />} type="text">
            {reactionCounts.angry}
          </Button>
        </Tooltip>

        {/* Comment count */}
        <Button
          type="text"
          icon={<CommentOutlined />}
          onClick={() => setShowComments(!showComments)}
        >
          {comments.length}
        </Button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar src={c.user?.image} size={36} />
              <div>
                <p className="font-semibold">{c.user?.username}</p>
                <p>{c.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-gray-500">Chưa có bình luận nào.</p>
          )}

          <Form
            form={form}
            className="mt-3 flex items-center gap-2"
            onFinish={onFinish}
            initialValues={{
              post_id: 4,
              user_id: 7,
            }}
          >
            <Form.Item
              name="content"
              rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
              className="flex-1"
            >
              <Input placeholder="Nhập bình luận..." />
            </Form.Item>
            <Form.Item name="post_id" />
            <Form.Item name="user_id" />

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Gửi
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </Card>
  );
}
