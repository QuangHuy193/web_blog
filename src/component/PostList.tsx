"use client";

import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import type { PostWithUser } from "@/lib/contains";
import { Button } from "antd";

export default function PostList() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [action, setAction] = useState({
    loadingFirstPosts: true,
    loadingPosts: false,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 8;

  async function fetchPosts(pageNumber: number) {
    try {
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
    } catch (error) {
      console.error("Lỗi tải posts:", error);
    } finally {
      setAction((prev) => ({ ...prev, loadingFirstPosts: false }));
      setAction((prev) => ({ ...prev, loadingPosts: false }));
    }
  }

  useEffect(() => {
    fetchPosts(1);
  }, []);

  if (action.loadingFirstPosts)
    return <p className="!text-center">Đang tải bài viết...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6">
      {posts.map((post) => (
        <PostComponent key={post.id} {...post} />
      ))}
      <div className="flex justify-center">
        {hasMore && (
          <Button
            onClick={() => {
              setAction((prev) => ({ ...prev, loadingPosts: true }));
              const nextPage = page + 1;
              setPage(nextPage);
              fetchPosts(nextPage);
            }}
          >
            {action.loadingPosts ? "Đang tải bài viết..." : "Tải thêm bài viết"}
          </Button>
        )}
      </div>
    </div>
  );
}
