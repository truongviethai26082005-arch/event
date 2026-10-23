"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleAlert,
  CircleDollarSign,
  ClipboardList,
  Radar,
  Users,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import ConversionFunnel from "@/app/admin-radar/ConversionFunnel";
import CustomerSourcesChart from "@/app/admin-radar/CustomerSourcesChart";
import EventCalendar from "@/app/admin-radar/EventCalendar";
import {
  AdminLead,
  ADMIN_LEAD_SELECT,
  LEAD_SOURCE_LABELS,
  LEAD_SOURCES,
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  LeadSource,
  LeadStatus,
  formatCurrency,
  formatDate,
  getDatabaseError,
} from "@/app/admin/_components/admin-types";

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [selectedStage, setSelectedStage] = useState<LeadStatus | null>(null);
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);

  const loadLeads = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: queryError } = await supabase
        .from("leads")
        .select(ADMIN_LEAD_SELECT)
        .order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setLeads((data ?? []) as AdminLead[]);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải dữ liệu khách hàng.";
      setError(getDatabaseError({ message }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialization = window.setTimeout(() => {
      const current = new Date();
      setNow(current);
    }, 0);

    void loadLeads();
    return () => window.clearTimeout(initialization);
  }, [loadLeads]);

  const metrics = useMemo(() => {
    if (!now) return null;
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const leadsThisMonth = leads.filter((lead) => {
      const created = new Date(lead.created_at);
      return created >= startThisMonth && created < startNextMonth;
    }).length;
    const leadsLastMonth = leads.filter((lead) => {
      const created = new Date(lead.created_at);
      return created >= startLastMonth && created < startThisMonth;
    }).length;
    const change =
      leadsLastMonth === 0
        ? leadsThisMonth > 0
          ? 100
          : 0
        : Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100);
    const monthlyEvents = leads.filter(
      (lead) =>
        (lead.event_status === "CONFIRMED" ||
          lead.event_status === "IN_PROGRESS") &&
        lead.event_date &&
        lead.event_date.slice(0, 10) >= isoDate(startThisMonth) &&
        lead.event_date.slice(0, 10) < isoDate(startNextMonth)
    );
    const scheduledThisMonth = leads.filter((lead) => {
      if (!lead.event_date || lead.event_status === "CANCELLED") return false;
      return (
        lead.event_date.slice(0, 10) >= isoDate(startThisMonth) &&
        lead.event_date.slice(0, 10) < isoDate(startNextMonth)
      );
    });
    const estimated = scheduledThisMonth.reduce(
      (sum, lead) => sum + Number(lead.budget || 0),
      0
    );
    const reportedRevenue = scheduledThisMonth.filter(
      (lead) =>
        lead.status === "WON" &&
        lead.actual_revenue !== null &&
        lead.actual_revenue !== undefined
    );
    const actual = reportedRevenue.reduce(
      (sum, lead) => sum + Number(lead.actual_revenue || 0),
      0
    );
    return {
      leadsThisMonth,
      leadsLastMonth,
      change,
      monthlyEvents,
      estimated,
      actual,
      reportedRevenueCount: reportedRevenue.length,
      wonEventsCount: scheduledThisMonth.filter((lead) => lead.status === "WON").length,
    };
  }, [leads, now]);


  const stageCounts = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length,
  }));
  const maxStage = Math.max(1, ...stageCounts.map((stage) => stage.count));
  const sourceCounts = LEAD_SOURCES.map((source) => ({
    source,
    count: leads.filter((lead) => lead.source === source).length,
  }));
  const sourceTotal = sourceCounts.reduce((sum, source) => sum + source.count, 0);
  const sourceColors = ["#0A1E5E", "#D4AF37", "#22c55e", "#f97316", "#94a3b8"];
  let sourceOffset = 0;
  const sourceGradient = sourceTotal
    ? `conic-gradient(${sourceCounts
        .map(({ count }, index) => {
          const start = sourceOffset;
          sourceOffset += (count / sourceTotal) * 100;
          return `${sourceColors[index]} ${start}% ${sourceOffset}%`;
        })
        .join(", ")})`
    : "#e2e8f0";
  const selectedSourceData = sourceCounts.find(
    (item) => item.source === selectedSource
  );
  const selectedStageData = stageCounts.find(
    (item) => item.status === selectedStage
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A78113]">
            TRƯỜNG HẢI EVENT &amp; TRAVEL
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Trung tâm điều hành
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi khách hàng, doanh thu dự kiến và lịch sự kiện.
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#142d75]"
        >
          <ClipboardList className="h-4 w-4" />
          Quản lý khách hàng
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <section aria-label="Chỉ số kinh doanh" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Lead mới tháng này"
          value={loading ? "…" : String(metrics?.leadsThisMonth ?? 0)}
          detail={
            metrics?.leadsLastMonth === 0 && metrics.leadsThisMonth > 0
              ? "Mới phát sinh; tháng trước không có lead"
              : `${metrics?.change ?? 0}% so với tháng trước`
          }
          icon={Users}
          trend={metrics?.leadsLastMonth ? metrics.change : undefined}
          accent="blue"
        />
        <KpiCard
          title="Sự kiện trong tháng"
          value={loading ? "…" : String(metrics?.monthlyEvents.length ?? 0)}
          detail="Đã xác nhận hoặc đang diễn ra"
          icon={CalendarDays}
          accent="gold"
        />
        <KpiCard
          title="Doanh thu dự kiến"
          value={loading ? "…" : formatCurrency(metrics?.estimated ?? 0)}
          detail="Theo ngày tổ chức trong tháng"
          icon={CircleDollarSign}
          accent="violet"
        />
        <KpiCard
          title="Doanh thu thực tế"
          value={
            loading
              ? "…"
              : metrics?.reportedRevenueCount
                ? formatCurrency(metrics.actual)
                : "Chưa ghi nhận"
          }
          detail={
            metrics?.wonEventsCount
              ? `${metrics.reportedRevenueCount}/${metrics.wonEventsCount} sự kiện đã chốt có doanh thu thực tế`
              : "Nhập doanh thu tại hồ sơ khách hàng đã chốt"
          }
          icon={CircleDollarSign}
          accent="green"
        />
      </section>

      <Link
        href="/admin-radar"
        className="group flex flex-col justify-between gap-5 rounded-2xl border border-[#0A1E5E]/10 bg-gradient-to-r from-[#0A1E5E] to-[#142d75] p-5 text-white shadow-sm transition hover:shadow-lg sm:flex-row sm:items-center sm:p-6"
      >
        <div className="flex items-start gap-4">
          <span className="rounded-2xl bg-white/10 p-3 text-[#D4AF37]">
            <Radar className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E7C65A]">
              Công cụ nội dung
            </p>
            <h2 className="mt-1 text-lg font-extrabold">Radar SEO AI</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-blue-100">
              Phân tích đối thủ và lỗ hổng thị trường, tạo bài viết chuẩn SEO,
              sau đó chỉnh sửa, lưu nháp hoặc xuất bản.
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0A1E5E] transition group-hover:bg-[#D4AF37] sm:self-auto">
          Mở Radar SEO <ArrowRight className="h-4 w-4" />
        </span>
      </Link>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <ConversionFunnel
            leads={leads}
            selectedStage={selectedStage}
            onSelectStage={setSelectedStage}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <CustomerSourcesChart leads={leads} />
        </div>
      </section>

      <EventCalendar leads={leads} onRefreshLeads={loadLeads} />
    </div>
  );
}

function KpiCard({
  title,
  value,
  detail,
  icon: Icon,
  accent,
  trend,
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Users;
  accent: "blue" | "gold" | "violet" | "green";
  trend?: number;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    gold: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <p className="mt-3 truncate text-2xl font-black tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span className={`rounded-xl p-2.5 ${colors[accent]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        {trend !== undefined &&
          (trend >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-rose-600" />
          ))}
        {detail}
      </p>
    </article>
  );
}


