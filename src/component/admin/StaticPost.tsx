import { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { PostWithUser } from "@/lib/interface";
import LoadingToast from "../LoadingToast";
import { Pagination, Select } from "antd";
import { numberOfRowFilter } from "@/lib/constaints";

function StaticPost({ token, selectedPost }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [action, setAction] = useState({
    loadingPosts: false,
    refreshPost: false,
  });
  const [limit, setLimit] = useState(numberOfRowFilter[0]);

  const fetchPosts = async () => {
    try {
      setAction((prve) => ({ ...prve, loadingPosts: true }));
      const res = await fetch(`/api/admin/posts?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);
    } finally {
      setAction((prve) => ({ ...prve, loadingPosts: false }));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, limit, action.refreshPost]);

  useEffect(() => {
    if (!selectedPost) return;

    let cancelled = false;

    const findPost = async () => {
      let currentPage = 1;
      let found = false;

      while (!found && !cancelled) {
        const res = await fetch(
          `/api/admin/posts?page=${currentPage}&limit=${limit}`
        );
        const data = await res.json();

        if (!data.success || data.data.length === 0) break;

        const target = data.data.find((p) => p.id === selectedPost);

        if (target) {
          setPosts(data.data);
          setTotal(data.total);
          setPage(currentPage);
          found = true;

          // cần delay 1 nhịp để DOM render xong
          setTimeout(() => {
            const el = document.getElementById(selectedPost);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        } else {
          currentPage++;
          if (currentPage > Math.ceil(data.total / limit)) break; // hết trang
        }
      }
    };

    findPost();

    return () => {
      cancelled = true;
    };
  }, [selectedPost, limit]);

  return (
    <div>
      <div className="felx mb-4">
        <div>
          Số hàng{" "}
          <Select
            defaultValue={numberOfRowFilter[0]}
            className="min-w-20"
            onChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          >
            {numberOfRowFilter.map((value) => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      {action.loadingPosts && (
        <LoadingToast title="Đang tải danh sách bài viết..." />
      )}
      {posts.map((post: PostWithUser) => (
        <div
          key={post.id}
          id={post.id}
          className={`transition-all duration-500 ${
            selectedPost == post.id
              ? "ring-2 ring-blue-500 rounded-md bg-blue-50"
              : ""
          }`}
        >
          <PostItem {...post} token={token} setRefreshPost={setAction} />
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center py-4">
        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default StaticPost;
