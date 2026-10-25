"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COMPANY_INFO } from "@/lib/company-data";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileDown,
  Edit3,
  Phone,
  ArrowLeft,
  CalendarCheck,
  Sparkles,
  MessageCircle,
} from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [localLead, setLocalLead] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    event?: string;
    guests?: string;
    budget?: string;
    date?: string;
    location?: string;
    notes?: string;
    promo?: string;
    submittedAt?: string;
  } | null>(null);

  const [referenceCode, setReferenceCode] = useState("TH-REQ-2026-8899");

  useEffect(() => {
    setMounted(true);

    // Randomize slightly for dynamic feel or keep standard format
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setReferenceCode(`TH-REQ-2026-${randomSuffix}`);

    // Đọc thông tin dự phòng từ localStorage nếu có
    try {
      const saved = localStorage.getItem("last_submitted_lead");
      if (saved) {
        setLocalLead(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Format các trường theo đúng form thiết kế trong ảnh
  const rawName = searchParams.get("name") || (mounted && localLead?.name) || "";
  const trimmedName = rawName.trim();
  const capitalizedName = trimmedName
    ? trimmedName.replace(/(^|\s)\S/g, (char) => char.toUpperCase())
    : "";
  const customerNameFormatted = capitalizedName
    ? capitalizedName.startsWith("Anh") || capitalizedName.startsWith("Chị") || capitalizedName.startsWith("Cô") || capitalizedName.startsWith("Bác")
      ? capitalizedName
      : `Anh / Chị ${capitalizedName}`
    : "Anh / Chị Trang";

  const rawPhone = searchParams.get("phone") || (mounted && localLead?.phone) || "";
  const formatPhone = (p: string) => {
    const clean = p.replace(/\D/g, "");
    if (clean.length === 10) {
      return `${clean.slice(0, 4)}.${clean.slice(4, 7)}.${clean.slice(7)}`;
    }
    return p || "0987.654.312";
  };
  const customerPhoneFormatted = formatPhone(rawPhone);

  const rawLoc = searchParams.get("location") || (mounted && localLead?.location) || "";
  const locationFormatted = rawLoc
    ? rawLoc.includes("phụ cận")
      ? rawLoc
      : `${rawLoc} & Vùng phụ cận`
    : "Hà Nội & Vùng phụ cận";

  const rawEvent = searchParams.get("event") || (mounted && localLead?.event) || "";
  const eventTypeFormatted = rawEvent
    ? rawEvent.includes("Khai trương") || rawEvent.includes("Khánh thành")
      ? "Lễ Khai trương & Khởi công"
      : rawEvent.split("(")[0].trim()
    : "Lễ Khai trương & Khởi công";

  const rawDate = searchParams.get("date") || (mounted && localLead?.date) || "";
  const eventDateFormatted = rawDate && rawDate !== "Đang lên kế hoạch" ? rawDate : "Tháng 11 / 2026";

  const rawGuests = searchParams.get("guests") || (mounted && localLead?.guests) || "";
  const guestsFormatted = rawGuests
    ? rawGuests.includes("VIP")
      ? rawGuests
      : `${rawGuests} Khách VIP`
    : "100 – 300 Khách VIP";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14 md:py-18 font-sans print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
          
          {/* ========================================================= */}
          {/* 1. KHUNG THÔNG BÁO THÀNH CÔNG (HERO CARD - NỀN XANH NAVY) */}
          {/* ========================================================= */}
          <div className="bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#122868] text-white p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Ambient gold & blue glow circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Biểu tượng: Vòng tròn tích xanh nổi bật thể hiện trạng thái thành công */}
            <div className="relative mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-400/25 blur-lg animate-pulse" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 p-[3px] shadow-xl shadow-emerald-500/30">
                <div className="w-full h-full rounded-full bg-[#0A1E5E] flex items-center justify-center border-2 border-emerald-400">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 drop-shadow-[0_2px_10px_rgba(52,211,153,0.6)]" />
                </div>
              </div>
            </div>

            {/* Tag thông báo (đã loại bỏ icon/emoji theo yêu cầu) */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs sm:text-sm font-black tracking-wide shadow-sm mb-4">
              <span>YÊU CẦU BÁO GIÁ ĐÃ ĐƯỢC GHI NHẬN THÀNH CÔNG.</span>
            </div>

            {/* Tiêu đề chính (đã loại bỏ dấu chấm thừa) */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Cảm Ơn Quý Khách{trimmedName && trimmedName !== "Quý Khách" ? ` ${trimmedName}` : ""}!
            </h1>

            {/* Nội dung thông báo tiếp nhận */}
            <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl mx-auto mt-4 font-normal leading-relaxed">
              Phòng Dự Án của <strong className="text-white font-bold">Trường Hải Event & Travel</strong> đã tiếp nhận thông tin đăng ký tư vấn cho dịch vụ{" "}
              <span className="text-[#D4AF37] font-bold underline decoration-[#D4AF37]/50 underline-offset-4">
                {eventTypeFormatted}
              </span>.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* ========================================================= */}
            {/* 2. KHUNG THÔNG BÁO CAM KẾT LIÊN HỆ                       */}
            {/* Dạng hiển thị: Hộp viền vàng cam nổi bật kèm icon đồng hồ */}
            {/* ========================================================= */}
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border-2 border-amber-400 shadow-lg shadow-amber-500/10 flex flex-col md:flex-row items-center md:items-start gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

              {/* Icon Đồng hồ nổi bật trong khối vàng cam */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30 border border-white/20">
                <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-pulse" />
              </div>

              {/* Tiêu đề & Nội dung cam kết */}
              <div className="space-y-2 text-center md:text-left flex-1">
                <h3 className="font-black text-base sm:text-lg md:text-xl text-[#0A1E5E]">
                  Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  Chuyên viên tư vấn & kỹ thuật dự án sẽ trực tiếp gọi điện hoặc kết bạn Zalo qua số điện thoại:{" "}
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-200/90 font-black text-[#0A1E5E] text-xs sm:text-sm shadow-sm">
                    {customerPhoneFormatted}
                  </span>{" "}
                  trong vòng <strong className="text-amber-900 font-bold">15 - 30 phút</strong> để trao đổi chi tiết về mặt bằng, công suất âm thanh ánh sáng sân khấu, kịch bản chương trình và gửi bảng dự toán bóc tách chi phí hoàn chỉnh.
                </p>
              </div>
            </div>

            {/* ========================================================= */}
            {/* 3. BẢNG TÓM TẮT THÔNG TIN YÊU CẦU BÁO GIÁ (THEO FORM MẪU) */}
            {/* ========================================================= */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 md:p-9 space-y-6">
              
              {/* Header của form: Tiêu đề + Mã đơn & 2 nút Tải PDF + Chỉnh sửa */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0A1E5E] tracking-tight">
                    Tóm Tắt Yêu Cầu Báo Giá
                  </h3>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-slate-500" />
                    <span>Tải Phiếu PDF</span>
                  </button>

                  <Link
                    href="/dich-vu#bao-gia"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Chỉnh sửa</span>
                  </Link>
                </div>
              </div>

              {/* Lưới 2 khối thông tin (Grid 2 cột) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                
                {/* Khối Cột Trái: Khách hàng, Số điện thoại */}
                <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-100 flex flex-col justify-center gap-4">
                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium whitespace-nowrap shrink-0">Khách hàng:</span>
                    <span className="font-bold text-[#0A1E5E] text-right whitespace-nowrap">
                      {customerNameFormatted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium whitespace-nowrap shrink-0">Số điện thoại:</span>
                    <span className="font-bold text-[#0A1E5E] text-right whitespace-nowrap">
                      {customerPhoneFormatted}
                    </span>
                  </div>
                </div>

                {/* Khối Cột Phải: Loại hình dịch vụ, Dự kiến thời gian, Quy mô sự kiện */}
                <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium whitespace-nowrap shrink-0">Loại hình dịch vụ:</span>
                    <span className="font-bold text-[#0A1E5E] text-right whitespace-nowrap">
                      {eventTypeFormatted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium whitespace-nowrap shrink-0">Dự kiến thời gian:</span>
                    <span className="font-bold text-[#0A1E5E] text-right whitespace-nowrap">
                      {eventDateFormatted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium whitespace-nowrap shrink-0">Quy mô sự kiện:</span>
                    <span className="font-bold text-[#0A1E5E] text-right whitespace-nowrap">
                      {guestsFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Khung cam kết bảo mật ISO 27001 ở đáy thẻ */}
              <div className="p-3.5 sm:px-4 rounded-xl bg-blue-50/60 border border-blue-100/80 flex items-center gap-2.5 text-xs text-slate-600 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#0A1E5E] shrink-0" />
                <span>
                  Cam kết bảo mật tuyệt đối thông tin khách hàng theo tiêu chuẩn ISO 27001. Không chia sẻ cho bên thứ ba vì bất kỳ mục đích nào.
                </span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* 4. PHẦN CTA BÊN DƯỚI BẢNG (THEO FORM MẪU)                 */}
            {/* ========================================================= */}
            <div className="text-center pt-2 print:hidden">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`tel:${COMPANY_INFO.hotline}`}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0A1E5E] hover:bg-[#122868] text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>Gọi Trực Tiếp Giám Đốc Dự Án</span>
                </a>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Quay Về Trang Chủ</span>
                </Link>
              </div>
            </div>

            {/* Back link to services */}
            <div className="pt-4 border-t border-slate-100 text-center print:hidden">
              <Link
                href="/dich-vu"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0A1E5E] transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại Trang Danh Mục Dịch Vụ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10 font-sans">
          <div className="flex items-center gap-3 text-sm text-[#0A1E5E] font-bold bg-white px-6 py-4 rounded-2xl shadow-md border border-slate-200">
            <Clock className="w-5 h-5 animate-spin text-[#D4AF37]" />
            <span>Đang tải thông tin xác nhận yêu cầu báo giá...</span>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
