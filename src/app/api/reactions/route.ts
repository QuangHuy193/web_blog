import { ApiResponse, Reaction } from "@/lib/contains";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: Reaction = await req.json();

    // Chỉ lấy những field cần insert
    const { post_id, user_id, type } = body;

    //kiểm tra user đã reaction bài viết chưa
    const existing = await query<Reaction[]>(
      "SELECT * FROM reactions WHERE post_id = ? AND user_id = ?",
      [post_id, user_id]
    );

    let newReaction: Reaction;

    if (existing.length > 0) {
      // Nếu đã có thì update
      await query(
        "UPDATE reactions SET type = ? WHERE post_id = ? AND user_id = ?",
        [type, post_id, user_id]
      );

      newReaction = {
        ...existing[0],
        type,
        created_at: new Date().toISOString(),
      };
    } else {
      const result = await query<{ insertId: number }>(
        "INSERT INTO reactions (post_id, user_id, type) VALUES (?, ?, ?)",
        [post_id, user_id, type]
      );

      newReaction = {
        id: result.insertId,
        post_id,
        user_id,
        type,
        created_at: new Date().toISOString(),
      };
    }

    return NextResponse.json<ApiResponse<Reaction>>({
      success: true,
      data: newReaction,
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
