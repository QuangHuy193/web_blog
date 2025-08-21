import { ApiResponse, User } from "@/lib/contains";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { username, email, image } = body as Partial<User>;

    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "ID không hợp lệ" }, { status: 400 });
    }

    // update user
    await query(
      `UPDATE users 
       SET username = ?, email = ?, image = ?
       WHERE id = ?`,
      [username, email, image, userId]
    );

    // lấy lại thông tin user sau khi update
    const users = await query<User[]>("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    const updatedUser = users[0];

    delete updatedUser.password;

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: updatedUser,
    });
  } catch (error: unknown) {
    let message = "Lỗi sửa thông tin";
    if (error instanceof Error) message = error.message;

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
