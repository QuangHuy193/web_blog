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

    const notification = await query<Notification[]>(
      `SELECT * FROM notification WHERE	recipient_id = ?  ORDER BY created_at DESC`,
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
