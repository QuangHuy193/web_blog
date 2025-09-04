import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Post, ApiResponse, User } from "@/lib/contains";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const posts = await query<Post[]>(
      `SELECT * FROM posts where deleted = 0 ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );

    const users = await query<User[]>("SELECT id, username, image FROM users");

    const postsWithUser = posts.map((p) => ({
      ...p,
      user: users.find((u) => u.id === p.author_id) || null,
    }));

    return NextResponse.json<ApiResponse<typeof postsWithUser>>({
      success: true,
      data: postsWithUser,
    });
  } catch (error: unknown) {
    let message = "Lỗi server";
    if (error instanceof Error) message = error.message;
    console.error("API /posts error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: Post = await req.json();

    // Chỉ lấy những field cần insert
    const { content, image, author_id } = body;

    // Insert vào DB
    const result = await query<{ insertId: number }>(
      "INSERT INTO posts ( content, image, author_id) VALUES ( ?, ?, ?)",
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
