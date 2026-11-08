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
  TrendingUp,
  Users,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import ConversionFunnel from "@/app/admin-radar/ConversionFunnel";
import CustomerSourcesChart from "@/app/admin-radar/CustomerSourcesChart";
import EventCalendar from "@/app/admin-radar/EventCalendar";
import FollowUpTasks from "@/app/admin-radar/FollowUpTasks";
import { summarizeRevenue } from "@/lib/lead-funnel";
import {
  AdminLead,
  LeadStatus,
  fetchAdminLeads,
  formatCurrency,
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
  const [crmReady, setCrmReady] = useState(true);
  /** Tổng báo giá gần nhất của từng lead (giá trị chính xác hơn ngân sách khách tự khai). */
  const [latestQuoteTotals, setLatestQuoteTotals] = useState<Map<string, number>>(new Map());

  const loadLeads = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const result = await fetchAdminLeads(supabase);
      setLeads(result.leads);
      setCrmReady(result.crmReady);
      if (result.crmReady) {
        const { data: quotes } = await supabase
          .from("lead_quotes")
          .select("lead_id,version,total")
          .order("version", { ascending: true });
        const totals = new Map<string, number>();
        (quotes ?? []).forEach((q: { lead_id: string; total: number }) => totals.set(q.lead_id, Number(q.total)));
        setLatestQuoteTotals(totals);
      }
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
    const revenue = summarizeRevenue(leads, isoDate(startThisMonth), isoDate(startNextMonth), latestQuoteTotals);
    return { leadsThisMonth, leadsLastMonth, change, ...revenue };
  }, [leads, now, latestQuoteTotals]);


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

      <section aria-label="Chỉ số kinh doanh" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
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
          title="Sự kiện đã chốt trong tháng"
          value={loading ? "…" : String(metrics?.wonEventsInMonth ?? 0)}
          detail="Đã ký hợp đồng & nhận cọc, tổ chức trong tháng"
          icon={CalendarDays}
          accent="gold"
        />
        <KpiCard
          title="Doanh thu đã chốt (tháng)"
          value={loading ? "…" : formatCurrency(metrics?.wonRevenueInMonth ?? 0)}
          detail="Tổng giá trị hợp đồng của sự kiện tổ chức trong tháng"
          icon={CircleDollarSign}
          accent="violet"
        />
        <KpiCard
          title="Doanh thu tiềm năng"
          value={loading ? "…" : formatCurrency(metrics?.pipelineValue ?? 0)}
          detail={
            metrics?.pipelineCount
              ? `${metrics.pipelineCount} khách đang báo giá / thương lượng${
                  metrics.pipelineWithoutValue ? ` (${metrics.pipelineWithoutValue} chưa có giá)` : ""
                }`
              : "Chưa có khách đang báo giá / thương lượng"
          }
          icon={TrendingUp}
          accent="blue"
        />
        <KpiCard
          title="Doanh thu thực tế (tháng)"
          value={loading ? "…" : metrics?.actualCount ? formatCurrency(metrics.actualRevenueInMonth) : "Chưa ghi nhận"}
          detail={
            metrics?.wonEventsInMonth
              ? `${metrics.actualCount}/${metrics.wonEventsInMonth} sự kiện đã nhập doanh thu thực tế`
              : "Nhập sau khi tổ chức xong, tại hồ sơ khách"
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

      <FollowUpTasks leads={leads} crmReady={crmReady} />

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


