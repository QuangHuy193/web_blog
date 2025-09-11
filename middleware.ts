import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Danh sách API public
  const publicRoutes = ["/api/users"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Thiếu token" },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, JWT_SECRET);

    // kiểm tra là admin
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (pathname.startsWith("/api/admin") && decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Không có quyền admin" },
        { status: 403 }
      );
    }
    return NextResponse.next(); // Cho qua nếu đúng
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Token không hợp lệ hoặc hết hạn" },
      { status: 403 }
    );
  }
}

// Áp dụng cho tất cả route /api/*
export const config = {
  matcher: ["/api/:path*"],
};
