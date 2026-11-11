"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  getDatabaseError,
} from "@/app/admin/_components/admin-types";
import DashboardKpiBar from "./DashboardKpiBar";

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
      void loadLeads();
    }, 0);

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
    <div className="mx-auto max-w-[1440px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Điều hành</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Tổng quan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉ số kinh doanh trong tháng, việc cần xử lý, phễu chuyển đổi và lịch sự kiện.
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#142d75]"
        >
          Danh sách khách hàng
        </Link>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {error}
        </div>
      )}

      {/* 1. Chỉ số tháng này — 4 thẻ cân đối trên 1 hàng, di chuột để xem chi tiết */}
      <DashboardKpiBar
        leads={leads}
        metrics={metrics}
        now={now}
        loading={loading}
        latestQuoteTotals={latestQuoteTotals}
      />

      {/* 2. Vận hành trong ngày: Việc cần làm (7/12) + Nguồn khách hàng (5/12) */}
      <section className="grid gap-5 xl:grid-cols-12 xl:items-stretch">
        <div className="xl:col-span-7">
          <FollowUpTasks leads={leads} crmReady={crmReady} />
        </div>

        <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
          <CustomerSourcesChart leads={leads} />
        </div>
      </section>

      {/* 3. Phễu chuyển đổi khách hàng — toàn chiều rộng để cân xứng phễu & bảng chi tiết */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
        <ConversionFunnel
          leads={leads}
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
        />
      </section>

      {/* 4. Lịch sự kiện */}
      <EventCalendar leads={leads} onRefreshLeads={loadLeads} />
    </div>
  );
}


