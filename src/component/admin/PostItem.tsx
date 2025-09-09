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
  deleted,
  hidden,
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
            {deleted === 1 && (
              <span className="italic text-red-500">🗑️ Đã bị xóa</span>
            )}
            {deleted === 0 && hidden === 1 && (
              <span className="italic text-gray-500">⚠️ Đã bị ẩn</span>
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
          {(deleted === 1 || hidden === 1) && (
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer">
              🔄 Khôi phục
            </button>
          )}
          {deleted === 0 && (
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer">
              🗑️ Xóa
            </button>
          )}
          {hidden === 0 && (
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer">
              👁️‍🗨️ Ẩn
            </button>
          )}
          {}
        </div>
      </div>
    </Card>
  );
}

export default PostItem;
