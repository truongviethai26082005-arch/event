"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  Radar,
  Receipt,
} from "lucide-react";
import { signOut } from "@/app/admin-radar/actions";

/**
 * Menu quản trị, nhóm theo đúng dòng công việc:
 * Bán hàng (khách → báo giá → dịch vụ) và Nội dung & SEO (kéo khách về từ Google).
 */
const NAV_GROUPS = [
  {
    title: "Điều hành",
    items: [{ href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard }],
  },
  {
    title: "Bán hàng",
    items: [
      { href: "/admin/leads", label: "Khách hàng", icon: ClipboardList },
      { href: "/admin/bang-gia", label: "Bảng đơn giá", icon: Receipt },
      { href: "/admin/services", label: "Dịch vụ & gói", icon: Package },
    ],
  },
  {
    title: "Nội dung & SEO",
    items: [
      { href: "/admin-radar", label: "Radar SEO", icon: Radar },
      { href: "/admin/portfolio", label: "Hồ sơ sự kiện", icon: BriefcaseBusiness },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  return (
    // data-admin-shell: globals.css dựa vào đây để ẩn header/footer của website công khai.
    <div data-admin-shell className="min-h-screen bg-slate-100 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <Link href="/admin/dashboard" className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image
              src="/images/logo.png"
              alt="Logo Trường Hải Event & Travel"
              width={80}
              height={80}
              className="h-full w-full scale-125 object-contain"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-900">Trường Hải</p>
            <p className="text-xs text-slate-500">Trang quản trị</p>
          </div>
        </Link>

        <nav aria-label="Điều hướng quản trị" className="flex gap-1 overflow-x-auto p-3 [scrollbar-width:none] lg:flex-1 lg:flex-col lg:gap-4 lg:overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="flex shrink-0 gap-1 lg:flex-col">
              <p className="hidden px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:block">
                {group.title}
              </p>
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition lg:w-full ${
                      active
                        ? "bg-[#0A1E5E] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-[#0A1E5E]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">{label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="hidden space-y-2 border-t border-slate-100 px-5 py-4 lg:block">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0A1E5E]"
          >
            <ExternalLink className="h-4 w-4" />
            Xem website
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
