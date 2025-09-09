import { Avatar, Select, Button, Tag } from "antd";

function UserItem({ id, username, email, image, role, status, created_at }) {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3 border-b hover:bg-gray-50 transition">
      {/* Thông tin người dùng */}
      <div className="flex items-center gap-4 flex-1">
        <Avatar src={image} size={48}>
          {username?.[0]}
        </Avatar>
        <div>
          <div className="font-semibold text-gray-800">{username}</div>
          <div className="text-gray-500 text-sm">{email}</div>
        </div>
      </div>

      <div className="w-28 text-center">
        {status === "normal" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Khóa</Tag>
        )}
      </div>
      <div className="mr-3">
        {role !== "admin" && (
          <Button type="primary" danger className="flex items-center gap-2">
            🔒 Khóa tài khoản
          </Button>
        )}
      </div>

      {/* Ngày tạo */}
      <div className="w-40 text-gray-500 text-sm">
        Tài khoản được tạo vào {new Date(created_at).toLocaleString()}
      </div>

      {/* Role chọn bằng Select */}
      <div className="w-40 ">
        <Select defaultValue={role} style={{ width: "100%" }}>
          <Select.Option value="user">Người dùng</Select.Option>
          <Select.Option value="collaborator">Cộng tác viên</Select.Option>
        </Select>
      </div>
    </div>
  );
}

export default UserItem;
