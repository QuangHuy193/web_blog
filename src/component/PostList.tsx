"use client";

import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import type { PostWithUser } from "@/lib/contains";
import { Button } from "antd";
import LoadingToast from "./LoadingToast";

export default function PostList({
  userId,
  selectedMenu,
  setSelectedMenu,
  setEditingPost,
}) {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [action, setAction] = useState({
    loadingPosts: false,
    loadingMorePosts: false,
    fetchAgainPosts: false,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 8;

  async function fetchPosts(pageNumber: number) {
    try {
      setAction((prev) => ({ ...prev, loadingPosts: true }));
      if (selectedMenu === "posts") {
        const res = await fetch(`/api/posts?page=${pageNumber}&limit=${limit}`);
        const data = await res.json();
        if (data.success) {
          if (pageNumber === 1) {
            setPosts(data.data);
          } else {
            setPosts((prev) => [...prev, ...data.data]);
          }
          // Nếu ít hơn limit thì coi như hết
          if (data.data.length < limit) {
            setHasMore(false);
          }
        }
      } else if (selectedMenu === "deletedPost") {
        console.log(userId);
        const res = await fetch(
          `/api/posts/delete/${userId}?page=${pageNumber}&limit=${limit}`
        );
        const data = await res.json();
        if (data.success) {
          if (pageNumber === 1) {
            setPosts(data.data);
          } else {
            setPosts((prev) => [...prev, ...data.data]);
          }
          // Nếu ít hơn limit thì coi như hết
          if (data.data.length < limit) {
            setHasMore(false);
          }
        }
      } else {
        const res = await fetch(
          `/api/posts/${userId}?page=${pageNumber}&limit=${limit}`
        );
        const data = await res.json();
        if (data.success) {
          if (pageNumber === 1) {
            setPosts(data.data);
          } else {
            setPosts((prev) => [...prev, ...data.data]);
          }
          // Nếu ít hơn limit thì coi như hết
          if (data.data.length < limit) {
            setHasMore(false);
          }
        }
      }
    } catch (error) {
      console.error("Lỗi tải posts:", error);
    } finally {
      setAction((prev) => ({ ...prev, loadingMorePosts: false }));
      setAction((prev) => ({ ...prev, loadingPosts: false }));
    }
  }

  useEffect(() => {
    fetchPosts(1);
  }, [userId, action.fetchAgainPosts, selectedMenu]);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      {posts.length === 0 && (
        <div className="flex justify-center items-center py-10 text-gray-500 text-lg font-medium">
          <span className="px-4 py-2 bg-gray-100 rounded-lg shadow-sm">
            😢 Không có bài viết thuộc mục này rồi
          </span>
        </div>
      )}
      {action.loadingPosts && <LoadingToast title="Đang tải bài viết..." />}
      {posts.map((post) => (
        <PostComponent
          key={post.id}
          {...post}
          userId={userId}
          setAction={setAction}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          setEditingPost={setEditingPost}
        />
      ))}
      <div className="flex justify-center">
        {hasMore && (
          <Button
            onClick={() => {
              setAction((prev) => ({ ...prev, loadingMorePosts: true }));
              const nextPage = page + 1;
              setPage(nextPage);
              fetchPosts(nextPage);
            }}
          >
            {action.loadingMorePosts
              ? "Đang tải bài viết..."
              : "Tải thêm bài viết"}
          </Button>
        )}
      </div>
    </div>
  );
}
