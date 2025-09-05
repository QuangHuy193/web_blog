import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Post, ApiResponse } from "@/lib/contains";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const posts = await query<Post[]>(
      `UPDATE posts SET deleted = 0 where id = ${id}`
    );

    return NextResponse.json<ApiResponse<typeof posts>>({
      success: true,
      data: posts,
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
