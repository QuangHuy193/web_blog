import { ApiResponse, Comment } from "@/lib/contains";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: Comment = await req.json();

    // Chỉ lấy những field cần insert
    const { post_id, user_id, content } = body;

    // Insert vào DB
    const result = await query<{ insertId: number }>(
      "INSERT INTO comments (post_id, user_id,content) VALUES ( ?, ?,?)",
      [post_id, user_id, content]
    );

    // Trả lại bài viết mới tạo
    const newComment: Comment = {
      id: result.insertId,
      post_id,
      user_id,
      content,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<Comment>>({
      success: true,
      data: newComment,
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
