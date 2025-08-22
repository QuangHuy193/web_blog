import { ReactNode } from "react";
import { HomeOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";

import PostList from "@/component/PostList";
import Profile from "@/component/Profile";
import CreatePost from "@/component/CreatePost";
// import Settings from "@/component/Settings";

interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  display: boolean;
  component: (props?: any) => ReactNode; // function component để truyền props được
}

export const menuConfig: MenuItem[] = [
  {
    key: "posts",
    label: "Bảng tin",
    icon: <HomeOutlined />,
    display: true,
    component: (props) => <PostList {...props} />,
  },
  {
    key: "profile",
    label: "Thông tin cá nhân",
    icon: <UserOutlined />,
    display: false,
    component: (props) => <Profile {...props} />,
  },
  {
    key: "createPost",
    label: "Tạo bài viết",
    icon: <EditOutlined />,
    display: true,
    component: (props) => <CreatePost {...props} />,
  },
  //   {
  //     key: "settings",
  //     label: "Cài đặt",
  //     icon: <SettingOutlined />,
  //     component: (props) => <Settings {...props} />,
  //   },
];
