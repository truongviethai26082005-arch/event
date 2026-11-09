"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import {
  BUDGET_OPTIONS,
  DEFAULT_BUDGET,
  DEFAULT_GUESTS,
  EVENT_TYPE_OPTIONS,
  GUEST_OPTIONS,
  isValidPhone,
} from "@/lib/lead-form-options";
import { landingInfo, markLeadFormSubmitted } from "@/app/admin-radar/lead-tracker";
import type { LeadChannel } from "@/lib/lead-funnel";

interface LeadCaptureFormProps {
  /** Token của lead có sẵn (lead tạo khi bấm nút, hoặc link sale gửi). Có token -> cập nhật lead đó. */
  token?: string | null | Promise<string | null>;
  /** Kênh khách đang liên hệ, dùng làm nguồn khi phải tạo lead mới. */
  channel?: LeadChannel;
  defaultValues?: { fullName?: string; phone?: string; eventType?: string };
  submitLabel?: string;
  onSuccess?: () => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#0A1E5E]";
const labelClass = "mb-1 block text-xs font-bold text-slate-700";

/**
 * Form rút gọn của "Nhận Kịch Bản & Báo Giá" (cùng bộ trường với form /dich-vu).
 * Gửi về POST /api/leads.
 */
export default function LeadCaptureForm({
  token,
  channel,
  defaultValues,
  submitLabel = "Gửi để nhận kịch bản & báo giá",
  onSuccess,
}: LeadCaptureFormProps) {
  const [form, setForm] = useState({
    fullName: defaultValues?.fullName || "",
    phone: defaultValues?.phone || "",
    email: "",
    eventType: defaultValues?.eventType || EVENT_TYPE_OPTIONS[0],
    estimatedGuests: DEFAULT_GUESTS as string,
    budgetRange: DEFAULT_BUDGET as string,
    eventDate: "",
    location: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.fullName.trim()) return setError("Vui lòng nhập họ tên.");
    if (!isValidPhone(form.phone)) return setError("Vui lòng nhập số điện thoại / Zalo hợp lệ (10 số).");

    setStatus("sending");
    try {
      const resolvedToken = await token;
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token: resolvedToken || undefined, channel, ...landingInfo() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Không gửi được thông tin.");
      }
      markLeadFormSubmitted();
      setStatus("done");
      onSuccess?.();
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? `${err.message} Quý khách vui lòng gọi Hotline 0844 198 333.`
          : "Có lỗi xảy ra, vui lòng gọi Hotline 0844 198 333."
      );
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <p className="mt-2 text-base font-black text-emerald-900">Đã nhận thông tin!</p>
        <p className="mt-1 text-sm text-emerald-800">
          Chuyên viên sẽ liên hệ số <strong>{form.phone}</strong> trong vòng 30 phút để gửi kịch bản &amp; báo giá.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label>
          <span className={labelClass}>
            Họ và tên <span className="text-rose-500">*</span>
          </span>
          <input
            required
            value={form.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            placeholder="VD: Anh Hoàng / Chị Thảo"
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>
            Số điện thoại / Zalo <span className="text-rose-500">*</span>
          </span>
          <input
            required
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set("phone")(e.target.value)}
            placeholder="VD: 0912 345 678"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Loại sự kiện / dịch vụ</span>
        <select value={form.eventType} onChange={(e) => set("eventType")(e.target.value)} className={inputClass}>
          {EVENT_TYPE_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Quy mô khách</span>
          <select value={form.estimatedGuests} onChange={(e) => set("estimatedGuests")(e.target.value)} className={inputClass}>
            {GUEST_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Ngân sách dự kiến</span>
          <select value={form.budgetRange} onChange={(e) => set("budgetRange")(e.target.value)} className={inputClass}>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Ngày dự kiến tổ chức</span>
          <input type="date" value={form.eventDate} onChange={(e) => set("eventDate")(e.target.value)} className={inputClass} />
        </label>
        <label>
          <span className={labelClass}>Địa điểm</span>
          <input
            value={form.location}
            onChange={(e) => set("location")(e.target.value)}
            placeholder="VD: Hà Nội, Hạ Long..."
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => set("email")(e.target.value)}
          placeholder="example@congty.com"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Yêu cầu thêm</span>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          placeholder="VD: cần sân khấu ngoài trời, MC, múa lân..."
          className={`${inputClass} resize-none`}
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#f3d977] to-[#D4AF37] px-5 py-3 text-sm font-black text-[#0A1E5E] shadow-lg transition hover:shadow-xl disabled:opacity-60"
      >
        {status === "sending" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A1E5E] border-t-transparent" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {status === "sending" ? "Đang gửi..." : submitLabel}
      </button>
      <p className="text-center text-[11px] text-slate-400">
        Thông tin chỉ dùng để lập dự toán, không gửi thư rác.
      </p>
    </form>
  );
}
