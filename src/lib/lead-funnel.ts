/**
 * ĐỊNH NGHĨA DUY NHẤT CHO PHỄU KHÁCH HÀNG (LEAD FUNNEL)
 *
 * Mọi nơi ghi lead (form, nút liên hệ, API) và mọi nơi đọc lead (dashboard,
 * CRM, biểu đồ nguồn) đều dùng chung file này để đầu vào, giai đoạn và chỉ số
 * đầu ra luôn thống nhất.
 *
 *  ĐẦU VÀO  ─▶  1. Mới tiếp nhận ─▶ 2. Đã báo giá ─▶ 3. Đang thương lượng ─▶ 4. Đã chốt
 *                     │                  │                  │
 *                     └──────────────────┴──────────────────┴─▶ Không thành (rơi khỏi phễu)
 */

import { COMPANY_INFO } from "@/lib/company-data";
import {
  LeadSource,
  LeadStatus,
  isLeadSource,
  isLeadStatus,
} from "@/app/admin/_components/admin-types";

/* ------------------------------------------------------------------ */
/* 1. ĐẦU VÀO                                                         */
/* ------------------------------------------------------------------ */

/** Kênh mà khách tương tác trên website (giá trị gửi từ trình duyệt). */
export type LeadChannel = "GG_FORM" | "ZALO" | "HOTLINE" | "FACEBOOK";

export const LEAD_CHANNELS: LeadChannel[] = ["GG_FORM", "ZALO", "HOTLINE", "FACEBOOK"];

/** Kênh trên website → giá trị `source` lưu trong bảng `leads`. */
export const CHANNEL_TO_SOURCE: Record<LeadChannel, LeadSource> = {
  GG_FORM: "WEBSITE_FORM",
  ZALO: "ZALO_OA",
  HOTLINE: "HOTLINE",
  FACEBOOK: "FACEBOOK",
};

export function isLeadChannel(value: unknown): value is LeadChannel {
  return typeof value === "string" && (LEAD_CHANNELS as string[]).includes(value);
}

/** Mô tả cách mỗi nguồn đi vào phễu. */
export const SOURCE_ENTRY_RULES: Record<LeadSource, string> = {
  WEBSITE_FORM:
    "Khách điền form báo giá (/dich-vu) hoặc form xin hồ sơ năng lực (/ho-so-nang-luc). Có tên và số điện thoại thật.",
  ZALO_OA:
    "Khách bấm nút Chat Zalo trên website. Chưa có số điện thoại, sale cần xác minh khi khách nhắn.",
  HOTLINE:
    "Khách bấm nút gọi Hotline trên website. Chưa có số điện thoại, sale cần cập nhật sau cuộc gọi.",
  FACEBOOK:
    "Khách bấm nút Facebook / Messenger trên website. Chưa có số điện thoại, sale cần xác minh khi khách nhắn.",
  REFERRAL: "Khách được giới thiệu, sale nhập tay.",
  OTHER: "Nguồn khác, sale nhập tay.",
};

/** Lượt bấm nút (không có form) của cùng một trình duyệt chỉ được tính 1 lead / kênh trong khoảng này. */
export const CLICK_LEAD_DEDUPE_MS = 24 * 60 * 60 * 1000;

/** Số điện thoại tạm cho lead đến từ lượt bấm nút. */
export const PENDING_PHONE = "Chờ cập nhật";

/**
 * Chuẩn hóa nguồn của một lead.
 * Dữ liệu cũ lưu Facebook dưới dạng REFERRAL kèm chữ "Facebook" trong ghi chú,
 * hàm này đưa chúng về đúng nguồn FACEBOOK.
 */
export function resolveLeadSource(lead: {
  source?: string | null;
  notes?: string | null;
  full_name?: string | null;
}): LeadSource {
  const raw = String(lead.source || "").toUpperCase();
  if (raw === "REFERRAL") {
    const text = `${lead.notes || ""} ${lead.full_name || ""}`.toLowerCase();
    return text.includes("facebook") ? "FACEBOOK" : "REFERRAL";
  }
  return isLeadSource(raw) ? raw : "OTHER";
}

/* ------------------------------------------------------------------ */
/* 2. GIAI ĐOẠN                                                       */
/* ------------------------------------------------------------------ */

/** Các tầng của phễu theo thứ tự. "Không thành" (LOST) là nhánh rơi ra, không phải tầng. */
export const PIPELINE_STAGES = ["NEW", "QUOTED", "NEGOTIATING", "WON"] as const satisfies readonly LeadStatus[];
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export interface StageGuide {
  /** Tên tầng hiển thị trên phễu. */
  funnelLabel: string;
  /** Khi nào lead ở trạng thái này. */
  entryRule: string;
  /** Việc sale cần làm để đẩy lead sang bước tiếp theo. */
  nextAction: string;
}

export const STAGE_GUIDE: Record<LeadStatus, StageGuide> = {
  NEW: {
    funnelLabel: "Tiếp nhận",
    entryRule: "Tự động khi khách gửi form hoặc bấm Hotline / Zalo / Facebook trên website.",
    nextAction: "Gọi lại xác nhận nhu cầu, gửi báo giá rồi chuyển sang “Đã báo giá”.",
  },
  QUOTED: {
    funnelLabel: "Đã báo giá",
    entryRule: "Sale đã tư vấn và gửi báo giá cho khách.",
    nextAction: "Theo dõi phản hồi, hẹn khảo sát và đàm phán rồi chuyển sang “Đang thương lượng”.",
  },
  NEGOTIATING: {
    funnelLabel: "Thương lượng",
    entryRule: "Khách đã phản hồi báo giá, đang đàm phán hợp đồng, khảo sát địa điểm hoặc điều chỉnh ngân sách.",
    nextAction: "Ký hợp đồng và nhận cọc rồi chuyển sang “Đã chốt”.",
  },
  WON: {
    funnelLabel: "Đã chốt",
    entryRule: "Đã ký hợp đồng và nhận cọc.",
    nextAction: "Lên lịch sự kiện, sau khi tổ chức nhập doanh thu thực tế.",
  },
  LOST: {
    funnelLabel: "Không thành",
    entryRule: "Khách dừng ở bất kỳ bước nào (hủy kế hoạch, không đủ ngân sách, chọn đơn vị khác...).",
    nextAction: "Ghi rõ lý do vào ghi chú để rút kinh nghiệm.",
  },
};

/** Trạng thái hợp lệ của một lead; giá trị rỗng/lạ được coi là "Mới". */
export function getLeadStatus(lead: { status?: string | null }): LeadStatus {
  const raw = String(lead.status || "");
  return isLeadStatus(raw) ? raw : "NEW";
}

/* ------------------------------------------------------------------ */
/* 3. ĐẦU RA                                                          */
/* ------------------------------------------------------------------ */

export interface FunnelStageStat {
  status: PipelineStage;
  label: string;
  /** Số lead ĐANG đứng ở bước này. */
  current: number;
  /** Số lead ĐÃ ĐI QUA bước này (đang ở bước này hoặc các bước sau). */
  reached: number;
  /** reached / tổng lead. */
  pctOfTotal: number;
  /** reached / reached của tầng trước (tầng đầu = 100). Luôn ≤ 100%. */
  stepRate: number;
}

export interface FunnelSummary {
  total: number;
  stages: FunnelStageStat[];
  /** Lead đang xử lý (Mới + Đã báo giá + Đang thương lượng). */
  open: number;
  won: number;
  lost: number;
  /** Đã chốt / (Đã chốt + Không thành): tỷ lệ thắng trên các lead đã có kết quả. */
  winRateClosed: number;
  /** Đã chốt / tổng lead: tỷ lệ chuyển đổi toàn phễu. */
  winRateOverall: number;
  currentByStatus: Record<LeadStatus, number>;
}

/** Thứ tự của bước trong phễu (NEW = 0 ... WON = 3); giá trị lạ = 0. */
export function stageRank(status?: string | null) {
  const index = (PIPELINE_STAGES as readonly string[]).indexOf(String(status || ""));
  return index < 0 ? 0 : index;
}

function pct(part: number, whole: number) {
  return whole > 0 ? (part / whole) * 100 : 0;
}

/**
 * Tổng hợp phễu theo kiểu cộng dồn: một lead ở "Đang thương lượng" được tính là
 * đã đi qua "Tiếp nhận" và "Đã báo giá".
 *
 * Lead "Không thành" được tính tới bước nó rơi khỏi phễu (cột lost_stage, tối đa
 * "Đang thương lượng"). Dữ liệu cũ chưa có lost_stage chỉ được tính ở tầng 1.
 */
export function summarizeFunnel(
  leads: { status?: string | null; lost_stage?: string | null }[]
): FunnelSummary {
  const currentByStatus: Record<LeadStatus, number> = {
    NEW: 0,
    QUOTED: 0,
    NEGOTIATING: 0,
    WON: 0,
    LOST: 0,
  };
  leads.forEach((lead) => {
    currentByStatus[getLeadStatus(lead)] += 1;
  });

  // Số lead "Không thành" đã từng đi tới từng bước
  const lostReached = [0, 0, 0, 0];
  leads.forEach((lead) => {
    if (getLeadStatus(lead) !== "LOST") return;
    const rank = Math.min(stageRank(lead.lost_stage), 2);
    for (let i = 0; i <= rank; i += 1) lostReached[i] += 1;
  });

  const total = leads.length;
  const stages: FunnelStageStat[] = [];
  PIPELINE_STAGES.forEach((status, index) => {
    const reached =
      index === 0
        ? total
        : PIPELINE_STAGES.slice(index).reduce((sum, s) => sum + currentByStatus[s], 0) +
          lostReached[index];
    const prevReached = index === 0 ? total : stages[index - 1].reached;
    stages.push({
      status,
      label: STAGE_GUIDE[status].funnelLabel,
      current: currentByStatus[status],
      reached,
      pctOfTotal: pct(reached, total),
      stepRate: index === 0 ? (total > 0 ? 100 : 0) : pct(reached, prevReached),
    });
  });

  const won = currentByStatus.WON;
  const lost = currentByStatus.LOST;
  return {
    total,
    stages,
    open: currentByStatus.NEW + currentByStatus.QUOTED + currentByStatus.NEGOTIATING,
    won,
    lost,
    winRateClosed: pct(won, won + lost),
    winRateOverall: pct(won, total),
    currentByStatus,
  };
}

/* ------------------------------------------------------------------ */
/* 4. CHĂM SÓC & LỊCH SỬ                                              */
/* ------------------------------------------------------------------ */

/** Lý do "Không thành" gợi ý cho sale chọn. */
export const LOST_REASONS = [
  "Giá cao hơn ngân sách",
  "Chọn đơn vị khác",
  "Khách hủy / hoãn kế hoạch",
  "Không liên lạc được",
  "Không đúng nhu cầu dịch vụ",
  "Khác",
] as const;

export type LeadActivityType =
  | "created"
  | "status_change"
  | "call"
  | "message"
  | "meeting"
  | "note"
  | "quote_sent"
  | "form_submitted"
  | "merged"
  | "ai_analysis";

export const ACTIVITY_LABELS: Record<LeadActivityType, string> = {
  created: "Tiếp nhận lead",
  status_change: "Đổi trạng thái",
  call: "Gọi điện",
  message: "Nhắn tin (Zalo / Messenger)",
  meeting: "Gặp / khảo sát",
  note: "Ghi chú",
  quote_sent: "Gửi báo giá",
  form_submitted: "Khách điền form",
  merged: "Gộp lead trùng",
  ai_analysis: "AI phân tích",
};

/** Các loại hoạt động sale tự ghi nhận bằng tay. */
export const MANUAL_ACTIVITY_TYPES: LeadActivityType[] = ["call", "message", "meeting", "note"];

/**
 * Hạn chăm sóc: lead ở trạng thái này mà quá thời hạn kể từ lần liên hệ gần nhất
 * (hoặc từ khi vào bước) thì bị nhắc trên dashboard.
 */
export const FOLLOW_UP_RULES: Partial<Record<LeadStatus, { afterMs: number; action: string }>> = {
  NEW: { afterMs: 30 * 60 * 1000, action: "Gọi lại khách (cam kết phản hồi 30 phút)" },
  QUOTED: { afterMs: 3 * 24 * 60 * 60 * 1000, action: "Hỏi khách phản hồi về báo giá" },
  NEGOTIATING: { afterMs: 7 * 24 * 60 * 60 * 1000, action: "Chốt lịch ký hợp đồng / nhận cọc" },
};

/** Không có phản hồi quá thời hạn này thì đề xuất chuyển "Không thành". */
export const STALE_AFTER_MS = 14 * 24 * 60 * 60 * 1000;

export interface FollowUpLeadFields {
  status?: string | null;
  created_at?: string | null;
  quoted_at?: string | null;
  negotiating_at?: string | null;
  last_contacted_at?: string | null;
}

/** Mốc bắt đầu tính hạn chăm sóc: lần liên hệ gần nhất, hoặc lúc vào bước hiện tại. */
export function followUpBaseTime(lead: FollowUpLeadFields): number | null {
  const status = getLeadStatus(lead);
  const enteredAt =
    status === "QUOTED" ? lead.quoted_at : status === "NEGOTIATING" ? lead.negotiating_at : lead.created_at;
  const times = [enteredAt, lead.last_contacted_at, lead.created_at]
    .map((t) => (t ? new Date(t).getTime() : NaN))
    .filter((t) => Number.isFinite(t));
  return times.length ? Math.max(...times) : null;
}

export interface FollowUpTask<T> {
  lead: T;
  action: string;
  overdueMs: number;
  stale: boolean;
}

/** Danh sách lead quá hạn chăm sóc, quá hạn lâu nhất lên đầu. */
export function getFollowUpTasks<T extends FollowUpLeadFields>(leads: T[], now = Date.now()): FollowUpTask<T>[] {
  const tasks: FollowUpTask<T>[] = [];
  leads.forEach((lead) => {
    const rule = FOLLOW_UP_RULES[getLeadStatus(lead)];
    const base = followUpBaseTime(lead);
    if (!rule || base === null) return;
    const idle = now - base;
    if (idle < rule.afterMs) return;
    const stale = getLeadStatus(lead) !== "NEW" && idle >= STALE_AFTER_MS;
    tasks.push({
      lead,
      action: stale ? "Quá 14 ngày không phản hồi: liên hệ lần cuối hoặc chuyển “Không thành”" : rule.action,
      overdueMs: idle - rule.afterMs,
      stale,
    });
  });
  return tasks.sort((a, b) => b.overdueMs - a.overdueMs);
}

/** Thời lượng dạng "2 giờ", "3 ngày". */
export function formatDuration(ms: number) {
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} giờ`;
  return `${Math.round(hours / 24)} ngày`;
}

/* ------------------------------------------------------------------ */
/* 5. TRÙNG SỐ ĐIỆN THOẠI                                             */
/* ------------------------------------------------------------------ */

function phoneDigits(phone?: string | null) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length >= 11) digits = `0${digits.slice(2)}`;
  return digits;
}

/** Số hotline của công ty: dữ liệu cũ từng ghi số này thay cho SĐT khách. */
const COMPANY_PHONE = phoneDigits(COMPANY_INFO.hotline);

/**
 * Chuẩn hóa SĐT VN: chỉ giữ số, +84/84 -> 0.
 * Trả "" nếu không phải SĐT của khách (rỗng, "Chờ cập nhật", hoặc là hotline công ty).
 */
export function normalizePhone(phone?: string | null) {
  const digits = phoneDigits(phone);
  if (digits === COMPANY_PHONE) return "";
  return digits.length >= 9 && digits.length <= 11 ? digits : "";
}

/** Các lead khác có cùng số điện thoại với lead đang xem. */
export function findDuplicateLeads<T extends { id: string; phone?: string | null }>(lead: T, leads: T[]) {
  const key = normalizePhone(lead.phone);
  if (!key) return [];
  return leads.filter((other) => other.id !== lead.id && normalizePhone(other.phone) === key);
}

/** Số lượng lead theo SĐT (để đánh dấu lead trùng trong bảng). */
export function countByPhone(leads: { phone?: string | null }[]) {
  const counts = new Map<string, number>();
  leads.forEach((lead) => {
    const key = normalizePhone(lead.phone);
    if (key) counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

/* ------------------------------------------------------------------ */
/* 6. LỊCH SỰ KIỆN & DOANH THU                                        */
/* ------------------------------------------------------------------ */

/**
 * Lead có lên lịch không, và ở dạng nào:
 *  - "CONFIRMED": Đã chốt (ký hợp đồng + nhận cọc) và có ngày tổ chức
 *  - "TENTATIVE": Đã báo giá / Đang thương lượng và có ngày dự kiến -> hiện mờ "Dự kiến"
 *  - null: Mới tiếp nhận, Không thành, sự kiện đã hủy, hoặc chưa có ngày -> không lên lịch
 */
export type CalendarKind = "CONFIRMED" | "TENTATIVE";

export function calendarKind(lead: {
  status?: string | null;
  event_date?: string | null;
  event_status?: string | null;
}): CalendarKind | null {
  if (!lead.event_date || lead.event_status === "CANCELLED") return null;
  const status = getLeadStatus(lead);
  if (status === "WON") return "CONFIRMED";
  if (status === "QUOTED" || status === "NEGOTIATING") return "TENTATIVE";
  return null;
}

interface RevenueLead {
  id: string;
  status?: string | null;
  event_date?: string | null;
  event_status?: string | null;
  budget?: number | null;
  actual_revenue?: number | null;
}

/**
 * Giá trị của 1 lead:
 *  - Đã chốt: ô "Ngân sách" (= giá trị hợp đồng), thiếu thì lấy báo giá gần nhất
 *  - Đang báo giá / thương lượng: báo giá gần nhất (chính xác hơn), thiếu thì lấy ngân sách khách khai
 */
export function leadValue(lead: RevenueLead, latestQuoteTotal?: number | null) {
  const budget = Number(lead.budget) || 0;
  const quote = Number(latestQuoteTotal) || 0;
  return getLeadStatus(lead) === "WON" ? budget || quote : quote || budget;
}

export interface RevenueSummary {
  /** Sự kiện Đã chốt, tổ chức trong tháng (không tính sự kiện đã hủy). */
  wonEventsInMonth: number;
  /** Tổng giá trị hợp đồng của các sự kiện trên. */
  wonRevenueInMonth: number;
  /** Doanh thu thực tế đã nhập của các sự kiện trên. */
  actualRevenueInMonth: number;
  actualCount: number;
  /** Tổng giá trị đang trong ống: Đã báo giá + Đang thương lượng (mọi thời điểm). */
  pipelineValue: number;
  pipelineCount: number;
  /** Số lead trong ống chưa có báo giá lẫn ngân sách (chưa ước được giá trị). */
  pipelineWithoutValue: number;
}

/** Tổng hợp doanh thu theo tháng tổ chức. monthStart / monthEnd dạng yyyy-mm-dd (monthEnd không tính). */
export function summarizeRevenue(
  leads: RevenueLead[],
  monthStart: string,
  monthEnd: string,
  latestQuoteTotals: Map<string, number> = new Map()
): RevenueSummary {
  const summary: RevenueSummary = {
    wonEventsInMonth: 0,
    wonRevenueInMonth: 0,
    actualRevenueInMonth: 0,
    actualCount: 0,
    pipelineValue: 0,
    pipelineCount: 0,
    pipelineWithoutValue: 0,
  };
  leads.forEach((lead) => {
    const status = getLeadStatus(lead);
    const value = leadValue(lead, latestQuoteTotals.get(lead.id));
    if (status === "QUOTED" || status === "NEGOTIATING") {
      summary.pipelineCount += 1;
      summary.pipelineValue += value;
      if (!value) summary.pipelineWithoutValue += 1;
      return;
    }
    const day = String(lead.event_date || "").slice(0, 10);
    if (status !== "WON" || !day || lead.event_status === "CANCELLED") return;
    if (day < monthStart || day >= monthEnd) return;
    summary.wonEventsInMonth += 1;
    summary.wonRevenueInMonth += value;
    if (lead.actual_revenue !== null && lead.actual_revenue !== undefined) {
      summary.actualCount += 1;
      summary.actualRevenueInMonth += Number(lead.actual_revenue) || 0;
    }
  });
  return summary;
}
