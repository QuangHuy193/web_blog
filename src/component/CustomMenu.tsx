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
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  items,
  triggerIcon,
  isClick,
  variant = "default",
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
          variant === "notifi"
            ? item.status === "new"
              ? "bg-[#444] text-white font-medium hover:bg-[#555]" // thông báo mới
              : "text-gray-300 hover:bg-[#444] hover:text-white" // đã xem
            : "hover:bg-gray-100 hover:text-black";
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
            className={`flex items-center gap-2 text-left hover:cursor-pointer p-2 rounded ${itemStyle}`}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <Tippy
      interactive
      trigger={isClick ? "click" : "mouseenter"}
      placement="bottom-end"
      content={activeMenu ? renderMenu(activeMenu, true) : renderMenu(items)}
      className="bg-white"
    >
      <span style={{ cursor: "pointer" }}>
        {triggerIcon ?? <MoreOutlined style={{ fontSize: "22px" }} />}
      </span>
    </Tippy>
  );
};

export default CustomMenu;
