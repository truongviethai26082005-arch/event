"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  Filter,
  MapPin,
  Plus,
  Users,
  Wrench,
  X,
} from "lucide-react";
import {
  AdminLead,
  EVENT_STATUS_LABELS,
  EventStatus,
  formatCurrency,
  formatDate,
  LeadStatus,
} from "@/app/admin/_components/admin-types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { calendarKind } from "@/lib/lead-funnel";

export type CalendarEventCategory = "su-kien" | "du-lich" | "thiet-bi";

export interface ExtendedCalendarEvent extends Partial<AdminLead> {
  id: string;
  full_name: string;
  company_name?: string | null;
  phone?: string;
  email?: string | null;
  event_type: string;
  category?: CalendarEventCategory;
  guest_count?: number | null;
  budget?: number | null;
  actual_revenue?: number | null;
  event_date: string;
  event_time?: string | null;
  end_time?: string | null;
  event_status: EventStatus;
  status?: LeadStatus;
  location?: string | null;
  assigned_to?: string | null;
  equipment_status?: string | null;
  payment_status?: string;
  notes?: string | null;
  /** true: lead Đã báo giá / Đang thương lượng có ngày dự kiến (chưa chốt) */
  tentative?: boolean;
}

interface EventCalendarProps {
  leads: AdminLead[];
  onRefreshLeads?: () => void;
  showWrapperCard?: boolean;
}

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

export default function EventCalendar({
  leads,
  onRefreshLeads,
  showWrapperCard = true,
}: EventCalendarProps) {
  // Ngày thật, chỉ xác định ở trình duyệt (tránh lệch giữa máy chủ dựng trang và máy người xem)
  const [today, setToday] = useState<Date | null>(null);
  // Giá trị tạm cố định; ngày thật được gán trong useEffect (không đọc giờ hiện tại lúc dựng sẵn trang)
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date(0));
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  const [filterType, setFilterType] = useState<"ALL" | CalendarEventCategory>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<ExtendedCalendarEvent | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [savingQuickAdd, setSavingQuickAdd] = useState(false);

  // Form thêm sự kiện nhanh
  // Không gán sẵn ngân sách / số khách: số giả sẽ bị cộng thẳng vào doanh thu
  const emptyQuickForm = (date: string) => ({
    fullName: "",
    phone: "",
    companyName: "",
    eventType: "",
    eventDate: date,
    eventTime: "09:00",
    location: "",
    guestCount: "",
    budget: "",
    assignedTo: "",
    notes: "",
  });
  const [quickForm, setQuickForm] = useState(() => emptyQuickForm(""));
  const [quickAddError, setQuickAddError] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => {
      const current = new Date();
      setToday(current);
      setCalendarDate(current);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const now = today ?? new Date(0);

  // Sự kiện trên lịch lấy 100% từ CRM:
  //  - Đã chốt -> sự kiện chính thức
  //  - Đã báo giá / Đang thương lượng có ngày -> "Dự kiến" (viền nét đứt)
  //  - Mới tiếp nhận / Không thành / Đã hủy / chưa có ngày -> không lên lịch
  const allEvents: ExtendedCalendarEvent[] = useMemo(() => {
    return leads.flatMap((lead) => {
      const kind = calendarKind(lead);
      if (!kind) return [];
      const type = String(lead.event_type || "").toLowerCase();
      const isTour = type.includes("tour") || type.includes("team building") || type.includes("teambuilding") || type.includes("du lịch");
      const tentative = kind === "TENTATIVE";
      return [
        {
          ...lead,
          id: lead.id,
          event_date: String(lead.event_date).slice(0, 10),
          category: isTour ? "du-lich" : "su-kien",
          event_status: tentative ? "PENDING" : lead.event_status || "CONFIRMED",
          payment_status: tentative ? "Chưa chốt: đang báo giá / thương lượng" : "Đã ký hợp đồng & nhận cọc",
          tentative,
        } as ExtendedCalendarEvent,
      ];
    });
  }, [leads]);

  // Bộ lọc theo loại hình
  const filteredEvents = useMemo(() => {
    if (filterType === "ALL") return allEvents;
    return allEvents.filter((e) => e.category === filterType);
  }, [allEvents, filterType]);

  // Hệ thống Cảnh báo Trùng lịch & Xung đột vận hành (Collision Detection)
  const conflictsMap = useMemo(() => {
    const conflicts = new Map<string, string[]>(); // eventId -> list of conflict reasons

    const confirmed = allEvents.filter((e) => !e.tentative);
    for (let i = 0; i < confirmed.length; i++) {
      for (let j = i + 1; j < confirmed.length; j++) {
        const e1 = confirmed[i];
        const e2 = confirmed[j];

        // Nếu trùng ngày
        if (e1.event_date === e2.event_date) {
          const reasons: string[] = [];

          // 1. Trùng địa điểm
          if (
            e1.location &&
            e2.location &&
            e1.location.trim().toLowerCase() === e2.location.trim().toLowerCase()
          ) {
            reasons.push(`Trùng địa điểm "${e1.location}" với sự kiện "${e2.event_type}"`);
          }

          // 2. Trùng nhân sự cốt cán
          if (
            e1.assigned_to &&
            e2.assigned_to &&
            e1.assigned_to.trim().toLowerCase() === e2.assigned_to.trim().toLowerCase()
          ) {
            reasons.push(`Trùng nhân sự phụ trách "${e1.assigned_to}" với sự kiện "${e2.event_type}"`);
          }

          if (reasons.length > 0) {
            const list1 = conflicts.get(e1.id) || [];
            conflicts.set(e1.id, [...list1, ...reasons]);

            const list2 = conflicts.get(e2.id) || [];
            conflicts.set(
              e2.id,
              [...list2, `Xung đột vận hành với sự kiện "${e1.event_type}" (${reasons.join(", ")})`]
            );
          }
        }
      }
    }

    return conflicts;
  }, [allEvents]);

  // Tính danh sách các ngày hiển thị trên lưới lịch
  const calendarDays = useMemo(() => {
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
    const next = new Date(calendarDate);
    if (calendarMode === "month") next.setMonth(next.getMonth() + direction);
    else next.setDate(next.getDate() + direction * 7);
    setCalendarDate(next);
  };

  const jumpToToday = () => {
    setCalendarDate(new Date());
  };

  const calendarTitle = useMemo(() => {
    if (calendarMode === "month") {
      return new Intl.DateTimeFormat("vi-VN", {
        month: "long",
        year: "numeric",
      }).format(calendarDate);
    }
    const first = calendarDays[0] ?? calendarDate;
    const last = calendarDays[6] ?? calendarDate;
    return `${formatDate(isoDate(first))} – ${formatDate(isoDate(last))}`;
  }, [calendarDate, calendarDays, calendarMode]);

  // Mở popup thêm nhanh sự kiện vào ngày được nhấp đúp
  const openQuickAdd = (dateStr: string) => {
    setQuickForm(emptyQuickForm(dateStr));
    setQuickAddError("");
    setIsQuickAddOpen(true);
  };
  const handleDayDoubleClick = (dateStr: string) => openQuickAdd(dateStr);

  // Lưu sự kiện mới vào Supabase / State
  const handleSaveQuickEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingQuickAdd(true);

    setQuickAddError("");
    try {
      const supabase = createSupabaseBrowserClient();
      // Sự kiện thêm thẳng vào lịch = hợp đồng ĐÃ CHỐT (khách đặt trực tiếp, không qua website)
      const newLeadData = {
        full_name: quickForm.fullName.trim(),
        phone: quickForm.phone.trim(),
        company_name: quickForm.companyName.trim() || null,
        event_type: quickForm.eventType.trim(),
        guest_count: quickForm.guestCount ? Number(quickForm.guestCount) : null,
        budget: quickForm.budget ? Number(String(quickForm.budget).replace(/[^\d]/g, "")) : null,
        event_date: quickForm.eventDate,
        event_time: quickForm.eventTime ? `${quickForm.eventTime}:00` : null,
        event_status: "CONFIRMED",
        status: "WON",
        location: quickForm.location.trim() || null,
        assigned_to: quickForm.assignedTo.trim() || null,
        notes: `[Tạo từ Lịch sự kiện] ${quickForm.notes}`.trim(),
        source: "OTHER",
      };

      const { error } = await supabase.from("leads").insert([newLeadData]);
      if (error) throw error;
      if (onRefreshLeads) onRefreshLeads();
      setIsQuickAddOpen(false);
    } catch (err) {
      setQuickAddError(err instanceof Error ? err.message : "Không lưu được sự kiện.");
    } finally {
      setSavingQuickAdd(false);
    }
  };

  // Timeline giờ cho Góc nhìn Tuần (từ 07:00 đến 21:00)
  const timeSlots = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const content = (
    <div className="space-y-4">
      {/* CẢNH BÁO TRÙNG LỊCH: tự phát hiện từ các sự kiện ĐÃ CHỐT */}
      {conflictsMap.size > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 text-rose-900 shadow-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-extrabold text-rose-900 uppercase tracking-wide">
              {conflictsMap.size} sự kiện đã chốt bị trùng địa điểm / nhân sự
            </h4>
            <ul className="mt-1 list-disc pl-4 text-rose-800 leading-relaxed">
              {allEvents
                .filter((e) => conflictsMap.has(e.id))
                .slice(0, 4)
                .map((e) => (
                  <li key={e.id}>
                    <strong>{formatDate(e.event_date)}</strong> · {e.full_name}: {conflictsMap.get(e.id)?.[0]}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {/* THANH ĐIỀU HƯỚNG & CÔNG CỤ LỊCH */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              Lịch điều hành sự kiện &amp; Tour
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#0A1E5E]">
              {filteredEvents.filter((e) => !e.tentative).length} đã chốt
            </span>
            {filteredEvents.some((e) => e.tentative) && (
              <span className="rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">
                {filteredEvents.filter((e) => e.tentative).length} dự kiến
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500 capitalize">
            {calendarTitle} &bull; Lịch lấy từ CRM: sự kiện Đã chốt và lịch Dự kiến của khách đang báo giá / thương lượng
          </p>
        </div>

        {/* Cụm nút điều hướng & góc nhìn */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nút thêm sự kiện nhanh */}
          <button
            type="button"
            onClick={() => openQuickAdd(isoDate(today ?? new Date()))}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1E5E] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#152e7a]"
          >
            <Plus className="h-4 w-4 text-[#D4AF37]" />
            <span>Thêm sự kiện đã chốt</span>
          </button>

          {/* Nút về Hôm nay */}
          <button
            type="button"
            onClick={jumpToToday}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            Hôm nay
          </button>

          {/* Bộ chuyển đổi góc nhìn Tháng / Tuần */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setCalendarMode("month")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                calendarMode === "month"
                  ? "bg-white text-[#0A1E5E] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tháng
            </button>
            <button
              type="button"
              onClick={() => setCalendarMode("week")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                calendarMode === "week"
                  ? "bg-white text-[#0A1E5E] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tuần (Timeline)
            </button>
          </div>

          {/* Mũi tên lùi / tiến */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Lùi lịch"
              onClick={() => changeCalendar(-1)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Tiến lịch"
              onClick={() => changeCalendar(1)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition shadow-xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* BỘ LỌC THEO LOẠI HÌNH (FILTER TYPE) */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          Lọc loại hình:
        </span>
        <button
          type="button"
          onClick={() => setFilterType("ALL")}
          className={`rounded-lg px-3 py-1 font-semibold transition ${
            filterType === "ALL"
              ? "bg-[#0A1E5E] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả ({allEvents.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType("su-kien")}
          className={`rounded-lg px-3 py-1 font-semibold transition ${
            filterType === "su-kien"
              ? "bg-purple-700 text-white"
              : "bg-purple-50 text-purple-700 hover:bg-purple-100"
          }`}
        >
          🎪 Lịch Sự kiện &amp; Gala ({allEvents.filter((e) => e.category === "su-kien").length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType("du-lich")}
          className={`rounded-lg px-3 py-1 font-semibold transition ${
            filterType === "du-lich"
              ? "bg-teal-700 text-white"
              : "bg-teal-50 text-teal-700 hover:bg-teal-100"
          }`}
        >
          🚌 Lịch Tour &amp; Teambuilding ({allEvents.filter((e) => e.category === "du-lich").length})
        </button>
      </div>

      {/* GIAO DIỆN LỊCH 1: GÓC NHÌN THÁNG (MONTH VIEW) */}
      {calendarMode === "month" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          {/* Thứ trong tuần */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80">
            {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"].map((day) => (
              <div key={day} className="py-2.5 text-center text-[11px] font-bold text-slate-600">
                {day}
              </div>
            ))}
          </div>

          {/* Lưới 42 ô ngày */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {calendarDays.map((day) => {
              const dateStr = isoDate(day);
              const dayEvents = filteredEvents.filter((e) => e.event_date.slice(0, 10) === dateStr);
              const inMonth = calendarDate.getMonth() === day.getMonth();
              const isToday = dateStr === isoDate(now);

              // Kiểm tra khẩn cấp trong 3 ngày tới: 24, 25, 26 tháng 10
              const isUrgent3Days =
                dateStr >= isoDate(addDays(now, 1)) && dateStr <= isoDate(addDays(now, 3));

              return (
                <div
                  key={dateStr}
                  onDoubleClick={() => handleDayDoubleClick(dateStr)}
                  className={`min-h-[110px] p-2 transition-colors duration-150 ${
                    !inMonth ? "bg-slate-50/60" : "bg-white hover:bg-slate-50/40"
                  }`}
                  title="Nhấp đúp để thêm nhanh sự kiện vào ngày này"
                >
                  {/* Header ngày */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all ${
                        isToday
                          ? "bg-[#0A1E5E] font-black text-white ring-4 ring-blue-100 shadow-sm"
                          : inMonth
                            ? "font-semibold text-slate-700"
                            : "text-slate-300 font-normal"
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {/* Huy hiệu cảnh báo 3 ngày */}
                    {isUrgent3Days && dayEvents.some((e) => !e.tentative) && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-700 animate-pulse">
                        <CircleAlert className="h-2.5 w-2.5" />
                        <span>Sắp diễn ra</span>
                      </span>
                    )}
                  </div>

                  {/* Danh sách thẻ sự kiện trên ô ngày */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      const hasConflict = conflictsMap.has(event.id);
                      const isLiveToday = isToday || event.event_status === "IN_PROGRESS";

                      // Phân loại màu sắc chuẩn theo mô tả
                      let badgeStyle = "bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 hover:bg-emerald-100";
                      if (event.tentative) {
                        badgeStyle = "bg-white text-slate-500 border border-dashed border-slate-300 hover:bg-slate-50";
                      } else if (hasConflict) {
                        badgeStyle = "bg-rose-100 text-rose-900 border-l-4 border-rose-600 ring-2 ring-rose-400 font-black animate-pulse";
                      } else if (isLiveToday) {
                        badgeStyle = "bg-blue-600 text-white font-bold shadow-xs hover:bg-blue-700";
                      } else if (isUrgent3Days) {
                        badgeStyle = "bg-rose-50 text-rose-800 border-l-2 border-rose-500 hover:bg-rose-100";
                      } else if (event.event_status === "PENDING") {
                        badgeStyle = "bg-amber-50 text-amber-800 border-l-2 border-amber-500 hover:bg-amber-100";
                      }

                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className={`group flex w-full flex-col rounded-md px-1.5 py-1 text-left text-[10px] leading-tight transition-all shadow-2xs ${badgeStyle}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="truncate font-bold">
                              {event.tentative ? "Dự kiến · " : event.event_time ? `${event.event_time.slice(0, 5)} ` : ""}
                              {event.full_name}
                            </span>
                            {hasConflict && <AlertTriangle className="h-3 w-3 shrink-0 text-rose-600" />}
                          </div>
                          <span className="truncate text-[9px] opacity-80 font-normal">
                            {event.event_type}
                          </span>
                        </button>
                      );
                    })}

                    {dayEvents.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(dayEvents[3])}
                        className="w-full text-center text-[10px] font-bold text-slate-500 hover:underline"
                      >
                        +{dayEvents.length - 3} sự kiện nữa
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GIAO DIỆN LỊCH 2: GÓC NHÌN TUẦN THEO TIMELINE KHUNG GIỜ (WEEK VIEW TIMELINE) */}
      {calendarMode === "week" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="min-w-[850px]">
            {/* Header các ngày trong tuần */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-slate-200 bg-slate-50/90 font-bold text-xs text-slate-700">
              <div className="py-3 px-2 text-center text-slate-400 border-r border-slate-200">
                Khung giờ
              </div>
              {calendarDays.map((day) => {
                const dateStr = isoDate(day);
                const isToday = dateStr === isoDate(now);
                return (
                  <div
                    key={dateStr}
                    className={`py-2.5 px-2 text-center border-r border-slate-100 ${
                      isToday ? "bg-blue-50 text-[#0A1E5E]" : ""
                    }`}
                  >
                    <div className="text-[10px] text-slate-500 font-medium">
                      {new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(day)}
                    </div>
                    <div
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-black ${
                        isToday ? "bg-[#0A1E5E] text-white" : "text-slate-800"
                      }`}
                    >
                      {day.getDate()}/{day.getMonth() + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Thân Timeline theo khung giờ từ 07:00 đến 21:00 */}
            <div className="divide-y divide-slate-100 text-xs">
              {timeSlots.map((slot) => {
                const slotHour = parseInt(slot.slice(0, 2), 10);

                return (
                  <div key={slot} className="grid grid-cols-[80px_repeat(7,1fr)] min-h-[52px]">
                    <div className="p-2 text-center text-[11px] font-semibold text-slate-400 border-r border-slate-200 bg-slate-50/40">
                      {slot}
                    </div>

                    {calendarDays.map((day) => {
                      const dateStr = isoDate(day);
                      // Lấy các sự kiện rơi vào khung giờ này
                      const slotEvents = filteredEvents.filter((e) => {
                        if (e.event_date.slice(0, 10) !== dateStr) return false;
                        const eventStartHour = e.event_time ? parseInt(e.event_time.slice(0, 2), 10) : 9;
                        const eventEndHour = e.end_time ? parseInt(e.end_time.slice(0, 2), 10) : eventStartHour + 3;
                        return slotHour >= eventStartHour && slotHour < eventEndHour;
                      });

                      const isCollision = slotEvents.filter((e) => !e.tentative).length > 1;

                      return (
                        <div
                          key={dateStr}
                          onDoubleClick={() => handleDayDoubleClick(dateStr)}
                          className={`p-1 border-r border-slate-100 relative ${
                            isCollision ? "bg-rose-50/70" : "hover:bg-slate-50/40"
                          }`}
                        >
                          {slotEvents.map((event) => {
                            const hasConflict = conflictsMap.has(event.id);

                            return (
                              <button
                                key={event.id}
                                type="button"
                                onClick={() => setSelectedEvent(event)}
                                className={`w-full text-left p-1.5 rounded-lg text-[10px] leading-tight mb-1 transition shadow-xs ${
                                  event.tentative
                                    ? "border border-dashed border-slate-300 bg-white text-slate-500"
                                    : hasConflict
                                    ? "bg-rose-600 text-white font-extrabold"
                                    : event.event_status === "IN_PROGRESS"
                                      ? "bg-blue-600 text-white font-bold"
                                      : "bg-emerald-500 text-white font-semibold"
                                }`}
                              >
                                <div className="truncate font-black">{event.tentative ? "Dự kiến · " : ""}{event.full_name}</div>
                                <div className="truncate text-[9px] opacity-90">{event.event_type}</div>
                                <div className="truncate text-[8px] opacity-80">{event.location}</div>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CHÂN LỊCH: CHÚ THÍCH MÀU SẮC PHÂN LOẠI CHUẨN */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-emerald-500 shadow-xs" />
            <strong className="text-slate-800">Màu xanh lá:</strong> Đã chốt (ký hợp đồng &amp; nhận cọc)
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md border border-dashed border-slate-400 bg-white" />
            <strong className="text-slate-800">Viền nét đứt:</strong> Dự kiến (đang báo giá / thương lượng, chưa chốt)
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-rose-500 animate-pulse shadow-xs" />
            <strong className="text-slate-800">Màu đỏ:</strong> Sắp diễn ra trong 3 ngày (kiểm tra gấp khâu chuẩn bị)
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-blue-600 shadow-xs" />
            <strong className="text-slate-800">Màu xanh dương:</strong> Đang diễn ra hôm nay
          </span>

          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <strong className="text-rose-700">Cảnh báo nhấp nháy:</strong> Trùng lịch / Xung đột sảnh &amp; nhân sự
          </span>
        </div>

        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1 font-bold text-[#0A1E5E] hover:underline"
        >
          Quản lý toàn bộ hồ sơ sự kiện <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* POPUP 1: MODAL XEM CHI TIẾT SỰ KIỆN KHI CLICK VÀO Ô NGÀY (QUICK VIEW / DRILL-DOWN) */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs animate-fadeIn"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedEvent(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-5"
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#0A1E5E] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#D4AF37]">
                    {selectedEvent.category === "du-lich" ? "Tour Du Lịch" : "Sự kiện & Hội nghị"}
                  </span>
                  {selectedEvent.tentative ? (
                    <span className="rounded-md border border-dashed border-slate-400 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      DỰ KIẾN · CHƯA CHỐT
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500">
                      {EVENT_STATUS_LABELS[selectedEvent.event_status]}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-black text-slate-900">
                  {selectedEvent.event_type}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cảnh báo xung đột nếu sự kiện này bị trùng lịch */}
            {conflictsMap.has(selectedEvent.id) && (
              <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900 space-y-1 animate-pulse">
                <div className="flex items-center gap-1.5 font-bold text-rose-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Cảnh báo xung đột vận hành:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                  {conflictsMap.get(selectedEvent.id)?.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Chi tiết vận hành */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400">Khách hàng / Công ty</p>
                <p className="font-extrabold text-sm text-slate-900">{selectedEvent.full_name}</p>
                {selectedEvent.company_name && (
                  <p className="text-slate-600 font-semibold">{selectedEvent.company_name}</p>
                )}
                {selectedEvent.phone && (
                  <a href={`tel:${selectedEvent.phone}`} className="text-[#0A1E5E] font-bold hover:underline block pt-0.5">
                    📞 {selectedEvent.phone}
                  </a>
                )}
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400">Thời gian tổ chức</p>
                <p className="font-extrabold text-sm text-slate-900">{formatDate(selectedEvent.event_date)}</p>
                <p className="text-slate-600 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    Khung giờ: {selectedEvent.event_time ? selectedEvent.event_time.slice(0, 5) : "Chưa đặt giờ"} &ndash;{" "}
                    {selectedEvent.end_time ? selectedEvent.end_time.slice(0, 5) : "Chưa đặt giờ kết thúc"}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400">Sảnh / Địa điểm</p>
                <p className="font-bold text-slate-800 flex items-start gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#0A1E5E] shrink-0 mt-0.5" />
                  <span>{selectedEvent.location || "Chưa cập nhật địa điểm"}</span>
                </p>
                <p className="text-slate-500 pt-1">
                  Quy mô: <strong>{selectedEvent.guest_count ? `${selectedEvent.guest_count} khách` : "Theo thỏa thuận"}</strong>
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400">Nhân sự phụ trách</p>
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span>{selectedEvent.assigned_to || "Chưa phân công"}</span>
                </p>
                <p className="text-slate-500 pt-1">
                  Tình trạng: <strong>{selectedEvent.payment_status}</strong>
                </p>
              </div>
            </div>

            {/* Thiết bị & Ghi chú */}
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-700 flex items-center gap-1">
                <Wrench className="h-3.5 w-3.5 text-[#0A1E5E]" />
                <span>Hạng mục thi công &amp; Thiết bị:</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                {selectedEvent.equipment_status || "Chưa cập nhật."}
              </p>
              {selectedEvent.notes && (
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 mt-1">
                  <strong>Ghi chú:</strong> {selectedEvent.notes}
                </p>
              )}
            </div>

            {/* Footer hành động */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs font-bold text-slate-900">
                {selectedEvent.tentative ? "Ngân sách khách khai" : "Giá trị hợp đồng"}:{" "}
                {selectedEvent.budget ? formatCurrency(selectedEvent.budget) : "Chưa cập nhật"}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/leads?lead=${encodeURIComponent(selectedEvent.id)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1E5E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#152e7a]"
                >
                  <span>Mở hồ sơ CRM đầy đủ</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: MODAL "THÊM SỰ KIỆN NHANH" (+) */}
      {isQuickAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs animate-fadeIn"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsQuickAddOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Khách đặt trực tiếp · lưu vào CRM với trạng thái Đã chốt
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Thêm sự kiện đã chốt ({formatDate(quickForm.eventDate)})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEvent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khách hàng / Liên hệ *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Anh Minh - Giám đốc"
                    value={quickForm.fullName}
                    onChange={(e) => setQuickForm({ ...quickForm, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E] focus:ring-1 focus:ring-[#0A1E5E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0912 345 678"
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E] focus:ring-1 focus:ring-[#0A1E5E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên sự kiện / Tour *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Khai trương chi nhánh 2"
                    value={quickForm.eventType}
                    onChange={(e) => setQuickForm({ ...quickForm, eventType: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E] focus:ring-1 focus:ring-[#0A1E5E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá trị hợp đồng (VNĐ)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="VD: 52000000"
                    value={quickForm.budget}
                    onChange={(e) => setQuickForm({ ...quickForm, budget: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày tổ chức</label>
                  <input
                    type="date"
                    required
                    value={quickForm.eventDate}
                    onChange={(e) => setQuickForm({ ...quickForm, eventDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giờ bắt đầu</label>
                  <input
                    type="time"
                    value={quickForm.eventTime}
                    onChange={(e) => setQuickForm({ ...quickForm, eventTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa điểm tổ chức</label>
                  <input
                    type="text"
                    placeholder="VD: Khách sạn Lotte Liễu Giai"
                    value={quickForm.location}
                    onChange={(e) => setQuickForm({ ...quickForm, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nhân sự phụ trách</label>
                  <input
                    type="text"
                    placeholder="VD: Mr. Tuấn Anh"
                    value={quickForm.assignedTo}
                    onChange={(e) => setQuickForm({ ...quickForm, assignedTo: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Số khách</label>
                <input
                  type="number"
                  min="0"
                  placeholder="VD: 200"
                  value={quickForm.guestCount}
                  onChange={(e) => setQuickForm({ ...quickForm, guestCount: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú vận hành</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú yêu cầu nhân sự, âm thanh hoặc lưu ý khách..."
                  value={quickForm.notes}
                  onChange={(e) => setQuickForm({ ...quickForm, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 text-slate-900 outline-none focus:border-[#0A1E5E]"
                />
              </div>

              {quickAddError && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">{quickAddError}</p>
              )}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingQuickAdd}
                  className="rounded-xl bg-[#0A1E5E] px-5 py-2 font-bold text-white shadow-sm transition hover:bg-[#152e7a] disabled:opacity-50"
                >
                  {savingQuickAdd ? "Đang lưu..." : "Tạo sự kiện lên lịch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const body = today ? (
    content
  ) : (
    <div className="h-64 animate-pulse rounded-2xl bg-slate-100" aria-label="Đang tải lịch" />
  );

  if (showWrapperCard) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {body}
      </section>
    );
  }

  return body;
}
