"use client";

import { useEffect, useState } from "react";
import { Clock, MessageCircle, X } from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import {
  LEAD_CAPTURE_EVENT,
  LeadCaptureDetail,
} from "@/app/admin-radar/lead-tracker";

/** Tên kênh chat theo link khách định mở. */
function chatName(url: string, channel: LeadCaptureDetail["channel"]) {
  if (/m\.me|messenger/i.test(url)) return "Messenger";
  if (channel === "ZALO" || /zalo/i.test(url)) return "Zalo";
  return "Facebook";
}

/**
 * Popup "Nhận Kịch Bản & Báo Giá".
 *
 * - Zalo / Facebook / Messenger (có continueUrl): hiện TRƯỚC khi mở chat. Khách chọn
 *   "Chat ... ngay" (không cần điền) hoặc để lại SĐT để được gọi lại.
 * - Hotline: hiện SAU khi bấm gọi (cuộc gọi không mở tab mới nên khách vẫn thấy).
 * Khách điền form -> cập nhật đúng lead vừa tạo khi bấm nút (qua token).
 */
export default function LeadCapturePopup() {
  const [detail, setDetail] = useState<LeadCaptureDetail | null>(null);

  useEffect(() => {
    const open = (event: Event) => {
      setDetail((event as CustomEvent<LeadCaptureDetail>).detail);
    };
    window.addEventListener(LEAD_CAPTURE_EVENT, open);
    return () => window.removeEventListener(LEAD_CAPTURE_EVENT, open);
  }, []);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDetail(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  if (!detail) return null;

  const close = () => setDetail(null);
  const chat = detail.continueUrl ? chatName(detail.continueUrl, detail.channel) : null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-capture-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="relative bg-[#0A1E5E] px-5 pb-5 pt-6 text-white sm:px-7">
          <button
            type="button"
            aria-label="Đóng"
            onClick={close}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#D4AF37]">
            <Clock className="h-3.5 w-3.5" /> Phản hồi trong 30 phút
          </span>
          <h2 id="lead-capture-title" className="mt-3 text-xl font-black leading-tight">
            Nhận Kịch Bản &amp; Báo Giá Miễn Phí
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            {chat
              ? `Chat ${chat} với chuyên viên ngay, hoặc để lại số điện thoại để được gọi lại và nhận báo giá đúng nhu cầu.`
              : "Nếu chưa kịp gọi hoặc máy bận, quý khách để lại số điện thoại để chuyên viên chủ động liên hệ và gửi báo giá."}
          </p>
        </div>

        <div className="px-5 py-5 sm:px-7">
          {chat && detail.continueUrl && (
            <>
              <a
                href={detail.continueUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0068FF] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#0057d6]"
              >
                <MessageCircle className="h-4 w-4" /> Chat {chat} ngay
              </a>
              <div className="my-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                hoặc để lại số, chuyên viên gọi lại
                <span className="h-px flex-1 bg-slate-200" />
              </div>
            </>
          )}

          <LeadCaptureForm
            token={detail.token}
            channel={detail.channel}
            // Có nút chat thì giữ popup để khách vẫn bấm chat được sau khi gửi
            onSuccess={chat ? undefined : () => window.setTimeout(close, 3500)}
          />

          {!chat && (
            <button
              type="button"
              onClick={close}
              className="mt-2 w-full text-center text-xs font-semibold text-slate-500 underline hover:text-slate-700"
            >
              Bỏ qua, tôi sẽ gọi lại sau
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
