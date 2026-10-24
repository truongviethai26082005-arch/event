"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Check,
  CircleAlert,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Mail,
  Phone,
  Plus,
  Printer,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
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
  unit?: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Đọc số tiền bằng chữ tiếng Việt chính xác chuẩn kế toán doanh nghiệp
 */
function readVietnameseCurrency(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return "Không đồng chẵn.";

  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  function readGroup(n: number): string {
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;
    let res = "";

    if (h > 0 || n >= 100) {
      res += digits[h] + " trăm ";
    }
    if (t > 1) {
      res += digits[t] + " mươi ";
      if (o === 1) res += "mốt ";
      else if (o === 5) res += "lăm ";
      else if (o > 0) res += digits[o] + " ";
    } else if (t === 1) {
      res += "mười ";
      if (o === 5) res += "lăm ";
      else if (o > 0) res += digits[o] + " ";
    } else if (t === 0 && o > 0) {
      if (h > 0) res += "lẻ ";
      res += digits[o] + " ";
    }
    return res.trim();
  }

  let temp = Math.floor(amount);
  const groups: number[] = [];
  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  let text = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g > 0) {
      const gText = readGroup(g);
      text += gText + " " + units[i] + " ";
    }
  }

  text = text.trim();
  if (!text) return "Không đồng chẵn.";
  return text.charAt(0).toUpperCase() + text.slice(1) + " đồng chẵn.";
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

  // Proposal / Báo giá A4 state
  const [quoteLead, setQuoteLead] = useState<AdminLead | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    { title: "Gói tổ chức sự kiện", unit: "Gói", quantity: 1, unitPrice: 0 },
  ]);
  const [quoteNotes, setQuoteNotes] = useState("");
  const [vatPercent, setVatPercent] = useState<number>(8); // Mặc định VAT 8% hoặc 10%
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [quoteViewTab, setQuoteViewTab] = useState<"preview" | "edit">("preview");
  const [copiedZalo, setCopiedZalo] = useState(false);

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

  const subtotalQuote = quoteItems.reduce(
    (sum, item) => sum + Math.max(0, item.quantity) * Math.max(0, item.unitPrice),
    0
  );
  const discountAmount = Math.min(subtotalQuote, Math.max(0, discountValue));
  const afterDiscount = subtotalQuote - discountAmount;
  const vatAmount = Math.round((afterDiscount * Math.max(0, vatPercent)) / 100);
  const totalQuote = afterDiscount + vatAmount;

  const copyZaloSummary = () => {
    if (!quoteLead) return;
    const lines = [
      `🌟 BẢNG BÁO GIÁ DỊCH VỤ SỰ KIỆN - TRƯỜNG HẢI EVENT & TRAVEL`,
      `👤 Kính gửi: ${quoteLead.full_name}${quoteLead.company_name ? ` (${quoteLead.company_name})` : ""}`,
      `📞 Hotline tư vấn: 0844 198 333 - 0912 345 678`,
      `🎪 Hạng mục: ${eventTypeLabel(quoteLead.event_type)}`,
      `📍 Địa điểm: ${quoteLead.location || "Theo địa điểm chỉ định"}`,
      `👥 Quy mô: ${quoteLead.guest_count ? `${quoteLead.guest_count} khách VIP` : "Theo kịch bản"}`,
      `---------------------------------`,
      `CHI TIẾT BÓC TÁCH DỰ TOÁN:`,
      ...quoteItems.map(
        (it, idx) =>
          `${idx + 1}. ${it.title} (${it.quantity} ${it.unit || "gói"}): ${formatCurrency(
            it.quantity * it.unitPrice
          )}`
      ),
      `---------------------------------`,
      `Cộng tiền thiết bị & dịch vụ: ${formatCurrency(subtotalQuote)}`,
      discountAmount > 0 ? `Chiết khấu ưu đãi: -${formatCurrency(discountAmount)}` : "",
      vatPercent > 0 ? `Thuế GTGT (VAT ${vatPercent}%): +${formatCurrency(vatAmount)}` : "",
      `💰 TỔNG GIÁ TRỊ HỢP ĐỒNG: ${formatCurrency(totalQuote)} (đã gồm VAT)`,
      `📝 Bằng chữ: ${readVietnameseCurrency(totalQuote)}`,
      quoteNotes ? `\n📌 Ghi chú: ${quoteNotes}` : "",
      `---------------------------------`,
      `Trường Hải Event cam kết toàn bộ thiết bị âm thanh ánh sáng chuẩn châu Âu, an toàn tuyệt đối và có dự phòng 1:1.`,
    ]
      .filter(Boolean)
      .join("\n");

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(lines);
      setCopiedZalo(true);
      setTimeout(() => setCopiedZalo(false), 3000);
    }
  };

  const sendQuoteByEmail = () => {
    if (!quoteLead?.email) {
      setError("Khách hàng chưa có email để gửi báo giá.");
      return;
    }
    const body = [
      `Kính gửi ${quoteLead.full_name},`,
      "",
      `Trường Hải Event & Travel trân trọng gửi bảng dự toán báo giá cho chương trình: ${eventTypeLabel(quoteLead.event_type)}.`,
      "",
      "CHI TIẾT HẠNG MỤC TRIỂN KHAI:",
      ...quoteItems.map(
        (item, idx) =>
          `${idx + 1}. ${item.title} - ${item.quantity} ${item.unit || "gói"} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.quantity * item.unitPrice)}`
      ),
      "",
      `Cộng tiền hàng: ${formatCurrency(subtotalQuote)}`,
      discountAmount > 0 ? `Chiết khấu ưu đãi: -${formatCurrency(discountAmount)}` : "",
      vatPercent > 0 ? `Thuế GTGT (${vatPercent}%): +${formatCurrency(vatAmount)}` : "",
      `TỔNG CỘNG THANH TOÁN: ${formatCurrency(totalQuote)}`,
      `Bằng chữ: ${readVietnameseCurrency(totalQuote)}`,
      quoteNotes ? `\nGhi chú & Điều khoản: ${quoteNotes}` : "",
      "",
      "Cam kết chất lượng: Toàn bộ thiết bị âm thanh ánh sáng, màn hình LED đạt tiêu chuẩn an toàn PCCC và có thiết bị dự phòng 1:1 tại hiện trường.",
      "",
      "Trân trọng,",
      "CÔNG TY TNHH SỰ KIỆN & DU LỊCH TRƯỜNG HẢI",
      "Hotline: 0844 198 333 | Website: https://truonghaievent.com",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${encodeURIComponent(quoteLead.email)}?subject=${encodeURIComponent(
      `[Báo Giá Chính Thức] ${eventTypeLabel(quoteLead.event_type)} - Trường Hải Event & Travel`
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
                  const b = selectedLead.budget || 50000000;
                  setQuoteItems([
                    {
                      title: `Gói tổ chức ${eventTypeLabel(selectedLead.event_type)} trọn gói`,
                      unit: "Gói",
                      quantity: 1,
                      unitPrice: Math.round(b * 0.45),
                    },
                    {
                      title: "Hệ thống âm thanh Line Array RCF & ánh sáng Moving Beam 350W sân khấu chính",
                      unit: "Hệ thống",
                      quantity: 1,
                      unitPrice: Math.round(b * 0.35),
                    },
                    {
                      title: "Ekip đạo diễn chương trình, MC sự kiện & điều phối viên vận hành hiện trường",
                      unit: "Gói ekip",
                      quantity: 1,
                      unitPrice: Math.round(b * 0.20),
                    },
                  ]);
                  setQuoteNotes(
                    "1. Báo giá đã bao gồm toàn bộ chi phí vận chuyển, lắp đặt, chạy thử và tháo dỡ tại hiện trường.\n2. Hệ thống thiết bị âm thanh ánh sáng có chứng nhận kiểm định an toàn và dự phòng thiết bị 1:1.\n3. Tiến độ thanh toán: Tạm ứng 50% khi xác nhận báo giá/ký hợp đồng; 50% còn lại thanh toán trong vòng 03 ngày sau khi hoàn tất sự kiện."
                  );
                  setVatPercent(8);
                  setDiscountValue(0);
                  setQuoteViewTab("preview");
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-amber-50 px-4 py-2.5 text-sm font-bold text-[#66500E] hover:bg-amber-100 transition shadow-xs"
              >
                <FileText className="h-4 w-4 text-[#A78113]" /> Tạo báo giá / Xuất PDF A4
              </button>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          EXECUTIVE A4 PROPOSAL BUILDER & PDF PRINT TEMPLATE
      ===================================================================== */}
      {quoteLead && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-2 sm:p-4 print:p-0 print:bg-white">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            className="my-auto flex flex-col w-full max-w-5xl rounded-2xl bg-slate-100 shadow-2xl max-h-[94vh] overflow-hidden print:max-h-none print:shadow-none print:bg-white print:rounded-none"
          >
            {/* Top Toolbar (Non-printable) */}
            <div className="quote-no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A1E5E] text-white">
                  <FileText className="h-5 w-5 text-amber-300" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="quote-title" className="text-base font-extrabold text-slate-900">
                      Báo Giá Sự Kiện &amp; Bản In A4
                    </h2>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
                      DOANH NGHIỆP
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Khách hàng: <strong>{quoteLead.full_name}</strong> {quoteLead.company_name ? `(${quoteLead.company_name})` : ""} · {eventTypeLabel(quoteLead.event_type)}
                  </p>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuoteViewTab("preview")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    quoteViewTab === "preview"
                      ? "bg-white text-[#0A1E5E] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem trước Bản In A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuoteViewTab("edit")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    quoteViewTab === "edit"
                      ? "bg-white text-[#0A1E5E] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa Bóc Tách ({quoteItems.length})</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyZaloSummary}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                  title="Sao chép bảng tóm tắt chi phí để dán vào Zalo gửi khách"
                >
                  {copiedZalo ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedZalo ? "Đã chép Zalo!" : "Chép gửi Zalo"}</span>
                </button>

                <button
                  type="button"
                  onClick={sendQuoteByEmail}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                >
                  <Send className="h-3.5 w-3.5 text-slate-500" />
                  <span>Soạn Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1E5E] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#142d75] transition"
                  title="Mở hộp thoại in hoặc lưu file PDF khổ A4"
                >
                  <Printer className="h-3.5 w-3.5 text-amber-300" />
                  <span>In / Lưu PDF (A4)</span>
                </button>

                <button
                  type="button"
                  aria-label="Đóng báo giá"
                  onClick={() => setQuoteLead(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 print:p-0 print:overflow-visible">
              {/* TAB 1: BẢN IN CHUẨN A4 (PREVIEW & PRINT) */}
              {quoteViewTab === "preview" && (
                <div className="mx-auto my-0 bg-white shadow-xl rounded-xl p-8 sm:p-12 text-slate-900 border border-slate-200/60 max-w-[840px] quote-a4-document print:border-none print:shadow-none print:p-0 print:rounded-none">
                  {/* A4 Header: Logo & Company Information */}
                  <div className="flex items-start justify-between border-b-2 border-slate-800 pb-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <Image
                          src="/images/logo.png"
                          alt="Logo Trường Hải Event & Travel"
                          width={64}
                          height={64}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#A78113]">
                          HỆ THỐNG TỔ CHỨC SỰ KIỆN CHUYÊN NGHIỆP
                        </p>
                        <h1 className="text-base font-black uppercase tracking-tight text-slate-950 sm:text-lg">
                          CÔNG TY TNHH SỰ KIỆN &amp; DU LỊCH TRƯỜNG HẢI
                        </h1>
                        <p className="text-[11px] text-slate-600 leading-tight">
                          Trụ sở: Số 68 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, TP. Hà Nội
                        </p>
                        <p className="text-[11px] text-slate-600">
                          Hotline: <strong>0844 198 333</strong> · Email: contact@truonghaievent.com · MST: 0109882345
                        </p>
                      </div>
                    </div>

                    {/* Quotation No & Date Box */}
                    <div className="text-right shrink-0">
                      <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-left">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">SỐ BÁO GIÁ</p>
                        <p className="font-mono text-xs font-black text-[#0A1E5E]">
                          BG-TH2026/L{quoteLead.id.slice(0, 5).toUpperCase()}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                        </p>
                        <p className="text-[10px] font-semibold text-emerald-700">
                          Hiệu lực: 15 ngày
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document Title */}
                  <div className="my-6 text-center">
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 sm:text-2xl">
                      BẢNG DỰ TOÁN BÁO GIÁ DỊCH VỤ SỰ KIỆN
                    </h2>
                    <p className="mt-1 text-xs italic text-slate-600">
                      (V/v: Cung cấp trọn gói giải pháp thiết bị âm thanh ánh sáng, sân khấu và nhân sự vận hành)
                    </p>
                  </div>

                  {/* Client & Event Specs Box */}
                  <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <div>
                        <span className="font-semibold text-slate-500">Kính gửi Quý khách:</span>{" "}
                        <strong className="text-slate-950 text-sm">{quoteLead.full_name}</strong>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Đơn vị / Công ty:</span>{" "}
                        <strong className="text-slate-900">{quoteLead.company_name || "Khách hàng doanh nghiệp"}</strong>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Số điện thoại / Zalo:</span>{" "}
                        <span className="font-mono font-bold text-slate-900">{quoteLead.phone}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Email liên hệ:</span>{" "}
                        <span className="text-slate-800">{quoteLead.email || "Chưa cung cấp"}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Loại hình sự kiện:</span>{" "}
                        <strong className="text-[#0A1E5E]">{eventTypeLabel(quoteLead.event_type)}</strong>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Quy mô khách mời:</span>{" "}
                        <strong className="text-slate-900">{quoteLead.guest_count ? `${quoteLead.guest_count} khách VIP` : "Theo kịch bản"}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold text-slate-500">Thời gian &amp; Địa điểm:</span>{" "}
                        <span className="text-slate-900">
                          {quoteLead.event_date ? formatDate(quoteLead.event_date) : "Theo thỏa thuận hai bên"}
                          {quoteLead.event_time ? ` (${quoteLead.event_time})` : ""} · <strong>{quoteLead.location || "Địa điểm do Quý khách chỉ định"}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Quotation Table */}
                  <div className="mb-4 overflow-hidden rounded-xl border border-slate-300">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="border-b border-slate-300 bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-10 border-r border-slate-300">STT</th>
                          <th className="py-2.5 px-3 border-r border-slate-300">Danh mục Hạng mục / Thiết bị</th>
                          <th className="py-2.5 px-3 text-center w-16 border-r border-slate-300">ĐVT</th>
                          <th className="py-2.5 px-3 text-center w-16 border-r border-slate-300">SL</th>
                          <th className="py-2.5 px-3 text-right w-28 border-r border-slate-300">Đơn giá (VND)</th>
                          <th className="py-2.5 px-3 text-right w-32">Thành tiền (VND)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {quoteItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-500 border-r border-slate-200">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-200">
                              {item.title}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">
                              {item.unit || "Gói"}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-700 border-r border-slate-200">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-950">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Summary Calculation */}
                  <div className="mb-6 flex justify-end">
                    <div className="w-80 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Cộng tiền thiết bị &amp; dịch vụ:</span>
                        <span className="font-mono font-semibold">{formatCurrency(subtotalQuote)}</span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Chiết khấu ưu đãi:</span>
                          <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                        </div>
                      )}

                      {vatPercent > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>Thuế GTGT (VAT {vatPercent}%):</span>
                          <span className="font-mono font-semibold">+{formatCurrency(vatAmount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-sm font-black text-slate-950">
                        <span>TỔNG GIÁ TRỊ DỰ TOÁN:</span>
                        <span className="font-mono text-base text-[#0A1E5E]">{formatCurrency(totalQuote)}</span>
                      </div>

                      <div className="pt-1 text-right text-[11px] italic text-slate-700">
                        (Bằng chữ: <strong>{readVietnameseCurrency(totalQuote)}</strong>)
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-[11px] leading-relaxed text-slate-700">
                    <p className="font-bold uppercase text-slate-900 mb-1 text-xs">
                      ĐIỀU KHOẢN VẬN HÀNH &amp; CAM KẾT CHẤT LƯỢNG:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        <strong>Tiêu chuẩn an toàn:</strong> 100% thiết bị âm thanh ánh sáng, màn LED đạt chuẩn kiểm định an toàn điện &amp; PCCC; có kỹ sư trực vận hành và thiết bị dự phòng 1:1 tại hiện trường.
                      </li>
                      <li>
                        <strong>Tiến độ thanh toán:</strong> Tạm ứng 50% ngay sau khi ký hợp đồng/xác nhận phương án; 50% còn lại thanh toán trong vòng 03 ngày sau khi hoàn tất sự kiện và ký biên bản nghiệm thu.
                      </li>
                      <li>
                        <strong>Hiệu lực báo giá:</strong> Báo giá có giá trị trong vòng 15 ngày kể từ ngày ban hành.
                      </li>
                      {quoteNotes && (
                        <li className="text-[#0A1E5E] font-medium whitespace-pre-wrap">
                          <strong>Ghi chú bổ sung:</strong> {quoteNotes}
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Signatures & Red Company Stamp */}
                  <div className="grid grid-cols-2 gap-8 text-center text-xs pt-2">
                    {/* Client Signature Box */}
                    <div className="flex flex-col items-center">
                      <p className="font-bold uppercase text-slate-900">ĐẠI DIỆN KHÁCH HÀNG (BÊN A)</p>
                      <p className="text-[11px] italic text-slate-500 mt-0.5">(Ký, ghi rõ họ tên và đóng dấu)</p>
                      <div className="h-28 flex items-end justify-center">
                        <span className="text-[11px] text-slate-400 italic">Đã duyệt dự toán</span>
                      </div>
                      <p className="font-bold text-slate-900 mt-2">{quoteLead.full_name}</p>
                    </div>

                    {/* Company Signature & Official Stamp */}
                    <div className="flex flex-col items-center relative">
                      <p className="font-bold uppercase text-slate-900">
                        ĐẠI DIỆN TRƯỜNG HẢI EVENT (BÊN B)
                      </p>
                      <p className="text-[11px] italic text-slate-500 mt-0.5">(Ký tên và đóng dấu)</p>

                      <div className="h-28 relative w-full flex items-center justify-center">
                        {/* Realistic Mock Signature */}
                        <div className="absolute z-10 select-none">
                          <span
                            style={{ fontFamily: "cursive" }}
                            className="text-2xl font-bold tracking-wider text-blue-800 -rotate-6 block scale-110 drop-shadow-xs"
                          >
                            Trương Việt Hải
                          </span>
                        </div>

                        {/* Authentic Red Corporate Stamp (Mô Phỏng Con Dấu Mộc Đỏ) */}
                        <div className="absolute z-20 pointer-events-none -rotate-12 translate-x-3 -translate-y-1 opacity-90 select-none">
                          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-double border-red-600 bg-red-600/5 p-1 shadow-xs">
                            <div className="flex h-full w-full flex-col items-center justify-between rounded-full border border-red-600 p-1.5 text-center">
                              {/* Top Curved Text */}
                              <p className="text-[6.5px] font-black uppercase tracking-tight text-red-600 leading-none">
                                CÔNG TY TNHH SỰ KIỆN &amp; DU LỊCH
                              </p>

                              {/* Center Star & Company Name */}
                              <div className="flex flex-col items-center my-0.5">
                                <span className="text-red-600 text-[10px] leading-none">★ ★ ★</span>
                                <span className="text-[9px] font-black uppercase tracking-wider text-red-600 leading-tight">
                                  TRƯỜNG HẢI
                                </span>
                              </div>

                              {/* Bottom Tax ID */}
                              <p className="text-[6px] font-black uppercase tracking-tighter text-red-600 leading-none">
                                M.S.T: 0109882345 · TP. HÀ NỘI
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="font-bold text-slate-950 mt-2">Mr. Trương Việt Hải</p>
                      <p className="text-[11px] text-slate-600">Tổng Giám Đốc Điều Hành</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CHỈNH SỬA BÓC TÁCH CHI PHÍ (EDITOR) */}
              {quoteViewTab === "edit" && (
                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Bóc Tách Chi Tiết Hạng Mục Sự Kiện
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Thêm, bớt thiết bị và điều chỉnh đơn giá theo ngân sách thực tế của khách hàng.
                    </p>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[620px] text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Hạng mục / Thiết bị</th>
                          <th className="w-24 py-2.5 px-2">ĐVT</th>
                          <th className="w-20 py-2.5 px-2">SL</th>
                          <th className="w-36 py-2.5 px-2">Đơn giá (VND)</th>
                          <th className="w-36 py-2.5 px-3 text-right">Thành tiền</th>
                          <th className="w-10 py-2.5 px-2 text-center">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {quoteItems.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/70">
                            <td className="py-2 px-3">
                              <input
                                value={item.title}
                                placeholder="Tên gói hoặc hạng mục..."
                                onChange={(e) =>
                                  setQuoteItems((items) =>
                                    items.map((entry, idx) =>
                                      idx === index ? { ...entry, title: e.target.value } : entry
                                    )
                                  )
                                }
                                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-[#0A1E5E]"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                value={item.unit || "Gói"}
                                placeholder="Gói, Bộ, Buổi..."
                                onChange={(e) =>
                                  setQuoteItems((items) =>
                                    items.map((entry, idx) =>
                                      idx === index ? { ...entry, unit: e.target.value } : entry
                                    )
                                  )
                                }
                                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-[#0A1E5E]"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  setQuoteItems((items) =>
                                    items.map((entry, idx) =>
                                      idx === index
                                        ? { ...entry, quantity: Math.max(1, Number(e.target.value)) }
                                        : entry
                                    )
                                  )
                                }
                                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-[#0A1E5E]"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="number"
                                min="0"
                                step="100000"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  setQuoteItems((items) =>
                                    items.map((entry, idx) =>
                                      idx === index
                                        ? { ...entry, unitPrice: Math.max(0, Number(e.target.value)) }
                                        : entry
                                    )
                                  )
                                }
                                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-mono text-slate-900 outline-none focus:border-[#0A1E5E]"
                              />
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuoteItems((items) => items.filter((_, idx) => idx !== index))
                                }
                                className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setQuoteItems((items) => [
                        ...items,
                        { title: "", unit: "Gói", quantity: 1, unitPrice: 0 },
                      ])
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#0A1E5E] hover:bg-slate-50 transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> Thêm hạng mục thiết bị / dịch vụ
                  </button>

                  {/* Discount & VAT adjustment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Chiết khấu / Giảm giá (VND)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100000"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                        placeholder="Ví dụ: 5.000.000"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Thuế GTGT (VAT)
                      </label>
                      <select
                        value={vatPercent}
                        onChange={(e) => setVatPercent(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                      >
                        <option value={0}>0% (Không áp dụng thuế)</option>
                        <option value={8}>8% (Mức ưu đãi Nghị định)</option>
                        <option value={10}>10% (Chuẩn dịch vụ doanh nghiệp)</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes & Terms input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Điều khoản thanh toán &amp; Ghi chú kỹ thuật
                    </label>
                    <textarea
                      rows={3}
                      value={quoteNotes}
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      placeholder="Nhập tiến độ thanh toán, cam kết an toàn, thời hạn hiệu lực..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 outline-none focus:border-[#0A1E5E]"
                    />
                  </div>

                  {/* Action button to switch to preview */}
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                    <div>
                      <span className="text-xs text-slate-500">Tổng thanh toán dự kiến:</span>{" "}
                      <strong className="text-base font-black text-[#0A1E5E]">
                        {formatCurrency(totalQuote)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuoteViewTab("preview")}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0A1E5E] px-4 py-2 text-xs font-bold text-white hover:bg-[#142d75] transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem trước Bản In A4 &amp; Xuất PDF →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Print CSS Stylesheet */}
            <style jsx global>{`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 8mm 10mm 8mm 10mm;
                }
                body * {
                  visibility: hidden !important;
                }
                .quote-a4-document,
                .quote-a4-document * {
                  visibility: visible !important;
                }
                .quote-a4-document {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                  background: white !important;
                }
                .quote-no-print {
                  display: none !important;
                }
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
