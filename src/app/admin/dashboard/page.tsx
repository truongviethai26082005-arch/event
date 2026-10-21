"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleDollarSign,
  ClipboardList,
  Radar,
  Users,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  AdminLead,
  ADMIN_LEAD_SELECT,
  LEAD_SOURCE_LABELS,
  LEAD_SOURCES,
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  EVENT_STATUS_LABELS,
  LeadSource,
  LeadStatus,
  eventTypeLabel,
  formatCurrency,
  formatDate,
  getDatabaseError,
} from "@/app/admin/_components/admin-types";

type CalendarMode = "month" | "week";

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

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
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  const [selectedEvent, setSelectedEvent] = useState<AdminLead | null>(null);
  const [selectedStage, setSelectedStage] = useState<LeadStatus | null>(null);
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);

  useEffect(() => {
    const initialization = window.setTimeout(() => {
      const current = new Date();
      setNow(current);
      setCalendarDate(current);
    }, 0);

    async function loadLeads() {
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
    }

    void loadLeads();
    return () => window.clearTimeout(initialization);
  }, []);

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

  const events = useMemo(
    () =>
      leads.filter(
        (lead) =>
          (lead.event_status === "CONFIRMED" ||
            lead.event_status === "IN_PROGRESS") &&
          Boolean(lead.event_date)
      ),
    [leads]
  );
  const urgentEvents = useMemo(() => {
    if (!now) return [];
    const today = isoDate(now);
    const lastAlertDate = isoDate(addDays(now, 3));
    return events
      .filter(
        (event) =>
          Boolean(event.event_date) &&
          event.event_date!.slice(0, 10) >= today &&
          event.event_date!.slice(0, 10) <= lastAlertDate
      )
      .sort((first, second) =>
        `${first.event_date} ${first.event_time || ""}`.localeCompare(
          `${second.event_date} ${second.event_time || ""}`
        )
      );
  }, [events, now]);

  const calendarDays = useMemo(() => {
    if (!calendarDate) return [];
    const anchor = new Date(calendarDate);
    if (calendarMode === "week") {
      const first = new Date(anchor);
      first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
      return Array.from({ length: 7 }, (_, index) => addDays(first, index));
    }
    const firstDay = monthStart(anchor);
    firstDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, index) => addDays(firstDay, index));
  }, [calendarDate, calendarMode]);

  const changeCalendar = (direction: number) => {
    if (!calendarDate) return;
    const next = new Date(calendarDate);
    if (calendarMode === "month") next.setMonth(next.getMonth() + direction);
    else next.setDate(next.getDate() + direction * 7);
    setCalendarDate(next);
  };

  const calendarTitle = calendarDate
    ? calendarMode === "month"
      ? new Intl.DateTimeFormat("vi-VN", {
          month: "long",
          year: "numeric",
        }).format(calendarDate)
      : `${formatDate(isoDate(calendarDays[0] ?? calendarDate))} – ${formatDate(
          isoDate(calendarDays[6] ?? calendarDate)
        )}`
    : "Đang tải lịch...";

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
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Phễu chuyển đổi khách hàng
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Tổng quan lead theo trạng thái hiện tại
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1E5E] hover:underline"
            >
              Xem danh sách <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {stageCounts.map(({ status, count }, index) => (
              <button
                key={status}
                type="button"
                aria-pressed={selectedStage === status}
                onClick={() =>
                  setSelectedStage((current) => current === status ? null : status)
                }
                className={`grid w-full grid-cols-[130px_1fr_34px] items-center gap-3 rounded-lg p-1 text-left transition ${
                  selectedStage === status ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-50"
                }`}
              >
                <span className="truncate text-xs font-semibold text-slate-600">
                  {LEAD_STATUS_LABELS[status]}
                </span>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      ["bg-blue-500", "bg-indigo-500", "bg-amber-500", "bg-emerald-500", "bg-slate-400"][index]
                    }`}
                    style={{ width: `${Math.max(count ? 5 : 0, (count / maxStage) * 100)}%` }}
                  />
                </div>
                <span className="text-right text-xs font-bold text-slate-800">{count}</span>
              </button>
            ))}
          </div>
          <div aria-live="polite" className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500">
              {selectedStageData
                ? `${LEAD_STATUS_LABELS[selectedStageData.status]}: ${selectedStageData.count} lead`
                : "Chọn một trạng thái để xem chi tiết"}
            </span>
            {selectedStageData && (
              <Link
                href={`/admin/leads?status=${selectedStageData.status}`}
                className="font-bold text-[#0A1E5E] hover:underline"
              >
                Mở danh sách đã lọc
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-extrabold text-slate-900">Nguồn khách hàng</h2>
          <p className="mt-1 text-xs text-slate-500">Phân bổ theo kênh tiếp nhận</p>
          <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div
              role="img"
              aria-label={`Biểu đồ nguồn khách hàng, tổng ${sourceTotal} lead`}
              className="relative h-40 w-40 shrink-0 rounded-full"
              style={{ background: sourceGradient }}
            >
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white text-center">
                <span className="text-2xl font-black text-slate-900">
                  {selectedSourceData?.count ?? sourceTotal}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {selectedSourceData
                    ? LEAD_SOURCE_LABELS[selectedSourceData.source]
                    : "Tổng lead"}
                </span>
              </div>
            </div>
            <div className="w-full space-y-1">
              {sourceCounts.map(({ source, count }, index) => (
                <button
                  key={source}
                  type="button"
                  aria-pressed={selectedSource === source}
                  onClick={() =>
                    setSelectedSource((current) => current === source ? null : source)
                  }
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-xs transition ${
                    selectedSource === source ? "bg-amber-50 ring-1 ring-amber-200" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2 font-semibold text-slate-600">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: sourceColors[index] }}
                    />
                    <span className="truncate">{LEAD_SOURCE_LABELS[source]}</span>
                  </span>
                  <span className="font-bold text-slate-800">{count}</span>
                </button>
              ))}
              {selectedSourceData && (
                <Link
                  href={`/admin/leads?source=${selectedSourceData.source}`}
                  className="mt-2 inline-flex text-xs font-bold text-[#0A1E5E] hover:underline"
                >
                  Xem lead từ nguồn này
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {urgentEvents.length > 0 && (
        <section
          aria-label="Cảnh báo sự kiện sắp diễn ra"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-extrabold text-rose-900">
                {urgentEvents.length} sự kiện sẽ diễn ra trong 3 ngày tới
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {urgentEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-left text-xs font-semibold text-rose-900 hover:bg-rose-100"
                  >
                    {eventTypeLabel(event.event_type)} · {event.full_name} ·{" "}
                    {formatDate(event.event_date)}
                    {event.event_time ? ` ${event.event_time.slice(0, 5)}` : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Lịch sự kiện</h2>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-500">{calendarTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-100 p-1">
              {(["month", "week"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCalendarMode(mode)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold ${
                    calendarMode === mode
                      ? "bg-white text-[#0A1E5E] shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {mode === "month" ? "Tháng" : "Tuần"}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Lùi lịch"
              onClick={() => changeCalendar(-1)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Tiến lịch"
              onClick={() => changeCalendar(1)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/70">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="py-2 text-center text-[11px] font-bold text-slate-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const date = isoDate(day);
            const dayEvents = events.filter((event) => event.event_date?.slice(0, 10) === date);
            const inMonth = calendarDate?.getMonth() === day.getMonth();
            const urgent =
              now !== null &&
              date >= isoDate(now) &&
              date <= isoDate(addDays(now, 3));
            return (
              <div
                key={date}
                className={`min-h-24 border-b border-r border-slate-100 p-1.5 sm:min-h-28 sm:p-2 ${
                  !inMonth && calendarMode === "month" ? "bg-slate-50/60" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      now && date === isoDate(now)
                        ? "bg-[#0A1E5E] font-bold text-white"
                        : inMonth
                          ? "font-semibold text-slate-700"
                          : "text-slate-300"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {urgent && dayEvents.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-600">
                      <CircleAlert className="h-3 w-3" />
                      3 ngày
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setSelectedEvent(event)}
                      className={`block w-full truncate rounded-md px-1.5 py-1 text-left text-[10px] font-semibold ${
                        event.event_status === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                      }`}
                    >
                      {event.event_time ? `${event.event_time.slice(0, 5)} ` : ""}
                      {event.full_name}: {eventTypeLabel(event.event_type)}
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                    <p className="px-1 text-[10px] text-slate-500">
                      +{dayEvents.length - 2} sự kiện
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 px-5 py-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> {EVENT_STATUS_LABELS.CONFIRMED}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> {EVENT_STATUS_LABELS.IN_PROGRESS}
          </span>
          <span className="inline-flex items-center gap-2">
            <CircleAlert className="h-3.5 w-3.5 text-rose-600" /> Sắp diễn ra trong 3 ngày
          </span>
        </div>
      </section>

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedEvent(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-dialog-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#A78113]">
                  Chi tiết lịch sự kiện
                </p>
                <h3 id="event-dialog-title" className="mt-1 text-xl font-extrabold text-slate-900">
                  {eventTypeLabel(selectedEvent.event_type)}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Đóng chi tiết"
                onClick={() => setSelectedEvent(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <Detail label="Khách hàng" value={selectedEvent.full_name} />
              <Detail label="Ngày tổ chức" value={formatDate(selectedEvent.event_date)} />
              <Detail
                label="Giờ tổ chức"
                value={selectedEvent.event_time?.slice(0, 5) || "Chưa cập nhật"}
              />
              <Detail
                label="Trạng thái sự kiện"
                value={EVENT_STATUS_LABELS[selectedEvent.event_status] || "Chưa cập nhật"}
              />
              <Detail label="Địa điểm" value={selectedEvent.location || "Chưa cập nhật"} />
              <Detail label="Nhân sự phụ trách" value={selectedEvent.assigned_to || "Chưa phân công"} />
              <Detail label="Thiết bị" value={selectedEvent.equipment_status || "Chưa cập nhật"} />
              <Detail label="Khách mời" value={selectedEvent.guest_count ? `${selectedEvent.guest_count} khách` : "Chưa cập nhật"} />
            </dl>
            <Link
              href={`/admin/leads?lead=${encodeURIComponent(selectedEvent.id)}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white"
            >
              Mở hồ sơ khách hàng <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      )}
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
