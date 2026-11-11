"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Trang Bảng đơn giá đã được gỡ bỏ khỏi dashboard quản trị.
 * Tự động chuyển hướng về trang Tổng quan dashboard.
 */
export default function PriceListPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center text-sm text-slate-500">
      Đang chuyển hướng về Tổng quan...
    </div>
  );
}
