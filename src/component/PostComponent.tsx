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
  CommentWithUser,
  PostWithUser,
  Reaction,
  ReactionWithUser,
} from "@/lib/contains";
import { useState, useEffect } from "react";
import Image from "next/image";
import { notifyError, notifySuccess } from "./Toast";

export default function PostComponent({
  id,
  content,
  image,
  user,
  created_at,
}: PostWithUser) {
  const [form] = Form.useForm();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [reactions, setReactions] = useState<ReactionWithUser[]>([]);
  const [toggleAction, setToggleAction] = useState({
    showComments: false,
    sendComment: false,
  });
  const user_local =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = user_local ? JSON.parse(user_local) : null;

  const userReacted = (type: Reaction["type"]) => {
    return reactions.some(
      (r) => r.type === type && r.user_id === currentUser?.id
    );
  };
  // 🔹 Load comments + reactions khi component mount
  useEffect(() => {
    fetchComments();
    fetchReactions();
  }, [id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${id}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.data);
    } catch (err) {
      console.error("Lỗi tải comments:", err);
    }
  };

  const fetchReactions = async () => {
    try {
      const res = await fetch(`/api/posts/${id}/reactions`);
      const data = await res.json();
      if (data.success) setReactions(data.data);
    } catch (err) {
      console.error("Lỗi tải reactions:", err);
    }
  };

  // 🔹 Đếm số lượng reaction theo type
  const reactionCounts = reactions.reduce<Record<Reaction["type"], number>>(
    (acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    },
    { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 }
  );

  // 🔹 Gom tên user theo type
  const getReactionUsernames = (type: string) => {
    return reactions
      .filter((r) => r.type === type)
      .map((r) => r.user?.username)
      .join(", ");
  };

  // xử lý reaction
  const handleReaction = async (type: string) => {
    try {
      let values: any = {};
      const user_local = localStorage.getItem("user");
      if (user_local) {
        const u = JSON.parse(user_local);
        values.user_id = u.id;
      }
      values.post_id = id;
      values.type = type;
      const res = await fetch(`/api/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      fetchReactions();
    } catch (err) {
      console.error("Lỗi tải reactions:", err);
    }
  };

  // Xử lý gửi bình luận
  const onFinish = async (values: Comment) => {
    try {
      setToggleAction((prev) => ({ ...prev, sendComment: true }));
      const user_local = localStorage.getItem("user");
      if (user_local) {
        const u = JSON.parse(user_local);
        values.user_id = u.id;
      }
      values.post_id = id;

      const res = await fetch(`/api/comments`, {
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

      // 🔹 Refresh comments
      fetchComments();
    } catch (err) {
      notifyError("Lỗi server");
    } finally {
      setToggleAction((prev) => ({ ...prev, sendComment: false }));
    }
  };

  const handleShowComment = () => {
    if (toggleAction.showComments) {
      setToggleAction((prev) => ({ ...prev, showComments: false }));
    } else {
      setToggleAction((prev) => ({ ...prev, showComments: true }));
    }
  };

  return (
    <Card className="!mb-4 !shadow">
      <Card.Meta
        avatar={<Avatar src={user?.image} size={48} alt={user?.username} />}
        title={user?.username}
        description={new Date(created_at).toLocaleString()}
      />

      <p className="mt-2">{content}</p>

      {image && (
        <div className="mt-3">
          <Image src={image} alt="Post image" width={800} height={400} />
        </div>
      )}

      {/* Hiển thị reactions */}
      <div className="flex gap-2 mt-3">
        <Tooltip title={getReactionUsernames("like") || "Chưa có ai"}>
          <Button
            icon={<LikeOutlined />}
            type={userReacted("like") ? "primary" : "text"}
            onClick={() => {
              handleReaction("like");
            }}
          >
            {reactionCounts.like}
          </Button>
        </Tooltip>

        <Tooltip title={getReactionUsernames("love") || "Chưa có ai"}>
          <Button
            icon={<HeartOutlined />}
            type={userReacted("love") ? "primary" : "text"}
            onClick={() => {
              handleReaction("love");
            }}
          >
            {reactionCounts.love}
          </Button>
        </Tooltip>

        <Tooltip title={getReactionUsernames("haha") || "Chưa có ai"}>
          <Button
            icon={<SmileOutlined />}
            type={userReacted("haha") ? "primary" : "text"}
            onClick={() => {
              handleReaction("haha");
            }}
          >
            {reactionCounts.haha}
          </Button>
        </Tooltip>

        <Tooltip title={getReactionUsernames("wow") || "Chưa có ai"}>
          <Button
            icon={<ThunderboltOutlined />}
            type={userReacted("wow") ? "primary" : "text"}
            onClick={() => {
              handleReaction("wow");
            }}
          >
            {reactionCounts.wow}
          </Button>
        </Tooltip>

        <Tooltip title={getReactionUsernames("sad") || "Chưa có ai"}>
          <Button
            icon={<FrownOutlined />}
            type={userReacted("sad") ? "primary" : "text"}
            onClick={() => {
              handleReaction("sad");
            }}
          >
            {reactionCounts.sad}
          </Button>
        </Tooltip>

        <Tooltip title={getReactionUsernames("angry") || "Chưa có ai"}>
          <Button
            icon={<MehOutlined />}
            type={userReacted("angry") ? "primary" : "text"}
            onClick={() => {
              handleReaction("angry");
            }}
          >
            {reactionCounts.angry}
          </Button>
        </Tooltip>

        {/* Comment count */}
        <Button
          type="text"
          icon={<CommentOutlined />}
          onClick={handleShowComment}
        >
          {comments.length}
        </Button>
      </div>

      {toggleAction.showComments && (
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
          >
            <Form.Item
              name="content"
              rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
              className="flex-1"
            >
              <Input placeholder="Nhập bình luận..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {toggleAction.sendComment ? "Đang gửi..." : "Gửi"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </Card>
  );
}
