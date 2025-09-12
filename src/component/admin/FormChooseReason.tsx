import { reasonBlock } from "@/lib/constaints";
import { Button } from "antd";
import { useState } from "react";
import { notifyError, notifySuccess } from "../Toast";

function FormChooseReason({ setAction, id, author_id, token, setRefreshPost }) {
  const [reason, setReason] = useState("");
  const [chose, setChose] = useState("");

  const handleChooseReason = (key, value) => {
    setChose(key);
    setReason(value);
  };

  const handleComfirm = async () => {
    if (!reason) {
      notifyError("Bạn chưa chọn lý do!");
      return;
    }

    setAction((prve) => ({ ...prve, showFormReason: false }));
    setAction((prve) => ({ ...prve, loadingBlockPost: true }));
    const user = localStorage.getItem("user");
    if (user) {
      const admin_id = JSON.parse(user);
      try {
        const res = await fetch(`/api/admin/posts/block/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ author_id, admin_id, reason }),
        });

        const result = await res.json();

        if (result.success) {
          notifySuccess(result.message || "Đã khóa bài viết");
          setRefreshPost((prev) => ({
            ...prev,
            refreshPost: !prev.refreshPost,
          }));
          setAction((prve) => ({ ...prve, loadingBlockPost: false }));
        } else {
          notifyError("Không thể khóa bài viết!");
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra, không thể khóa bài viết!");
        console.log(error);
      }
    }
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="flex-col bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Chọn lý do chặn</h2>

        <div className="space-y-2 mb-4">
          {reasonBlock.map((reason) => (
            <div
              key={reason.key}
              className={`px-4 py-2 border rounded-md cursor-pointer transition 
                ${
                  chose === reason.key
                    ? "bg-blue-100 border-blue-400"
                    : "hover:bg-gray-100"
                }`}
              onClick={() => handleChooseReason(reason.key, reason.label)}
            >
              {reason.label}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="primary" onClick={handleComfirm}>
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormChooseReason;
