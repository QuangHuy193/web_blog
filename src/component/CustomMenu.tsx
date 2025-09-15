// CustomMenu.tsx
import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MoreOutlined, ArrowLeftOutlined } from "@ant-design/icons";

interface MenuItem {
  label: string;
  status?: string;
  icon?: React.ReactNode;
  action?: () => void;
  children?: MenuItem[];
}

interface CustomMenuProps {
  items: MenuItem[];
  triggerIcon?: React.ReactNode;
  isClick?: boolean;
  variant?: "default" | "notifi";
  tippy_content?: string;
  position?: string;
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  items,
  triggerIcon,
  isClick,
  variant = "default",
  tippy_content = "Thông báo",
  position = "bottom-end",
}) => {
  const [activeMenu, setActiveMenu] = useState<MenuItem[] | null>(null);

  const renderMenu = (menuItems: MenuItem[], isSubmenu = false) => (
    <div className={`flex flex-col gap-2 p-3 rounded-lg min-w-[200px]  `}>
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
