"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
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
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
} from "@/app/admin/_components/admin-types";
import {
  PIPELINE_STAGES,
  STAGE_GUIDE,
  getLeadStatus,
  resolveLeadSource,
  summarizeFunnel,
} from "@/lib/lead-funnel";

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
  lost_stage?: string | null;
  lost_reason?: string | null;
}

interface ConversionFunnelProps {
  leads: FunnelLeadItem[];
  selectedStage?: LeadStatus | null;
  onSelectStage?: (status: LeadStatus | null) => void;
  showCardWrapper?: boolean;
}

const STAGE_STYLE: Record<
  LeadStatus,
  { start: string; end: string; icon: React.ComponentType<{ className?: string }> }
> = {
  NEW: { start: "#2563EB", end: "#1D4ED8", icon: Users },
  QUOTED: { start: "#6366F1", end: "#4338CA", icon: Clock },
  NEGOTIATING: { start: "#D97706", end: "#B45309", icon: Sparkles },
  WON: { start: "#059669", end: "#047857", icon: CheckCircle2 },
  LOST: { start: "#475569", end: "#334155", icon: XCircle },
};

// 4 tầng hình thang, viewBox 0 0 500 300, tâm X = 250
const TRAPEZOIDS = [
  { points: "20,10 480,10 440,74 60,74", y: 10 },
  { points: "66,80 434,80 394,144 106,144", y: 80 },
  { points: "112,150 388,150 348,214 152,214", y: 150 },
  { points: "158,220 342,220 310,290 190,290", y: 220 },
];

function formatLeadDate(dateString?: string) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const fmtPct = (value: number) => `${value.toFixed(value >= 10 || value === 0 ? 0 : 1)}%`;

export default function ConversionFunnel({
  leads,
  selectedStage: externalSelectedStage,
  onSelectStage: externalOnSelectStage,
  showCardWrapper = false,
}: ConversionFunnelProps) {
  const [internalSelectedStage, setInternalSelectedStage] = useState<LeadStatus | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const selectedStage =
    externalSelectedStage !== undefined ? externalSelectedStage : internalSelectedStage;

  const handleSelectStage = (status: LeadStatus) => {
    const next = selectedStage === status ? null : status;
    if (externalOnSelectStage) externalOnSelectStage(next);
    else setInternalSelectedStage(next);
  };

  const summary = useMemo(() => summarizeFunnel(leads), [leads]);

  const stageLeads = useMemo(() => {
    if (!selectedStage) return [];
    return leads.filter((l) => getLeadStatus(l) === selectedStage);
  }, [leads, selectedStage]);

  const selectedPipelineIndex = selectedStage
    ? (PIPELINE_STAGES as readonly LeadStatus[]).indexOf(selectedStage)
    : -1;
  const selectedStat = selectedPipelineIndex >= 0 ? summary.stages[selectedPipelineIndex] : null;
  const nextStat =
    selectedPipelineIndex >= 0 && selectedPipelineIndex < summary.stages.length - 1
      ? summary.stages[selectedPipelineIndex + 1]
      : null;

  const content = (
    <div className="space-y-5">
      {/* Tiêu đề */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              Phễu chuyển đổi khách hàng
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
              {summary.total} lead
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Đầu vào: form &amp; nút Hotline / Zalo / Facebook trên website. Sale chuyển giai đoạn tại trang Khách hàng.
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1E5E] transition hover:text-[#D4AF37]"
        >
          Xem danh sách <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Chỉ số đầu ra */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Metric label="Đang xử lý" value={String(summary.open)} hint="Mới + Báo giá + Thương lượng" />
        <Metric label="Đã chốt" value={String(summary.won)} hint="Ký hợp đồng & nhận cọc" tone="green" />
        <Metric
          label="Tỷ lệ thắng"
          value={fmtPct(summary.winRateClosed)}
          hint={`Đã chốt / lead đã có kết quả (${summary.won + summary.lost})`}
          tone="green"
        />
        <Metric
          label="Chuyển đổi toàn phễu"
          value={fmtPct(summary.winRateOverall)}
          hint="Đã chốt / tổng lead tiếp nhận"
        />
      </div>

      {/* Phễu + tỷ lệ chuyển tầng */}
      <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_200px]">
        <div className="mx-auto w-full max-w-[460px]">
          <svg viewBox="0 0 500 300" className="h-auto w-full drop-shadow-md" role="group" aria-label="Phễu 4 tầng">
            <defs>
              {PIPELINE_STAGES.map((status) => (
                <linearGradient key={status} id={`funnel-gradient-${status}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={STAGE_STYLE[status].start} />
                  <stop offset="100%" stopColor={STAGE_STYLE[status].end} />
                </linearGradient>
              ))}
              <filter id="funnel-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
              </filter>
            </defs>

            {summary.stages.map((stage, index) => {
              const geom = TRAPEZOIDS[index];
              const isSelected = selectedStage === stage.status;
              const isHovered = hoveredIndex === index;
              return (
                <g
                  key={stage.status}
                  className="cursor-pointer"
                  onClick={() => handleSelectStage(stage.status)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${index + 1}. ${stage.label}: ${stage.reached} lead đã qua, ${stage.current} đang ở bước này`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectStage(stage.status);
                    }
                  }}
                >
                  <polygon
                    points={geom.points}
                    fill={`url(#funnel-gradient-${stage.status})`}
                    stroke={isSelected ? "#F59E0B" : "rgba(255,255,255,0.8)"}
                    strokeWidth={isSelected ? 3.5 : isHovered ? 2 : 1.2}
                    opacity={isSelected ? 1 : selectedStage && !isSelected ? 0.45 : isHovered ? 0.95 : 0.9}
                    filter={isSelected || isHovered ? "url(#funnel-glow)" : undefined}
                    className="transition-all duration-200"
                  />
                  <text
                    x="250"
                    y={geom.y + 28}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontWeight="800"
                    fontSize="13.5"
                    className="pointer-events-none select-none font-sans"
                  >
                    {`${index + 1}. ${stage.label.toUpperCase()}`}
                  </text>
                  <text
                    x="250"
                    y={geom.y + 48}
                    textAnchor="middle"
                    fill={isSelected ? "#FEF08A" : "#FFFFFF"}
                    fontWeight="700"
                    fontSize="12"
                    className="pointer-events-none select-none font-sans"
                  >
                    {`${stage.reached} lead (${fmtPct(stage.pctOfTotal)})`}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
            <MousePointerClick className="h-4 w-4 shrink-0 text-[#0A1E5E]" />
            Mỗi tầng đếm lead <strong className="font-semibold text-slate-700">đã đi qua</strong> bước đó. Nhấp để xem chi tiết.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Tỷ lệ chuyển tầng</p>
          {summary.stages.slice(1).map((stage, i) => (
            <div key={stage.status} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
              <div className="flex items-center gap-1 text-slate-500">
                <span className="truncate">{summary.stages[i].label}</span>
                <ArrowDown className="h-3 w-3 shrink-0 -rotate-90" />
                <span className="truncate">{stage.label}</span>
              </div>
              <p className="mt-0.5 text-base font-black text-slate-900">{fmtPct(stage.stepRate)}</p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleSelectStage("LOST")}
            aria-pressed={selectedStage === "LOST"}
            className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition ${
              selectedStage === "LOST"
                ? "border-amber-300 bg-amber-50 ring-2 ring-amber-200"
                : "border-dashed border-slate-300 bg-white hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-1 font-semibold text-slate-600">
              <XCircle className="h-3.5 w-3.5" /> Rơi khỏi phễu (Không thành)
            </span>
            <span className="mt-0.5 block text-base font-black text-slate-900">
              {summary.lost} lead{" "}
              <span className="text-xs font-semibold text-slate-500">
                ({fmtPct(summary.total ? (summary.lost / summary.total) * 100 : 0)})
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Chi tiết tầng đang chọn */}
      {selectedStage && (
        <div className="animate-fadeIn rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/70 via-white to-white p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${STAGE_STYLE[selectedStage].start}, ${STAGE_STYLE[selectedStage].end})`,
                }}
              >
                {React.createElement(STAGE_STYLE[selectedStage].icon, { className: "h-5 w-5" })}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {selectedStat ? `Tầng ${selectedPipelineIndex + 1}` : "Nhánh rơi khỏi phễu"}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {STAGE_GUIDE[selectedStage].funnelLabel}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/leads?status=${selectedStage}`}
                className="inline-flex items-center gap-1 rounded-lg bg-[#0A1E5E] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#152e7a]"
              >
                Mở trong CRM <ExternalLink className="h-3 w-3" />
              </Link>
              <button
                type="button"
                onClick={() => handleSelectStage(selectedStage)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                title="Đóng chi tiết"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {selectedStat && (
            <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-3">
              <Metric
                label="Đã đi qua bước này"
                value={String(selectedStat.reached)}
                hint={`${fmtPct(selectedStat.pctOfTotal)} trên tổng ${summary.total} lead`}
              />
              <Metric
                label="Đang đứng ở bước này"
                value={String(selectedStat.current)}
                hint={`Trạng thái CRM: “${LEAD_STATUS_LABELS[selectedStat.status]}”`}
                tone="blue"
              />
              <Metric
                label="Sang bước tiếp theo"
                value={nextStat ? fmtPct(nextStat.stepRate) : "Đáy phễu"}
                hint={nextStat ? `Chuyển sang “${nextStat.label}”` : "Đầu ra cuối cùng của phễu"}
                tone="green"
              />
            </div>
          )}

          <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
            <p className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0A1E5E]" />
              <span>
                <strong>Khi nào ở bước này:</strong> {STAGE_GUIDE[selectedStage].entryRule}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Việc cần làm tiếp:</strong> {STAGE_GUIDE[selectedStage].nextAction}
              </span>
            </p>
            {selectedStage === "LOST" && (
              <p className="pl-6 text-[11px] text-slate-500">
                Lead “Không thành” được tính tới bước khách rời đi (ghi tự động khi đổi trạng thái). Lead cũ trước khi
                có tính năng này chỉ được tính ở tầng 1.
              </p>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-bold text-slate-700">
              Lead đang ở trạng thái “{LEAD_STATUS_LABELS[selectedStage]}” ({stageLeads.length})
            </p>
            {stageLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
                Hiện chưa có lead nào ở trạng thái này.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5">Khách hàng</th>
                      <th className="px-3 py-2.5">Số điện thoại</th>
                      <th className="px-3 py-2.5">Nguồn</th>
                      <th className="px-3 py-2.5">Nhu cầu</th>
                      <th className="px-3 py-2.5">{selectedStage === "LOST" ? "Lý do" : "Tiếp nhận"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stageLeads.map((lead, idx) => (
                      <tr key={lead.id || idx} className="transition-colors hover:bg-slate-50/80">
                        <td className="px-3 py-2.5 font-bold text-slate-900">
                          {lead.id ? (
                            <Link href={`/admin/leads?lead=${lead.id}`} className="hover:underline">
                              {lead.full_name || "Khách hàng"}
                            </Link>
                          ) : (
                            lead.full_name || "Khách hàng"
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {lead.phone && /\d/.test(lead.phone) ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                            >
                              <PhoneCall className="h-3 w-3" />
                              {lead.phone}
                            </a>
                          ) : (
                            <span className="text-amber-600">{lead.phone || "Chờ cập nhật"}</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                          {LEAD_SOURCE_LABELS[resolveLeadSource(lead)]}
                        </td>
                        <td className="max-w-[220px] truncate px-3 py-2.5">
                          {lead.event_type || "Tư vấn tổ chức sự kiện"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-[11px] text-slate-500">
                          {selectedStage === "LOST"
                            ? `${lead.lost_reason || "Chưa ghi lý do"}${
                                lead.lost_stage ? ` (rơi ở: ${STAGE_GUIDE[lead.lost_stage as LeadStatus]?.funnelLabel || lead.lost_stage})` : ""
                              }`
                            : formatLeadDate(lead.created_at)}
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
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">{content}</div>
    );
  }
  return content;
}

function Metric({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "slate" | "green" | "blue";
}) {
  const color = { slate: "text-slate-900", green: "text-emerald-600", blue: "text-blue-600" }[tone];
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-black ${color}`}>{value}</p>
      <p className="mt-0.5 text-[10px] leading-snug text-slate-400">{hint}</p>
    </div>
  );
}
