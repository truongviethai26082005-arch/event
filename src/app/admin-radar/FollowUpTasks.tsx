"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlarmClock, ArrowRight, CheckCircle2 } from "lucide-react";
import { AdminLead, LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS } from "@/app/admin/_components/admin-types";
import { FOLLOW_UP_RULES, formatDuration, getFollowUpTasks, normalizePhone, resolveLeadSource } from "@/lib/lead-funnel";
import { AI_SCORE_STYLE } from "@/app/admin/_components/LeadAiPanel";

/** Lead nóng được xử lý trước (tối ưu thời gian sale), sau đó mới tới mức quá hạn. */
const SCORE_PRIORITY: Record<string, number> = { HOT: 0, WARM: 1, COLD: 2 };

const MAX_ROWS = 8;

/**
 * "Việc cần làm": lead quá hạn chăm sóc theo FOLLOW_UP_RULES
 * (Mới > 30 phút, Đã báo giá > 3 ngày, Đang thương lượng > 7 ngày không liên hệ).
 */
export default function FollowUpTasks({ leads, crmReady }: { leads: AdminLead[]; crmReady: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  const tasks = useMemo(
    () =>
      now === null
        ? []
        : getFollowUpTasks(leads, now).sort(
            (a, b) =>
              (SCORE_PRIORITY[a.lead.ai_score || ""] ?? 1) - (SCORE_PRIORITY[b.lead.ai_score || ""] ?? 1) ||
              b.overdueMs - a.overdueMs
          ),
    [leads, now]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
            <AlarmClock className="h-5 w-5 text-rose-600" /> Việc cần làm
            {tasks.length > 0 && (
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                {tasks.length} lead quá hạn
              </span>
            )}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Hạn chăm sóc: Mới {formatDuration(FOLLOW_UP_RULES.NEW!.afterMs)} · Đã báo giá{" "}
            {formatDuration(FOLLOW_UP_RULES.QUOTED!.afterMs)} · Thương lượng{" "}
            {formatDuration(FOLLOW_UP_RULES.NEGOTIATING!.afterMs)} kể từ lần liên hệ gần nhất.
          </p>
        </div>
      </div>

      {!crmReady && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Chưa chạy migration CRM nên hệ thống chưa biết lần liên hệ gần nhất; hạn đang tính từ ngày tạo lead.
        </p>
      )}

      {tasks.length === 0 ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Không có lead nào quá hạn chăm sóc.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {tasks.slice(0, MAX_ROWS).map(({ lead, action, overdueMs, stale }) => (
            <li key={lead.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {lead.full_name}
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {LEAD_STATUS_LABELS[lead.status]}
                  </span>
                  {lead.ai_score && AI_SCORE_STYLE[lead.ai_score] && (
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${AI_SCORE_STYLE[lead.ai_score].className}`}>
                      {AI_SCORE_STYLE[lead.ai_score].label}
                    </span>
                  )}
                </p>
                <p className={`mt-0.5 text-xs ${stale ? "text-rose-700" : "text-slate-600"}`}>{action}</p>
                {!stale && lead.ai_next_action && (
                  <p className="mt-0.5 text-xs text-violet-700">🤖 {lead.ai_next_action}</p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Quá hạn {formatDuration(overdueMs)} · {LEAD_SOURCE_LABELS[resolveLeadSource(lead)]}
                  {normalizePhone(lead.phone) ? ` · ${lead.phone}` : " · chưa có SĐT"}
                </p>
              </div>
              <Link
                href={`/admin/leads?lead=${lead.id}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
              >
                Xử lý <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {tasks.length > MAX_ROWS && (
        <Link href="/admin/leads" className="mt-2 inline-block text-xs font-bold text-[#0A1E5E] hover:underline">
          Xem thêm {tasks.length - MAX_ROWS} lead khác →
        </Link>
      )}
    </section>
  );
}
