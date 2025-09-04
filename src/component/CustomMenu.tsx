// CustomMenu.tsx
import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { MoreOutlined, ArrowLeftOutlined } from "@ant-design/icons";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  children?: MenuItem[];
}

interface CustomMenuProps {
  items: MenuItem[];
  triggerIcon?: React.ReactNode;
  isClick?: boolean;
}

const CustomMenu: React.FC<CustomMenuProps> = ({
  items,
  triggerIcon,
  isClick,
}) => {
  const [activeMenu, setActiveMenu] = useState<MenuItem[] | null>(null);

  const renderMenu = (menuItems: MenuItem[], isSubmenu = false) => (
    <div className="flex flex-col gap-2 p-3 rounded-lg min-w-[150px] shadow">
      {isSubmenu && (
        <button
          onClick={() => setActiveMenu(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeftOutlined /> Quay lại
        </button>
      )}
      {menuItems.map((item, idx) => (
        <button
          key={idx}
          onClick={() => {
            if (item.children) {
              setActiveMenu(item.children);
            } else {
              item.action?.();
            }
          }}
          className="flex items-center gap-2 text-left hover:bg-gray-100 hover:text-black hover:cursor-pointer p-2 rounded "
        >
          {item.icon && <span>{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <Tippy
      interactive
      trigger={isClick ? "click" : "mouseenter"}
      placement="bottom-end"
      content={activeMenu ? renderMenu(activeMenu, true) : renderMenu(items)}
    >
      <span style={{ cursor: "pointer" }}>
        {triggerIcon ?? <MoreOutlined style={{ fontSize: "22px" }} />}
      </span>
    </Tippy>
  );
};

export default CustomMenu;
