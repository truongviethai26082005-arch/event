import type { SupabaseClient } from "@supabase/supabase-js";

export type LeadStatus = "NEW" | "QUOTED" | "NEGOTIATING" | "WON" | "LOST";
export type LeadSource =
  | "WEBSITE_FORM"
  | "HOTLINE"
  | "ZALO_OA"
  | "FACEBOOK"
  | "REFERRAL"
  | "OTHER";
export type EventStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface AdminLead {
  id: string;
  full_name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  event_type: string;
  guest_count: number | null;
  budget: number | null;
  actual_revenue: number | null;
  event_date: string | null;
  event_time: string | null;
  event_status: EventStatus;
  location: string | null;
  notes: string | null;
  status: LeadStatus;
  source: LeadSource;
  assigned_to: string | null;
  equipment_status: string | null;
  created_at: string;
  // Các trường dưới đây có sau migration 20261108000000_lead_crm_phase_a.sql
  quoted_at?: string | null;
  negotiating_at?: string | null;
  won_at?: string | null;
  lost_at?: string | null;
  lost_stage?: LeadStatus | null;
  lost_reason?: string | null;
  last_contacted_at?: string | null;
  form_token?: string | null;
  form_submitted_at?: string | null;
}

export const ADMIN_LEAD_SELECT =
  "id,full_name,company_name,phone,email,event_type,guest_count,budget,actual_revenue,event_date,event_time,event_status,location,notes,status,source,assigned_to,equipment_status,created_at";

/** Bộ cột đầy đủ khi DB đã chạy migration CRM giai đoạn A. */
export const ADMIN_LEAD_SELECT_FULL = `${ADMIN_LEAD_SELECT},quoted_at,negotiating_at,won_at,lost_at,lost_stage,lost_reason,last_contacted_at,form_token,form_submitted_at`;

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: string;
  actor: string | null;
  from_status: string | null;
  to_status: string | null;
  note: string | null;
  created_at: string;
}

export interface LeadQuote {
  id: string;
  lead_id: string;
  version: number;
  items: { title: string; unit?: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  discount: number;
  vat_percent: number;
  total: number;
  notes: string | null;
  sent_via: string | null;
  created_by: string | null;
  created_at: string;
}

/** Lỗi do DB chưa có cột / bảng / hàm của migration mới. */
export function isMissingSchemaError(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return (
    ["42703", "42P01", "42883", "PGRST200", "PGRST202", "PGRST204", "PGRST205"].includes(error.code || "") ||
    /column|schema cache|does not exist/i.test(error.message || "")
  );
}

/**
 * Tải toàn bộ lead cho trang quản trị. Thử bộ cột đầy đủ trước; nếu DB chưa chạy
 * migration CRM giai đoạn A thì lùi về bộ cột cũ và báo `crmReady = false`.
 */
export async function fetchAdminLeads(supabase: Pick<SupabaseClient, "from">): Promise<{ leads: AdminLead[]; crmReady: boolean }> {
  const full = await supabase.from("leads").select(ADMIN_LEAD_SELECT_FULL).order("created_at", { ascending: false });
  if (!full.error) return { leads: (full.data ?? []) as AdminLead[], crmReady: true };
  if (!isMissingSchemaError(full.error)) throw full.error;

  const basic = await supabase.from("leads").select(ADMIN_LEAD_SELECT).order("created_at", { ascending: false });
  if (basic.error) throw basic.error;
  return { leads: (basic.data ?? []) as AdminLead[], crmReady: false };
}

export const CRM_MIGRATION_NOTICE =
  "Cơ sở dữ liệu chưa chạy migration supabase/migrations/20261108000000_lead_crm_phase_a.sql: lịch sử hoạt động, mốc thời gian, lưu báo giá và gộp lead đang tạm tắt.";

export interface AdminService {
  id: string;
  title: string;
  slug: string;
  category: "su-kien" | "du-lich";
  description: string;
  image_url: string | null;
  price_range: string | null;
  features: string[] | null;
  is_active: boolean;
}

export interface AdminProject {
  id: string;
  title: string;
  category: string;
  client_name: string;
  client_logo: string | null;
  description: string;
  image_url: string | null;
  images: string[] | null;
  event_date: string | null;
  guest_count: number | null;
  location: string | null;
  testimonial: string | null;
  is_published: boolean;
}

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "QUOTED",
  "NEGOTIATING",
  "WON",
  "LOST",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Mới tiếp nhận",
  QUOTED: "Đã báo giá",
  NEGOTIATING: "Đang thương lượng",
  WON: "Đã chốt",
  LOST: "Không thành",
};

export const LEAD_SOURCES: LeadSource[] = [
  "WEBSITE_FORM",
  "HOTLINE",
  "ZALO_OA",
  "FACEBOOK",
  "REFERRAL",
  "OTHER",
];
export const EVENT_STATUSES: EventStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  WEBSITE_FORM: "Form website",
  HOTLINE: "Hotline",
  ZALO_OA: "Zalo",
  FACEBOOK: "Facebook",
  REFERRAL: "Giới thiệu",
  OTHER: "Khác",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  PENDING: "Chưa xác nhận",
  CONFIRMED: "Đã xác nhận",
  IN_PROGRESS: "Đang diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

export function isEventStatus(value: string): value is EventStatus {
  return EVENT_STATUSES.some((status) => status === value);
}

export function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.some((status) => status === value);
}

export function isLeadSource(value: string): value is LeadSource {
  return LEAD_SOURCES.some((source) => source === value);
}

export function formatCurrency(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "Chưa có dữ liệu";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export const VN_TIME_ZONE = "Asia/Ho_Chi_Minh";

/** Giá trị chỉ có ngày ("2026-11-08"), không kèm giờ. */
function isDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
}

/**
 * Ngày theo giờ Việt Nam dạng yyyy-mm-dd, dùng để so sánh / lọc theo ngày.
 * Thời điểm (created_at...) được đổi sang giờ VN; ngày thuần (event_date) giữ nguyên.
 */
export function toVnDateKey(value: string | null | undefined) {
  if (!value) return "";
  if (isDateOnly(value)) return value.trim();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  // en-CA cho định dạng yyyy-mm-dd
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: VN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa xác định";
  const key = toVnDateKey(value);
  const date = new Date(`${key}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Chưa xác định";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function eventTypeLabel(value: string) {
  return value.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

export function getDatabaseError(error: { message: string }) {
  if (error.message.includes("schema cache") || error.message.includes("column")) {
    return "Cơ sở dữ liệu chưa có các trường quản trị mới. Hãy áp dụng các migration trong thư mục supabase/migrations.";
  }
  return `Không thể tải dữ liệu Supabase: ${error.message}`;
}
