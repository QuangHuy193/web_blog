import { query } from "@/lib/db";
import { Comment, ApiResponse, User } from "@/lib/interface";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const posts = await query<Comment[]>(
      "SELECT * FROM comments where post_id = ? ORDER BY created_at DESC",
      [id]
    );
    const users = await query<User[]>("SELECT id, username, image FROM users");

    const commentsWithUser = posts.map((c) => ({
      ...c,
      user: users.find((u) => u.id === c.user_id) || null,
    }));

    return NextResponse.json<ApiResponse<typeof commentsWithUser>>({
      success: true,
      data: commentsWithUser,
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
