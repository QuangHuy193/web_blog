import { reasonUnblock } from "@/lib/constaints";
import { Button } from "antd";
import { Input } from "antd";
import { useState } from "react";
import { notifyError, notifySuccess } from "./Toast";

const { TextArea } = Input;

function RequestUnlockPopup({
  title = "Điền lý do để xem xét mở khóa bài viết",
  post_id,
  author_id,
  token,
  setToggleAction,
}) {
  const [content, setContent] = useState("");

  const handleAddReason = (reason: string) => {
    setContent((prev) => prev + " " + reason);
  };

  const handleSendRequest = async () => {
    if (!content) {
      notifyError("Vui lòng điền lý do!");
      return;
    }

    try {
      const res = await fetch("/api/posts/request/unlock", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ post_id, author_id, content }),
      });
      const result = await res.json();

      if (result.success) {
        notifySuccess("Đã gửi yêu cầu cho quản trị viên, vui lòng đợi");
        setToggleAction((prev) => ({
          ...prev,
          showPopupReason: false,
        }));
      }
    } catch (error) {
      notifyError("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="relative flex-col bg-white rounded-lg shadow-lg p-6 w-[600px]">
        <span
          className="absolute top-0 right-0 p-2 cursor-pointer"
          onClick={() =>
            setToggleAction((prev) => ({
              ...prev,
              showPopupReason: false,
            }))
          }
        >
          ❌
        </span>
        <div className="text-xl mb-3">{title}</div>

        <div className="flex flex-wrap gap-2 mb-3">
          {reasonUnblock.map((reason) => (
            <div
              key={reason.key}
              className="px-3 py-1 bg-gray-100 rounded-md border text-sm cursor-pointer"
              onClick={() => handleAddReason(reason.label)}
            >
              {reason.label}
            </div>
          ))}
        </div>

        <TextArea
          className="!h-[150px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="text-end mt-3">
          <Button
            type="primary"
            className="!pl-5 !pr-5"
            onClick={handleSendRequest}
          >
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RequestUnlockPopup;
