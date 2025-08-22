import { query } from "@/lib/db";
import { Reaction, ApiResponse, User } from "@/lib/contains";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const posts = await query<Reaction[]>(
      "SELECT * FROM reactions where post_id = ? ORDER BY created_at DESC",
      [id]
    );
    const users = await query<User[]>("SELECT id, username, image FROM users");

    const reactionsWithUser = posts.map((r) => ({
      ...r,
      user: users.find((u) => u.id === r.user_id) || null,
    }));

    return NextResponse.json<ApiResponse<typeof reactionsWithUser>>({
      success: true,
      data: reactionsWithUser,
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
