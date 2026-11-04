"use client";

import React from "react";
import Link from "next/link";
import {
  Radar,
  Sparkles,
  Compass,
  Globe,
  FileText,
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  ExternalLink,
  RefreshCw,
  X,
  ChevronRight,
  ShieldCheck,
  Layers,
  LogOut,
} from "lucide-react";
import { signOut } from "@/app/admin-radar/actions";

export type RadarNavSection =
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
  label: string;
  subtitle: string;
  icon: any;
  badge?: string;
  badgeVariant?: string;
  count?: number;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export interface RadarSidebarProps {
  activeSection: RadarNavSection;
  onSelectSection: (section: RadarNavSection) => void;
  counts: {
    posts: number;
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
  const navGroups: NavGroup[] = [
    {
      group: "TRUNG TÂM RADAR AI",
      items: [
        {
          id: "scanner" as RadarNavSection,
          label: "Quét & Bóc Tách",
          subtitle: "Domain, Sitemap & Link URL",
          icon: Radar,
          badge: isScanning ? "Đang quét" : undefined,
          badgeVariant: "animate-pulse bg-amber-500/20 text-amber-300 border-amber-500/40",
        },
        {
          id: "editor" as RadarNavSection,
          label: "AI Studio & Biên Tập",
          subtitle: "Lỗ hổng đối thủ & Soạn bài SEO",
          icon: Sparkles,
          badge: hasActiveEditor ? "Đang mở" : undefined,
          badgeVariant: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        },
        {
          id: "content_gap" as RadarNavSection,
          label: "Khoảng Trống SEO",
          subtitle: "Bản đồ chủ đề & Xu hướng",
          icon: Compass,
          count: counts.gaps,
        },
        {
          id: "competitors" as RadarNavSection,
          label: "Quản Lý Đối Thủ",
          subtitle: "Danh bạ 9 đối thủ & Tần suất",
          icon: Globe,
          count: counts.competitors,
        },
      ],
    },
    {
      group: "BÀI VIẾT & VŨ KHÍ NỘI DUNG",
      items: [
        {
          id: "posts" as RadarNavSection,
          label: "Kho Bài Viết Radar",
          subtitle: "Bản nháp & Đã xuất bản",
          icon: FileText,
          count: counts.posts,
        },
        {
          id: "events" as RadarNavSection,
          label: "Vũ Khí & Case Study",
          subtitle: "Dữ liệu năng lực thực tế",
          icon: Briefcase,
          count: counts.events,
        },
      ],
    },
    {
      group: "VẬN HÀNH HỆ THỐNG",
      items: [
        {
          id: "cron" as RadarNavSection,
          label: "Chỉ Số & Tự Động",
          subtitle: "4 Metric & Ca quét 02:30",
          icon: TrendingUp,
        },
        {
          id: "logs" as RadarNavSection,
          label: "Nhật Ký Ca Quét",
          subtitle: "Lịch sử hoạt động AI",
          icon: Activity,
          count: counts.logs,
        },
      ],
    },
  ];

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
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
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
          {activeSection !== "editor" && (
            <button
              type="button"
              onClick={() => handleItemClick("editor")}
              className="px-2 py-1 rounded-lg bg-[#D4AF37] text-[#0A1E5E] text-[10px] font-bold shrink-0 hover:bg-amber-400 transition-colors shadow-xs"
            >
              Xem ngay
            </button>
          )}
        </div>
      )}

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all group cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-amber-50 via-amber-100/50 to-white border border-[#D4AF37] text-slate-900 shadow-sm"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-[#D4AF37] text-[#0A1E5E] font-bold shadow-xs"
                            : "bg-slate-100 text-slate-600 group-hover:text-amber-700 group-hover:bg-[#D4AF37]/15"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate leading-tight ${
                            isActive ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p className={`text-[10px] truncate leading-tight mt-0.5 ${
                          isActive ? "text-amber-800 font-medium" : "text-slate-400 group-hover:text-slate-500"
                        }`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

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
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            isActive
                              ? "bg-[#D4AF37] text-[#0A1E5E]"
                              : "bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-slate-200"
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
          </div>
        ))}
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
          <div className="relative w-72 sm:w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
