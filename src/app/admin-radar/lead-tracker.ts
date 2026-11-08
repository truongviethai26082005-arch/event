"use client";

import { CLICK_LEAD_DEDUPE_MS, LeadChannel } from "@/lib/lead-funnel";

/** Sự kiện trình duyệt yêu cầu mở popup "Để lại thông tin nhận kịch bản & báo giá". */
export const LEAD_CAPTURE_EVENT = "lead-capture:open";

export interface LeadCaptureDetail {
  channel: LeadChannel;
  /** Token của lead vừa tạo khi khách bấm nút; form popup gửi kèm để cập nhật đúng lead đó. */
  token: Promise<string | null>;
  /**
   * Link kênh chat (Zalo / Facebook / Messenger) mà khách định mở.
   * Có giá trị -> popup hiện TRƯỚC khi mở chat, kèm nút "Chat ... ngay".
   */
  continueUrl?: string;
}

/** Kênh mở tab mới (chat): hiện popup trước, khách tự chọn chat ngay hoặc để lại SĐT. */
const CHAT_CHANNELS: LeadChannel[] = ["ZALO", "FACEBOOK"];

const isAdminPath = () =>
  /^\/(admin|admin-radar|admin-login|login)(\/|$)/.test(window.location.pathname);

/**
 * Dùng cho onClick của các nút liên hệ (thẻ <a>).
 * - Zalo / Facebook / Messenger, lần đầu trong 24h và khách chưa gửi form: chặn mở chat,
 *   hiện popup có nút "Chat ... ngay" + form để lại SĐT.
 * - Các trường hợp khác (Hotline, đã bấm gần đây...): mở link như bình thường và ghi lead.
 */
export function handleContactClick(
  event: { preventDefault: () => void; currentTarget: { href?: string } },
  channel: LeadChannel
) {
  if (typeof window === "undefined") return;
  const href = event.currentTarget.href;
  const offerFirst =
    CHAT_CHANNELS.includes(channel) &&
    Boolean(href) &&
    !isAdminPath() &&
    !wasTrackedRecently(channel) &&
    !wasFormSubmittedRecently();

  if (offerFirst) {
    event.preventDefault();
    trackLandingLead(channel, undefined, { continueUrl: href });
    return;
  }
  trackLandingLead(channel);
}

/** Đã điền form trong khoảng này thì không hiện popup nữa. */
const FORM_SUBMITTED_SUPPRESS_MS = 7 * 24 * 60 * 60 * 1000;
const FORM_SUBMITTED_KEY = "lead_form_submitted_at";

/**
 * Gửi tương tác của khách trên website vào phễu (POST /api/radar/track-lead).
 *
 * - Có `info` (tên + SĐT từ form): luôn ghi thành 1 lead.
 * - Chỉ bấm nút (Hotline / Zalo / Facebook): mỗi trình duyệt chỉ tạo 1 lead cho
 *   mỗi kênh trong 24 giờ, rồi mở popup mời khách để lại số điện thoại.
 */
export function trackLandingLead(
  source: LeadChannel,
  info?: {
    fullName?: string;
    phone?: string;
    email?: string;
    eventType?: string;
    notes?: string;
  },
  options?: { continueUrl?: string }
) {
  if (typeof window === "undefined") return;
  // Admin bấm Hotline / Zalo trên header, footer trang quản trị: không phải khách -> không ghi lead
  if (isAdminPath()) return;

  const isClickOnly = !info?.fullName || !info?.phone;
  if (isClickOnly && wasTrackedRecently(source)) return;

  const token = fetch("/api/radar/track-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, ...info }),
    keepalive: true,
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { token?: string | null } | null) => data?.token ?? null)
    .catch((e) => {
      console.warn("Track lead error:", e);
      return null;
    });

  if (!isClickOnly) {
    markLeadFormSubmitted();
    return;
  }

  markTracked(source);
  if (!wasFormSubmittedRecently()) {
    window.dispatchEvent(
      new CustomEvent<LeadCaptureDetail>(LEAD_CAPTURE_EVENT, {
        detail: { channel: source, token, continueUrl: options?.continueUrl },
      })
    );
  }
}

/** Gọi sau khi khách gửi bất kỳ form nào để không làm phiền bằng popup nữa. */
export function markLeadFormSubmitted() {
  safeSet(FORM_SUBMITTED_KEY, String(Date.now()));
}

function wasFormSubmittedRecently() {
  return Date.now() - Number(safeGet(FORM_SUBMITTED_KEY) || 0) < FORM_SUBMITTED_SUPPRESS_MS;
}

const storageKey = (channel: LeadChannel) => `lead_click_tracked_${channel}`;

function wasTrackedRecently(channel: LeadChannel) {
  return Date.now() - Number(safeGet(storageKey(channel)) || 0) < CLICK_LEAD_DEDUPE_MS;
}

function markTracked(channel: LeadChannel) {
  safeSet(storageKey(channel), String(Date.now()));
}

function safeGet(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Trình duyệt chặn localStorage: bỏ qua
  }
}
