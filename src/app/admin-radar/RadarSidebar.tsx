"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Radar,
  Sparkles,
  Compass,
  Globe,
  FileText,
  Activity,
  ExternalLink,
  X,
  ChevronRight,
  LogOut,
  Brain,
  CheckSquare,
} from "lucide-react";
import { signOut } from "@/app/admin-radar/actions";

export type RadarNavSection =
  | "viet_bai"
  | "duyet_bai"
  | "bo_nao"
  | "doi_thu"
  | "ke_hoach"
  | "scanner"
  | "editor"
  | "posts"
  | "competitors"
  | "content_gap"
  | "events"
  | "cron"
  | "logs";

export interface NavItem {
  id: RadarNavSection;
  number: string;
  label: string;
  subtitle: string;
  icon: any;
  badge?: string;
  badgeVariant?: string;
  count?: number;
  highlightCount?: boolean;
}

export interface RadarSidebarProps {
  activeSection: RadarNavSection;
  onSelectSection: (section: RadarNavSection) => void;
  counts: {
    posts: number;
    drafts?: number;
    competitors: number;
    gaps: number;
    events: number;
    logs: number;
  };
  hasActiveEditor: boolean;
  activeEditorTitle?: string;
  isScanning: boolean;
  isSupabaseConfigured: boolean;
  onRefreshAll: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function RadarSidebar({
  activeSection,
  onSelectSection,
  counts,
  hasActiveEditor,
  activeEditorTitle,
  isScanning,
  isSupabaseConfigured,
  onRefreshAll,
  mobileOpen,
  onCloseMobile,
}: RadarSidebarProps) {
  const draftCount = counts.drafts ?? 0;

  // 5 Canonical Items requested by the user
  const navItems: NavItem[] = [
    {
      id: "viet_bai",
      number: "1",
      label: "Viết bài",
      subtitle: "Nhập từ khóa & AI tạo nháp",
      icon: Sparkles,
      badge: isScanning ? "Đang quét" : hasActiveEditor ? "Đang mở" : undefined,
      badgeVariant: isScanning
        ? "animate-pulse bg-amber-500/20 text-amber-700 border-amber-400"
        : "bg-emerald-50 text-emerald-700 border-emerald-300",
    },
    {
      id: "duyet_bai",
      number: "2",
      label: draftCount > 0 ? `Duyệt bài (${draftCount})` : "Duyệt bài",
      subtitle: "Soát [CẦN SỐ LIỆU] & Đăng",
      icon: CheckSquare,
      count: draftCount > 0 ? draftCount : undefined,
      highlightCount: draftCount > 0,
    },
    {
      id: "bo_nao",
      number: "3",
      label: "Bộ não thương hiệu",
      subtitle: "Dự án thật, thiết bị & Quy tắc",
      icon: Brain,
      count: counts.events,
    },
    {
      id: "doi_thu",
      number: "4",
      label: "Đối thủ",
      subtitle: "Tìm đối thủ & Đọc sitemap",
      icon: Globe,
      count: counts.competitors,
    },
    {
      id: "ke_hoach",
      number: "5",
      label: "Kế hoạch nội dung",
      subtitle: "Bản đồ khoảng trống & Đề bài",
      icon: Compass,
      count: counts.gaps,
    },
  ];

  // Helper check active section (including backward compatible aliases)
  const isItemActive = (itemId: RadarNavSection) => {
    if (itemId === "viet_bai") {
      return (
        activeSection === "viet_bai" ||
        activeSection === "scanner" ||
        activeSection === "editor"
      );
    }
    if (itemId === "duyet_bai") {
      return activeSection === "duyet_bai" || activeSection === "posts";
    }
    if (itemId === "bo_nao") {
      return activeSection === "bo_nao" || activeSection === "events";
    }
    if (itemId === "doi_thu") {
      return activeSection === "doi_thu" || activeSection === "competitors";
    }
    if (itemId === "ke_hoach") {
      return (
        activeSection === "ke_hoach" ||
        activeSection === "content_gap" ||
        activeSection === "cron"
      );
    }
    return activeSection === itemId;
  };

  const handleItemClick = (id: RadarNavSection) => {
    onSelectSection(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-700 select-none shadow-sm">
      {/* Brand & System Status */}
      <div className="p-5 border-b border-slate-200 space-y-3 shrink-0 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0A1E5E] rounded-[10px] flex items-center justify-center">
                <Radar className="w-5 h-5 text-[#D4AF37] animate-spin [animation-duration:8s]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-slate-900 text-base tracking-tight">
                  RADAR SEO
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#D4AF37] text-[#0A1E5E]">
                  AI v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Trường Hải Event & Travel
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Editor Quick Alert (if working on an article) */}
      {hasActiveEditor && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-300 flex items-center justify-between gap-2 shrink-0 animate-in fade-in">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                Bài viết đang mở
              </p>
              <p className="text-xs text-slate-900 truncate font-semibold">
                {activeEditorTitle || "Bản thảo chưa đặt tên"}
              </p>
            </div>
          </div>
          {!isItemActive("viet_bai") && (
            <button
              type="button"
              onClick={() => handleItemClick("viet_bai")}
              className="px-2 py-1 rounded-lg bg-[#D4AF37] text-[#0A1E5E] text-[10px] font-bold shrink-0 hover:bg-amber-400 transition-colors shadow-xs cursor-pointer"
            >
              Xem ngay
            </button>
          )}
        </div>
      )}

      {/* 5-ITEM TOOLBAR NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex items-center justify-between px-3 pb-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Thanh công cụ (5 mục)
          </p>
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            Trực quan & Tinh gọn
          </span>
        </div>

        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = isItemActive(item.id);
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-3 py-3 rounded-2xl flex items-center justify-between transition-all group cursor-pointer border ${
                  isActive
                    ? "bg-gradient-to-r from-amber-50 via-amber-100/60 to-white border-[#D4AF37] text-slate-900 shadow-sm"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Item Number + Icon Container */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors relative ${
                      isActive
                        ? "bg-[#0A1E5E] text-[#D4AF37] font-bold shadow-xs"
                        : "bg-slate-100 text-slate-600 group-hover:text-amber-700 group-hover:bg-[#D4AF37]/15"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span
                      className={`absolute -top-1 -left-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center border ${
                        isActive
                          ? "bg-[#D4AF37] text-[#0A1E5E] border-white shadow-xs"
                          : "bg-white text-slate-500 border-slate-200 group-hover:border-amber-400 group-hover:text-amber-700"
                      }`}
                    >
                      {item.number}
                    </span>
                  </div>

                  {/* Label & Subtitle */}
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-black truncate leading-tight ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-700 group-hover:text-slate-900"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-[10px] truncate leading-tight mt-0.5 ${
                        isActive
                          ? "text-amber-800 font-semibold"
                          : "text-slate-400 group-hover:text-slate-500"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Badges / Counts */}
                <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${item.badgeVariant}`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {typeof item.count === "number" && (
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border ${
                        item.highlightCount
                          ? "bg-amber-500 text-slate-950 border-amber-600 shadow-xs animate-pulse"
                          : isActive
                          ? "bg-[#D4AF37] text-[#0A1E5E] border-[#D4AF37]"
                          : "bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-slate-200"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}

                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive
                        ? "text-[#D4AF37] translate-x-0.5"
                        : "text-slate-400 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Secondary: Nhật Ký Ca Quét */}
        <div className="pt-3 border-t border-slate-150">
          <button
            type="button"
            onClick={() => handleItemClick("logs")}
            className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
              activeSection === "logs"
                ? "bg-slate-100 text-slate-900 font-bold border border-slate-300"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-medium">Nhật ký hoạt động ca quét</span>
            </div>
            {counts.logs > 0 && (
              <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                {counts.logs}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 space-y-2 shrink-0 bg-slate-50/70">
        <Link
          href="/tin-tuc"
          target="_blank"
          className="w-full px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#0A1E5E] font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
        >
          <span className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span>Xem Blog Trên Web</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Left Sidebar */}
      <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-0 h-screen overflow-hidden z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 sm:w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
