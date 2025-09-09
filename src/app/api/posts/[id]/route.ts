import { ApiResponse, Post, User } from "@/lib/interface";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

//lấy post theo user_id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const posts = await query<Post[]>(
      `SELECT * FROM posts where deleted = 0 and author_id = ${id} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset} `
    );

    const users = await query<User[]>(
      "SELECT id, username, image FROM users where id = ?",
      [id]
    );

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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "ID không hợp lệ" },
        { status: 400 }
      );
    }

    await query<Post[]>("UPDATE posts SET deleted = 1 WHERE id = ?", [postId]);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Đã xóa bài viết",
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { content, image } = body;

    const postId = Number(id);
    if (isNaN(postId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "ID không hợp lệ" },
        { status: 400 }
      );
    }

    await query<Post[]>(
      "UPDATE posts SET content = ?, image = ?, updated_at = NOW() WHERE id = ?",
      [content, image, postId]
    );

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Đã sửa bài viết",
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
