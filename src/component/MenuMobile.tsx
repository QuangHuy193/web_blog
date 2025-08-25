// MenuMobile.tsx
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { menuConfig } from "../lib/menuConfig"; // chỗ lưu menuConfig

function MenuMobile({ onClose, onChangePage }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50">
      <div className="bg-white w-3/4 h-full p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Menu</h2>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className="!text-xl"
          />
        </div>

        <ul className="space-y-3">
          {menuConfig
            .filter((item) => item.isMobile)
            .map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => {
                  onChangePage(item.key, true);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default MenuMobile;
