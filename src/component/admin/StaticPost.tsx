import { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { PostWithUser } from "@/lib/interface";

function StaticPost() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 8;

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/posts/all?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
        console.log(data.data);
      }
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);
  return (
    <div>
      {posts.map((post: PostWithUser) => (
        <div key={post.id} className="">
          <PostItem {...post} />
        </div>
      ))}

      {/* Pagination */}
      {/* <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map(
          (p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                page === p ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div> */}
    </div>
  );
}

export default StaticPost;
