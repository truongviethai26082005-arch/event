"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COMPANY_INFO } from "@/lib/company-data";
import {
  CheckCircle2,
  CalendarCheck,
  FileSpreadsheet,
  Download,
  Phone,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Clock,
  ShieldCheck,
  Gift,
} from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const customerName = searchParams.get("name") || "Quý khách";
  const customerPhone = searchParams.get("phone") || "";
  const eventType = searchParams.get("event") || "Dịch vụ sự kiện & tour";

  // Hàm tải file dự toán mẫu (tạo file CSV/Excel ảo tải về ngay)
  const handleDownloadEstimator = () => {
    const csvContent =
      "\uFEFF" +
      "STT,Hạng mục công việc,Chi tiết kỹ thuật,Đơn vị,Số lượng,Đơn vị tính,Ghi chú\n" +
      "1,Hệ thống Âm thanh,Line Array công suất lớn kèm micro UHF,Hệ,1,Gói tiêu chuẩn,Chính hãng\n" +
      "2,Hệ thống Ánh sáng,Moving Beam 380W + Par LED 54 bóng,Hệ,1,Gói sân khấu,Có kỹ thuật trực\n" +
      "3,Màn hình LED,Màn hình LED P2.5 Indoor / P3.91 Outdoor,m2,20,Sắc nét,Hỗ trợ visual 4K\n" +
      "4,Nhà bạt không gian,Khung hợp kim nhôm đúc bạt 2 da Hàn Quốc,m2,150,Chống mưa nắng,Kiên cố an toàn\n" +
      "5,Sân khấu biểu diễn,Khung sắt chịu lực trải thảm đỏ mới 100%,m2,30,Cao 0.8m,Có bậc tam cấp\n" +
      "6,Đoàn Lân Sư Rồng,Tứ Quý Hưng Long 4 trống hội + Thần tài,Đoàn,1,Khai mạc,Tặng kèm theo Combo\n" +
      "7,Nhân sự kỹ thuật,Đạo diễn âm thanh ánh sáng + Kỹ thuật viên,Người,4,Toàn thời gian,Trực chiến 100%\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Bang_Du_Toan_Mau_TruongHaiEvent_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16 md:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#122868] text-white p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Checkmark Icon Circle */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>YÊU CẦU BÁO GIÁ ĐÃ ĐƯỢC GHI NHẬN THÀNH CÔNG</span>
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Cảm Ơn {customerName}!
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-3 font-light leading-relaxed">
              Phòng Dự Án của <strong>Trường Hải Event & Travel</strong> đã nhận được thông tin đăng ký cho dịch vụ{" "}
              <span className="text-[#D4AF37] font-semibold">{eventType}</span>.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* SLA Alert Box */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-900 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-sm text-[#0A1E5E]">
                  Thời Gian Phản Hồi Cam Kết: Trong Vòng 30 Phút
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed font-light">
                  Chuyên viên tư vấn kỹ thuật sẽ liên hệ trực tiếp qua số điện thoại/Zalo:{" "}
                  <strong className="text-[#0A1E5E]">{customerPhone || "của quý khách"}</strong> để trao đổi chi tiết về mặt bằng, công suất âm thanh ánh sáng và gửi bảng dự toán bóc tách chi phí.
                </p>
              </div>
            </div>

            {/* 3 Next Steps */}
            <div className="space-y-4">
              <h3 className="font-black text-base text-[#0A1E5E] flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#D4AF37]" />
                3 Bước Tiếp Theo Trong Quy Trình Hỗ Trợ:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-black text-[#D4AF37] bg-[#0A1E5E] px-2.5 py-1 rounded-md inline-block mb-2">
                    BƯỚC 1
                  </span>
                  <h4 className="font-bold text-xs text-[#0A1E5E] mb-1">
                    Tư vấn & Khảo sát 0 đồng
                  </h4>
                  <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                    Kỹ thuật viên đến tận nơi đo đạc mặt bằng sân khấu, kiểm tra hệ thống nguồn điện 3 pha và vị trí dựng nhà bạt.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-black text-[#D4AF37] bg-[#0A1E5E] px-2.5 py-1 rounded-md inline-block mb-2">
                    BƯỚC 2
                  </span>
                  <h4 className="font-bold text-xs text-[#0A1E5E] mb-1">
                    Gửi Kịch bản & Dự toán bóc tách
                  </h4>
                  <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                    Lập bảng kê chi tiết từng thiết bị, kịch bản timeline sự kiện và phối cảnh 3D sân khấu độc bản.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-black text-[#D4AF37] bg-[#0A1E5E] px-2.5 py-1 rounded-md inline-block mb-2">
                    BƯỚC 3
                  </span>
                  <h4 className="font-bold text-xs text-[#0A1E5E] mb-1">
                    Ký Hợp đồng & Triển khai sớm
                  </h4>
                  <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                    Ký hợp đồng pháp nhân, xuất hóa đơn VAT và tiến hành setup thiết bị trước giờ G tối thiểu 12-24 giờ.
                  </p>
                </div>
              </div>
            </div>

            {/* Lead Magnet Free Download Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E5E] to-[#122868] text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#D4AF37]">
                  <Gift className="w-4 h-4 text-[#D4AF37]" />
                  <span>QUÀ TẶNG ĐẶC QUYỀN ĐÃ MỞ KHÓA</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white">
                  Bộ Bảng Tính Dự Toán Ngân Sách Sự Kiện 2026
                </h4>
                <p className="text-xs text-slate-300 font-light max-w-md">
                  File Excel chuẩn hóa bóc tách các hạng mục: Sân khấu, Line Array, LED, Nhà bạt, PG, Lân Sư Rồng giúp bạn dễ dàng trình duyệt ban lãnh đạo.
                </p>
              </div>

              <button
                onClick={handleDownloadEstimator}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#cba32a] text-[#0A1E5E] font-black text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Tải Về File Mẫu Ngay</span>
              </button>
            </div>

            {/* Quick Contact Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={COMPANY_INFO.socials.zalo}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Trực Tiếp Qua Zalo ({COMPANY_INFO.hotlineDisplay})</span>
              </a>

              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#0A1E5E] hover:bg-[#122868] text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/40 shadow-md transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi Hotline 24/7: {COMPANY_INFO.hotlineDisplay}</span>
              </a>
            </div>

            {/* Back button */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <Link
                href="/dich-vu"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0A1E5E] transition"
              >
                <ArrowLeft className="w-4 h-4" />
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
    <Suspense fallback={<div className="p-10 text-center text-xs">Đang tải thông tin xác nhận...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
