/**
 * BỘ TRƯỜNG FORM "NHẬN KỊCH BẢN & BÁO GIÁ" DÙNG CHUNG
 * Dùng cho form /dich-vu, popup khi khách bấm nút liên hệ, và trang link sale gửi khách.
 * Chạy được cả ở trình duyệt lẫn máy chủ (không import thư viện client).
 */

/** Loại sự kiện: khớp các gói dịch vụ trong src/app/dich-vu/data/services-data.ts */
export const EVENT_TYPE_OPTIONS = [
  "Tổ Chức Lễ Khai Trương, Khánh Thành & Khởi Công",
  "Tiệc Tất Niên (Year End Party) & Gala Dinner Doanh Nghiệp",
  "Tổ Chức Hội Nghị, Hội Thảo & Sự Kiện Mở Bán BĐS",
  "Team Building, Tour Doanh Nghiệp & Du Lịch Nghỉ Dưỡng MICE",
  "Sản Xuất, Thi Công & Cho Thuê Trang Thiết Bị Sự Kiện Trọn Gói",
  "Tổ chức Sự Kiện & Du Lịch Trọn Gói",
] as const;

export const GUEST_OPTIONS = [
  "Dưới 50 khách (Sự kiện nhỏ / Cửa hàng)",
  "50 - 150 khách (Quy mô vừa)",
  "150 - 300 khách (Doanh nghiệp chuẩn)",
  "300 - 600 khách (Quy mô lớn)",
  "Trên 600 khách (Đại lễ / Festival / Hội nghị lớn)",
] as const;

export const BUDGET_OPTIONS = [
  "Dưới 20.000.000đ (Tiết kiệm)",
  "20.000.000đ - 50.000.000đ",
  "50.000.000đ - 100.000.000đ",
  "100.000.000đ - 250.000.000đ",
  "Trên 250.000.000đ (VIP Đẳng cấp)",
] as const;

export const DEFAULT_GUESTS = GUEST_OPTIONS[2];
export const DEFAULT_BUDGET = BUDGET_OPTIONS[1];

/** Dữ liệu khách nhập trong form (dạng chữ, đúng như hiển thị). */
export interface LeadFormInput {
  fullName: string;
  phone: string;
  email?: string;
  companyName?: string;
  eventType?: string;
  estimatedGuests?: string;
  budgetRange?: string;
  /** dd/mm/yyyy hoặc yyyy-mm-dd */
  eventDate?: string;
  location?: string;
  notes?: string;
  promoCode?: string;
  promoTitle?: string;
}

/** Khoảng quy mô -> số khách đại diện để lưu vào cột guest_count. */
export function parseGuestCount(text?: string): number | null {
  if (!text) return null;
  if (text.includes("Dưới 50")) return 40;
  if (text.includes("50 - 150")) return 100;
  if (text.includes("150 - 300")) return 200;
  if (text.includes("300 - 600")) return 450;
  if (text.includes("Trên 600")) return 700;
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/** Khoảng ngân sách -> số tiền đại diện để lưu vào cột budget. */
export function parseBudget(text?: string): number | null {
  if (!text) return null;
  if (text.includes("Dưới 20")) return 15_000_000;
  if (text.includes("20.000.000") && text.includes("50.000.000")) return 35_000_000;
  if (text.includes("50.000.000") && text.includes("100.000.000")) return 75_000_000;
  if (text.includes("100.000.000") && text.includes("250.000.000")) return 175_000_000;
  if (text.includes("Trên 250")) return 300_000_000;
  return null;
}

/** dd/mm/yyyy hoặc yyyy-mm-dd -> yyyy-mm-dd (null nếu không hợp lệ). */
export function parseEventDate(text?: string): string | null {
  if (!text) return null;
  const value = text.trim();
  let y: number, m: number, d: number;
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const vn = value.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (iso) [y, m, d] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
  else if (vn) [y, m, d] = [Number(vn[3]), Number(vn[2]), Number(vn[1])];
  else return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    return null;
  }
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Số điện thoại VN hợp lệ: 9–11 chữ số. */
export function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 11;
}

/** Ghép phần chữ (quy mô, ngân sách, ưu đãi...) vào ghi chú để sale đọc nguyên văn. */
export function buildLeadNotes(input: LeadFormInput) {
  return [
    input.notes ? `Yêu cầu: ${input.notes}` : "",
    input.estimatedGuests ? `Quy mô: ${input.estimatedGuests}` : "",
    input.budgetRange ? `Ngân sách: ${input.budgetRange}` : "",
    input.eventDate ? `Ngày dự kiến: ${input.eventDate}` : "",
    input.promoCode ? `Ưu đãi áp dụng: [${input.promoCode}] ${input.promoTitle || ""}`.trim() : "",
  ]
    .filter(Boolean)
    .join(" | ");
}
