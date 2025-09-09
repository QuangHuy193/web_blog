export function checkLogin() {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
}

export const fetchComments = async (id, setComments) => {
  try {
    const res = await fetch(`/api/posts/${id}/comments`);
    const data = await res.json();
    if (data.success) setComments(data.data);
  } catch (err) {
    console.error("Lỗi tải comments:", err);
  }
};

export const fetchReactions = async (id, setReactions) => {
  try {
    const res = await fetch(`/api/posts/${id}/reactions`);
    const data = await res.json();
    if (data.success) setReactions(data.data);
  } catch (err) {
    console.error("Lỗi tải reactions:", err);
  }
};
