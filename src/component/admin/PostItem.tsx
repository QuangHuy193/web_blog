import { CommentWithUser, ReactionWithUser } from "@/lib/interface";
import { useEffect, useState } from "react";
import { Card, Avatar, Image } from "antd";
import { fetchComments, fetchReactions } from "@/lib/function";

function PostItem({
  id,
  content,
  image,
  created_at,
  updated_at,
  status,
  user,
}) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [reactions, setReactions] = useState<ReactionWithUser[]>([]);

  useEffect(() => {
    fetchComments(id, setComments);
    fetchReactions(id, setReactions);
  }, [id]);

  return (
    <Card
      key={id}
      className="w-full !mb-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center-safe gap-4">
        {/* Avatar user */}
        <Avatar src={user?.image} size={48}>
          {user?.username?.[0]}
        </Avatar>

        {/* Nội dung bài viết */}
        <div className="flex-1">
          <div className="font-semibold text-gray-800">{user?.username} </div>
          <span className="text-xs text-gray-500">
            {new Date(created_at).toLocaleString()}
            {updated_at &&
              ` (Chỉnh sửa vào ${new Date(updated_at).toLocaleString()})`}
          </span>
          <p className="text-gray-600 text-sm mt-1 line-clamp-10 break-words max-w-[500px]">
            {content}
          </p>

          {/* Trạng thái & Stats */}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {status === "deleted" && (
              <span className="italic text-red-500">🗑️ Đã bị xóa</span>
            )}
            {status === "blocked" && (
              <span className="italic text-gray-500">⚠️ Đã bị khóa</span>
            )}
            <span>💬 {comments.length}</span>
            <span>👍 {reactions.length}</span>
          </div>
        </div>

        {/* Ảnh bài viết nếu có */}
        {image && (
          <div className="w-24 h-24 rounded-md overflow-hidden border">
            <Image src={image} alt="post" />
          </div>
        )}

        <div className="flex flex-col gap-3 p-4 ">
          {status === "blocked" && (
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer">
              🔓 Mở khóa
            </button>
          )}
          {status === "active" && (
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer">
              🔒 Khóa
            </button>
          )}
          {}
        </div>
      </div>
    </Card>
  );
}

export default PostItem;
