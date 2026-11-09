"use client";

import { Activity, Brain, CheckSquare, Compass, Globe, PenLine, Route } from "lucide-react";

export type RadarNavSection =
  | "top_google"
  | "viet_bai"
  | "duyet_bai"
  | "bo_nao"
  | "doi_thu"
  | "ke_hoach"
  // Tên cũ, vẫn giữ để các nút điều hướng cũ không gãy:
  | "scanner"
  | "editor"
  | "posts"
  | "competitors"
  | "content_gap"
  | "events"
  | "cron"
  | "logs";

/** Gộp tên cũ về đúng mục đang hiển thị. */
export function canonicalSection(section: RadarNavSection): RadarNavSection {
  switch (section) {
    case "scanner":
    case "editor":
      return "viet_bai";
    case "posts":
      return "duyet_bai";
    case "events":
      return "bo_nao";
    case "competitors":
      return "doi_thu";
    case "content_gap":
    case "cron":
      return "ke_hoach";
    default:
      return section;
  }
}

/** Tiêu đề + mô tả ngắn của từng mục (dùng cho đầu trang Radar). */
export const RADAR_SECTION_INFO: Record<string, { title: string; description: string }> = {
  top_google: {
    title: "Dây chuyền SEO",
    description:
      "Quy trình chính: xem top Google → đọc bài đối thủ → so sánh → đề xuất → AI viết → duyệt & đăng → theo dõi thứ hạng.",
  },
  duyet_bai: {
    title: "Kho bài viết",
    description: "Đọc lại bài nháp, điền các chỗ [CẦN SỐ LIỆU], tick danh sách kiểm tra rồi mới đăng lên website.",
  },
  viet_bai: {
    title: "Viết bài theo yêu cầu",
    description: "Tự chọn một bài hoặc website đối thủ, AI đọc cấu trúc và viết bản nháp mới cho mình.",
  },
  bo_nao: {
    title: "Bộ não thương hiệu",
    description: "Dữ liệu thật của công ty mà AI được phép dùng: dự án đã làm, thiết bị, giọng văn.",
  },
  doi_thu: {
    title: "Danh sách đối thủ",
    description: "Công cụ phụ: tự thêm website đối thủ để quét bài. Dữ liệu chỉ lưu trên trình duyệt này.",
  },
  ke_hoach: {
    title: "Kế hoạch nội dung",
    description: "Công cụ phụ: chủ đề đối thủ có mà mình chưa có. Dữ liệu chỉ lưu trên trình duyệt này.",
  },
  logs: {
    title: "Nhật ký quét",
    description: "Công cụ phụ: lịch sử các lần quét và viết bài bằng công cụ phụ.",
  },
};

interface Tab {
  id: RadarNavSection;
  label: string;
  icon: typeof Route;
  count?: number;
  highlight?: boolean;
}

export interface RadarSidebarProps {
  activeSection: RadarNavSection;
  onSelectSection: (section: RadarNavSection) => void;
  counts: { drafts: number; competitors: number; gaps: number; logs: number };
  activeEditorTitle?: string | null;
  isScanning: boolean;
}

/**
 * Thanh mục của Radar SEO (nằm ngang, trong khung quản trị chung).
 * Nhóm 1 = quy trình chính theo thứ tự làm việc; nhóm 2 = công cụ phụ.
 */
export default function RadarSidebar({
  activeSection,
  onSelectSection,
  counts,
  activeEditorTitle,
  isScanning,
}: RadarSidebarProps) {
  const current = canonicalSection(activeSection);

  const main: Tab[] = [
    { id: "top_google", label: "Dây chuyền SEO", icon: Route },
    { id: "duyet_bai", label: "Kho bài viết", icon: CheckSquare, count: counts.drafts || undefined, highlight: counts.drafts > 0 },
    { id: "viet_bai", label: "Viết bài theo yêu cầu", icon: PenLine },
    { id: "bo_nao", label: "Bộ não thương hiệu", icon: Brain },
  ];
  const extra: Tab[] = [
    { id: "doi_thu", label: "Đối thủ", icon: Globe, count: counts.competitors || undefined },
    { id: "ke_hoach", label: "Kế hoạch nội dung", icon: Compass, count: counts.gaps || undefined },
    { id: "logs", label: "Nhật ký", icon: Activity, count: counts.logs || undefined },
  ];

  const renderTab = (tab: Tab, small = false) => {
    const active = current === tab.id;
    const Icon = tab.icon;
    return (
      <button
        key={tab.id}
        type="button"
        onClick={() => onSelectSection(tab.id)}
        aria-current={active ? "page" : undefined}
        className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3 font-semibold transition ${
          small ? "py-1.5 text-xs" : "py-2 text-sm"
        } ${
          active
            ? "border-[#0A1E5E] bg-[#0A1E5E] text-white shadow-sm"
            : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-[#0A1E5E]"
        }`}
      >
        <Icon className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {tab.label}
        {tab.id === "viet_bai" && (isScanning || activeEditorTitle) && (
          <span className={`h-2 w-2 rounded-full ${isScanning ? "animate-pulse bg-amber-400" : "bg-emerald-500"}`} />
        )}
        {tab.count !== undefined && (
          <span
            className={`rounded-md px-1.5 text-[11px] font-bold ${
              active ? "bg-white/20 text-white" : tab.highlight ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"
            }`}
          >
            {tab.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <nav aria-label="Các mục Radar SEO" className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1 [scrollbar-width:none]">{main.map((t) => renderTab(t))}</div>
        <div className="flex max-w-full items-center gap-1 overflow-x-auto [scrollbar-width:none] border-slate-200 lg:border-l lg:pl-4">
          <span className="mr-1 shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Công cụ phụ</span>
          {extra.map((t) => renderTab(t, true))}
        </div>
      </div>

      {activeEditorTitle && current !== "viet_bai" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
          <span className="min-w-0 truncate text-amber-900">
            <strong>Đang viết dở:</strong> {activeEditorTitle}
          </span>
          <button
            type="button"
            onClick={() => onSelectSection("viet_bai")}
            className="shrink-0 rounded-lg bg-[#0A1E5E] px-2.5 py-1 font-bold text-white hover:bg-[#142d75]"
          >
            Tiếp tục viết
          </button>
        </div>
      )}
    </nav>
  );
}
