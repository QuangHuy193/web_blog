import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { User, ApiResponse } from "@/lib/contains";

// 📌 Đăng ký
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, role } = body;

    if (!username || !email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Kiểm tra username/email đã tồn tại chưa
    const existing = await query<User[]>(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existing.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Username hoặc Email đã tồn tại" },
        { status: 400 }
      );
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await query<{ insertId: number }>(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?,?)",
      [username, email, hashedPassword, role]
    );

    const newUser: User = {
      id: result.insertId,
      username,
      email,
      role,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: newUser,
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

// 📌 Đăng nhập
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Vui lòng nhập email và mật khẩu" },
        { status: 400 }
      );
    }

    const users = await query<User[]>("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Tài khoản không tồn tại" },
        { status: 401 }
      );
    }

    const user = users[0];

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    // Không trả mật khẩu về client
    delete user.password;

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
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
