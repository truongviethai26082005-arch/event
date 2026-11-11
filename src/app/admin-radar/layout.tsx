import type { ReactNode } from "react";
import AdminShell from "@/app/admin/_components/admin-shell";
import FloatingContactHider from "./FloatingContactHider";

/** Radar SEO dùng chung khung quản trị với các trang /admin (một menu, một cách điều hướng). */
export default function AdminRadarLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      <FloatingContactHider />
      {children}
    </AdminShell>
  );
}
