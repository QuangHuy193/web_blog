import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await query("DELETE FROM comments WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Đã xóa comment" });
  } catch (error: unknown) {
    let message = "Lỗi server";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
