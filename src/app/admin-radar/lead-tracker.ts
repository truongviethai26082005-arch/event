"use client";

/**
 * Tiện ích theo dõi tương tác khách hàng từ Landing Page
 * Tự động gửi dữ liệu về phân hệ Radar và Supabase
 */
export function trackLandingLead(
  source: "GG_FORM" | "ZALO" | "HOTLINE" | "FACEBOOK",
  info?: {
    fullName?: string;
    phone?: string;
    eventType?: string;
    notes?: string;
  }
) {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/radar/track-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, ...info }),
      keepalive: true,
    }).catch((e) => {
      console.warn("Track lead error:", e);
    });
  } catch (err) {
    console.warn("Track lead failed:", err);
  }
}
