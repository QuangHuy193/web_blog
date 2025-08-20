"use client";

import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import type { PostWithExtras } from "@/lib/contains";

export default function PostList() {
  const [posts, setPosts] = useState<PostWithExtras[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (data.success) {
          setPosts(data.data);
          console.log(data.data);
        }
      } catch (error) {
        console.error("Lỗi tải posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center">Đang tải bài viết...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6">
      {posts.map((post) => (
        <PostComponent key={post.id} {...post} />
      ))}
    </div>
  );
}
