import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ApiResponse } from "@/lib/interface";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    await query(`UPDATE notification SET status = "seen" WHERE id = ?`, [id]);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Đã thay đổi trạng thái thông báo",
    });
  } catch (error: unknown) {
    let message = "Lỗi server";
    if (error instanceof Error) message = error.message;
    console.error("API error:", error);

    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
