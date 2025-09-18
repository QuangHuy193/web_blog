import { notifySuccess } from "@/component/Toast";
import { useCallback, useRef } from "react";

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

export function useThrottle(fn, delay, setDisabledRefresh) {
  const lastCall = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        setDisabledRefresh(true);
        fn(...args);

        // mở khóa sau khi hết delay
        setTimeout(() => {
          setDisabledRefresh(false);
        }, delay);
      }
    },
    [fn, delay]
  );
}

export const handleRefresh = (setPage, setAction) => {
  notifySuccess("Đã làm mới thông báo");
  setPage(1);
  setAction((prev) => ({
    ...prev,
    hasMore: true,
    refreshNotification: !prev.refreshNotification,
  }));
};
