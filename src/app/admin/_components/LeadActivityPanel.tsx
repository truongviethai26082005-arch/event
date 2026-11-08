"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Clock,
  Copy,
  FileText,
  History,
  Link2,
  MessageSquare,
  Phone,
  StickyNote,
  Users,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  AdminLead,
  LEAD_STATUS_LABELS,
  LeadActivity,
  LeadQuote,
  formatCurrency,
  isLeadStatus,
} from "@/app/admin/_components/admin-types";
import {
  ACTIVITY_LABELS,
  LeadActivityType,
  MANUAL_ACTIVITY_TYPES,
  STAGE_GUIDE,
} from "@/lib/lead-funnel";

const ACTIVITY_ICONS: Partial<Record<LeadActivityType, typeof Phone>> = {
  call: Phone,
  message: MessageSquare,
  meeting: Users,
  note: StickyNote,
  quote_sent: FileText,
};

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusLabel = (value?: string | null) =>
  value && isLeadStatus(value) ? LEAD_STATUS_LABELS[value] : value || "";

interface LeadActivityPanelProps {
  lead: AdminLead;
  /** Tăng số này để panel tải lại lịch sử (sau khi lưu hồ sơ / báo giá). */
  refreshKey: number;
  /** Gọi sau khi ghi nhận liên hệ để trang tải lại lead (last_contacted_at). */
  onLeadTouched: () => void;
  onOpenQuote: (quote: LeadQuote) => void;
}

/**
 * Khối "Tiến trình & lịch sử" trong hồ sơ lead:
 *  - Mốc thời gian từng giai đoạn (ghi tự động khi đổi trạng thái)
 *  - Ghi nhận liên hệ (gọi / nhắn / gặp / ghi chú)
 *  - Link form gửi khách qua Zalo / Messenger
 *  - Lịch sử báo giá theo phiên bản
 *  - Nhật ký hoạt động
 */
export default function LeadActivityPanel({ lead, refreshKey, onLeadTouched, onOpenQuote }: LeadActivityPanelProps) {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [quotes, setQuotes] = useState<LeadQuote[]>([]);
  const [logType, setLogType] = useState<LeadActivityType>("call");
  const [logNote, setLogNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"link" | "message" | null>(null);

  const load = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const [act, quo] = await Promise.all([
      supabase.from("lead_activities").select("*").eq("lead_id", lead.id).order("created_at", { ascending: false }),
      supabase.from("lead_quotes").select("*").eq("lead_id", lead.id).order("version", { ascending: false }),
    ]);
    if (act.error || quo.error) {
      setError((act.error || quo.error)?.message || "Không tải được lịch sử.");
      return;
    }
    setError("");
    setActivities((act.data ?? []) as LeadActivity[]);
    setQuotes((quo.data ?? []) as LeadQuote[]);
  }, [lead.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, refreshKey]);

  const logActivity = async () => {
    if (logType === "note" && !logNote.trim()) {
      setError("Nhập nội dung ghi chú.");
      return;
    }
    setSaving(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("lead_activities").insert([
      {
        lead_id: lead.id,
        type: logType,
        actor: auth.user?.email || "Admin",
        note: logNote.trim() || null,
      },
    ]);
    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setLogNote("");
    await load();
    onLeadTouched();
  };

  const formLink =
    typeof window !== "undefined" && lead.form_token
      ? `${window.location.origin}/dich-vu/nhan-bao-gia?ma=${lead.form_token}`
      : "";
  const formMessage = [
    `Dạ Trường Hải Event & Travel cảm ơn anh/chị đã liên hệ ạ!`,
    `Để chuyên viên gửi kịch bản và báo giá sát nhu cầu nhất, anh/chị vui lòng điền nhanh thông tin sự kiện (khoảng 1 phút) tại đây:`,
    formLink,
    `Bên em sẽ phản hồi trong vòng 30 phút ạ.`,
  ].join("\n");

  const copy = async (text: string, kind: "link" | "message") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      setError("Trình duyệt không cho sao chép, hãy bôi đen và copy thủ công.");
    }
  };

  const milestones: { label: string; at?: string | null; hint?: string }[] = [
    { label: STAGE_GUIDE.NEW.funnelLabel, at: lead.created_at },
    { label: STAGE_GUIDE.QUOTED.funnelLabel, at: lead.quoted_at },
    { label: STAGE_GUIDE.NEGOTIATING.funnelLabel, at: lead.negotiating_at },
    { label: STAGE_GUIDE.WON.funnelLabel, at: lead.won_at },
  ];
  if (lead.status === "LOST") {
    milestones.push({
      label: "Không thành",
      at: lead.lost_at,
      hint: [lead.lost_stage ? `rơi ở bước ${statusLabel(lead.lost_stage)}` : "", lead.lost_reason || ""]
        .filter(Boolean)
        .join(" · "),
    });
  }

  return (
    <div className="space-y-5">
      {/* Mốc thời gian giai đoạn */}
      <section className="rounded-xl border border-slate-200 p-4">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <Clock className="h-4 w-4 text-[#A78113]" /> Mốc thời gian phễu
        </h3>
        <ol className="mt-3 space-y-2 text-xs">
          {milestones.map((m) => (
            <li key={m.label} className="flex items-start justify-between gap-3">
              <span className={`font-semibold ${m.at ? "text-slate-800" : "text-slate-400"}`}>
                {m.at ? "●" : "○"} {m.label}
                {m.hint && <span className="ml-1 font-normal text-slate-500">({m.hint})</span>}
              </span>
              <span className={m.at ? "text-slate-600" : "text-slate-400"}>{m.at ? formatDateTime(m.at) : "Chưa tới"}</span>
            </li>
          ))}
          <li className="flex items-start justify-between gap-3 border-t border-slate-100 pt-2">
            <span className="font-semibold text-slate-700">Liên hệ gần nhất</span>
            <span className={lead.last_contacted_at ? "text-slate-600" : "text-amber-600"}>
              {lead.last_contacted_at ? formatDateTime(lead.last_contacted_at) : "Chưa liên hệ"}
            </span>
          </li>
        </ol>
      </section>

      {/* Ghi nhận liên hệ */}
      <section className="rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-extrabold text-slate-900">Ghi nhận liên hệ với khách</h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {MANUAL_ACTIVITY_TYPES.map((type) => {
            const Icon = ACTIVITY_ICONS[type] || StickyNote;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setLogType(type)}
                aria-pressed={logType === type}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                  logType === type
                    ? "border-[#0A1E5E] bg-[#0A1E5E] text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {ACTIVITY_LABELS[type]}
              </button>
            );
          })}
        </div>
        <textarea
          rows={2}
          value={logNote}
          onChange={(e) => setLogNote(e.target.value)}
          placeholder="Kết quả: khách cần sân khấu ngoài trời, hẹn gửi báo giá trước 17h..."
          className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A1E5E]"
        />
        <button
          type="button"
          onClick={() => void logActivity()}
          disabled={saving}
          className="mt-2 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : `Lưu: ${ACTIVITY_LABELS[logType]}`}
        </button>
      </section>

      {/* Link form gửi khách */}
      <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <Link2 className="h-4 w-4 text-blue-700" /> Gửi form nhận kịch bản &amp; báo giá cho khách
        </h3>
        <p className="mt-1 text-xs text-slate-600">
          Dán tin nhắn này vào Zalo / Messenger. Khách điền xong, thông tin tự cập nhật vào lead này.
        </p>
        {lead.form_submitted_at && (
          <p className="mt-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
            ✓ Khách đã điền form lúc {formatDateTime(lead.form_submitted_at)}
          </p>
        )}
        {formLink ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copy(formMessage, "message")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              {copied === "message" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === "message" ? "Đã chép tin nhắn" : "Chép tin nhắn kèm link"}
            </button>
            <button
              type="button"
              onClick={() => void copy(formLink, "link")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700"
            >
              {copied === "link" ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
              {copied === "link" ? "Đã chép link" : "Chỉ chép link"}
            </button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-amber-700">Lead này chưa có mã form (cần chạy migration CRM).</p>
        )}
      </section>

      {/* Lịch sử báo giá */}
      <section className="rounded-xl border border-slate-200 p-4">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <FileText className="h-4 w-4 text-[#A78113]" /> Báo giá đã gửi ({quotes.length})
        </h3>
        {quotes.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">
            Chưa có. Báo giá được lưu tự động khi bấm “Chép gửi Zalo”, “Soạn Email” hoặc “In / Lưu PDF”.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100 text-xs">
            {quotes.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-2 py-2">
                <span>
                  <strong className="text-slate-900">v{q.version}</strong> · {formatCurrency(Number(q.total))}
                  <span className="block text-slate-500">
                    {formatDateTime(q.created_at)}
                    {q.sent_via ? ` · ${q.sent_via}` : ""}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onOpenQuote(q)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 font-bold text-slate-700 hover:border-[#0A1E5E]"
                >
                  Mở lại
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Nhật ký */}
      <section className="rounded-xl border border-slate-200 p-4">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <History className="h-4 w-4 text-[#A78113]" /> Nhật ký hoạt động
        </h3>
        {error && <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700">{error}</p>}
        {activities.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">Chưa có hoạt động.</p>
        ) : (
          <ol className="mt-3 space-y-3 border-l-2 border-slate-100 pl-4">
            {activities.map((a) => (
              <li key={a.id} className="relative text-xs">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
                <p className="font-bold text-slate-800">
                  {ACTIVITY_LABELS[a.type as LeadActivityType] || a.type}
                  {a.type === "status_change" && (
                    <span className="font-semibold text-slate-600">
                      : {statusLabel(a.from_status)} → {statusLabel(a.to_status)}
                    </span>
                  )}
                </p>
                {a.note && <p className="mt-0.5 whitespace-pre-wrap text-slate-600">{a.note}</p>}
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {formatDateTime(a.created_at)}
                  {a.actor ? ` · ${a.actor}` : ""}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
