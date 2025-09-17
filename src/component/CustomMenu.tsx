// CustomMenu.tsx
import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MoreOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useThrottle } from "@/lib/function";

interface MenuItem {
  label: string;
  status?: string;
  icon?: React.ReactNode;
  action?: () => void;
  children?: MenuItem[];
}

interface CustomMenuProps {
  items?: MenuItem[];
  triggerIcon?: React.ReactNode;
  isClick?: boolean;
  variant?: "default" | "notifi";
  tippy_content?: string;
  position?: string;
  handleRefresh?: () => void;
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  items = [{ label: "Bạn không có thông báo nào" }],
  triggerIcon,
  isClick,
  variant = "default",
  tippy_content = "Thông báo",
  position = "bottom-end",
  handleRefresh = () => {},
}) => {
  const [activeMenu, setActiveMenu] = useState<MenuItem[] | null>(null);
  const [disabledRefresh, setDisabledRefresh] = useState(false);

  const handleRefreshNoti = useThrottle(
    () => {
      handleRefresh();
    },
    5000,
    setDisabledRefresh
  );

  const renderMenu = (menuItems: MenuItem[], isSubmenu = false) => (
    <div
      className={`flex flex-col gap-2 p-3 rounded-lg min-w-[200px] ${
        variant === "notifi" && "max-h-[500px] overflow-y-scroll"
      } `}
    >
      {isSubmenu && (
        <button
          onClick={() => setActiveMenu(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeftOutlined /> Quay lại
        </button>
      )}
      {menuItems.map((item, idx) => {
        const itemStyle =
          variant === "notifi" && item.status === "seen" ? "text-gray-500" : ""; // thông báo cũ

        return (
          <button
            key={idx}
            onClick={() => {
              if (item.children) {
                setActiveMenu(item.children);
              } else {
                item.action?.();
              }
            }}
            className={`text-black flex items-center justify-between gap-2 text-left hover:bg-gray-100 hover:cursor-pointer p-2 rounded ${itemStyle}`}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
            {item.status === "new" && <span className="text-blue-400">●</span>}
          </button>
        );
      })}

      {variant === "notifi" && (
        <div className="flex gap-2">
          {Array.isArray(items) &&
            items.length > 0 &&
            items[0].label !== "Bạn không có thông báo nào" && (
              <button className="flex-1 bg-gray-400 rounded p-2 cursor-pointer">
                Xem thông báo trước đó
              </button>
            )}

          <Tippy
            content={
              disabledRefresh
                ? "Vui lòng chờ 5s để làm mới lại"
                : "Làm mới thông báo"
            }
            placement="bottom-end"
          >
            <button
              className={`text-xl ${
                disabledRefresh
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handleRefreshNoti}
            >
              🔄
            </button>
          </Tippy>
        </div>
      )}
    </div>
  );

  return (
    <Tippy
      interactive
      trigger={isClick ? "click" : "mouseenter"}
      placement={position}
      content={activeMenu ? renderMenu(activeMenu, true) : renderMenu(items)}
      theme="customMenu"
    >
      <Tippy content={tippy_content}>
        <span style={{ cursor: "pointer" }}>
          {triggerIcon ?? <MoreOutlined style={{ fontSize: "22px" }} />}
        </span>
      </Tippy>
    </Tippy>
  );
};

export default CustomMenu;
