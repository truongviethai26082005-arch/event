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
    <div data-admin-shell className="min-h-screen bg-[#F8FAFC] lg:flex">
      <aside className="border-b border-slate-800 bg-[#0B132B] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        {/* Brand Header */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-white font-black text-sm shadow-sm">
            TH
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-extrabold text-white">Trường Hải</p>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">Trang quản trị hệ thống</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav aria-label="Điều hướng quản trị" className="flex gap-1 overflow-x-auto p-3.5 [scrollbar-width:none] lg:flex-1 lg:flex-col lg:gap-5 lg:overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="flex shrink-0 gap-1 lg:flex-col">
              <p className="hidden px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:block">
                {group.title}
              </p>
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                const isRadar = href === "/admin-radar";
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition lg:w-full ${
                      active
                        ? isRadar
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                          : "bg-white/10 text-white shadow-sm"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">{label}</span>
                    </div>
                    {isRadar && (
                      <span className="rounded-md bg-white/20 px-1.5 py-0.2 text-[10px] font-black uppercase tracking-wider text-white">
                        PRO
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Actions */}
        <div className="hidden space-y-3.5 border-t border-slate-800/80 p-4 lg:block">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Xem website</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 hover:text-rose-400 transition cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Đăng xuất</span>
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-900/60 border border-slate-800/90 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-950 text-indigo-300 font-black text-xs border border-indigo-700/50 shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">Admin Trường Hải</p>
                <p className="truncate text-[10px] text-slate-400">admin@truonghai.vn</p>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
