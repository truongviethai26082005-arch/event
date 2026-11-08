"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, RefreshCw, Sparkles } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AdminLead } from "@/app/admin/_components/admin-types";
import { normalizePhone } from "@/lib/lead-funnel";

export const AI_SCORE_STYLE: Record<string, { label: string; className: string }> = {
  HOT: { label: "🔥 Nóng", className: "bg-rose-50 text-rose-700 ring-rose-200" },
  WARM: { label: "🌤 Ấm", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  COLD: { label: "❄️ Lạnh", className: "bg-sky-50 text-sky-700 ring-sky-200" },
};

interface LeadAiPanelProps {
  lead: AdminLead;
  /** Gọi sau khi AI phân tích xong / ghi nhận đã nhắn, để trang tải lại lead. */
  onChanged: () => void;
}

/**
 * Khối "AI phân tích" trong hồ sơ lead:
 *  - Tự phân tích khi mở lead có thông tin nhưng chưa được phân tích
 *  - Điểm nóng/ấm/lạnh, tóm tắt nhu cầu, thông tin cần hỏi thêm, gói gợi ý, việc cần làm
 *  - Tin nhắn soạn sẵn theo bước phễu hiện tại: 1 bấm = chép + ghi nhận đã nhắn
 */
export default function LeadAiPanel({ lead, onChanged }: LeadAiPanelProps) {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const autoRanFor = useRef<string | null>(null);

  const analyze = useCallback(async () => {
    setRunning(true);
    setError("");
    try {
      const res = await fetch(`/api/crm/leads/${lead.id}/analyze`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "AI phân tích thất bại.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI phân tích thất bại.");
    } finally {
      setRunning(false);
    }
  }, [lead.id, onChanged]);

  // Tự động: lead có SĐT (đã có thông tin) mà chưa phân tích -> phân tích ngay khi mở
  useEffect(() => {
    if (lead.ai_analyzed_at || !normalizePhone(lead.phone) || autoRanFor.current === lead.id) return;
    autoRanFor.current = lead.id;
    const t = window.setTimeout(() => void analyze(), 0);
    return () => window.clearTimeout(t);
  }, [lead.id, lead.ai_analyzed_at, lead.phone, analyze]);

  const copyAndLog = async () => {
    if (!lead.ai_message) return;
    try {
      await navigator.clipboard.writeText(lead.ai_message);
    } catch {
      setError("Trình duyệt không cho sao chép, hãy bôi đen và copy thủ công.");
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
    const supabase = createSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();
    await supabase.from("lead_activities").insert([
      { lead_id: lead.id, type: "message", actor: auth.user?.email || "Admin", note: `Gửi tin nhắn AI soạn:\n${lead.ai_message}` },
    ]);
    onChanged();
  };

  const score = lead.ai_score ? AI_SCORE_STYLE[lead.ai_score] : null;
  const needs = lead.ai_needs;
  const needRows = needs
    ? ([
        ["Loại sự kiện", needs.event_type],
        ["Thời gian", needs.event_date],
        ["Địa điểm", needs.location],
        ["Số khách", needs.guest_count],
        ["Ngân sách", needs.budget],
      ] as const).filter(([, v]) => v)
    : [];

  return (
    <section className="rounded-xl border border-violet-200 bg-gradient-to-b from-violet-50/80 to-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <Sparkles className="h-4 w-4 text-violet-600" /> AI phân tích
          {score && (
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${score.className}`}>{score.label}</span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => void analyze()}
          disabled={running}
          className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-xs font-bold text-violet-700 hover:bg-violet-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${running ? "animate-spin" : ""}`} />
          {running ? "Đang phân tích..." : lead.ai_analyzed_at ? "Phân tích lại" : "Phân tích AI"}
        </button>
      </div>

      {error && <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700">{error}</p>}

      {!lead.ai_analyzed_at ? (
        <p className="mt-2 text-xs text-slate-500">
          {running
            ? "AI đang đọc nhu cầu khách, chấm điểm và soạn tin nhắn..."
            : normalizePhone(lead.phone)
              ? "Chưa có kết quả."
              : "Lead chưa có thông tin khách. Gửi link form hoặc nhập SĐT trước, sau đó bấm “Phân tích AI”."}
        </p>
      ) : (
        <div className="mt-3 space-y-3 text-xs text-slate-700">
          {lead.ai_score_reason && <p className="text-slate-500">{lead.ai_score_reason}</p>}
          {lead.ai_summary && <p className="text-sm font-semibold text-slate-900">{lead.ai_summary}</p>}

          {needRows.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
              {needRows.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] uppercase tracking-wide text-slate-400">{k}</dt>
                  <dd className="font-semibold text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          {!!needs?.requirements?.length && (
            <p>
              <strong>Yêu cầu:</strong> {needs.requirements.join(" · ")}
            </p>
          )}
          {!!needs?.missing_info?.length && (
            <div className="rounded-lg bg-amber-50 p-2.5 text-amber-900">
              <strong>Cần hỏi thêm:</strong>
              <ul className="mt-1 list-inside list-disc">
                {needs.missing_info.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {lead.ai_suggested_package && (
            <p>
              <strong>📦 Gói gợi ý:</strong> {lead.ai_suggested_package}
            </p>
          )}
          {lead.ai_next_action && (
            <p className="rounded-lg bg-emerald-50 p-2.5 text-emerald-900">
              <strong>👉 Việc cần làm:</strong> {lead.ai_next_action}
            </p>
          )}

          {lead.ai_message && (
            <div>
              <p className="mb-1 font-bold text-slate-800">Tin nhắn soạn sẵn cho bước hiện tại</p>
              <p className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-2.5 text-sm leading-relaxed text-slate-700">
                {lead.ai_message}
              </p>
              <button
                type="button"
                onClick={() => void copyAndLog()}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-700"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Đã chép & ghi nhận đã nhắn" : "Chép tin nhắn & ghi nhận đã nhắn khách"}
              </button>
            </div>
          )}
          <p className="text-[10px] text-slate-400">
            Phân tích lúc {new Date(lead.ai_analyzed_at).toLocaleString("vi-VN")}. Đổi trạng thái hoặc có tương tác mới thì bấm
            “Phân tích lại” để AI soạn tin nhắn cho bước tiếp theo.
          </p>
        </div>
      )}
    </section>
  );
}
