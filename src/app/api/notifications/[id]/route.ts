import { ApiResponse, Notification } from "@/lib/interface";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

//lấy thông báo theo user_id
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

    const notification = await query<Notification[]>(
      `SELECT * FROM notification WHERE	recipient_id = ?  ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      [id]
    );

    return NextResponse.json<ApiResponse<typeof notification>>({
      success: true,
      data: notification,
    });
  } catch (error: unknown) {
    let message = "Lỗi server";
    if (error instanceof Error) message = error.message;
    console.error("API /notification error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
