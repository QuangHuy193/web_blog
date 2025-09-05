"use client";

import { Card, Avatar, Button, Tooltip, Form, Input } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import type {
  Comment,
  CommentWithUser,
  Reaction,
  ReactionWithUser,
} from "@/lib/contains";
import { useState, useEffect } from "react";
import Image from "next/image";
import { notifyError, notifySuccess } from "./Toast";
import { showAlert } from "@/lib/alert";
import { reactionConfig } from "@/lib/reactionConfig";
import CustomMenu from "./CustomMenu";

export default function PostComponent({
  id,
  content,
  image,
  user,
  created_at,
  updated_at,
  userId,
  setAction,
  selectedMenu,
  setSelectedMenu,
  setEditingPost,
}) {
  const post = { id, content, image };
  const [form] = Form.useForm();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [reactions, setReactions] = useState<ReactionWithUser[]>([]);
  const [toggleAction, setToggleAction] = useState({
    showComments: false,
    sendComment: false,
    deleteComment: -1,
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

  // xóa bình luận
  const handleDeleteComment = async (id: number) => {
    const result = await showAlert({
      title: "Bạn có chắc muốn xóa bình luận này?",
      icon: "warning",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setToggleAction((prev) => ({ ...prev, deleteComment: id }));

        const res = await fetch(`/api/comments/${id}`, {
          method: "DELETE",
        });

        const deleted = await res.json();

        if (deleted.success) {
          notifySuccess("Đã xóa bình luận");
          fetchComments();
        } else {
          notifyError(deleted.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setToggleAction((prev) => ({ ...prev, deleteComment: -1 }));
      }
    }
  };

  const handleShowComment = () => {
    if (toggleAction.showComments) {
      setToggleAction((prev) => ({ ...prev, showComments: false }));
    } else {
      setToggleAction((prev) => ({ ...prev, showComments: true }));
    }
  };

  //xóa bài viết
  const handleDeletePost = async (id) => {
    const result = await showAlert({
      text: "Bạn chắc chắn muốn xóa bài viết này?",
      icon: "warning",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.success) {
          notifySuccess(data.message);
          setAction((prev) => ({
            ...prev,
            fetchAgainPosts: !prev.fetchAgainPosts,
          }));
        } else {
          console.log(data.error);
          notifyError("Đã có lỗi xảy ra, vui lòng thử lại!");
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
  };

  //sửa bài viết
  const handleEditPost = (post) => {
    setEditingPost(post);
    setSelectedMenu("editPost");
  };

  //khôi phục bài viết
  const handleRecoverPost = async (id) => {
    const result = await showAlert({
      text: "Bạn chắc chắn muốn khôi phục bài viết này?",
      icon: "warning",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/posts/recover/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.success) {
          notifySuccess("Đã khôi phục bài viết");
          setAction((prev) => ({
            ...prev,
            fetchAgainPosts: !prev.fetchAgainPosts,
          }));
        } else {
          console.log(data.error);
          notifyError("Đã có lỗi xảy ra, vui lòng thử lại!");
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
  };

  return (
    <Card className="!mb-4 !shadow">
      <div className="flex justify-between">
        <div>
          <Card.Meta
            avatar={<Avatar src={user?.image} size={48} alt={user?.username} />}
            title={user?.username}
            description={
              <>
                {new Date(created_at).toLocaleString()}

                {created_at !== updated_at && (
                  <span className="text-gray-500 italic"> (đã chỉnh sửa)</span>
                )}
              </>
            }
          />

          <p className="mt-2">{content}</p>

          {image && (
            <div className="mt-3">
              <Image src={image} alt="Post image" width={800} height={400} />
            </div>
          )}
        </div>

        {selectedMenu === "myPost" && (
          <CustomMenu
            items={[
              {
                label: "✏️ Sửa",
                action: () => handleEditPost(post),
              },
              {
                label: "🗑️ Xóa",
                action: () => handleDeletePost(id),
              },
            ]}
            isClick={true}
          />
        )}

        {selectedMenu === "deletedPost" && (
          <CustomMenu
            items={[
              {
                label: "↩️ Khôi phục",
                action: () => handleRecoverPost(id),
              },
            ]}
            isClick={true}
          />
        )}
      </div>

      {/* Hiển thị reactions */}
      <div className="flex flex-wrap gap-2 mt-3">
        {Object.entries(reactionConfig).map(([key, { icon, color }]) => (
          <Tooltip key={key} title={getReactionUsernames(key) || "Chưa có ai"}>
            <Button
              icon={icon}
              style={{
                color: userReacted(key) ? "white" : "black",
                backgroundColor: userReacted(key) ? color : undefined,
              }}
              // type="primary"
              onClick={() => handleReaction(key)}
            >
              {reactionCounts[key] || 0}
            </Button>
          </Tooltip>
        ))}

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
        <div className="mt-4 space-y-3 ">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar className="flex-shrink-0" src={c.user?.image} size={36} />

              <div className="flex-1 min-w-0">
                <p className="font-semibold">{c.user?.username}</p>
                <p className="break-words max-w-[700px]">{c.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </span>
                {currentUser.id === c.user_id && (
                  <Button
                    type="link"
                    className="!text-red-500"
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    {toggleAction.deleteComment === c.id
                      ? "Đang xóa..."
                      : "Xóa"}
                  </Button>
                )}
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
