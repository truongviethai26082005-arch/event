"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CircleAlert,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  AdminLead,
  ADMIN_LEAD_SELECT,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  EVENT_STATUS_LABELS,
  isEventStatus,
  isLeadSource,
  isLeadStatus,
  LeadSource,
  LeadStatus,
  eventTypeLabel,
  formatCurrency,
  formatDate,
} from "@/app/admin/_components/admin-types";

const statusColors: Record<LeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-200",
  QUOTED: "bg-violet-50 text-violet-700 ring-violet-200",
  NEGOTIATING: "bg-amber-50 text-amber-800 ring-amber-200",
  WON: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  LOST: "bg-slate-100 text-slate-600 ring-slate-200",
};

interface QuoteItem {
  title: string;
  quantity: number;
  unitPrice: number;
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "ALL">("ALL");
  const [eventTypeFilter, setEventTypeFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [saving, setSaving] = useState(false);
  const [quoteLead, setQuoteLead] = useState<AdminLead | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    { title: "Gói tổ chức sự kiện", quantity: 1, unitPrice: 0 },
  ]);
  const [quoteNotes, setQuoteNotes] = useState("");

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: queryError } = await supabase
        .from("leads")
        .select(ADMIN_LEAD_SELECT)
        .order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setLeads((data ?? []) as AdminLead[]);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message.includes("column") || loadError.message.includes("schema cache")
            ? "Cơ sở dữ liệu chưa có các trường quản trị mới. Hãy áp dụng migration Supabase để quản lý CRM."
            : loadError.message
          : "Không thể tải danh sách khách hàng."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLeads();
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const leadId = params.get("lead");
      const requestedStatus = params.get("status");
      const requestedSource = params.get("source");
      if (requestedStatus && isLeadStatus(requestedStatus)) {
        setStatusFilter(requestedStatus);
      }
      if (requestedSource && isLeadSource(requestedSource)) {
        setSourceFilter(requestedSource);
      }
      if (!leadId) return;
      const match = leads.find((lead) => lead.id === leadId);
      if (match) setSelectedLead(match);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [leads]);

  const eventTypes = useMemo(
    () => [...new Set(leads.map((lead) => eventTypeLabel(lead.event_type)).filter(Boolean))],
    [leads]
  );

  const filteredLeads = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("vi");
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        [lead.full_name, lead.phone, lead.email || "", lead.company_name || ""]
          .join(" ")
          .toLocaleLowerCase("vi")
          .includes(search);
      const created = lead.created_at?.slice(0, 10) ?? "";
      return (
        matchesSearch &&
        (statusFilter === "ALL" || lead.status === statusFilter) &&
        (sourceFilter === "ALL" || lead.source === sourceFilter) &&
        (eventTypeFilter === "ALL" || eventTypeLabel(lead.event_type) === eventTypeFilter) &&
        (!dateFrom || created >= dateFrom) &&
        (!dateTo || created <= dateTo)
      );
    });
  }, [dateFrom, dateTo, eventTypeFilter, leads, query, sourceFilter, statusFilter]);

  const saveLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLead) return;
    const form = new FormData(event.currentTarget);
    const update = {
      status: String(form.get("status")) as LeadStatus,
      assigned_to: String(form.get("assigned_to") || "").trim() || null,
      event_date: String(form.get("event_date") || "") || null,
      event_time: String(form.get("event_time") || "") || null,
      event_status: String(form.get("event_status") || "PENDING"),
      location: String(form.get("location") || "").trim() || null,
      equipment_status: String(form.get("equipment_status") || "").trim() || null,
      budget: form.get("budget") ? Number(form.get("budget")) : null,
      actual_revenue: form.get("actual_revenue")
        ? Number(form.get("actual_revenue"))
        : null,
      guest_count: form.get("guest_count") ? Number(form.get("guest_count")) : null,
    };
    if (update.budget !== null && (!Number.isFinite(update.budget) || update.budget < 0)) {
      setError("Ngân sách phải là số không âm.");
      return;
    }
    if (
      update.actual_revenue !== null &&
      (!Number.isFinite(update.actual_revenue) || update.actual_revenue < 0)
    ) {
      setError("Doanh thu thực tế phải là số không âm.");
      return;
    }
    if (!isEventStatus(update.event_status)) {
      setError("Trạng thái sự kiện không hợp lệ.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: updateError } = await supabase
        .from("leads")
        .update(update)
        .eq("id", selectedLead.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      const updatedLead = data as AdminLead;
      setLeads((previous) =>
        previous.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
      );
      setSelectedLead(updatedLead);
      setNotice("Đã cập nhật hồ sơ khách hàng.");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Không thể cập nhật khách hàng."
      );
    } finally {
      setSaving(false);
    }
  };

  const totalQuote = quoteItems.reduce(
    (sum, item) => sum + Math.max(0, item.quantity) * Math.max(0, item.unitPrice),
    0
  );

  const sendQuoteByEmail = () => {
    if (!quoteLead?.email) {
      setError("Khách hàng chưa có email để gửi báo giá.");
      return;
    }
    const body = [
      `Kính gửi ${quoteLead.full_name},`,
      "",
      `Trường Hải Event & Travel gửi báo giá tham khảo cho ${eventTypeLabel(quoteLead.event_type)}:`,
      ...quoteItems.map(
        (item) =>
          `- ${item.title}: ${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.quantity * item.unitPrice)}`
      ),
      "",
      `Tổng dự kiến: ${formatCurrency(totalQuote)}`,
      quoteNotes ? `Ghi chú: ${quoteNotes}` : "",
      "",
      "Báo giá có hiệu lực sau khi được hai bên xác nhận. Vui lòng liên hệ 0844 198 333 để được tư vấn.",
      "Trân trọng,",
      "Trường Hải Event & Travel",
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${encodeURIComponent(quoteLead.email)}?subject=${encodeURIComponent(
      `Báo giá ${eventTypeLabel(quoteLead.event_type)} - Trường Hải Event`
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A78113]">
            CRM • SALES PIPELINE
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Khách hàng &amp; yêu cầu báo giá
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi lead, giao phụ trách và quản lý tiến độ chốt sự kiện.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dich-vu#bao-gia")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Nhận lead từ website
        </button>
      </header>

      {(error || notice) && (
        <div
          role={error ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            error
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error && <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{error || notice}</span>
          <button
            type="button"
            aria-label="Đóng thông báo"
            onClick={() => {
              setError("");
              setNotice("");
            }}
            className="ml-auto text-current opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.6fr)_repeat(5,minmax(135px,1fr))]">
          <label className="relative">
            <span className="sr-only">Tìm tên, số điện thoại, email hoặc công ty</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tên, công ty, điện thoại, email"
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#0A1E5E] focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <select
            aria-label="Lọc trạng thái"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value === "ALL" || isLeadStatus(event.target.value)
                  ? event.target.value
                  : "ALL"
              )
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0A1E5E]"
          >
            <option value="ALL">Tất cả trạng thái</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>{LEAD_STATUS_LABELS[status]}</option>
            ))}
          </select>
          <select
            aria-label="Lọc nguồn khách hàng"
            value={sourceFilter}
            onChange={(event) =>
              setSourceFilter(
                event.target.value === "ALL" || isLeadSource(event.target.value)
                  ? event.target.value
                  : "ALL"
              )
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0A1E5E]"
          >
            <option value="ALL">Tất cả nguồn</option>
            {LEAD_SOURCES.map((source) => (
              <option key={source} value={source}>
                {LEAD_SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
          <select
            aria-label="Lọc loại sự kiện"
            value={eventTypeFilter}
            onChange={(event) => setEventTypeFilter(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0A1E5E]"
          >
            <option value="ALL">Tất cả loại sự kiện</option>
            {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              aria-label="Từ ngày tạo"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="min-w-0 w-full text-xs text-slate-600 outline-none"
            />
          </label>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              aria-label="Đến ngày tạo"
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="min-w-0 w-full text-xs text-slate-600 outline-none"
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Hiển thị <strong className="text-slate-800">{filteredLeads.length}</strong> / {leads.length} khách hàng
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-bold">Khách hàng</th>
                <th className="px-4 py-3 font-bold">Sự kiện</th>
                <th className="px-4 py-3 font-bold">Quy mô</th>
                <th className="px-4 py-3 font-bold">Ngân sách</th>
                <th className="px-4 py-3 font-bold">Trạng thái</th>
                <th className="px-4 py-3 font-bold">Phụ trách</th>
                <th className="px-4 py-3 font-bold">Ngày nhận</th>
                <th className="px-4 py-3 text-right font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-14 text-center text-sm text-slate-500">Đang tải danh sách khách hàng...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center">
                    <p className="font-semibold text-slate-700">Chưa có khách hàng phù hợp</p>
                    <p className="mt-1 text-xs text-slate-500">Thay đổi bộ lọc hoặc chờ yêu cầu mới từ website.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="transition hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="text-left"
                      >
                        <span className="block font-bold text-slate-900 hover:text-[#0A1E5E]">{lead.full_name}</span>
                        <span className="mt-1 block text-xs text-slate-500">{lead.company_name || "Khách hàng cá nhân"}</span>
                      </button>
                    </td>
                    <td className="max-w-56 px-4 py-3.5">
                      <span className="block truncate text-sm font-semibold text-slate-800">{eventTypeLabel(lead.event_type)}</span>
                      <span className="mt-1 block text-xs text-slate-500">{LEAD_SOURCE_LABELS[lead.source] || LEAD_SOURCE_LABELS.OTHER}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-700">
                      {lead.guest_count ? `${lead.guest_count} khách` : "Chưa rõ"}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">{formatCurrency(lead.budget)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusColors[lead.status]}`}>
                        {LEAD_STATUS_LABELS[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{lead.assigned_to || "Chưa phân công"}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-[#0A1E5E] hover:text-[#0A1E5E]"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/45"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedLead(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-detail-title"
            className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#A78113]">Lead detail</p>
                <h2 id="lead-detail-title" className="mt-1 text-xl font-extrabold text-slate-900">{selectedLead.full_name}</h2>
                <p className="mt-1 text-sm text-slate-500">{selectedLead.company_name || "Khách hàng cá nhân"}</p>
              </div>
              <button type="button" aria-label="Đóng hồ sơ" onClick={() => setSelectedLead(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-7">
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${selectedLead.phone}`} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  <Phone className="h-4 w-4" /> Gọi khách
                </a>
                {selectedLead.email ? (
                  <a href={`mailto:${selectedLead.email}`} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    <Mail className="h-4 w-4" /> Gửi email
                  </a>
                ) : (
                  <span className="flex items-center justify-center gap-2 rounded-xl border border-slate-100 py-2.5 text-sm text-slate-400">
                    <Mail className="h-4 w-4" /> Chưa có email
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl bg-slate-50 p-4 text-sm">
                <LeadDetail label="Loại sự kiện" value={eventTypeLabel(selectedLead.event_type)} />
                <LeadDetail label="Nguồn" value={LEAD_SOURCE_LABELS[selectedLead.source] || "Khác"} />
                <LeadDetail label="Số khách" value={selectedLead.guest_count ? `${selectedLead.guest_count} khách` : "Chưa cập nhật"} />
                <LeadDetail label="Ngân sách dự kiến" value={formatCurrency(selectedLead.budget)} />
                <LeadDetail label="Ngày nhận yêu cầu" value={formatDate(selectedLead.created_at)} />
                <LeadDetail label="Điện thoại" value={selectedLead.phone} />
                <LeadDetail label="Email" value={selectedLead.email || "Chưa cung cấp"} />
                <LeadDetail label="Địa điểm" value={selectedLead.location || "Chưa cập nhật"} />
              </dl>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Yêu cầu &amp; ghi chú</h3>
                <p className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 p-3 text-sm leading-relaxed text-slate-600">
                  {selectedLead.notes || "Khách hàng chưa để lại ghi chú."}
                </p>
              </div>
              <form key={selectedLead.id} onSubmit={saveLead} className="space-y-4 rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-extrabold text-slate-900">Trạng thái &amp; phân công</h3>
                <label className="block text-xs font-semibold text-slate-600">
                  Trạng thái lead
                  <select name="status" defaultValue={selectedLead.status} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
                    {LEAD_STATUSES.map((status) => <option key={status} value={status}>{LEAD_STATUS_LABELS[status]}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-slate-600">
                  Nhân viên phụ trách
                  <input name="assigned_to" defaultValue={selectedLead.assigned_to || ""} placeholder="Tên Sales / Account Executive" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-slate-600">
                    Ngày tổ chức
                    <input name="event_date" type="date" defaultValue={selectedLead.event_date?.slice(0, 10) || ""} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-2 text-sm" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-600">
                    Giờ bắt đầu
                    <input name="event_time" type="time" defaultValue={selectedLead.event_time?.slice(0, 5) || ""} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-2 text-sm" />
                  </label>
                </div>
                <label className="block text-xs font-semibold text-slate-600">
                  Địa điểm tổ chức
                  <input name="location" defaultValue={selectedLead.location || ""} placeholder="Nhập địa chỉ hoặc địa điểm dự kiến" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
                </label>
                <label className="block text-xs font-semibold text-slate-600">
                  Trạng thái sự kiện
                  <select name="event_status" defaultValue={selectedLead.event_status || "PENDING"} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    {Object.entries(EVENT_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-slate-600">
                    Ngân sách dự kiến (VND)
                    <input name="budget" type="number" min="0" step="100000" defaultValue={selectedLead.budget ?? ""} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-600">
                    Doanh thu thực tế (VND)
                    <input name="actual_revenue" type="number" min="0" step="100000" defaultValue={selectedLead.actual_revenue ?? ""} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold text-slate-600">
                    Số khách
                    <input name="guest_count" type="number" min="0" defaultValue={selectedLead.guest_count ?? ""} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-600">
                    Tình trạng thiết bị
                    <input name="equipment_status" defaultValue={selectedLead.equipment_status || ""} placeholder="Chưa khảo sát" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
                  </label>
                </div>
                <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                  {saving ? "Đang lưu..." : "Lưu cập nhật hồ sơ"}
                </button>
              </form>
            </div>
            <div className="border-t border-slate-100 p-4 sm:px-7">
              <button
                type="button"
                onClick={() => {
                  setQuoteLead(selectedLead);
                  setQuoteItems([{ title: `Gói ${eventTypeLabel(selectedLead.event_type)}`, quantity: 1, unitPrice: selectedLead.budget || 0 }]);
                  setQuoteNotes("");
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-amber-50 px-4 py-2.5 text-sm font-bold text-[#66500E] hover:bg-amber-100"
              >
                <FileText className="h-4 w-4" /> Tạo báo giá / đề xuất
              </button>
            </div>
          </section>
        </div>
      )}

      {quoteLead && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="quote-title" className="quote-print-card my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#A78113]">Proposal builder</p>
                <h2 id="quote-title" className="mt-1 text-xl font-extrabold text-slate-900">Báo giá sự kiện</h2>
                <p className="mt-1 text-sm text-slate-500">Khách hàng: {quoteLead.full_name} · {eventTypeLabel(quoteLead.event_type)}</p>
              </div>
              <button type="button" aria-label="Đóng báo giá" onClick={() => setQuoteLead(null)} className="quote-no-print rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 px-5 py-5 sm:px-7">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead><tr className="border-b text-xs text-slate-500"><th className="py-2">Hạng mục</th><th className="w-20 py-2">Số lượng</th><th className="w-36 py-2">Đơn giá</th><th className="w-36 py-2 text-right">Thành tiền</th><th className="quote-no-print w-10" /></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {quoteItems.map((item, index) => (
                      <tr key={`${index}-${item.title}`}>
                        <td className="py-2 pr-2"><input aria-label={`Hạng mục ${index + 1}`} value={item.title} onChange={(event) => setQuoteItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, title: event.target.value } : entry))} className="w-full rounded-md border border-slate-200 px-2 py-1.5" /></td>
                        <td className="py-2 pr-2"><input aria-label={`Số lượng ${index + 1}`} type="number" min="1" value={item.quantity} onChange={(event) => setQuoteItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, quantity: Math.max(1, Number(event.target.value)) } : entry))} className="w-full rounded-md border border-slate-200 px-2 py-1.5" /></td>
                        <td className="py-2 pr-2"><input aria-label={`Đơn giá ${index + 1}`} type="number" min="0" step="100000" value={item.unitPrice} onChange={(event) => setQuoteItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, unitPrice: Math.max(0, Number(event.target.value)) } : entry))} className="w-full rounded-md border border-slate-200 px-2 py-1.5" /></td>
                        <td className="py-2 text-right font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</td>
                        <td className="quote-no-print py-2 pl-2"><button type="button" aria-label="Xóa hạng mục" onClick={() => setQuoteItems((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><X className="h-4 w-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={() => setQuoteItems((items) => [...items, { title: "", quantity: 1, unitPrice: 0 }])} className="quote-no-print inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1E5E]"><Plus className="h-3.5 w-3.5" /> Thêm hạng mục</button>
              <div className="flex justify-end border-t border-slate-100 pt-4">
                <p className="text-right text-sm text-slate-500">Tổng dự kiến<strong className="mt-1 block text-xl font-black text-slate-900">{formatCurrency(totalQuote)}</strong></p>
              </div>
              <label className="quote-no-print block text-xs font-semibold text-slate-600">Điều khoản / ghi chú
                <textarea value={quoteNotes} onChange={(event) => setQuoteNotes(event.target.value)} rows={3} placeholder="Thời hạn báo giá, điều khoản thanh toán..." className="mt-1.5 w-full rounded-lg border border-slate-200 p-3 text-sm font-normal" />
              </label>
              <p className="hidden print:block text-sm text-slate-600">{quoteNotes}</p>
              <div className="quote-no-print flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  <FileText className="h-4 w-4" /> Xem trước / Lưu PDF
                </button>
                <button type="button" onClick={sendQuoteByEmail} className="inline-flex items-center gap-2 rounded-lg bg-[#0A1E5E] px-4 py-2 text-sm font-bold text-white hover:bg-[#142d75]">
                  <Send className="h-4 w-4" /> Soạn email báo giá
                </button>
              </div>
            </div>
            <style jsx global>{`
              @media print {
                body * { visibility: hidden !important; }
                .quote-print-card, .quote-print-card * { visibility: visible !important; }
                .quote-print-card {
                  position: absolute !important;
                  inset: 0 !important;
                  width: 100% !important;
                  max-width: none !important;
                  margin: 0 !important;
                  box-shadow: none !important;
                }
                .quote-no-print { display: none !important; }
              }
            `}</style>
          </section>
        </div>
      )}
    </div>
  );
}

function LeadDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}
