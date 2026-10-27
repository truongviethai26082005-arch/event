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
} from "lucide-react";
import { FunnelLeadItem } from "./ConversionFunnel";

export type CustomerSourceType = "GG_FORM" | "ZALO" | "HOTLINE" | "FACEBOOK";

interface CustomerSourcesChartProps {
  leads: FunnelLeadItem[];
  selectedSource?: CustomerSourceType | null;
  onSelectSource?: (source: CustomerSourceType | null) => void;
}

interface SourceConfig {
  type: CustomerSourceType;
  label: string;
  shortLabel: string;
  color: string;
  bgLight: string;
  borderLight: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  crmQueryParam: string;
}

const SOURCES_CONFIG: Record<CustomerSourceType, SourceConfig> = {
  GG_FORM: {
    type: "GG_FORM",
    label: "GG Form",
    shortLabel: "GG Form",
    color: "#0A1E5E", // Brand Navy Blue
    bgLight: "bg-blue-50 text-blue-900 border-blue-200",
    borderLight: "border-blue-200",
    icon: FileText,
    description: "Khách hàng điền form nhận báo giá trực tuyến trên Landing Page & GG Form",
    crmQueryParam: "WEBSITE_FORM",
  },
  ZALO: {
    type: "ZALO",
    label: "Zalo",
    shortLabel: "Zalo",
    color: "#0068FF", // Zalo Official Blue
    bgLight: "bg-sky-50 text-sky-900 border-sky-200",
    borderLight: "border-sky-200",
    icon: MessageSquare,
    description: "Khách hàng nhấp vào nút Chat Zalo trực tiếp với chuyên viên tư vấn 1-1",
    crmQueryParam: "ZALO_OA",
  },
  HOTLINE: {
    type: "HOTLINE",
    label: "Hotline",
    shortLabel: "Hotline",
    color: "#D4AF37", // Gold
    bgLight: "bg-amber-50 text-amber-900 border-amber-200",
    borderLight: "border-amber-200",
    icon: PhoneCall,
    description: "Khách hàng bấm gọi qua đường dây nóng Hotline 24/7 (0844 198 333)",
    crmQueryParam: "HOTLINE",
  },
  FACEBOOK: {
    type: "FACEBOOK",
    label: "Facebook",
    shortLabel: "Facebook",
    color: "#1877F2", // Facebook Blue
    bgLight: "bg-indigo-50 text-indigo-900 border-indigo-200",
    borderLight: "border-indigo-200",
    icon: Share2,
    description: "Khách hàng liên hệ qua Fanpage Facebook Trường Hải Event & Travel",
    crmQueryParam: "REFERRAL",
  },
};

const SOURCE_ORDER: CustomerSourceType[] = ["GG_FORM", "ZALO", "HOTLINE", "FACEBOOK"];

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

  // Phân loại nguồn lead từ dữ liệu thật
  const sourceStats = useMemo(() => {
    const counts: Record<CustomerSourceType, number> = {
      GG_FORM: 0,
      ZALO: 0,
      HOTLINE: 0,
      FACEBOOK: 0,
    };

    leads.forEach((lead) => {
      const src = (lead.source || "").toUpperCase();
      const notes = (lead.notes || "").toUpperCase();
      const name = (lead.full_name || "").toUpperCase();

      if (src.includes("ZALO") || notes.includes("ZALO") || name.includes("ZALO")) {
        counts.ZALO += 1;
      } else if (
        src.includes("HOTLINE") ||
        notes.includes("HOTLINE") ||
        name.includes("HOTLINE") ||
        notes.includes("GỌI")
      ) {
        counts.HOTLINE += 1;
      } else if (
        src.includes("FACEBOOK") ||
        src.includes("FB") ||
        notes.includes("FACEBOOK") ||
        name.includes("FACEBOOK") ||
        src === "REFERRAL"
      ) {
        counts.FACEBOOK += 1;
      } else {
        // Mặc định các form điền trên website
        counts.GG_FORM += 1;
      }
    });

    const total = leads.length;

    return SOURCE_ORDER.map((type) => {
      const cfg = SOURCES_CONFIG[type];
      const count = counts[type];
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        ...cfg,
        count,
        percentage,
      };
    });
  }, [leads]);

  const totalLeads = leads.length;

  // Tạo Conic Gradient cho biểu đồ tròn Donut
  let cumulative = 0;
  const conicGradient = useMemo(() => {
    if (totalLeads === 0) return "#e2e8f0";

    const slices = sourceStats
      .filter((s) => s.count > 0)
      .map((s) => {
        const start = cumulative;
        const slicePct = (s.count / totalLeads) * 100;
        cumulative += slicePct;
        return `${s.color} ${start.toFixed(1)}% ${cumulative.toFixed(1)}%`;
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

        {/* Danh sách 4 nguồn: GG Form, Zalo, Hotline, Facebook */}
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
                href={`/admin/leads?source=${selectedData.crmQueryParam}`}
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
