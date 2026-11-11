"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  PhoneCall,
  Sparkles,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  LeadSource,
  LeadStatus,
  LEAD_STATUS_LABELS,
  VN_TIME_ZONE,
  eventTypeLabel,
  formatDate,
} from "@/app/admin/_components/admin-types";
import {
  PIPELINE_STAGES,
  PipelineStage,
  STAGE_GUIDE,
  getLeadStatus,
  resolveLeadSource,
  stageRank,
  summarizeFunnel,
} from "@/lib/lead-funnel";

export interface FunnelLeadItem {
  id?: string;
  status?: string | null;
  full_name?: string;
  company_name?: string | null;
  phone?: string | null;
  email?: string | null;
  event_type?: string | null;
  guest_count?: number | null;
  event_date?: string | null;
  notes?: string | null;
  created_at?: string;
  quoted_at?: string | null;
  negotiating_at?: string | null;
  won_at?: string | null;
  lost_at?: string | null;
  last_contacted_at?: string | null;
  assigned_to?: string | null;
  budget?: number | null;
  actual_revenue?: number | null;
  source?: string | null;
  lost_stage?: string | null;
  lost_reason?: string | null;
  ai_score?: "HOT" | "WARM" | "COLD" | null;
  ai_next_action?: string | null;
}

interface ConversionFunnelProps {
  leads: FunnelLeadItem[];
  selectedStage?: LeadStatus | null;
  onSelectStage?: (status: LeadStatus | null) => void;
  onOpenLead?: (leadId: string) => void;
  showCardWrapper?: boolean;
}

type StageFocusMode = "lost_here" | "budget";

const STAGE_STYLE: Record<
  LeadStatus,
  { start: string; end: string; badge: string; ring: string; icon: React.ComponentType<{ className?: string }> }
> = {
  NEW: {
    start: "#2563EB",
    end: "#1D4ED8",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    ring: "ring-2 ring-blue-300 border-blue-400 bg-blue-50/70",
    icon: Users,
  },
  QUOTED: {
    start: "#6366F1",
    end: "#4338CA",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    ring: "ring-2 ring-indigo-300 border-indigo-400 bg-indigo-50/70",
    icon: Clock,
  },
  NEGOTIATING: {
    start: "#D97706",
    end: "#B45309",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    ring: "ring-2 ring-amber-300 border-amber-400 bg-amber-50/70",
    icon: Sparkles,
  },
  WON: {
    start: "#059669",
    end: "#047857",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    ring: "ring-2 ring-emerald-300 border-emerald-400 bg-emerald-50/70",
    icon: CheckCircle2,
  },
  LOST: {
    start: "#475569",
    end: "#334155",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    ring: "ring-2 ring-rose-300 border-rose-400 bg-rose-50/70",
    icon: XCircle,
  },
};

const SOURCE_META: Record<
  LeadSource,
  { label: string; icon: string; barColor: string; textColor: string }
> = {
  HOTLINE: {
    label: "Hotline",
    icon: "📞",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-700",
  },
  ZALO_OA: {
    label: "Zalo OA",
    icon: "💬",
    barColor: "bg-blue-500",
    textColor: "text-blue-700",
  },
  WEBSITE_FORM: {
    label: "Website",
    icon: "🌐",
    barColor: "bg-indigo-500",
    textColor: "text-indigo-700",
  },
  FACEBOOK: {
    label: "Facebook",
    icon: "📘",
    barColor: "bg-sky-500",
    textColor: "text-sky-700",
  },
  REFERRAL: {
    label: "Giới thiệu",
    icon: "🤝",
    barColor: "bg-amber-500",
    textColor: "text-amber-700",
  },
  OTHER: {
    label: "Nguồn khác",
    icon: "🏷️",
    barColor: "bg-slate-400",
    textColor: "text-slate-600",
  },
};

const HEAT_META: Record<"HOT" | "WARM" | "COLD", { label: string; badgeClass: string }> = {
  HOT: {
    label: "🔥 Nóng",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
  },
  WARM: {
    label: "🌤 Ấm",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
  },
  COLD: {
    label: "❄️ Lạnh",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700",
  },
};

// Hình thang cân thu hẹp dần từ trên xuống dưới; tỷ lệ giữ chữ gọn trong viền ở mọi màn hình
const TIER_WIDTHS = ["w-full", "w-[93%]", "w-[86%]", "w-[79%]"];
const TIER_POLYGONS = [
  "0,0 100,0 96,100 4,100",
  "0,0 100,0 95.6,100 4.4,100",
  "0,0 100,0 95.2,100 4.8,100",
  "0,0 100,0 94.5,100 5.5,100",
];

const fmtPct = (value: number) => `${value.toFixed(value >= 10 || value === 0 ? 0 : 1)}%`;

function formatMoney(amount: number) {
  if (!amount || isNaN(amount)) return "0 đ";
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} tỷ đ`;
  }
  if (amount >= 1_000_000) {
    return `${Math.round(amount / 1_000_000)} tr đ`;
  }
  return `${amount.toLocaleString("vi-VN")} đ`;
}

function getLeadValue(lead: FunnelLeadItem): number {
  const raw =
    getLeadStatus(lead) === "WON" && lead.actual_revenue
      ? Number(lead.actual_revenue)
      : Number(lead.budget || 0);
  return Number.isFinite(raw) ? raw : 0;
}

function formatVnDateTimeShort(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VN_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatElapsedTime(iso?: string | null, nowMs: number = 0): string {
  if (!iso || nowMs <= 0) return "";
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "";
  const diffMs = Math.max(0, nowMs - ts);
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  if (diffHours < 1) {
    const mins = Math.max(1, Math.floor(diffMs / (60 * 1000)));
    return `${mins} phút trước`;
  }
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

function normalizeFunnelLead(lead: FunnelLeadItem): FunnelLeadItem {
  if (getLeadStatus(lead) !== "LOST") return lead;
  if (lead.lost_stage && (PIPELINE_STAGES as readonly string[]).includes(lead.lost_stage)) {
    return lead;
  }
  const inferred: PipelineStage = lead.negotiating_at
    ? "NEGOTIATING"
    : lead.quoted_at
    ? "QUOTED"
    : "NEW";
  return { ...lead, lost_stage: inferred };
}

function getLostStageRank(lead: FunnelLeadItem): number {
  if (lead.lost_stage && (PIPELINE_STAGES as readonly string[]).includes(lead.lost_stage)) {
    return Math.min(stageRank(lead.lost_stage), 2);
  }
  if (lead.negotiating_at) return 2;
  if (lead.quoted_at) return 1;
  return 0;
}

function didReachPipelineStage(lead: FunnelLeadItem, stage: PipelineStage): boolean {
  const targetRank = stageRank(stage);
  if (targetRank === 0) return true;
  const status = getLeadStatus(lead);
  if (status === "LOST") {
    return targetRank <= getLostStageRank(lead);
  }
  return stageRank(status) >= targetRank;
}

function describeLeadStageState(lead: FunnelLeadItem, nowMs: number): string {
  const status = getLeadStatus(lead);
  const parts: string[] = [];

  if (status === "NEW") {
    const t = formatVnDateTimeShort(lead.created_at);
    const rel = formatElapsedTime(lead.created_at, nowMs);
    parts.push(t ? `Tiếp nhận ${t}${rel ? ` (${rel})` : ""}` : "Mới tiếp nhận");
    if (lead.last_contacted_at) {
      parts.push(`Đã liên hệ ${formatVnDateTimeShort(lead.last_contacted_at)}`);
    } else {
      parts.push("Chưa ghi nhận liên hệ");
    }
  } else if (status === "QUOTED") {
    const refTime = lead.quoted_at || lead.created_at;
    const t = formatVnDateTimeShort(refTime);
    const rel = formatElapsedTime(refTime, nowMs);
    parts.push(t ? `Báo giá ${t}${rel ? ` (${rel})` : ""}` : "Đã gửi báo giá");
    if (lead.last_contacted_at) {
      parts.push(`Liên hệ ${formatVnDateTimeShort(lead.last_contacted_at)}`);
    } else {
      parts.push("Đang chờ khách phản hồi");
    }
  } else if (status === "NEGOTIATING") {
    const refTime = lead.negotiating_at || lead.quoted_at || lead.created_at;
    const t = formatVnDateTimeShort(refTime);
    const rel = formatElapsedTime(refTime, nowMs);
    parts.push(t ? `Thương lượng từ ${t}${rel ? ` (${rel})` : ""}` : "Đang thương lượng");
    if (lead.last_contacted_at) {
      parts.push(`Liên hệ ${formatVnDateTimeShort(lead.last_contacted_at)}`);
    } else {
      parts.push("Đang chốt điều khoản / hợp đồng");
    }
  } else if (status === "WON") {
    const t = formatVnDateTimeShort(lead.won_at || lead.created_at);
    parts.push(t ? `Chốt hợp đồng ${t}` : "Đã chốt hợp đồng");
    if (lead.event_date) {
      parts.push(`Ngày SK: ${formatDate(lead.event_date)}`);
    }
  } else {
    const rank = getLostStageRank(lead);
    const droppedFrom = STAGE_GUIDE[PIPELINE_STAGES[rank]].funnelLabel;
    const t = formatVnDateTimeShort(lead.lost_at || lead.created_at);
    parts.push(`Rớt tại ${droppedFrom}${t ? ` (${t})` : ""}`);
    if (lead.lost_reason?.trim()) {
      parts.push(`Lý do: ${lead.lost_reason.trim()}`);
    }
  }

  if (lead.assigned_to?.trim()) {
    parts.push(`Phụ trách: ${lead.assigned_to.trim()}`);
  }

  return parts.join(" • ");
}

interface HoverCustomerPopoverProps {
  title: string;
  subtitle: string;
  leads: FunnelLeadItem[];
  nowMs: number;
  onOpenLead?: (leadId: string) => void;
  positionClass: string;
  emptyText?: string;
}

function HoverCustomerPopover({
  title,
  subtitle,
  leads,
  nowMs,
  onOpenLead,
  positionClass,
  emptyText = "Chưa có khách hàng nào trong nhóm này.",
}: HoverCustomerPopoverProps) {
  return (
    <div
      className={`pointer-events-auto absolute z-40 w-[min(22rem,calc(100vw-2.5rem))] ${positionClass}`}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xl ring-1 ring-slate-900/5">
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
          <div>
            <p className="text-xs font-extrabold text-slate-900">{title}</p>
            <p className="text-[10.5px] font-medium text-slate-500">{subtitle}</p>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
            {leads.length} khách
          </span>
        </div>

        {leads.length === 0 ? (
          <p className="py-3 text-center text-[11px] text-slate-400">{emptyText}</p>
        ) : (
          <div className="mt-2 max-h-60 divide-y divide-slate-100 overflow-y-auto pr-0.5">
            {leads.map((lead, idx) => {
              const status = getLeadStatus(lead);
              const srcMeta = SOURCE_META[resolveLeadSource(lead)];
              const val = getLeadValue(lead);
              const evtLabel = lead.event_type ? eventTypeLabel(lead.event_type) : "";

              return (
                <div key={lead.id || idx} className="py-2 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1">
                        {lead.id && onOpenLead ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLead(lead.id as string);
                            }}
                            className="truncate text-left text-[11.5px] font-bold text-slate-900 hover:text-[#0A1E5E] hover:underline"
                          >
                            {lead.full_name || "Khách hàng"}
                          </button>
                        ) : lead.id ? (
                          <Link
                            href={`/admin/leads?lead=${lead.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 truncate text-[11.5px] font-bold text-slate-900 hover:text-[#0A1E5E] hover:underline"
                          >
                            {lead.full_name || "Khách hàng"}
                            <ExternalLink className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                          </Link>
                        ) : (
                          <span className="truncate text-[11.5px] font-bold text-slate-900">
                            {lead.full_name || "Khách hàng"}
                          </span>
                        )}

                        {lead.ai_score && (
                          <span
                            className={`rounded border px-1 py-0.2 text-[9px] font-bold ${HEAT_META[lead.ai_score].badgeClass}`}
                          >
                            {HEAT_META[lead.ai_score].label}
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-[10.5px] text-slate-600">
                        {[
                          evtLabel || null,
                          lead.phone && /\d/.test(lead.phone) ? lead.phone : null,
                          val > 0 ? formatMoney(val) : null,
                          `${srcMeta.icon} ${srcMeta.label}`,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                        {describeLeadStageState(lead, nowMs)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9.5px] font-bold ${STAGE_STYLE[status].badge}`}
                    >
                      {LEAD_STATUS_LABELS[status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConversionFunnel({
  leads,
  selectedStage: externalSelectedStage,
  onSelectStage: externalOnSelectStage,
  onOpenLead,
  showCardWrapper = false,
}: ConversionFunnelProps) {
  const [internalSelectedStage, setInternalSelectedStage] = useState<LeadStatus | null>(null);
  const [detailScopePref, setDetailScopePref] = useState<"auto" | "current" | "reached">("auto");
  const [stageViewOverride, setStageViewOverride] = useState<{
    stage: LeadStatus;
    mode: StageFocusMode;
  } | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number>(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNowMs(Date.now());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedStage =
    externalSelectedStage !== undefined ? externalSelectedStage : internalSelectedStage;

  const handleSelectStage = (status: LeadStatus | null) => {
    const next = status === null ? null : selectedStage === status ? null : status;
    setDetailScopePref("auto");
    setStageViewOverride(null);
    if (externalOnSelectStage) externalOnSelectStage(next);
    else setInternalSelectedStage(next);
  };

  const normalizedLeads = useMemo(() => leads.map(normalizeFunnelLead), [leads]);
  const summary = useMemo(() => summarizeFunnel(normalizedLeads), [normalizedLeads]);

  const openLeads = useMemo(
    () =>
      normalizedLeads.filter((l) => {
        const st = getLeadStatus(l);
        return st === "NEW" || st === "QUOTED" || st === "NEGOTIATING";
      }),
    [normalizedLeads]
  );

  const wonLeads = useMemo(
    () => normalizedLeads.filter((l) => getLeadStatus(l) === "WON"),
    [normalizedLeads]
  );

  const lostLeads = useMemo(
    () => normalizedLeads.filter((l) => getLeadStatus(l) === "LOST"),
    [normalizedLeads]
  );

  // Phân tích khách hàng rớt khỏi phễu theo từng bước
  const lostBreakdown = useMemo(() => {
    let fromNew = 0;
    let fromQuoted = 0;
    let fromNegotiating = 0;
    const reasons: Record<string, number> = {};

    lostLeads.forEach((l) => {
      const rank = getLostStageRank(l);
      if (rank === 1) fromQuoted += 1;
      else if (rank === 2) fromNegotiating += 1;
      else fromNew += 1;

      const r = l.lost_reason?.trim() || "Chưa ghi nhận lý do";
      reasons[r] = (reasons[r] || 0) + 1;
    });

    const topReasons = Object.entries(reasons)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return {
      fromNew,
      fromQuoted,
      fromNegotiating,
      totalLost: summary.lost,
      lostPct: summary.total > 0 ? (summary.lost / summary.total) * 100 : 0,
      topReasons,
    };
  }, [lostLeads, summary.lost, summary.total]);

  // Giai đoạn đang được hiển thị chi tiết bên cạnh phễu
  const activeDetailStage: LeadStatus = useMemo(() => {
    if (selectedStage) return selectedStage;
    if (summary.currentByStatus.QUOTED > 0) return "QUOTED";
    if (summary.currentByStatus.NEW > 0) return "NEW";
    if (summary.currentByStatus.NEGOTIATING > 0) return "NEGOTIATING";
    if (summary.currentByStatus.WON > 0) return "WON";
    return "NEW";
  }, [selectedStage, summary.currentByStatus]);

  // Danh sách lead HIỆN ĐANG ĐỨNG ở giai đoạn đang xem (khớp bảng CRM 1-1)
  const currentStageLeads = useMemo(() => {
    return normalizedLeads.filter((l) => getLeadStatus(l) === activeDetailStage);
  }, [normalizedLeads, activeDetailStage]);

  // Danh sách lead ĐÃ ĐI QUA giai đoạn đang xem (lũy kế theo dòng phễu)
  const reachedStageLeads = useMemo(() => {
    if (activeDetailStage === "LOST") return currentStageLeads;
    return normalizedLeads.filter((l) => didReachPipelineStage(l, activeDetailStage));
  }, [normalizedLeads, activeDetailStage, currentStageLeads]);

  // Danh sách lead rớt đúng tại bước đang xem (hoặc tương ứng thẻ thứ 3 khi xem WON/LOST)
  const thirdCardLeads = useMemo(() => {
    if (activeDetailStage === "WON") return wonLeads;
    if (activeDetailStage === "LOST") {
      return lostLeads.filter((l) => getLostStageRank(l) === 1);
    }
    const activeIdx = stageRank(activeDetailStage);
    return lostLeads.filter((l) => getLostStageRank(l) === activeIdx);
  }, [activeDetailStage, lostLeads, wonLeads]);

  // Xác định phạm vi đang phân tích: hiện tại vs tổng vào giai đoạn
  const effectiveScope: "current" | "reached" = useMemo(() => {
    if (activeDetailStage === "LOST" || activeDetailStage === "WON") return "current";
    if (detailScopePref === "current") return "current";
    if (detailScopePref === "reached") return "reached";
    if (currentStageLeads.length === 0 && reachedStageLeads.length > 0) return "reached";
    return "current";
  }, [activeDetailStage, currentStageLeads.length, detailScopePref, reachedStageLeads.length]);

  const analyzedLeads = effectiveScope === "reached" ? reachedStageLeads : currentStageLeads;

  const activeFocusMode: StageFocusMode | null =
    stageViewOverride && stageViewOverride.stage === activeDetailStage
      ? stageViewOverride.mode
      : null;

  const budgetSortedLeads = useMemo(
    () => [...analyzedLeads].sort((a, b) => getLeadValue(b) - getLeadValue(a)),
    [analyzedLeads]
  );

  const displayedCustomerLeads = useMemo(() => {
    if (activeFocusMode === "lost_here") return thirdCardLeads;
    if (activeFocusMode === "budget") return budgetSortedLeads;
    return analyzedLeads;
  }, [activeFocusMode, analyzedLeads, budgetSortedLeads, thirdCardLeads]);

  // Thống kê phân bổ Nguồn lead thật
  const activeSourceBreakdown = useMemo(() => {
    const counts: Record<LeadSource, number> = {
      HOTLINE: 0,
      ZALO_OA: 0,
      WEBSITE_FORM: 0,
      FACEBOOK: 0,
      REFERRAL: 0,
      OTHER: 0,
    };
    analyzedLeads.forEach((lead) => {
      const src = resolveLeadSource(lead);
      counts[src] = (counts[src] || 0) + 1;
    });

    const total = analyzedLeads.length;
    return (Object.keys(counts) as LeadSource[])
      .map((src) => ({
        source: src,
        ...SOURCE_META[src],
        count: counts[src],
        pct: total > 0 ? (counts[src] / total) * 100 : 0,
      }))
      .filter((item) => item.count > 0 || total === 0);
  }, [analyzedLeads]);

  // Thống kê phân bổ Độ nóng (AI Score / Heat) từ dữ liệu thật
  const activeHeatBreakdown = useMemo(() => {
    let hot = 0;
    let warm = 0;
    let cold = 0;
    let unassigned = 0;

    analyzedLeads.forEach((l) => {
      if (l.ai_score === "HOT") hot += 1;
      else if (l.ai_score === "WARM") warm += 1;
      else if (l.ai_score === "COLD") cold += 1;
      else unassigned += 1;
    });

    return { hot, warm, cold, unassigned, total: analyzedLeads.length };
  }, [analyzedLeads]);

  // Tổng ngân sách / giá trị thực của nhóm đang xem
  const activeTotalBudget = useMemo(
    () => analyzedLeads.reduce((acc, curr) => acc + getLeadValue(curr), 0),
    [analyzedLeads]
  );

  const activePipelineIndex = (PIPELINE_STAGES as readonly LeadStatus[]).indexOf(activeDetailStage);

  const customerListTitle = useMemo(() => {
    const stageName =
      activeDetailStage === "LOST"
        ? "Rớt khỏi phễu"
        : STAGE_GUIDE[activeDetailStage].funnelLabel;

    if (activeFocusMode === "lost_here") {
      if (activeDetailStage === "WON") return `Hợp đồng đã chốt (${displayedCustomerLeads.length})`;
      if (activeDetailStage === "LOST") {
        return `Khách rớt sau báo giá (${displayedCustomerLeads.length})`;
      }
      return `Khách rớt tại bước ${stageName} (${displayedCustomerLeads.length})`;
    }
    if (activeFocusMode === "budget") {
      return `Khách theo ngân sách — ${stageName} (${displayedCustomerLeads.length})`;
    }
    if (activeDetailStage === "LOST") {
      return `Khách hàng rớt khỏi phễu (${displayedCustomerLeads.length})`;
    }
    if (effectiveScope === "reached" && activeDetailStage !== "WON") {
      return `Tổng khách vào giai đoạn ${stageName} (${displayedCustomerLeads.length})`;
    }
    return `Khách đang ở giai đoạn ${stageName} (${displayedCustomerLeads.length})`;
  }, [activeDetailStage, activeFocusMode, displayedCustomerLeads.length, effectiveScope]);

  const content = (
    <div className="space-y-4">
      {/* 1. Header tóm tắt toàn phễu */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              Phễu chuyển đổi khách hàng
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
              {summary.total} khách thật
            </span>
            {selectedStage && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                Đang lọc: {LEAD_STATUS_LABELS[selectedStage]}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Di chuột hoặc bấm vào từng giai đoạn và các nút chỉ số để xem chi tiết trạng thái từng khách hàng (100% dữ liệu thật).
          </p>
        </div>

        {/* 4 Nút KPI mini (hover xem chi tiết khách hàng, bấm để lọc nhanh) */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <div
            className="relative"
            onMouseEnter={() => setHoveredKey("kpi:open")}
            onMouseLeave={() => setHoveredKey((prev) => (prev === "kpi:open" ? null : prev))}
          >
            <button
              type="button"
              onClick={() => {
                if (selectedStage === "WON" || selectedStage === "LOST") {
                  const firstOpen =
                    summary.currentByStatus.QUOTED > 0
                      ? "QUOTED"
                      : summary.currentByStatus.NEW > 0
                      ? "NEW"
                      : "NEGOTIATING";
                  handleSelectStage(firstOpen);
                } else {
                  setDetailScopePref("current");
                  setStageViewOverride(null);
                }
              }}
              className={`w-full rounded-xl border px-3 py-1.5 text-center transition hover:shadow-xs ${
                selectedStage && selectedStage !== "WON" && selectedStage !== "LOST"
                  ? "border-blue-300 bg-blue-50/70 ring-1 ring-blue-200"
                  : "border-slate-200 bg-slate-50 hover:border-blue-300"
              }`}
            >
              <span className="block text-[10px] font-bold uppercase text-slate-500">
                Đang xử lý
              </span>
              <span className="text-sm font-black text-blue-700">{summary.open}</span>
            </button>
            {hoveredKey === "kpi:open" && (
              <HoverCustomerPopover
                title="Khách hàng đang xử lý"
                subtitle="Bao gồm Tiếp nhận, Đã báo giá & Đang thương lượng"
                leads={openLeads}
                nowMs={nowMs}
                onOpenLead={onOpenLead}
                positionClass="left-0 top-full pt-2 sm:left-auto sm:right-0"
              />
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredKey("kpi:won")}
            onMouseLeave={() => setHoveredKey((prev) => (prev === "kpi:won" ? null : prev))}
          >
            <button
              type="button"
              onClick={() => handleSelectStage("WON")}
              className={`w-full rounded-xl border px-3 py-1.5 text-center transition hover:shadow-xs ${
                selectedStage === "WON"
                  ? "border-emerald-400 bg-emerald-100/70 ring-2 ring-emerald-200"
                  : "border-emerald-200 bg-emerald-50 hover:border-emerald-400"
              }`}
            >
              <span className="block text-[10px] font-bold uppercase text-emerald-700">
                Đã chốt
              </span>
              <span className="text-sm font-black text-emerald-700">{summary.won}</span>
            </button>
            {hoveredKey === "kpi:won" && (
              <HoverCustomerPopover
                title="Khách hàng đã chốt hợp đồng"
                subtitle="Click để lọc giai đoạn Đã chốt"
                leads={wonLeads}
                nowMs={nowMs}
                onOpenLead={onOpenLead}
                positionClass="right-0 top-full pt-2"
              />
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredKey("kpi:rate")}
            onMouseLeave={() => setHoveredKey((prev) => (prev === "kpi:rate" ? null : prev))}
          >
            <button
              type="button"
              onClick={() => handleSelectStage("WON")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-center transition hover:border-emerald-300 hover:shadow-xs"
            >
              <span className="block text-[10px] font-bold uppercase text-slate-500">
                Chuyển đổi
              </span>
              <span className="text-sm font-black text-emerald-600">
                {fmtPct(summary.winRateOverall)}
              </span>
            </button>
            {hoveredKey === "kpi:rate" && (
              <HoverCustomerPopover
                title={`Tỷ lệ chốt ${fmtPct(summary.winRateOverall)} (${summary.won}/${summary.total})`}
                subtitle="Danh sách hợp đồng đã chuyển đổi thành công"
                leads={wonLeads}
                nowMs={nowMs}
                onOpenLead={onOpenLead}
                positionClass="left-0 top-full pt-2 sm:left-auto sm:right-0"
                emptyText="Chưa có khách chốt hợp đồng trong bộ lọc hiện tại."
              />
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setHoveredKey("kpi:lost")}
            onMouseLeave={() => setHoveredKey((prev) => (prev === "kpi:lost" ? null : prev))}
          >
            <button
              type="button"
              onClick={() => handleSelectStage("LOST")}
              className={`w-full rounded-xl border px-3 py-1.5 text-center transition hover:shadow-xs ${
                selectedStage === "LOST"
                  ? "border-rose-400 bg-rose-50 ring-2 ring-rose-200"
                  : "border-slate-200 bg-slate-50 hover:border-rose-300"
              }`}
            >
              <span className="block text-[10px] font-bold uppercase text-slate-500">
                Rớt phễu
              </span>
              <span className="text-sm font-black text-rose-600">{summary.lost}</span>
            </button>
            {hoveredKey === "kpi:lost" && (
              <HoverCustomerPopover
                title="Khách hàng rớt khỏi phễu"
                subtitle="Click để xem chi tiết lý do & nguồn khách"
                leads={lostLeads}
                nowMs={nowMs}
                onOpenLead={onOpenLead}
                positionClass="right-0 top-full pt-2"
              />
            )}
          </div>
        </div>
      </div>

      {/* 2. BỐ CỤC CHÍNH: Phễu với tỷ lệ chuyển đổi trực tiếp (Trái) + Chi tiết từng giai đoạn (Phải) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* CỘT TRÁI (lg:col-span-5): PHỄU CHUYỂN ĐỔI + TỶ LỆ % GIỮA CÁC GIAI ĐOẠN */}
        <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 lg:col-span-5">
          <div className="flex flex-col items-center">
            {summary.stages.map((stage, index) => {
              const isSelected = activeDetailStage === stage.status;
              const nextStage = summary.stages[index + 1];
              const tierHoverKey = `tier:${stage.status}`;
              const tierCurrentLeads = normalizedLeads.filter(
                (l) => getLeadStatus(l) === stage.status
              );
              const tierReachedLeads = normalizedLeads.filter((l) =>
                didReachPipelineStage(l, stage.status)
              );
              const tierHoverLeads =
                tierCurrentLeads.length > 0 ? tierCurrentLeads : tierReachedLeads;
              const tierHoverSubtitle =
                tierCurrentLeads.length === 0 && tierReachedLeads.length > 0
                  ? `0 khách đang ở bước • ${tierReachedLeads.length} khách đã qua bước (click để lọc)`
                  : `Đang ở giai đoạn: ${stage.current} • Tổng vào bước: ${stage.reached} (click để lọc)`;

              return (
                <React.Fragment key={stage.status}>
                  <div
                    className={`relative mx-auto ${TIER_WIDTHS[index]}`}
                    onMouseEnter={() => setHoveredKey(tierHoverKey)}
                    onMouseLeave={() =>
                      setHoveredKey((prev) => (prev === tierHoverKey ? null : prev))
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectStage(stage.status)}
                      aria-pressed={isSelected}
                      className={`group relative block w-full transition-transform duration-200 focus:outline-none ${
                        isSelected ? "scale-[1.015]" : "hover:scale-[1.01]"
                      }`}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full drop-shadow-sm"
                      >
                        <defs>
                          <linearGradient
                            id={`tier-grad-${stage.status}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor={STAGE_STYLE[stage.status].start} />
                            <stop offset="100%" stopColor={STAGE_STYLE[stage.status].end} />
                          </linearGradient>
                        </defs>
                        <polygon
                          points={TIER_POLYGONS[index]}
                          fill={`url(#tier-grad-${stage.status})`}
                          stroke={isSelected ? "#F59E0B" : "rgba(255,255,255,0.45)"}
                          strokeWidth={isSelected ? 3 : 1}
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>

                      <div className="relative z-10 flex flex-col items-center justify-center px-5 py-2.5 text-center text-white">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          <span className="text-[11.5px] font-extrabold tracking-wide sm:text-xs">
                            {index + 1}. {stage.label.toUpperCase()}
                          </span>
                          <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-extrabold text-white">
                            Tổng: {stage.reached} khách
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] font-semibold text-white/95">
                          Đang ở giai đoạn: {stage.current} khách
                        </p>
                      </div>
                    </button>

                    {hoveredKey === tierHoverKey && (
                      <HoverCustomerPopover
                        title={`${index + 1}. ${stage.label}`}
                        subtitle={tierHoverSubtitle}
                        leads={tierHoverLeads}
                        nowMs={nowMs}
                        onOpenLead={onOpenLead}
                        positionClass="left-0 top-full pt-1.5 lg:left-full lg:top-0 lg:pl-2.5 lg:pt-0"
                        emptyText="Chưa có khách hàng ở giai đoạn này."
                      />
                    )}
                  </div>

                  {/* Tỷ lệ chuyển đổi % hiển thị trực tiếp giữa từng giai đoạn ngay trên phễu */}
                  {nextStage && (
                    <div className="my-1.5 flex w-full items-center justify-center">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-0.5 text-[11px] font-bold text-slate-700 shadow-2xs">
                        <ArrowDown className="h-3 w-3 shrink-0 text-indigo-600" />
                        <span>
                          Chuyển sang {nextStage.label}:{" "}
                          <strong className="text-indigo-700">{fmtPct(nextStage.stepRate)}</strong>
                        </span>
                        <span className="font-semibold text-slate-400">
                          ({nextStage.reached}/{stage.reached})
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* KHỐI: KHÁCH HÀNG RỚT KHỎI PHỄU (LOST) */}
          <div
            className="relative mt-3 w-full border-t border-slate-200/80 pt-3"
            onMouseEnter={() => setHoveredKey("tier:LOST")}
            onMouseLeave={() => setHoveredKey((prev) => (prev === "tier:LOST" ? null : prev))}
          >
            <button
              type="button"
              onClick={() => handleSelectStage("LOST")}
              aria-pressed={activeDetailStage === "LOST"}
              className={`group flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                activeDetailStage === "LOST"
                  ? "border-rose-400 bg-rose-50/90 ring-2 ring-rose-200"
                  : "border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                  <XCircle className="h-4 w-4" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                      Rớt khỏi phễu (Không thành)
                    </span>
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                      {lostBreakdown.totalLost} khách ({fmtPct(lostBreakdown.lostPct)})
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {lostBreakdown.totalLost === 0
                      ? "Chưa có khách nào rớt khỏi phễu"
                      : "Di chuột hoặc nhấp xem chi tiết lý do & nguồn khách"}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-rose-600" />
            </button>

            {hoveredKey === "tier:LOST" && (
              <HoverCustomerPopover
                title="Khách hàng rớt khỏi phễu"
                subtitle="Danh sách khách không thành kèm bước rớt & lý do"
                leads={lostLeads}
                nowMs={nowMs}
                onOpenLead={onOpenLead}
                positionClass="left-0 top-full pt-1.5 lg:left-full lg:bottom-0 lg:top-auto lg:pl-2.5 lg:pt-0"
                emptyText="Chưa có khách nào rớt khỏi phễu."
              />
            )}
          </div>
        </div>

        {/* CỘT PHẢI (lg:col-span-7): THÔNG TIN CHI TIẾT GIAI ĐOẠN ĐANG CHỌN TỪ DỮ LIỆU THẬT */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:col-span-7">
          {/* Header giai đoạn đang chọn */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                style={{
                  background: `linear-gradient(135deg, ${STAGE_STYLE[activeDetailStage].start}, ${STAGE_STYLE[activeDetailStage].end})`,
                }}
              >
                {React.createElement(STAGE_STYLE[activeDetailStage].icon, { className: "h-4 w-4" })}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 sm:text-base">
                    {activeDetailStage === "LOST"
                      ? "Khách hàng rớt khỏi phễu (Không thành)"
                      : `${activePipelineIndex + 1}. Giai đoạn: ${STAGE_GUIDE[activeDetailStage].funnelLabel}`}
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${STAGE_STYLE[activeDetailStage].badge}`}
                  >
                    {activeDetailStage === "LOST"
                      ? `${currentStageLeads.length} khách rớt`
                      : `Đang ở giai đoạn: ${currentStageLeads.length} • Tổng: ${reachedStageLeads.length}`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {STAGE_GUIDE[activeDetailStage].entryRule}
                </p>
              </div>
            </div>

            {selectedStage && (
              <button
                type="button"
                onClick={() => handleSelectStage(null)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                title="Bỏ lọc giai đoạn"
              >
                <X className="h-3.5 w-3.5" /> Bỏ lọc
              </button>
            )}
          </div>

          {/* 4 Nút chỉ số thật tại giai đoạn (hover xem nhanh, bấm giữ danh sách chi tiết bên dưới) */}
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {/* Nút 1: Đang ở giai đoạn */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredKey("card:current")}
              onMouseLeave={() =>
                setHoveredKey((prev) => (prev === "card:current" ? null : prev))
              }
            >
              <button
                type="button"
                onClick={() => {
                  setDetailScopePref("current");
                  setStageViewOverride(null);
                }}
                aria-pressed={!activeFocusMode && effectiveScope === "current"}
                className={`w-full rounded-xl border p-2.5 text-center transition hover:shadow-xs ${
                  !activeFocusMode && effectiveScope === "current"
                    ? STAGE_STYLE[activeDetailStage].ring
                    : "border-slate-100 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase text-slate-500">
                  {activeDetailStage === "LOST" ? "Tổng khách rớt" : "Đang ở giai đoạn"}
                </span>
                <p className="mt-0.5 text-base font-black text-slate-900">
                  {currentStageLeads.length}{" "}
                  <span className="text-[10px] font-normal text-slate-500">khách</span>
                </p>
              </button>

              {hoveredKey === "card:current" && (
                <HoverCustomerPopover
                  title={
                    activeDetailStage === "LOST"
                      ? "Tổng khách rớt khỏi phễu"
                      : `Khách đang ở giai đoạn ${STAGE_GUIDE[activeDetailStage].funnelLabel}`
                  }
                  subtitle="Di chuyển chuột hoặc bấm để xem chi tiết từng khách"
                  leads={currentStageLeads}
                  nowMs={nowMs}
                  onOpenLead={onOpenLead}
                  positionClass="left-0 top-full pt-2"
                />
              )}
            </div>

            {/* Nút 2: Tổng vào giai đoạn / Tỷ lệ rớt chung */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredKey("card:reached")}
              onMouseLeave={() =>
                setHoveredKey((prev) => (prev === "card:reached" ? null : prev))
              }
            >
              <button
                type="button"
                onClick={() => {
                  setDetailScopePref("reached");
                  setStageViewOverride(null);
                }}
                aria-pressed={!activeFocusMode && effectiveScope === "reached"}
                className={`w-full rounded-xl border p-2.5 text-center transition hover:shadow-xs ${
                  !activeFocusMode && effectiveScope === "reached"
                    ? STAGE_STYLE[activeDetailStage].ring
                    : "border-slate-100 bg-slate-50/70 hover:border-blue-300 hover:bg-blue-50/30"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase text-slate-500">
                  {activeDetailStage === "LOST" ? "Tỷ lệ rớt chung" : "Tổng vào giai đoạn"}
                </span>
                <p className="mt-0.5 text-base font-black text-blue-700">
                  {activeDetailStage === "LOST"
                    ? fmtPct(lostBreakdown.lostPct)
                    : `${reachedStageLeads.length} khách`}
                </p>
              </button>

              {hoveredKey === "card:reached" && (
                <HoverCustomerPopover
                  title={
                    activeDetailStage === "LOST"
                      ? `Tỷ lệ rớt: ${fmtPct(lostBreakdown.lostPct)} (${lostLeads.length}/${summary.total})`
                      : `Tổng khách từng vào giai đoạn ${STAGE_GUIDE[activeDetailStage].funnelLabel}`
                  }
                  subtitle="Xem trạng thái hiện tại của tất cả khách đã vào giai đoạn này"
                  leads={reachedStageLeads}
                  nowMs={nowMs}
                  onOpenLead={onOpenLead}
                  positionClass="right-0 top-full pt-2 sm:left-0 sm:right-auto"
                />
              )}
            </div>

            {/* Nút 3: Rớt tại bước này / Tỷ lệ thắng / Sau báo giá */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredKey("card:lost_here")}
              onMouseLeave={() =>
                setHoveredKey((prev) => (prev === "card:lost_here" ? null : prev))
              }
            >
              <button
                type="button"
                onClick={() =>
                  setStageViewOverride((prev) =>
                    prev?.stage === activeDetailStage && prev.mode === "lost_here"
                      ? null
                      : { stage: activeDetailStage, mode: "lost_here" }
                  )
                }
                aria-pressed={activeFocusMode === "lost_here"}
                className={`w-full rounded-xl border p-2.5 text-center transition hover:shadow-xs ${
                  activeFocusMode === "lost_here"
                    ? "border-amber-400 bg-amber-50/80 ring-2 ring-amber-300"
                    : "border-slate-100 bg-slate-50/70 hover:border-amber-300 hover:bg-amber-50/30"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase text-slate-500">
                  {activeDetailStage === "WON"
                    ? "Tỷ lệ thắng"
                    : activeDetailStage === "LOST"
                    ? "Sau báo giá"
                    : "Rớt tại bước này"}
                </span>
                <p
                  className={`mt-0.5 text-base font-black ${
                    activeDetailStage === "WON"
                      ? "text-emerald-600"
                      : activeDetailStage === "LOST"
                      ? "text-rose-600"
                      : "text-amber-600"
                  }`}
                >
                  {activeDetailStage === "WON"
                    ? fmtPct(summary.winRateOverall)
                    : `${thirdCardLeads.length} khách`}
                </p>
              </button>

              {hoveredKey === "card:lost_here" && (
                <HoverCustomerPopover
                  title={
                    activeDetailStage === "WON"
                      ? `Hợp đồng thắng (${fmtPct(summary.winRateOverall)})`
                      : activeDetailStage === "LOST"
                      ? "Khách rớt sau khi đã báo giá"
                      : `Khách rớt tại bước ${STAGE_GUIDE[activeDetailStage].funnelLabel}`
                  }
                  subtitle="Click để hiển thị danh sách nhóm này bên dưới"
                  leads={thirdCardLeads}
                  nowMs={nowMs}
                  onOpenLead={onOpenLead}
                  positionClass="left-0 top-full pt-2 sm:left-auto sm:right-0"
                  emptyText="Không có khách hàng nào rớt tại bước này."
                />
              )}
            </div>

            {/* Nút 4: Tổng ngân sách */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredKey("card:budget")}
              onMouseLeave={() =>
                setHoveredKey((prev) => (prev === "card:budget" ? null : prev))
              }
            >
              <button
                type="button"
                onClick={() =>
                  setStageViewOverride((prev) =>
                    prev?.stage === activeDetailStage && prev.mode === "budget"
                      ? null
                      : { stage: activeDetailStage, mode: "budget" }
                  )
                }
                aria-pressed={activeFocusMode === "budget"}
                className={`w-full rounded-xl border p-2.5 text-center transition hover:shadow-xs ${
                  activeFocusMode === "budget"
                    ? "border-emerald-400 bg-emerald-50/80 ring-2 ring-emerald-300"
                    : "border-slate-100 bg-slate-50/70 hover:border-emerald-300 hover:bg-emerald-50/30"
                }`}
              >
                <span className="block text-[10px] font-bold uppercase text-slate-500">
                  Tổng ngân sách
                </span>
                <p className="mt-0.5 text-base font-black text-emerald-700">
                  {formatMoney(activeTotalBudget)}
                </p>
              </button>

              {hoveredKey === "card:budget" && (
                <HoverCustomerPopover
                  title={`Ngân sách nhóm đang xem: ${formatMoney(activeTotalBudget)}`}
                  subtitle="Sắp xếp theo giá trị từ cao xuống thấp (click để giữ danh sách)"
                  leads={budgetSortedLeads}
                  nowMs={nowMs}
                  onOpenLead={onOpenLead}
                  positionClass="right-0 top-full pt-2"
                />
              )}
            </div>
          </div>

          {/* Bộ chọn phạm vi phân tích khi xem các bước trung gian */}
          {activeDetailStage !== "LOST" && activeDetailStage !== "WON" && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
              <span className="text-[11px] font-semibold text-slate-600">
                {currentStageLeads.length === 0 && reachedStageLeads.length > 0
                  ? `0 khách đang ở giai đoạn • Đang xem ${reachedStageLeads.length} khách từng vào giai đoạn này`
                  : "Phạm vi thống kê chi tiết bên dưới:"}
              </span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setDetailScopePref("current");
                    setStageViewOverride(null);
                  }}
                  className={`rounded-md px-2 py-1 text-[11px] font-bold transition ${
                    !activeFocusMode && effectiveScope === "current"
                      ? "bg-[#0A1E5E] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Đang ở giai đoạn ({currentStageLeads.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDetailScopePref("reached");
                    setStageViewOverride(null);
                  }}
                  className={`rounded-md px-2 py-1 text-[11px] font-bold transition ${
                    !activeFocusMode && effectiveScope === "reached"
                      ? "bg-[#0A1E5E] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Tổng vào giai đoạn ({reachedStageLeads.length})
                </button>
              </div>
            </div>
          )}

          {/* KHỐI 1: PHÂN BỔ THEO NGUỒN KHÁCH HÀNG (HOTLINE, ZALO, WEBSITE, FACEBOOK...) */}
          <div className="mt-3 rounded-xl border border-slate-200/90 bg-slate-50/40 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                📌 Nguồn khách hàng ({analyzedLeads.length} lead)
              </span>
              <span className="text-[11px] font-medium text-slate-500">Tỷ lệ đóng góp</span>
            </div>

            {analyzedLeads.length === 0 ? (
              <p className="mt-2 text-center text-xs text-slate-400">
                Hiện chưa có khách hàng nào trong nhóm này.
              </p>
            ) : (
              <>
                <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  {activeSourceBreakdown.map((item) => (
                    <div
                      key={item.source}
                      className={`${item.barColor} transition-all`}
                      style={{ width: `${item.pct}%` }}
                      title={`${item.label}: ${item.count} khách (${fmtPct(item.pct)})`}
                    />
                  ))}
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {activeSourceBreakdown.map((item) => (
                    <div
                      key={item.source}
                      className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 shadow-2xs"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <div className="text-right">
                        <span className={`text-xs font-extrabold ${item.textColor}`}>
                          {item.count}
                        </span>
                        <span className="ml-1 text-[10px] text-slate-400">
                          ({fmtPct(item.pct)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* KHỐI 2: ĐỘ NHIỆT & HÀNH ĐỘNG / LÝ DO RỚT */}
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-3">
              <span className="text-xs font-bold text-slate-800">🔥 Độ nhiệt quan tâm</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                  🔥 Nóng: {activeHeatBreakdown.hot}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                  🌤 Ấm: {activeHeatBreakdown.warm}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
                  ❄️ Lạnh: {activeHeatBreakdown.cold}
                </span>
                {activeHeatBreakdown.unassigned > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-500">
                    Chưa chấm: {activeHeatBreakdown.unassigned}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-3">
              {activeDetailStage === "LOST" ? (
                <>
                  <span className="text-xs font-bold text-rose-700">
                    ⚠️ Điểm rớt &amp; Lý do phổ biến
                  </span>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Tiếp nhận: <strong>{lostBreakdown.fromNew}</strong> • Sau báo giá:{" "}
                    <strong>{lostBreakdown.fromQuoted}</strong> • Thương lượng:{" "}
                    <strong>{lostBreakdown.fromNegotiating}</strong>
                  </p>
                  <div className="mt-1 space-y-0.5">
                    {lostBreakdown.topReasons.length === 0 ? (
                      <p className="text-[11px] text-slate-400">Chưa ghi nhận lý do cụ thể.</p>
                    ) : (
                      lostBreakdown.topReasons.map(([reason, count]) => (
                        <div key={reason} className="flex items-center justify-between text-xs">
                          <span className="truncate text-slate-600">• {reason}</span>
                          <span className="font-bold text-rose-600">{count} lead</span>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-emerald-800">
                    ⚡ Việc Sale cần làm tiếp
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {STAGE_GUIDE[activeDetailStage].nextAction}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* KHỐI 3: ĐỐI CHIẾU CHI TIẾT TỪNG KHÁCH HÀNG THẬT Ở GIAI ĐOẠN */}
          <div className="mt-3 rounded-xl border border-slate-200/90 bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">
                👤 {customerListTitle}
              </span>
              {activeFocusMode && (
                <button
                  type="button"
                  onClick={() => setStageViewOverride(null)}
                  className="text-[11px] font-semibold text-blue-700 hover:underline"
                >
                  Xem theo bước mặc định
                </button>
              )}
            </div>

            {displayedCustomerLeads.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">
                Không có khách hàng nào trong mục đang chọn.
              </p>
            ) : (
              <div className="mt-2 max-h-[340px] divide-y divide-slate-100 overflow-y-auto pr-1">
                {displayedCustomerLeads.map((lead, idx) => {
                  const status = getLeadStatus(lead);
                  const srcMeta = SOURCE_META[resolveLeadSource(lead)];
                  const val = getLeadValue(lead);
                  const evtLabel = lead.event_type ? eventTypeLabel(lead.event_type) : "";

                  return (
                    <div
                      key={lead.id || idx}
                      className="flex flex-col gap-1.5 py-2.5 text-xs first:pt-1 last:pb-1"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {lead.id && onOpenLead ? (
                              <button
                                type="button"
                                onClick={() => onOpenLead(lead.id as string)}
                                className="truncate font-bold text-slate-900 hover:text-[#0A1E5E] hover:underline"
                              >
                                {lead.full_name || "Khách hàng"}
                              </button>
                            ) : lead.id ? (
                              <Link
                                href={`/admin/leads?lead=${lead.id}`}
                                className="inline-flex items-center gap-1 truncate font-bold text-slate-900 hover:text-[#0A1E5E] hover:underline"
                              >
                                {lead.full_name || "Khách hàng"}
                                <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                              </Link>
                            ) : (
                              <span className="truncate font-bold text-slate-900">
                                {lead.full_name || "Khách hàng"}
                              </span>
                            )}

                            {lead.ai_score && (
                              <span
                                className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${HEAT_META[lead.ai_score].badgeClass}`}
                              >
                                {HEAT_META[lead.ai_score].label}
                              </span>
                            )}

                            <span className="shrink-0 text-[10.5px] text-slate-500">
                              {srcMeta.icon} {srcMeta.label}
                            </span>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                            {evtLabel && (
                              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                {evtLabel}
                              </span>
                            )}
                            {lead.company_name && (
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="h-3 w-3 text-slate-400" />
                                {lead.company_name}
                              </span>
                            )}
                            {lead.phone && /\d/.test(lead.phone) && (
                              <span className="inline-flex items-center gap-1">
                                <PhoneCall className="h-3 w-3 text-slate-400" />
                                {lead.phone}
                              </span>
                            )}
                            {lead.email && (
                              <span className="inline-flex items-center gap-1">
                                <Mail className="h-3 w-3 text-slate-400" />
                                {lead.email}
                              </span>
                            )}
                            {val > 0 && (
                              <span className="font-bold text-emerald-700">
                                {formatMoney(val)}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${STAGE_STYLE[status].badge}`}
                        >
                          {LEAD_STATUS_LABELS[status]}
                        </span>
                      </div>

                      <div className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
                        {describeLeadStageState(lead, nowMs)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (showCardWrapper) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7">
        {content}
      </section>
    );
  }

  return content;
}
