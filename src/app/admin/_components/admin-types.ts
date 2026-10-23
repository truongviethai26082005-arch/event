export type LeadStatus = "NEW" | "QUOTED" | "NEGOTIATING" | "WON" | "LOST";
export type LeadSource =
  | "WEBSITE_FORM"
  | "HOTLINE"
  | "ZALO_OA"
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
}

export const ADMIN_LEAD_SELECT =
  "id,full_name,company_name,phone,email,event_type,guest_count,budget,actual_revenue,event_date,event_time,event_status,location,notes,status,source,assigned_to,equipment_status,created_at";

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
  NEW: "Mới",
  QUOTED: "Đã báo giá",
  NEGOTIATING: "Đang thương lượng",
  WON: "Đã chốt",
  LOST: "Không thành",
};

export const LEAD_SOURCES: LeadSource[] = [
  "WEBSITE_FORM",
  "HOTLINE",
  "ZALO_OA",
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
  ZALO_OA: "Zalo OA",
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

export function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa xác định";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
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
