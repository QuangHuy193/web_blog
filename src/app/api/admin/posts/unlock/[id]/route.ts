import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ApiResponse } from "@/lib/interface";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { author_id, admin_id } = body;
    const reason = `1 bài biết của bạn vừa được mở khóa`;

    await query(`UPDATE posts SET status = 'active' where id = ?`, [id]);

    await query(
      `INSERT INTO notification (sender_id, recipient_id, content, type, post_id) values (?,?,?,?,?)`,
      [admin_id, author_id, reason, "post", id]
    );

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Đã mở khóa bài viết",
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
