import { query } from "@/lib/db";
import { ApiResponse, User } from "@/lib/interface";
import { NextResponse } from "next/server";

// lấy trừ admin
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    const users = await query<User[]>(
      `SELECT id, username, email, image, role, status, created_at FROM users where role <> 'admin' ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );

    return NextResponse.json<ApiResponse<typeof users>>({
      success: true,
      data: users,
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
