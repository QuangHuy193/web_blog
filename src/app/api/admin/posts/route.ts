import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Post, ApiResponse, User } from "@/lib/interface";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const posts = await query<Post[]>(
      `SELECT * FROM posts ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );

    const users = await query<User[]>("SELECT id, username, image FROM users");

    // lấy tổng số
    const totalResult = await query(`SELECT COUNT(*) AS total FROM posts`);
    const total = totalResult[0].total;

    const postsWithUser = posts.map((p) => ({
      ...p,
      user: users.find((u) => u.id === p.author_id) || null,
    }));

    return NextResponse.json<ApiResponse<typeof postsWithUser>>({
      success: true,
      data: postsWithUser,
      total: total,
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
