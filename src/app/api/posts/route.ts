import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  Post,
  Comment,
  Reaction,
  ApiResponse,
  User,
  PostWithExtras,
  ReactionWithUser,
  CommentWithUser,
} from "@/lib/contains";

export async function GET() {
  try {
    // Lấy toàn bộ bài viết
    const posts = await query<Post[]>(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );

    // Lấy toàn bộ user (để map cho post, comment, reaction)
    const users = await query<User[]>("SELECT id, username, image FROM users");

    // Lấy toàn bộ comment
    const comments = await query<Comment[]>(
      "SELECT * FROM comments ORDER BY created_at ASC"
    );

    // Lấy toàn bộ reaction
    const reactions = await query<Reaction[]>("SELECT * FROM reactions");

    // Gộp dữ liệu
    const postsWithExtras: PostWithExtras[] = posts.map((post) => {
      const user = users.find((u) => u.id === post.author_id) || null;

      const postComments: CommentWithUser[] = comments
        .filter((c) => c.post_id === post.id)
        .map((c) => ({
          ...c,
          user: users.find((u) => u.id === c.user_id) || null,
        }));

      const postReactions: ReactionWithUser[] = reactions
        .filter((r) => r.post_id === post.id)
        .map((r) => ({
          ...r,
          user: users.find((u) => u.id === r.user_id) || null,
        }));

      return {
        ...post,
        user,
        comments: postComments,
        reactions: postReactions,
      };
    });

    return NextResponse.json<ApiResponse<typeof postsWithExtras>>({
      success: true,
      data: postsWithExtras,
    });
  } catch (error: unknown) {
    let message = "Lỗi server";
    if (error instanceof Error) message = error.message;

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: Post = await req.json();

    // Chỉ lấy những field cần insert (không insert id, created_at, updated_at vì DB sẽ tự sinh)
    const { content, image, author_id } = body;

    // Insert vào DB
    const result = await query<{ insertId: number }>(
      "INSERT INTO posts ( content, image, author_id) VALUES ( ?, ?)",
      [content, image, author_id]
    );

    // Trả lại bài viết mới tạo
    const newPost: Post = {
      id: result.insertId,
      content,
      image,
      author_id,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<Post>>({
      success: true,
      data: newPost,
    });
  } catch (error: unknown) {
    let message = "Lỗi server";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
