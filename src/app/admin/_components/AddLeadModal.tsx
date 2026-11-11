"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  AdminLead,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  LeadSource,
  isLeadSource,
} from "@/app/admin/_components/admin-types";
import { EVENT_TYPE_OPTIONS, isValidPhone } from "@/lib/lead-form-options";
import { normalizePhone } from "@/lib/lead-funnel";

interface AddLeadModalProps {
  leads: AdminLead[];
  onClose: () => void;
  onCreated: () => void;
  onOpenExisting: (lead: AdminLead) => void;
}

const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800";

/** Sale thêm lead thủ công (khách gọi thẳng, nhắn Zalo cá nhân, được giới thiệu...). */
export default function AddLeadModal({ leads, onClose, onCreated, onOpenExisting }: AddLeadModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState<AdminLead | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") || "").trim();
    const source = String(form.get("source") || "OTHER");
    if (!isValidPhone(phone)) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }
    const existing = leads.find((l) => normalizePhone(l.phone) === normalizePhone(phone));
    if (existing && duplicate?.id !== existing.id) {
      setDuplicate(existing);
      setError("");
      return;
    }

    setSaving(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { error: insertError } = await supabase.from("leads").insert([
      {
        full_name: String(form.get("full_name") || "").trim(),
        phone,
        email: String(form.get("email") || "").trim() || null,
        company_name: String(form.get("company_name") || "").trim() || null,
        event_type: String(form.get("event_type") || EVENT_TYPE_OPTIONS[0]),
        notes: String(form.get("notes") || "").trim() || null,
        source: isLeadSource(source) ? source : ("OTHER" as LeadSource),
        status: "NEW",
      },
    ]);
    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    onCreated();
  };

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="add-lead-title" className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="add-lead-title" className="text-lg font-extrabold text-slate-900">
            Thêm lead thủ công
          </h2>
          <button type="button" aria-label="Đóng" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-slate-600">
              Họ tên *
              <input name="full_name" required className={inputClass} />
            </label>
            <label className="block text-xs font-semibold text-slate-600">
              Số điện thoại *
              <input name="phone" required inputMode="tel" className={inputClass} onChange={() => setDuplicate(null)} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-slate-600">
              Nguồn
              <select name="source" defaultValue="HOTLINE" className={`${inputClass} bg-white`}>
                {LEAD_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {LEAD_SOURCE_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-slate-600">
              Công ty
              <input name="company_name" className={inputClass} />
            </label>
          </div>
          <label className="block text-xs font-semibold text-slate-600">
            Loại sự kiện
            <select name="event_type" className={`${inputClass} bg-white`}>
              {EVENT_TYPE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Email
            <input name="email" type="email" className={inputClass} />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Nhu cầu / ghi chú
            <textarea name="notes" rows={3} className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </label>

          {duplicate && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
              Số này đã có ở lead <strong>{duplicate.full_name}</strong>.{" "}
              <button type="button" onClick={() => onOpenExisting(duplicate)} className="font-bold underline">
                Mở lead đó
              </button>{" "}
              hoặc bấm “Lưu lead” lần nữa để vẫn tạo lead mới.
            </div>
          )}
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}

          <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {saving ? "Đang lưu..." : "Lưu lead"}
          </button>
        </form>
      </section>
    </div>
  );
}
