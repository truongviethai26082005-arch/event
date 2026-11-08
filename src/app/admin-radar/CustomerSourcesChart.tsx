"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  MessageSquare,
  PhoneCall,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
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

const SOURCE_STYLE: Record<
  CustomerSourceType,
  { color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  WEBSITE_FORM: { color: "#0A1E5E", icon: FileText },
  ZALO_OA: { color: "#0068FF", icon: MessageSquare },
  HOTLINE: { color: "#D4AF37", icon: PhoneCall },
  FACEBOOK: { color: "#1877F2", icon: Share2 },
  REFERRAL: { color: "#22C55E", icon: Users },
  OTHER: { color: "#94A3B8", icon: Sparkles },
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
    leads.forEach((lead) => {
      counts[resolveLeadSource(lead)] += 1;
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
        icon: SOURCE_STYLE[type].icon,
        description: SOURCE_ENTRY_RULES[type],
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });
  }, [leads]);

  const totalLeads = leads.length;

  // Tạo Conic Gradient cho biểu đồ tròn Donut
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

  const selectedData = sourceStats.find((s) => s.type === selectedSource);

  return (
    <div className="space-y-4">
      {/* Tiêu đề card */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Nguồn khách hàng</h2>
          <p className="mt-0.5 text-xs text-slate-500">Phân bổ theo kênh tiếp nhận thực tế</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Real-time
        </span>
      </div>

      {/* Biểu đồ Donut & Danh sách 4 nguồn */}
      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        {/* Biểu đồ Donut trực quan */}
        <div
          role="img"
          aria-label={`Biểu đồ nguồn khách hàng, tổng ${totalLeads} lead`}
          className="relative h-36 w-36 shrink-0 rounded-full shadow-inner transition-all duration-300 sm:h-40 sm:w-40"
          style={{ background: conicGradient }}
        >
          {/* Lỗ donut ở giữa hiển thị tổng số lead */}
          <div className="absolute inset-4 sm:inset-5 flex flex-col items-center justify-center rounded-full bg-white text-center shadow-xs">
            <span className="text-2xl font-black text-slate-900">
              {selectedData ? selectedData.count : totalLeads}
            </span>
            <span className="text-[10px] font-bold text-slate-500 max-w-[80px] truncate">
              {selectedData ? selectedData.label : "Tổng lead"}
            </span>
          </div>
        </div>

        {/* Danh sách nguồn vào phễu */}
        <div className="w-full space-y-1.5">
          {sourceStats.map((item) => {
            const isSelected = selectedSource === item.type;
            const Icon = item.icon;

            return (
              <button
                key={item.type}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelect(item.type)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition-all duration-200 ${
                  isSelected
                    ? "bg-amber-50 ring-2 ring-amber-300 shadow-sm"
                    : "hover:bg-slate-50 border border-transparent hover:border-slate-200"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white shadow-xs"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="truncate">
                    <span className="font-bold text-slate-800">{item.label}</span>
                    <span className="ml-1.5 text-[10px] text-slate-400">
                      ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>

                <span className="font-extrabold text-slate-900 text-sm">
                  {item.count}
                </span>
              </button>
            );
          })}

          {/* Chi tiết kênh khi nhấp chọn */}
          {selectedData && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-2.5 text-xs text-slate-700 animate-fadeIn space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-amber-900">{selectedData.label}: {selectedData.count} khách</span>
                <span className="text-[10px] text-amber-700">Chiếm {selectedData.percentage.toFixed(1)}%</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                {selectedData.description}
              </p>
              <Link
                href={`/admin/leads?source=${selectedData.type}`}
                className="inline-flex items-center gap-1 font-bold text-[#0A1E5E] hover:underline text-[11px] pt-1"
              >
                <span>Xem danh sách lead nguồn này</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
