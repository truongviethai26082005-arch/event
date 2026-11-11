import type { EventCategory } from "./event-profiles-data";

export type RadarTabId =
  | "top_google"
  | "duyet_bai"
  | "viet_bai"
  | "bo_nao"
  | "doi_thu"
  | "ke_hoach";

export interface RadarEditablePostPayload {
  id?: string;
  title: string;
  slug: string;
  meta_description: string;
  focus_keyword: string;
  content: string;
  reading_time?: string;
  status?: string;
  created_at?: string;
  sourceProfileId?: string;
}

export const RADAR_PENDING_DRAFT_KEY = "truonghai_radar_pending_draft_v1";
export const RADAR_PENDING_PROFILE_KEY = "truonghai_radar_pending_profile_v1";

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  "khai-truong": "Lễ khai trương",
  "gala-dinner": "Gala Dinner",
  "hoi-nghi": "Hội nghị khách hàng",
  teambuilding: "Teambuilding",
  "thiet-bi": "Thiết bị sự kiện",
  "le-hoi": "Lễ hội & Sự kiện",
};

/**
 * Trả về nhãn hiển thị thống nhất cho phân loại sự kiện.
 */
export function getCategoryLabel(category: EventCategory): string {
  return CATEGORY_LABELS[category] ?? "Sự kiện doanh nghiệp";
}

/**
 * Lưu tạm bản thảo bài viết Case Study để chuyển sang Trình soạn thảo Radar SEO.
 */
export function savePendingRadarDraft(draft: RadarEditablePostPayload): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RADAR_PENDING_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Bỏ qua nếu trình duyệt chặn storage
  }
}

/**
 * Đọc và xóa bản thảo chờ mở từ Hồ sơ sự kiện khi vào trang Radar SEO.
 */
export function consumePendingRadarDraft(): RadarEditablePostPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(RADAR_PENDING_DRAFT_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(RADAR_PENDING_DRAFT_KEY);
    const parsed = JSON.parse(raw) as RadarEditablePostPayload;
    return parsed && typeof parsed.title === "string" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Lưu ID hồ sơ sự kiện được chọn để gắn làm minh chứng E-E-A-T khi viết bài Radar.
 */
export function savePendingRadarProfileId(profileId: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RADAR_PENDING_PROFILE_KEY, profileId);
  } catch {
    // Bỏ qua nếu trình duyệt chặn storage
  }
}

/**
 * Đọc và xóa ID hồ sơ sự kiện đang chờ gắn vào Radar SEO.
 */
export function consumePendingRadarProfileId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const profileId = sessionStorage.getItem(RADAR_PENDING_PROFILE_KEY);
    if (!profileId) return null;
    sessionStorage.removeItem(RADAR_PENDING_PROFILE_KEY);
    return profileId;
  } catch {
    return null;
  }
}

/**
 * Tạo URL điều hướng thống nhất sang các phân hệ của Radar SEO.
 */
export function buildRadarHref(
  tab: RadarTabId,
  options?: { profileId?: string; postSlug?: string; fromDraft?: boolean }
): string {
  const params = new URLSearchParams();
  params.set("tab", tab);
  if (options?.profileId) params.set("profileId", options.profileId);
  if (options?.postSlug) params.set("postSlug", options.postSlug);
  if (options?.fromDraft) params.set("fromDraft", "1");
  return `/admin-radar?${params.toString()}`;
}

