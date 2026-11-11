"use client";

export type RadarNavSection =
  | "top_google"
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

/** Gộp tên cũ về đúng mục đang hiển thị */
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

/** Tiêu đề + mô tả ngắn gọn, dễ hiểu của từng khu vực */
export const RADAR_SECTION_INFO: Record<string, { title: string; description: string }> = {
  top_google: {
    title: "Quy trình SEO tự động",
    description:
      "Dây chuyền 5 giai đoạn: Quét Top 10 Google → Đọc nội dung đối thủ → So sánh tìm khoảng trống → Đề xuất ý tưởng → AI viết bài & Đo lường thứ hạng.",
  },
  duyet_bai: {
    title: "Kho bài viết & Duyệt đăng",
    description: "Xem lại các bài viết AI đã soạn thảo, bổ sung thông tin giá cả/số liệu thực tế của công ty rồi phát hành lên website.",
  },
  viet_bai: {
    title: "Viết bài theo yêu cầu",
    description: "Chủ động dán link bài viết hoặc tên miền website đối thủ để AI mổ xẻ cấu trúc và viết một bài hoàn toàn mới cho Trường Hải.",
  },
  bo_nao: {
    title: "Dữ liệu thương hiệu",
    description: "Kho dữ liệu gốc của doanh nghiệp: năng lực kho thiết bị, bảng giá, danh mục dịch vụ và hình ảnh các sự kiện đã tổ chức thực tế.",
  },
  doi_thu: {
    title: "Danh sách đối thủ theo dõi",
    description: "Danh sách các website đối thủ cạnh tranh trực tiếp trong ngành tổ chức sự kiện & du lịch.",
  },
  ke_hoach: {
    title: "Kế hoạch từ khóa & Khoảng trống",
    description: "Các chủ đề và từ khóa giá trị cao mà đối thủ đã lên Top Google nhưng website Trường Hải chưa có bài viết.",
  },
  logs: {
    title: "Nhật ký hoạt động hệ thống",
    description: "Lịch sử chi tiết các lượt quét Google, cào dữ liệu đối thủ và tiến trình tạo bài viết của máy.",
  },
};

interface Tab {
  id: RadarNavSection;
  label: string;
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

export default function RadarSidebar({
  activeSection,
  onSelectSection,
  counts,
  activeEditorTitle,
  isScanning,
}: RadarSidebarProps) {
  const current = canonicalSection(activeSection);

  const main: Tab[] = [
    { id: "top_google", label: "Quy trình SEO tự động" },
    { id: "duyet_bai", label: "Kho bài viết", count: counts.drafts || undefined, highlight: counts.drafts > 0 },
    { id: "viet_bai", label: "Viết theo yêu cầu" },
    { id: "bo_nao", label: "Dữ liệu thương hiệu" },
  ];

  const extra: Tab[] = [
    { id: "doi_thu", label: "Đối thủ", count: counts.competitors || undefined },
    { id: "ke_hoach", label: "Kế hoạch từ khóa", count: counts.gaps || undefined },
    { id: "logs", label: "Nhật ký", count: counts.logs || undefined },
  ];

  const renderTab = (tab: Tab, small = false) => {
    const active = current === tab.id;
    return (
      <button
        key={tab.id}
        type="button"
        onClick={() => onSelectSection(tab.id)}
        aria-current={active ? "page" : undefined}
        className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl font-bold transition cursor-pointer ${
          small
            ? "px-3 py-1.5 text-xs bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-2xs"
            : "px-4 py-2 text-xs sm:text-sm"
        } ${
          active
            ? small
              ? "bg-[#0B1536] text-white shadow-sm ring-1 ring-[#0B1536]"
              : "bg-white text-slate-900 shadow-sm border border-slate-200/80 font-black"
            : small
            ? "hover:bg-slate-50"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
        }`}
      >
        <span>{tab.label}</span>
        {tab.id === "viet_bai" && (isScanning || activeEditorTitle) && (
          <span className={`h-2 w-2 rounded-full ${isScanning ? "animate-pulse bg-amber-400" : "bg-emerald-500"}`} />
        )}
        {tab.count !== undefined && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
              active && !small
                ? "bg-amber-400 text-slate-950"
                : tab.highlight
                ? "bg-amber-100 text-amber-900"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {tab.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <nav aria-label="Điều hướng tính năng Radar SEO" className="space-y-3">
      {/* Hàng nút chức năng chính và chức năng mở rộng */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-100/70 p-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {main.map((t) => renderTab(t))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-200/80 pt-2 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-3">
          <span className="mr-1 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            MỞ RỘNG:
          </span>
          {extra.map((t) => renderTab(t, true))}
        </div>
      </div>

      {activeEditorTitle && current !== "viet_bai" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs shadow-2xs">
          <span className="min-w-0 truncate text-amber-950 font-medium">
            <strong className="font-bold text-amber-900">Bài đang viết dở:</strong> {activeEditorTitle}
          </span>
          <button
            type="button"
            onClick={() => onSelectSection("viet_bai")}
            className="shrink-0 rounded-lg bg-[#0A1E5E] px-3 py-1 font-bold text-white hover:bg-[#142d75] transition"
          >
            Mở bài đang viết
          </button>
        </div>
      )}
    </nav>
  );
}
