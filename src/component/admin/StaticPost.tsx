import { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { PostWithUser } from "@/lib/interface";
import LoadingToast from "../LoadingToast";
import { Pagination, Select } from "antd";
import { numberOfRowFilter } from "@/lib/constaints";

function StaticPost({ token }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [action, setAction] = useState({
    loadingPosts: false,
    refreshPost: false,
  });
  const [limit, setLimit] = useState(5);

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
  return (
    <div>
      <div className="felx mb-4">
        <div>
          Số hàng{" "}
          <Select
            defaultValue={5}
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
        <div key={post.id} className="">
          <PostItem {...post} token setRefreshPost={setAction} />
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
