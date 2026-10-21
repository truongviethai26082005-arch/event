"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Radar,
} from "lucide-react";
import { signOut } from "@/app/admin-radar/actions";

const navigation = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin-radar", label: "Radar SEO", icon: Radar },
  { href: "/admin/leads", label: "Khách hàng tiềm năng", icon: ClipboardList },
  { href: "/admin/services", label: "Dịch vụ & gói", icon: Package },
  { href: "/admin/portfolio", label: "Hồ sơ sự kiện", icon: BriefcaseBusiness },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-[75vh] bg-slate-100 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-[calc(100vh-9.75rem)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
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
            <p className="truncate text-sm font-extrabold text-slate-900">
              Trường Hải Admin
            </p>
            <p className="text-xs text-slate-500">Event management</p>
          </div>
        </div>

        <nav
          aria-label="Điều hướng quản trị"
          className="flex gap-1 overflow-x-auto p-3 lg:flex-col"
        >
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin/dashboard" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition lg:w-full ${
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
        </nav>

        <div className="hidden border-t border-slate-100 px-5 py-4 lg:block">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Phiên quản trị đang hoạt động
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
