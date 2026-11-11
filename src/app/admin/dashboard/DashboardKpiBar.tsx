"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  AdminLead,
  formatCurrency,
  formatDate,
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
} from "@/app/admin/_components/admin-types";
import {
  getLeadStatus,
  leadValue,
  resolveLeadSource,
  RevenueSummary,
} from "@/lib/lead-funnel";

export type KpiKey = "new" | "pipeline" | "won" | "actual";

export interface DashboardMetrics extends RevenueSummary {
  leadsThisMonth: number;
  leadsLastMonth: number;
  change: number;
}

interface DashboardKpiBarProps {
  leads: AdminLead[];
  metrics: DashboardMetrics | null;
  now: Date | null;
  loading: boolean;
  latestQuoteTotals: Map<string, number>;
}

function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DashboardKpiBar({
  leads,
  metrics,
  now,
  loading,
  latestQuoteTotals,
}: DashboardKpiBarProps) {
  const [hoveredKey, setHoveredKey] = useState<KpiKey | null>(null);
  const [pinnedKey, setPinnedKey] = useState<KpiKey | null>(null);

  // Tính dữ liệu chi tiết khớp 100% với công thức tính chỉ số của dashboard
  const breakdown = useMemo(() => {
    if (!now) {
      return {
        newMonthLeads: [] as AdminLead[],
        newSourceSummary: "",
        pipelineLeads: [] as { lead: AdminLead; value: number; hasQuote: boolean }[],
        quotedCount: 0,
        negotiatingCount: 0,
        wonEvents: [] as {
          lead: AdminLead;
          contractValue: number;
          actualValue: number | null;
        }[],
        totalWonGuests: 0,
      };
    }

    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthStartIso = isoDate(startThisMonth);
    const monthEndIso = isoDate(startNextMonth);

    // 1. Khách mới tháng này
    const newMonthLeads = leads.filter((lead) => {
      const created = new Date(lead.created_at);
      return created >= startThisMonth && created < startNextMonth;
    });

    const sourceCounts = new Map<string, number>();
    newMonthLeads.forEach((lead) => {
      const label = LEAD_SOURCE_LABELS[resolveLeadSource(lead)];
      sourceCounts.set(label, (sourceCounts.get(label) || 0) + 1);
    });
    const newSourceSummary = Array.from(sourceCounts.entries())
      .map(([label, count]) => `${label}: ${count}`)
      .join(" · ");

    // 2. Đang báo giá / thương lượng (toàn bộ đường ống hiện hành)
    let quotedCount = 0;
    let negotiatingCount = 0;
    const pipelineLeads = leads
      .filter((lead) => {
        const status = getLeadStatus(lead);
        if (status === "QUOTED") quotedCount += 1;
        if (status === "NEGOTIATING") negotiatingCount += 1;
        return status === "QUOTED" || status === "NEGOTIATING";
      })
      .map((lead) => {
        const quote = latestQuoteTotals.get(lead.id);
        return {
          lead,
          value: leadValue(lead, quote),
          hasQuote: Boolean(quote && quote > 0),
        };
      })
      .sort((a, b) => b.value - a.value);

    // 3 & 4. Sự kiện đã chốt & Doanh thu thực tế trong tháng
    let totalWonGuests = 0;
    const wonEvents = leads
      .filter((lead) => {
        const day = String(lead.event_date || "").slice(0, 10);
        return (
          getLeadStatus(lead) === "WON" &&
          Boolean(day) &&
          lead.event_status !== "CANCELLED" &&
          day >= monthStartIso &&
          day < monthEndIso
        );
      })
      .map((lead) => {
        totalWonGuests += Number(lead.guest_count) || 0;
        const contractValue = leadValue(lead, latestQuoteTotals.get(lead.id));
        const actualValue =
          lead.actual_revenue !== null && lead.actual_revenue !== undefined
            ? Number(lead.actual_revenue) || 0
            : null;
        return { lead, contractValue, actualValue };
      })
      .sort((a, b) =>
        String(a.lead.event_date || "").localeCompare(String(b.lead.event_date || ""))
      );

    return {
      newMonthLeads,
      newSourceSummary,
      pipelineLeads,
      quotedCount,
      negotiatingCount,
      wonEvents,
      totalWonGuests,
    };
  }, [leads, now, latestQuoteTotals]);

  const cards: {
    key: KpiKey;
    title: string;
    value: string;
    subline: string;
    popoverAlign: string;
  }[] = [
    {
      key: "new",
      title: "Khách mới tháng này",
      value: loading ? "..." : String(metrics?.leadsThisMonth ?? 0),
      subline:
        metrics?.leadsLastMonth === 0 && (metrics?.leadsThisMonth ?? 0) > 0
          ? "Tháng trước chưa phát sinh"
          : `${metrics?.change ?? 0}% so với tháng trước (${metrics?.leadsLastMonth ?? 0})`,
      popoverAlign: "left-0",
    },
    {
      key: "pipeline",
      title: "Đang báo giá / thương lượng",
      value: loading ? "..." : formatCurrency(metrics?.pipelineValue ?? 0),
      subline: metrics?.pipelineCount
        ? `${metrics.pipelineCount} khách${
            metrics.pipelineWithoutValue ? ` · ${metrics.pipelineWithoutValue} chưa có giá` : ""
          }`
        : "Chưa có khách đang theo",
      popoverAlign: "left-0 lg:left-1/2 lg:-translate-x-1/2",
    },
    {
      key: "won",
      title: "Sự kiện đã chốt (tháng)",
      value: loading ? "..." : `${metrics?.wonEventsInMonth ?? 0} sự kiện`,
      subline: `Hợp đồng: ${formatCurrency(metrics?.wonRevenueInMonth ?? 0)}`,
      popoverAlign: "right-0 lg:right-auto lg:left-1/2 lg:-translate-x-1/2",
    },
    {
      key: "actual",
      title: "Doanh thu thực tế (tháng)",
      value: loading
        ? "..."
        : metrics?.actualCount
          ? formatCurrency(metrics.actualRevenueInMonth)
          : "Chưa nhập",
      subline: metrics?.wonEventsInMonth
        ? `${metrics.actualCount}/${metrics.wonEventsInMonth} sự kiện đã nhập · HĐ ${formatCurrency(metrics.wonRevenueInMonth)}`
        : "Nhập sau khi sự kiện hoàn tất",
      popoverAlign: "right-0",
    },
  ];

  const renderPopoverContent = (key: KpiKey) => {
    if (key === "new") {
      return (
        <div className="space-y-2.5">
          <div className="border-b border-slate-100 pb-2">
            <div className="text-xs font-bold text-slate-900">
              Khách hàng tiếp nhận trong tháng ({breakdown.newMonthLeads.length})
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              {breakdown.newSourceSummary || "Chưa có khách mới trong tháng này."}
            </div>
          </div>

          {breakdown.newMonthLeads.length === 0 ? (
            <p className="py-3 text-center text-xs text-slate-400">
              Chưa có dữ liệu khách mới trong tháng.
            </p>
          ) : (
            <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {breakdown.newMonthLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">
                      {lead.full_name}
                    </div>
                    <div className="truncate text-[11px] text-slate-500">
                      {LEAD_SOURCE_LABELS[resolveLeadSource(lead)]} ·{" "}
                      {LEAD_STATUS_LABELS[getLeadStatus(lead)]} ·{" "}
                      {formatDate(lead.created_at)}
                    </div>
                  </div>
                  <Link
                    href={`/admin/leads?lead=${lead.id}`}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
                  >
                    Xem
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (key === "pipeline") {
      return (
        <div className="space-y-2.5">
          <div className="border-b border-slate-100 pb-2">
            <div className="text-xs font-bold text-slate-900">
              Giá trị đang theo dõi ({breakdown.pipelineLeads.length} khách)
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Đã báo giá: {breakdown.quotedCount} · Thương lượng: {breakdown.negotiatingCount}
              {(metrics?.pipelineWithoutValue ?? 0) > 0
                ? ` · ${metrics?.pipelineWithoutValue} chưa có giá`
                : ""}
            </div>
          </div>

          {breakdown.pipelineLeads.length === 0 ? (
            <p className="py-3 text-center text-xs text-slate-400">
              Hiện không có khách ở bước báo giá / thương lượng.
            </p>
          ) : (
            <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {breakdown.pipelineLeads.map(({ lead, value, hasQuote }) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">
                      {lead.full_name}
                    </div>
                    <div className="truncate text-[11px] text-slate-500">
                      {LEAD_STATUS_LABELS[getLeadStatus(lead)]} ·{" "}
                      {value > 0
                        ? `${formatCurrency(value)}${hasQuote ? " (Báo giá)" : " (Ngân sách)"}`
                        : "Chưa nhập giá"}
                    </div>
                  </div>
                  <Link
                    href={`/admin/leads?lead=${lead.id}`}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
                  >
                    Xem
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (key === "won") {
      return (
        <div className="space-y-2.5">
          <div className="border-b border-slate-100 pb-2">
            <div className="text-xs font-bold text-slate-900">
              Sự kiện đã chốt tổ chức trong tháng ({breakdown.wonEvents.length})
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              Tổng hợp đồng: {formatCurrency(metrics?.wonRevenueInMonth ?? 0)} · Quy mô:{" "}
              {breakdown.totalWonGuests.toLocaleString("vi-VN")} khách
            </div>
          </div>

          {breakdown.wonEvents.length === 0 ? (
            <p className="py-3 text-center text-xs text-slate-400">
              Chưa có sự kiện nào tổ chức trong tháng này.
            </p>
          ) : (
            <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {breakdown.wonEvents.map(({ lead, contractValue }) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">
                      {lead.company_name || lead.full_name} — {lead.event_type}
                    </div>
                    <div className="truncate text-[11px] text-slate-500">
                      Ngày {formatDate(lead.event_date)} · {lead.location || "Chưa ghi địa điểm"} ·{" "}
                      {formatCurrency(contractValue)}
                    </div>
                  </div>
                  <Link
                    href={`/admin/leads?lead=${lead.id}`}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
                  >
                    Xem
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        <div className="border-b border-slate-100 pb-2">
          <div className="text-xs font-bold text-slate-900">
            Đối chiếu Hợp đồng &amp; Doanh thu thực tế
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            Hợp đồng: {formatCurrency(metrics?.wonRevenueInMonth ?? 0)} · Thực thu đã nhập:{" "}
            {formatCurrency(metrics?.actualRevenueInMonth ?? 0)}
          </div>
        </div>

        {breakdown.wonEvents.length === 0 ? (
          <p className="py-3 text-center text-xs text-slate-400">
            Chưa có sự kiện đã chốt trong tháng để đối chiếu.
          </p>
        ) : (
          <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {breakdown.wonEvents.map(({ lead, contractValue, actualValue }) => (
              <li
                key={lead.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-900">
                    {lead.company_name || lead.full_name}
                  </div>
                  <div className="truncate text-[11px] text-slate-500">
                    HĐ: {formatCurrency(contractValue)} · Thực thu:{" "}
                    <span className="font-semibold text-slate-800">
                      {actualValue !== null ? formatCurrency(actualValue) : "Chưa nhập"}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/leads?lead=${lead.id}`}
                  className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
                >
                  Cập nhật
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <section aria-label="Chỉ số tháng này" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const isOpen = hoveredKey === card.key || (hoveredKey === null && pinnedKey === card.key);
        const isPinned = pinnedKey === card.key;

        return (
          <div
            key={card.key}
            className="relative"
            onMouseEnter={() => setHoveredKey(card.key)}
            onMouseLeave={() =>
              setHoveredKey((prev) => (prev === card.key ? null : prev))
            }
          >
            <button
              type="button"
              onClick={() =>
                setPinnedKey((prev) => (prev === card.key ? null : card.key))
              }
              aria-expanded={isOpen}
              className={`group w-full h-full rounded-2xl border bg-white p-5 text-left transition-all cursor-pointer ${
                isOpen
                  ? "border-[#0A1E5E] shadow-md ring-1 ring-[#0A1E5E]/20"
                  : "border-slate-200 shadow-2xs hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {card.title}
                </span>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#0A1E5E]">
                  {isPinned ? "Đang ghim" : "Chi tiết"}
                </span>
              </div>

              <div className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums truncate">
                {card.value}
              </div>

              <p className="mt-2 text-xs text-slate-500 leading-snug line-clamp-1">
                {card.subline}
              </p>
            </button>

            {isOpen && (
              <div
                className={`absolute top-full z-40 w-[330px] sm:w-[390px] pt-2 ${card.popoverAlign}`}
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-slate-950/5 space-y-3">
                  {renderPopoverContent(card.key)}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                    <span>
                      {isPinned ? "Đã ghim bảng chi tiết" : "Di chuột sang thẻ khác để xem"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPinnedKey(null);
                        setHoveredKey(null);
                      }}
                      className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

