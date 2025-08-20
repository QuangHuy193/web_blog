// User
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin"; // phân quyền
  created_at: string;
}

// Blog Post
export interface Post {
  id: number;
  content: string;
  author_id: number;
  image?: string;
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

export interface PostWithExtras extends Post {
  user: Pick<User, "id" | "username" | "image"> | null;
  comments: CommentWithUser[];
  reactions: ReactionWithUser[];
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
  error?: string;
}
