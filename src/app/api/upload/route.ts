import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "Không có file" });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = Date.now() + "_" + file.name;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({
    success: true,
    filePath: "/uploads/" + fileName,
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");

  if (!filePath) return NextResponse.json({ success: false });

  const realPath = path.join(process.cwd(), "public", filePath);

  if (fs.existsSync(realPath)) {
    fs.unlinkSync(realPath);
  }

  return NextResponse.json({ success: true });
}
