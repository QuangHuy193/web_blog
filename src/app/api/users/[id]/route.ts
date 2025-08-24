import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@/lib/contains";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await req.json();
  const { oldPassword, newPassword } = body;

  try {
    // Lấy user từ DB
    const users: any[] = await query(
      "SELECT password FROM users WHERE id = ?",
      [id]
    );
    if (!users || users.length === 0) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Tài khoản không tồn tại",
      });
    }

    const hashedPassword = users[0].password;

    const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
    if (!isMatch) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Mật khẩu cũ không chính xác",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password = ? WHERE id = ?", [
      newHashedPassword,
      id,
    ]);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    let message = "Lỗi server";
    if (error instanceof Error) message = error.message;

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
