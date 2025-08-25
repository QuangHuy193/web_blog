import { ReactNode } from "react";
import { HeartOutlined, LikeOutlined } from "@ant-design/icons";
import { BsEmojiLaughing, BsEmojiFrown, BsEmojiSurprise } from "react-icons/bs";
import { FaAngry } from "react-icons/fa";

export const reactionConfig: Record<
  string,
  { color: string; icon: ReactNode; label: string }
> = {
  like: {
    color: "#3b82f6",
    icon: <LikeOutlined />,
    label: "Thích",
  },
  love: {
    color: "#f310d5",
    icon: <HeartOutlined />,
    label: "Yêu thích",
  },
  haha: {
    color: "#facc15",
    icon: <BsEmojiLaughing />,
    label: "Haha",
  },
  wow: {
    color: "#a855f7",
    icon: <BsEmojiSurprise />,
    label: "Wow",
  },
  sad: {
    color: "#6b7280",
    icon: <BsEmojiFrown />,
    label: "Buồn",
  },
  angry: {
    color: "#ff2929",
    icon: <FaAngry />,
    label: "Tức giận",
  },
};
