"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <div className="text-center mt-4">Đang kiểm tra đăng nhập...</div>;
}
