"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Mail,
  MousePointerClick,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  LeadStatus,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
} from "@/app/admin/_components/admin-types";

export interface FunnelLeadItem {
  id?: string;
  status?: string | null;
  full_name?: string;
  phone?: string | null;
  email?: string | null;
  event_type?: string | null;
  notes?: string | null;
  created_at?: string;
  budget?: number | null;
  source?: string | null;
}

interface ConversionFunnelProps {
  leads: FunnelLeadItem[];
  selectedStage?: LeadStatus | null;
  onSelectStage?: (status: LeadStatus | null) => void;
  showCardWrapper?: boolean;
}

interface StageFunnelData {
  status: LeadStatus;
  label: string;
  count: number;
  pctOfTotal: number;
  stepConversionRate: number; // Tỷ lệ chuyển tiếp từ giai đoạn trước (%)
  nextConversionRate: number; // Tỷ lệ chuyển tiếp sang giai đoạn kế tiếp (%)
  color: {
    start: string;
    end: string;
    textColor: string;
    bgBadge: string;
    border: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STAGE_CONFIG: Record<
  LeadStatus,
  {
    gradientStart: string;
    gradientEnd: string;
    textColor: string;
    bgBadge: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  NEW: {
    gradientStart: "#2563EB", // Blue 600
    gradientEnd: "#1D4ED8", // Blue 700
    textColor: "text-blue-700",
    bgBadge: "bg-blue-50 text-blue-700 border-blue-200",
    borderColor: "#3B82F6",
    icon: Users,
    description: "Khách hàng mới tiếp nhận từ form Landing Page và các kênh hotline.",
  },
  QUOTED: {
    gradientStart: "#6366F1", // Indigo 500
    gradientEnd: "#4338CA", // Indigo 700
    textColor: "text-indigo-700",
    bgBadge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    borderColor: "#6366F1",
    icon: Clock,
    description: "Khách hàng đã được tư vấn nhu cầu và gửi bảng báo giá sự kiện chi tiết.",
  },
  NEGOTIATING: {
    gradientStart: "#D97706", // Amber 600
    gradientEnd: "#B45309", // Amber 700
    textColor: "text-amber-700",
    bgBadge: "bg-amber-50 text-amber-700 border-amber-200",
    borderColor: "#D97706",
    icon: Sparkles,
    description: "Đang đàm phán hợp đồng, khảo sát địa điểm và điều chỉnh ngân sách.",
  },
  WON: {
    gradientStart: "#059669", // Emerald 600
    gradientEnd: "#047857", // Emerald 700
    textColor: "text-emerald-700",
    bgBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    borderColor: "#10B981",
    icon: CheckCircle2,
    description: "Đã chốt hợp đồng thành công, thanh toán cọc và chuẩn bị sự kiện.",
  },
  LOST: {
    gradientStart: "#475569", // Slate 600
    gradientEnd: "#334155", // Slate 700
    textColor: "text-slate-600",
    bgBadge: "bg-slate-100 text-slate-600 border-slate-300",
    borderColor: "#64748B",
    icon: XCircle,
    description: "Khách hàng hủy kế hoạch, không đạt ngân sách hoặc chọn thời điểm khác.",
  },
};

function formatLeadDate(dateString?: string) {
  if (!dateString) return "Mới gửi";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export default function ConversionFunnel({
  leads,
  selectedStage: externalSelectedStage,
  onSelectStage: externalOnSelectStage,
  showCardWrapper = false,
}: ConversionFunnelProps) {
  const [internalSelectedStage, setInternalSelectedStage] =
    useState<LeadStatus | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const selectedStage =
    externalSelectedStage !== undefined
      ? externalSelectedStage
      : internalSelectedStage;

  const handleSelectStage = (status: LeadStatus) => {
    const next = selectedStage === status ? null : status;
    if (externalOnSelectStage) {
      externalOnSelectStage(next);
    } else {
      setInternalSelectedStage(next);
    }
  };

  const totalLeads = leads.length;

  // Tính toán dữ liệu thật 100% cho 5 giai đoạn
  const funnelStages: StageFunnelData[] = useMemo(() => {
    const counts: Record<LeadStatus, number> = {
      NEW: 0,
      QUOTED: 0,
      NEGOTIATING: 0,
      WON: 0,
      LOST: 0,
    };

    leads.forEach((lead) => {
      const statusKey = (lead.status || "NEW") as LeadStatus;
      if (counts[statusKey] !== undefined) {
        counts[statusKey] += 1;
      } else {
        counts.NEW += 1;
      }
    });

    return LEAD_STATUSES.map((status, index) => {
      const count = counts[status];
      const pctOfTotal = totalLeads > 0 ? (count / totalLeads) * 100 : 0;

      // Tính tỷ lệ chuyển tiếp từ giai đoạn trước
      let stepConversionRate = 0;
      if (index === 0) {
        stepConversionRate = 100;
      } else {
        const prevCount = counts[LEAD_STATUSES[index - 1]];
        stepConversionRate = prevCount > 0 ? (count / prevCount) * 100 : 0;
      }

      // Tính tỷ lệ chuyển tiếp sang giai đoạn kế tiếp
      let nextConversionRate = 0;
      if (index < 4) {
        const nextCount = counts[LEAD_STATUSES[index + 1]];
        nextConversionRate = count > 0 ? (nextCount / count) * 100 : 0;
      }

      const cfg = STAGE_CONFIG[status];

      return {
        status,
        label: LEAD_STATUS_LABELS[status],
        count,
        pctOfTotal,
        stepConversionRate,
        nextConversionRate,
        color: {
          start: cfg.gradientStart,
          end: cfg.gradientEnd,
          textColor: cfg.textColor,
          bgBadge: cfg.bgBadge,
          border: cfg.borderColor,
        },
        icon: cfg.icon,
        description: cfg.description,
      };
    });
  }, [leads, totalLeads]);

  // Tỷ lệ chốt đơn toàn phễu (Win Rate)
  const wonCount = funnelStages.find((s) => s.status === "WON")?.count ?? 0;
  const overallConversionRate =
    totalLeads > 0 ? ((wonCount / totalLeads) * 100).toFixed(1) : "0";

  // Tọa độ hình thang thu hẹp dạng Phễu - Căn chỉnh tỷ lệ cân đối, tầng cuối rộng rãi không tràn chữ
  // ViewBox: 0 0 500 360 | Center X: 250
  const trapezoids = [
    {
      // Tầng 1: Mới (Rộng nhất)
      points: "20,12 480,12 444,72 56,72",
      labelY: 36,
      subY: 55,
      fontSizeTitle: "13.5",
      fontSizeSub: "12",
    },
    {
      // Tầng 2: Đã báo giá
      points: "61,78 439,78 403,138 97,138",
      labelY: 102,
      subY: 121,
      fontSizeTitle: "13.5",
      fontSizeSub: "12",
    },
    {
      // Tầng 3: Đang thương lượng
      points: "102,144 398,144 362,204 138,204",
      labelY: 168,
      subY: 187,
      fontSizeTitle: "13",
      fontSizeSub: "12",
    },
    {
      // Tầng 4: Đã chốt
      points: "143,210 357,210 323,270 177,270",
      labelY: 234,
      subY: 253,
      fontSizeTitle: "13.5",
      fontSizeSub: "12",
    },
    {
      // Tầng 5: Không thành (Đã mở rộng đáy: đỉnh 138px, đáy 90px - chữ hoàn toàn nằm gọn bên trong)
      points: "181,276 319,276 295,348 205,348",
      labelY: 302,
      subY: 322,
      fontSizeTitle: "11.5",
      fontSizeSub: "11",
    },
  ];

  const selectedIndex = funnelStages.findIndex((s) => s.status === selectedStage);
  const selectedData = selectedIndex >= 0 ? funnelStages[selectedIndex] : null;
  const prevStage = selectedIndex > 0 ? funnelStages[selectedIndex - 1] : null;
  const nextStage = selectedIndex >= 0 && selectedIndex < 4 ? funnelStages[selectedIndex + 1] : null;

  // Danh sách khách hàng thật thuộc giai đoạn đang chọn
  const stageLeads = useMemo(() => {
    if (!selectedStage) return [];
    return leads.filter((l) => (l.status || "NEW") === selectedStage);
  }, [leads, selectedStage]);

  const content = (
    <div className="space-y-6">
      {/* Thanh tiêu đề */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              Phễu chuyển đổi khách hàng
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
              {totalLeads} khách hàng thật
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Mô hình phễu 5 giai đoạn liên kết trực tiếp dữ liệu từ Landing Page
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span>Tỷ lệ chốt đơn (Win Rate):</span>
            <strong className="text-emerald-700">{overallConversionRate}%</strong>
          </div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1E5E] transition hover:text-[#D4AF37]"
          >
            Xem danh sách <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Khu vực mô hình phễu trung tâm */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[480px]">
          <svg
            viewBox="0 0 500 360"
            className="h-auto w-full drop-shadow-md transition-all duration-300"
          >
            <defs>
              {funnelStages.map((stage) => (
                <linearGradient
                  key={`grad-${stage.status}`}
                  id={`funnel-gradient-${stage.status}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={stage.color.start} />
                  <stop offset="100%" stopColor={stage.color.end} />
                </linearGradient>
              ))}
              <filter id="funnel-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="3"
                  stdDeviation="4"
                  floodColor="#000000"
                  floodOpacity="0.25"
                />
              </filter>
            </defs>

            {/* Vẽ 5 tầng hình thang của phễu - Đường phân chia trắng tinh gọn chuẩn như hình mẫu */}
            {funnelStages.map((stage, index) => {
              const geom = trapezoids[index];
              const isSelected = selectedStage === stage.status;
              const isHovered = hoveredIndex === index;

              return (
                <g
                  key={stage.status}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleSelectStage(stage.status)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${stage.label}: ${stage.count} người`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectStage(stage.status);
                    }
                  }}
                >
                  {/* Hình khối tầng phễu */}
                  <polygon
                    points={geom.points}
                    fill={`url(#funnel-gradient-${stage.status})`}
                    stroke={isSelected ? "#F59E0B" : isHovered ? "#FFFFFF" : "rgba(255,255,255,0.7)"}
                    strokeWidth={isSelected ? "3.5" : isHovered ? "2" : "1.2"}
                    opacity={isSelected ? 1 : selectedStage && !isSelected ? 0.45 : isHovered ? 0.95 : 0.9}
                    filter={isSelected || isHovered ? "url(#funnel-glow)" : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Tên giai đoạn - Đặt vừa vặn cân đối */}
                  <text
                    x="250"
                    y={geom.labelY}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontWeight="800"
                    fontSize={geom.fontSizeTitle}
                    letterSpacing="0.02em"
                    className="select-none font-sans drop-shadow-sm pointer-events-none"
                  >
                    {stage.label.toUpperCase()}
                  </text>

                  {/* Số lượng người + Tỷ lệ % trên phễu */}
                  <text
                    x="250"
                    y={geom.subY}
                    textAnchor="middle"
                    fill={isSelected ? "#FEF08A" : "#FFFFFF"}
                    fontWeight="700"
                    fontSize={geom.fontSizeSub}
                    className="select-none font-sans drop-shadow-sm pointer-events-none"
                  >
                    {stage.count} người ({stage.pctOfTotal.toFixed(0)}%)
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Gợi ý tương tác */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <MousePointerClick className="h-4 w-4 text-[#0A1E5E]" />
            <span>
              {selectedData
                ? `Đang xem chi tiết tầng: ${selectedData.label} (nhấp lại để đóng)`
                : "Nhấp vào bất kỳ tầng nào trên phễu để xem chi tiết thông tin cụ thể"}
            </span>
          </div>
        </div>
      </div>

      {/* KHU VỰC HIỂN THỊ THÔNG TIN CỤ THỂ KHI NHẤP VÀO TỪNG TẦNG CỦA PHỄU */}
      {selectedData && (
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/70 via-white to-white p-5 shadow-lg transition-all animate-fadeIn">
          {/* Header chi tiết giai đoạn */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${selectedData.color.start}, ${selectedData.color.end})`,
                }}
              >
                <selectedData.icon className="h-5 w-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Thông tin cụ thể giai đoạn
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedData.label} &mdash; {selectedData.count} khách hàng
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/leads?status=${selectedData.status}`}
                className="inline-flex items-center gap-1 rounded-lg bg-[#0A1E5E] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#152e7a]"
              >
                <span>Mở trong CRM</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
              <button
                type="button"
                onClick={() => handleSelectStage(selectedData.status)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                title="Đóng chi tiết"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 3 Thẻ chỉ số chuyển đổi cụ thể của giai đoạn */}
          <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500">Số lượng khách hàng</p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {selectedData.count}{" "}
                <span className="text-xs font-semibold text-slate-500">người</span>
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Chiếm {selectedData.pctOfTotal.toFixed(1)}% trên tổng {totalLeads} lead
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500">Tỷ lệ chuyển tiếp từ giai đoạn trước</p>
              <p className="mt-1 flex items-center gap-1 text-2xl font-black text-emerald-600">
                <TrendingUp className="h-5 w-5 shrink-0" />
                {selectedData.stepConversionRate.toFixed(1)}%
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {selectedIndex === 0
                  ? "100% đầu vào tiếp nhận từ Landing Page"
                  : `Chuyển tiếp từ ${prevStage?.label}`}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500">Chuyển tiếp sang giai đoạn sau</p>
              <p className="mt-1 text-2xl font-black text-blue-600">
                {selectedIndex < 4 ? `${selectedData.nextConversionRate.toFixed(1)}%` : "0% (Đáy phễu)"}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {nextStage ? `Chuyển sang ${nextStage.label}` : "Kết thúc phễu chuyển đổi"}
              </p>
            </div>
          </div>

          {/* Mô tả giai đoạn */}
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 flex items-start gap-2">
            <Info className="h-4 w-4 text-[#0A1E5E] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Ý nghĩa:</strong> {selectedData.description}
            </p>
          </div>

          {/* BẢNG DANH SÁCH CHI TIẾT KHÁCH HÀNG THẬT TRONG GIAI ĐOẠN NÀY */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Danh sách khách hàng trong giai đoạn &ldquo;{selectedData.label}&rdquo; ({stageLeads.length})</span>
            </div>

            {stageLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
                Hiện tại chưa có khách hàng nào đang ở giai đoạn này.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Khách hàng</th>
                      <th className="py-2.5 px-3">Số điện thoại</th>
                      <th className="py-2.5 px-3">Nhu cầu sự kiện</th>
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stageLeads.map((lead, idx) => (
                      <tr key={lead.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {lead.full_name || "Khách hàng"}
                        </td>
                        <td className="py-2.5 px-3">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              <PhoneCall className="h-3 w-3" />
                              {lead.phone}
                            </a>
                          ) : (
                            <span className="text-slate-400">&mdash;</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                            {lead.event_type || "Tư vấn tổ chức sự kiện"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                          {formatLeadDate(lead.created_at)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate text-[11px]">
                          {lead.notes || "Không có ghi chú thêm."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (showCardWrapper) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {content}
      </div>
    );
  }

  return content;
}
