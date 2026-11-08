"use client";

import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import {
  LEAD_CAPTURE_EVENT,
  LeadCaptureDetail,
} from "@/app/admin-radar/lead-tracker";

const CHANNEL_TEXT: Record<LeadCaptureDetail["channel"], string> = {
  HOTLINE: "Nếu chưa kịp gọi hoặc máy bận",
  ZALO: "Trong lúc chờ chuyên viên trả lời Zalo",
  FACEBOOK: "Trong lúc chờ chuyên viên trả lời tin nhắn",
  GG_FORM: "Để được tư vấn nhanh nhất",
};

/**
 * Popup hiện sau khi khách bấm Hotline / Zalo / Facebook / Messenger.
 * Không chặn khách: kênh chat / cuộc gọi vẫn mở bình thường, popup chỉ nằm lại trên website.
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

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && setDetail(null)}
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
            onClick={() => setDetail(null)}
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
            {CHANNEL_TEXT[detail.channel]}, quý khách để lại số điện thoại để chuyên viên chủ động liên hệ
            và gửi báo giá đúng nhu cầu.
          </p>
        </div>
        <div className="px-5 py-5 sm:px-7">
          <LeadCaptureForm
            token={detail.token}
            channel={detail.channel}
            onSuccess={() => window.setTimeout(() => setDetail(null), 3500)}
          />
          <button
            type="button"
            onClick={() => setDetail(null)}
            className="mt-2 w-full text-center text-xs font-semibold text-slate-500 underline hover:text-slate-700"
          >
            Bỏ qua, tôi sẽ trao đổi qua tin nhắn / cuộc gọi
          </button>
        </div>
      </section>
    </div>
  );
}
