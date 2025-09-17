import StaticPost from "@/component/admin/StaticPost";
import StaticUser from "@/component/admin/StaticUser";
import Profile from "@/component/Profile";

export const sidebarMenuItems = [
  {
    key: "posts",
    icon: "",
    label: "Bài viết",
    component: StaticPost,
    display: true,
  },
  {
    key: "profile",
    icon: "",
    label: "",
    component: Profile,
    display: false,
  },
  {
    key: "users",
    icon: "",
    label: "Người dùng",
    component: StaticUser,
    display: true,
  },
];
