import type { ReactNode } from "react";
import Link from "next/link";
import { ClipboardList, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "@/app/admin-radar/actions";
import FloatingContactHider from "./FloatingContactHider";

export default function AdminRadarLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <FloatingContactHider />
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Đã đăng nhập với quyền quản trị
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Các phân hệ Admin
            </Link>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Nhận báo giá
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
