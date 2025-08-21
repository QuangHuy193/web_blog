import { ReactNode } from "react";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";

import PostList from "@/component/PostList";
import Profile from "@/component/Profile";
// import Settings from "@/component/Settings";

interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  component: (props?: any) => ReactNode; // function component để truyền props được
}

export const menuConfig: MenuItem[] = [
  {
    key: "posts",
    label: "Bảng tin",
    icon: <HomeOutlined />,
    component: (props) => <PostList {...props} />,
  },
  {
    key: "profile",
    label: "Thông tin cá nhân",
    icon: <UserOutlined />,
    component: (props) => <Profile {...props} />,
  },
  //   {
  //     key: "settings",
  //     label: "Cài đặt",
  //     icon: <SettingOutlined />,
  //     component: (props) => <Settings {...props} />,
  //   },
];
