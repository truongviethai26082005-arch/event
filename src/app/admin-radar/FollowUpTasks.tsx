"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AdminLead,
  formatCurrency,
  formatDate,
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
} from "@/app/admin/_components/admin-types";
import {
  FOLLOW_UP_RULES,
  formatDuration,
  getFollowUpTasks,
  normalizePhone,
  resolveLeadSource,
} from "@/lib/lead-funnel";

/** Lead nóng được xử lý trước (tối ưu thời gian sale), sau đó mới tới mức quá hạn. */
const SCORE_PRIORITY: Record<string, number> = { HOT: 0, WARM: 1, COLD: 2 };

const SCORE_LABEL: Record<string, string> = {
  HOT: "Nóng",
  WARM: "Ấm",
  COLD: "Lạnh",
};

/**
 * "Việc cần làm": lead quá hạn chăm sóc theo FOLLOW_UP_RULES
 * (Mới > 30 phút, Đã báo giá > 3 ngày, Đang thương lượng > 7 ngày không liên hệ).
 */
export default function FollowUpTasks({ leads, crmReady }: { leads: AdminLead[]; crmReady: boolean }) {
  const [now, setNow] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const hoveredTask = useMemo(
    () => tasks.find((t) => t.lead.id === hoveredId) ?? null,
    [tasks, hoveredId]
  );

  return (
    <section className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">Việc cần làm hôm nay</h2>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                  tasks.length > 0
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {tasks.length > 0 ? `${tasks.length} quá hạn` : "Đúng hạn"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Hạn chăm sóc: Mới {formatDuration(FOLLOW_UP_RULES.NEW!.afterMs)} · Báo giá{" "}
              {formatDuration(FOLLOW_UP_RULES.QUOTED!.afterMs)} · Thương lượng{" "}
              {formatDuration(FOLLOW_UP_RULES.NEGOTIATING!.afterMs)}
            </p>
          </div>
          {tasks.length > 0 && (
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-slate-600 hover:text-[#0A1E5E]"
            >
              Xem tất cả ({tasks.length})
            </Link>
          )}
        </div>

        {!crmReady && (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Chưa chạy migration CRM nên hạn đang tính từ ngày tạo lead.
          </p>
        )}

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-8 text-center text-xs text-slate-500">
            Hiện không có khách hàng nào quá hạn chăm sóc.
          </div>
        ) : (
          <ul className="max-h-[300px] divide-y divide-slate-100 overflow-y-auto pr-1">
            {tasks.slice(0, 12).map(({ lead, action, overdueMs, stale }) => (
              <li
                key={lead.id}
                onMouseEnter={() => setHoveredId(lead.id)}
                onMouseLeave={() => setHoveredId((prev) => (prev === lead.id ? null : prev))}
                className={`flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition ${
                  hoveredId === lead.id ? "bg-slate-50" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate text-sm font-bold text-slate-900">
                      {lead.full_name}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {LEAD_STATUS_LABELS[lead.status]}
                    </span>
                    {lead.ai_score && SCORE_LABEL[lead.ai_score] && (
                      <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {SCORE_LABEL[lead.ai_score]}
                      </span>
                    )}
                  </div>
                  <p className={`mt-0.5 truncate text-xs ${stale ? "font-medium text-rose-700" : "text-slate-600"}`}>
                    {action}
                  </p>
                  {!stale && lead.ai_next_action && (
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      Đề xuất: {lead.ai_next_action}
                    </p>
                  )}
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Quá hạn {formatDuration(overdueMs)} · {LEAD_SOURCE_LABELS[resolveLeadSource(lead)]}
                    {normalizePhone(lead.phone) ? ` · ${lead.phone}` : " · chưa có SĐT"}
                  </p>
                </div>

                <Link
                  href={`/admin/leads?lead=${lead.id}`}
                  className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
                >
                  Xử lý
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chi tiết nhanh khi di chuột vào 1 khách hàng quá hạn */}
      {hoveredTask && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-slate-900">
            <span>
              {hoveredTask.lead.company_name || hoveredTask.lead.full_name} ·{" "}
              {hoveredTask.lead.event_type || "Sự kiện"}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Ngân sách: {hoveredTask.lead.budget ? formatCurrency(hoveredTask.lead.budget) : "Chưa khai"} · Ngày:{" "}
              {formatDate(hoveredTask.lead.event_date)}
            </span>
          </div>
          {hoveredTask.lead.notes && (
            <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">
              Ghi chú: {hoveredTask.lead.notes}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
