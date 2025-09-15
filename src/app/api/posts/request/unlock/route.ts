import { ApiResponse } from "@/lib/interface";
import { query } from "@/lib/db";
import { User } from "@/lib/interface";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { post_id, author_id } = body;
    let { content } = body;

    content = `1 người dùng vừa yêu cầu xem xét mở khóa với lý do: "${content}"`;

    const admin = await query<User>(
      `SELECT id FROm users WHERE role = 'admin'`
    );

    await query(
      `INSERT INTO notification (sender_id, recipient_id, post_id, content, type) values (?,?,?,?,?)`,
      [author_id, admin[0].id, post_id, content, "post"]
    );

    return NextResponse.json<ApiResponse<typeof admin>>({
      success: true,
      message: "Đã gửi yêu cầu cho quản trị viên",
    });
  } catch (error) {
    let message = "Lỗi server";
    if (error instanceof Error) message = error.message;
    console.error("API error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
