// User
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin"; // phân quyền
  status: string;
  created_at: string;
}

// Blog Post
export interface Post {
  id: number;
  content: string;
  author_id: number;
  image?: string;
  status: "active" | "deleted" | "blocked";
  created_at: string;
  updated_at?: string;
}

// Comment
export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

// Reaction (thả cảm xúc)
export interface Reaction {
  id: number;
  post_id: number;
  user_id: number;
  type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
  created_at: string;
}

//thông báo
export interface Notification {
  id: number;
  sender_id: number;
  recipient_id: number;
  post_id: string;
  content: string;
  type: "post" | "user";
  status: "new" | "seen" | "hidden" | "delete";
  created_at: string;
}

export interface PostWithUser extends Post {
  user: Pick<User, "id" | "username" | "image"> | null;
}

export interface CommentWithUser extends Comment {
  user: Pick<User, "id" | "username" | "image"> | null;
}

export interface ReactionWithUser extends Reaction {
  user: Pick<User, "id" | "username" | "image"> | null;
}

// Gợi ý cho API trả về
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  error?: string;
  total?: number;
}
