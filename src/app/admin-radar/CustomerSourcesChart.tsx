"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FunnelLeadItem } from "./ConversionFunnel";
import { LeadSource, LEAD_SOURCES, LEAD_SOURCE_LABELS } from "@/app/admin/_components/admin-types";
import { SOURCE_ENTRY_RULES, resolveLeadSource } from "@/lib/lead-funnel";

/** Nguồn khách = cột `source` trong bảng leads (chuẩn hóa bởi resolveLeadSource). */
export type CustomerSourceType = LeadSource;

interface CustomerSourcesChartProps {
  leads: FunnelLeadItem[];
  selectedSource?: CustomerSourceType | null;
  onSelectSource?: (source: CustomerSourceType | null) => void;
}

const SOURCE_STYLE: Record<CustomerSourceType, { color: string }> = {
  WEBSITE_FORM: { color: "#0A1E5E" },
  ZALO_OA: { color: "#2563EB" },
  HOTLINE: { color: "#C28E0E" },
  FACEBOOK: { color: "#475569" },
  REFERRAL: { color: "#059669" },
  OTHER: { color: "#94A3B8" },
};

/** 4 kênh website luôn hiển thị; Giới thiệu / Khác chỉ hiện khi có dữ liệu. */
const ALWAYS_SHOWN: CustomerSourceType[] = ["WEBSITE_FORM", "ZALO_OA", "HOTLINE", "FACEBOOK"];

export default function CustomerSourcesChart({
  leads,
  selectedSource: externalSelectedSource,
  onSelectSource: externalOnSelectSource,
}: CustomerSourcesChartProps) {
  const [internalSelectedSource, setInternalSelectedSource] =
    useState<CustomerSourceType | null>(null);
  const [hoveredSource, setHoveredSource] = useState<CustomerSourceType | null>(null);

  const selectedSource =
    externalSelectedSource !== undefined
      ? externalSelectedSource
      : internalSelectedSource;

  const handleSelect = (source: CustomerSourceType) => {
    const next = selectedSource === source ? null : source;
    if (externalOnSelectSource) {
      externalOnSelectSource(next);
    } else {
      setInternalSelectedSource(next);
    }
  };

  const sourceStats = useMemo(() => {
    const counts = Object.fromEntries(LEAD_SOURCES.map((s) => [s, 0])) as Record<
      CustomerSourceType,
      number
    >;
    const sampleNames = Object.fromEntries(LEAD_SOURCES.map((s) => [s, [] as string[]])) as Record<
      CustomerSourceType,
      string[]
    >;

    leads.forEach((lead) => {
      const src = resolveLeadSource(lead);
      counts[src] += 1;
      if (lead.full_name && sampleNames[src].length < 3) {
        sampleNames[src].push(lead.full_name);
      }
    });

    const total = leads.length;

    return LEAD_SOURCES.filter(
      (type) => ALWAYS_SHOWN.includes(type) || counts[type] > 0
    ).map((type) => {
      const count = counts[type];
      return {
        type,
        label: LEAD_SOURCE_LABELS[type],
        color: SOURCE_STYLE[type].color,
        description: SOURCE_ENTRY_RULES[type],
        recentNames: sampleNames[type],
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });
  }, [leads]);

  const totalLeads = leads.length;

  const conicGradient = useMemo(() => {
    if (totalLeads === 0) return "#e2e8f0";

    const nonEmpty = sourceStats.filter((s) => s.count > 0);
    const slices = nonEmpty.map((s, i) => {
      const start = nonEmpty.slice(0, i).reduce((sum, x) => sum + (x.count / totalLeads) * 100, 0);
      const end = start + (s.count / totalLeads) * 100;
      return `${s.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
    });

    return slices.length > 0 ? `conic-gradient(${slices.join(", ")})` : "#e2e8f0";
  }, [sourceStats, totalLeads]);

  const activeSource = hoveredSource ?? selectedSource;
  const activeData = sourceStats.find((s) => s.type === activeSource);

  return (
    <div
      className="flex h-full flex-col justify-between space-y-4"
      onMouseLeave={() => setHoveredSource(null)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Nguồn khách hàng</h2>
            <p className="mt-1 text-xs text-slate-500">
              Di chuột hoặc nhấp từng kênh để xem chi tiết
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
            {totalLeads} khách
          </span>
        </div>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div
            role="img"
            aria-label={`Biểu đồ nguồn khách hàng, tổng ${totalLeads} lead`}
            className="relative h-36 w-36 shrink-0 rounded-full transition-all duration-300"
            style={{ background: conicGradient }}
          >
            <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-2xs">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {activeData ? activeData.count : totalLeads}
              </span>
              <span className="max-w-[82px] truncate text-[10px] font-semibold text-slate-500">
                {activeData ? activeData.label : "Tổng khách"}
              </span>
            </div>
          </div>

          <div className="w-full space-y-1">
            {sourceStats.map((item) => {
              const isSelected = selectedSource === item.type;
              const isHovered = hoveredSource === item.type;

              return (
                <button
                  key={item.type}
                  type="button"
                  aria-pressed={isSelected}
                  onMouseEnter={() => setHoveredSource(item.type)}
                  onClick={() => handleSelect(item.type)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? "border-[#0A1E5E] bg-slate-50"
                      : isHovered
                        ? "border-slate-300 bg-slate-50/70"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate font-semibold text-slate-800">{item.label}</span>
                    <span className="text-[11px] text-slate-400">
                      ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>

                  <span className="font-bold text-slate-900 tabular-nums">
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chi tiết kênh khi di chuột hoặc nhấp chọn */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700">
        {activeData ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 font-semibold text-slate-900">
              <span>
                {activeData.label}: {activeData.count} khách ({activeData.percentage.toFixed(1)}%)
              </span>
              <Link
                href={`/admin/leads?source=${activeData.type}`}
                className="font-semibold text-[#0A1E5E] hover:underline"
              >
                Lọc danh sách
              </Link>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              {activeData.description}
            </p>
            {activeData.recentNames.length > 0 && (
              <p className="text-[11px] text-slate-500">
                Gần nhất: {activeData.recentNames.join(", ")}
              </p>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">
            Di chuột vào một kênh ở trên để xem quy tắc tiếp nhận và khách hàng gần nhất.
          </p>
        )}
      </div>
    </div>
  );
}
