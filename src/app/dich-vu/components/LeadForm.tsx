"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COMPANY_INFO } from "@/lib/company-data";
import { supabase, isSupabaseConfigured, DatabaseLead } from "@/lib/supabase";
import { PromotionCombo } from "../data/services-data";
import {
  Send,
  Phone,
  ShieldCheck,
  Clock,
  Sparkles,
  Gift,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  X,
  MessageCircle,
  MessageSquareText,
  ArrowRight,
} from "lucide-react";

interface LeadFormProps {
  initialService?: string;
  initialPromo?: PromotionCombo | null;
  onClearPromo?: () => void;
}

export default function LeadForm({
  initialService,
  initialPromo,
  onClearPromo,
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    eventType: initialService || "Tổ chức Lễ Khai trương, Khánh thành & Khởi công",
    estimatedGuests: "100 - 300 khách",
    budgetRange: "30.000.000đ - 70.000.000đ",
    eventDate: "",
    location: "Hà Nội",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [submittedLeadParams, setSubmittedLeadParams] = useState<{
    name: string;
    phone: string;
    event: string;
  } | null>(null);

  const [submitResult, setSubmitResult] = useState<{
    type: "success" | "error" | null;
    message: string;
    submittedName?: string;
    submittedPhone?: string;
  }>({ type: null, message: "" });

  // Tự động chuyển hướng sang trang cảm ơn sau khi gửi thành công
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (redirectCountdown !== null && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (redirectCountdown === 0 && submittedLeadParams) {
      const q = new URLSearchParams({
        name: submittedLeadParams.name,
        phone: submittedLeadParams.phone,
        event: submittedLeadParams.event,
      }).toString();
      router.push(`/dich-vu/cam-on?${q}`);
    }
    return () => clearTimeout(timer);
  }, [redirectCountdown, submittedLeadParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult({ type: null, message: "" });

    // Validate phone number format (Vietnam: 10 digits starting with 0)
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 9 || cleanPhone.length > 11) {
      setSubmitResult({
        type: "error",
        message: "Vui lòng nhập số điện thoại hoặc Zalo hợp lệ (10 số) để chuyên viên tiện liên hệ tư vấn.",
      });
      setSubmitting(false);
      return;
    }

    try {
      // Build lead payload
      const promoText = initialPromo ? ` [COMBO: ${initialPromo.code} - ${initialPromo.title}]` : "";
      const eventTypeComposite = `${formData.eventType}${promoText} (Quy mô: ${formData.estimatedGuests} | Ngân sách: ${formData.budgetRange})`;

      const detailedNotes = [
        formData.notes ? `Yêu cầu: ${formData.notes}` : "",
        formData.eventDate ? `Ngày dự kiến: ${formData.eventDate}` : "",
        formData.location ? `Địa điểm: ${formData.location}` : "",
        initialPromo ? `Quà tặng áp dụng: ${initialPromo.giftItems.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const leadRecord: DatabaseLead = {
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        event_type: eventTypeComposite,
        notes: detailedNotes,
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase.from("leads").insert([leadRecord]);
        if (error) throw error;
      } else {
        // Fallback lưu offline trong localStorage khi chạy môi trường dev/chưa cấu hình Supabase
        const existing = JSON.parse(localStorage.getItem("offline_leads") || "[]");
        existing.push({ ...leadRecord, created_at: new Date().toISOString() });
        localStorage.setItem("offline_leads", JSON.stringify(existing));
        await new Promise((r) => setTimeout(r, 600));
      }

      setSubmitResult({
        type: "success",
        message: `Yêu cầu báo giá của quý khách đã được chuyển thẳng tới Giám đốc Điều hành & Phòng Dự Án của Trường Hải Event.`,
        submittedName: formData.fullName,
        submittedPhone: formData.phone,
      });

      setSubmittedLeadParams({
        name: formData.fullName,
        phone: formData.phone,
        event: formData.eventType,
      });
      setRedirectCountdown(4);

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        eventType: "Tổ chức Lễ Khai trương, Khánh thành & Khởi công",
        estimatedGuests: "100 - 300 khách",
        budgetRange: "30.000.000đ - 70.000.000đ",
        eventDate: "",
        location: "Hà Nội",
        notes: "",
      });

      if (onClearPromo) onClearPromo();
    } catch (err: any) {
      console.error("Lỗi khi gửi lead form:", err);
      setSubmitResult({
        type: "error",
        message:
          "Hệ thống đang quá tải. Quý khách vui lòng gọi ngay Hotline 24/7: 0844 198 333 để nhận báo giá và kịch bản nhanh nhất!",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="bao-gia" className="scroll-mt-24">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* CỘT TRÁI: ĐỊNH VỊ THƯƠNG HIỆU, CHỨNG CHỈ & TÍN HIỆU NIỀM TIN */}
          <div className="lg:col-span-5 bg-[#0A1E5E] text-white p-7 sm:p-9 md:p-11 flex flex-col justify-between relative overflow-hidden">
            {/* Background glowing spheres */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span>Phản Hồi & Dự Toán Trong 30 Phút</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Nhận Báo Giá Chi Tiết & Kịch Bản Độc Bản
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Hãy cho chúng tôi biết về quy mô và mong muốn của bạn. Trường Hải Event & Travel sẽ gửi ngay bảng bóc tách thiết bị minh bạch, kịch bản chương trình và phương án tiết kiệm tối đa 25% ngân sách.
              </p>

              {/* Free Lead Magnet Benefit Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                  <Gift className="w-4 h-4 text-[#D4AF37]" />
                  <span>QUYỀN LỢI ĐẶC QUYỀN KHI ĐĂNG KÝ:</span>
                </div>
                <ul className="text-xs text-slate-200 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <MessageSquareText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Tư vấn trực tiếp 1-1, cá nhân hóa phương án theo đúng ngân sách</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Kịch bản timeline MC & bóc tách chi tiết không phát sinh</span>
                  </li>
                </ul>
              </div>

              {/* Contact info list */}
              <div className="space-y-3.5 pt-2 text-xs">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Hotline khẩn cấp (Hỗ trợ 24/7):</span>
                    <a
                      href={`tel:${COMPANY_INFO.hotline}`}
                      className="font-black text-base text-[#D4AF37] hover:underline"
                    >
                      {COMPANY_INFO.hotlineDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Cam kết bảo mật & Pháp lý:</span>
                    <span className="text-slate-200 leading-tight block">
                      Ký hợp đồng pháp nhân, xuất VAT đầy đủ, bảo mật thông tin nội bộ 100%.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-8 border-t border-white/10 text-xs text-slate-400 relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span>{COMPANY_INFO.brandName}</span>
              <span>MST: {COMPANY_INFO.taxId}</span>
            </div>
          </div>

          {/* CỘT PHẢI: FORM ĐIỀN THÔNG TIN TỐI ƯU HÓA CRO */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              {/* Promotion Applied Alert Banner */}
              {initialPromo && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start justify-between gap-3 shadow-sm animate-fadeIn">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="font-black text-xs uppercase text-[#0A1E5E]">
                        Ưu Đãi Đang Chọn: {initialPromo.title}
                      </span>
                    </div>
                    <p className="text-xs text-amber-800">
                      Mã: <strong>{initialPromo.code}</strong> • Tiết kiệm ngay: <strong>{initialPromo.savings}</strong>
                    </p>
                    <p className="text-[11px] text-amber-700 font-medium">
                      🎁 Quà tặng kèm: {initialPromo.giftItems[0]}
                    </p>
                  </div>
                  {onClearPromo && (
                    <button
                      onClick={onClearPromo}
                      className="p-1 rounded-md text-amber-700 hover:bg-amber-100 transition"
                      title="Bỏ chọn ưu đãi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Form Title */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-[#0A1E5E] flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-[#D4AF37]" />
                    Đăng Ký Tư Vấn & Nhận Dự Toán Chi Phí
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chuyên viên kỹ thuật sẽ liên hệ tư vấn đúng theo nhu cầu thực tế
                  </p>
                </div>
              </div>

              {/* Result Notifications */}
              {submitResult.type === "success" && (
                <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Gửi yêu cầu thành công!</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Cảm ơn quý khách <strong>{submitResult.submittedName}</strong>! {submitResult.message}
                  </p>
                  <p className="text-xs text-emerald-800 font-medium">
                    📞 Chuyên viên sẽ gọi điện/kết bạn Zalo qua số: <strong>{submitResult.submittedPhone}</strong> trong vòng 30 phút.
                  </p>

                  {/* Countdown notice & Direct Action Buttons */}
                  <div className="pt-2 border-t border-emerald-200/80 space-y-2.5">
                    {redirectCountdown !== null && redirectCountdown > 0 && (
                      <div className="flex items-center justify-between text-[11px] text-emerald-800 font-medium">
                        <span>⏳ Đang tự động chuyển đến Trang Xác Nhận sau <strong>{redirectCountdown}s</strong>...</span>
                        <button
                          type="button"
                          onClick={() => setRedirectCountdown(null)}
                          className="text-emerald-700 underline hover:text-emerald-900 text-[11px]"
                        >
                          Dừng chuyển tiếp
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <a
                        href={COMPANY_INFO.socials.zalo}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat Zalo Trực Tiếp Với Chuyên Viên (Nhận Tư Vấn 1-1)</span>
                      </a>

                      <a
                        href={`tel:${COMPANY_INFO.hotline}`}
                        className="px-4 py-2.5 rounded-xl bg-[#0A1E5E] hover:bg-[#122868] text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/40 shadow-sm flex items-center justify-center gap-1.5 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi Hotline ({COMPANY_INFO.hotlineDisplay})</span>
                      </a>
                    </div>

                    <div className="pt-1 text-center sm:text-left">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitResult({ type: null, message: "" });
                          setRedirectCountdown(null);
                        }}
                        className="text-emerald-800 hover:text-emerald-950 font-bold text-[11px] underline"
                      >
                        + Gửi thêm yêu cầu cho sự kiện / dịch vụ khác
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {submitResult.type === "error" && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{submitResult.message}</span>
                </div>
              )}

              {/* Main Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Full name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Họ và tên của bạn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Anh Hoàng / Chị Thảo"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-slate-50/50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Số điện thoại / Zalo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="VD: 0912 345 678"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-slate-50/50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Estimated Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email nhận báo giá (File PDF/Excel)
                    </label>
                    <input
                      type="email"
                      placeholder="example@congty.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-slate-50/50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Quy mô khách tham dự dự kiến
                    </label>
                    <select
                      value={formData.estimatedGuests}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedGuests: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="Dưới 50 khách (Sự kiện nhỏ / Cửa hàng)">Dưới 50 khách (Sự kiện nhỏ / Cửa hàng)</option>
                      <option value="50 - 150 khách (Quy mô vừa)">50 - 150 khách (Quy mô vừa)</option>
                      <option value="150 - 300 khách (Doanh nghiệp chuẩn)">150 - 300 khách (Doanh nghiệp chuẩn)</option>
                      <option value="300 - 600 khách (Quy mô lớn)">300 - 600 khách (Quy mô lớn)</option>
                      <option value="Trên 600 khách (Đại lễ / Festival / Hội nghị lớn)">Trên 600 khách (Đại lễ / Festival / Hội nghị lớn)</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Service Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Dịch vụ bạn quan tâm <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData({ ...formData, eventType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-white font-medium"
                  >
                    <optgroup label="MẢNG TỔ CHỨC SỰ KIỆN">
                      <option value="Tổ chức Lễ Khai trương, Khánh thành & Khởi công">
                        Tổ chức Lễ Khai trương, Khánh thành & Khởi công
                      </option>
                      <option value="Tiệc Tất Niên (Year End Party) & Gala Dinner">
                        Tiệc Tất Niên (Year End Party) & Gala Dinner
                      </option>
                      <option value="Tổ chức Hội Nghị, Hội Thảo & Sự Kiện Mở Bán BĐS">
                        Tổ chức Hội Nghị, Hội Thảo & Sự Kiện Mở Bán BĐS
                      </option>
                      <option value="Sản Xuất, Thi Công & Cho Thuê Trang Thiết Bị Sự Kiện">
                        Sản Xuất, Thi Công & Cho Thuê Trang Thiết Bị Sự Kiện
                      </option>
                    </optgroup>
                    <optgroup label="MẢNG DU LỊCH & TEAM BUILDING">
                      <option value="Team Building & Tour Doanh Nghiệp Nghỉ Dưỡng MICE">
                        Team Building & Tour Doanh Nghiệp Nghỉ Dưỡng MICE
                      </option>
                      <option value="Dịch Vụ Vận Tải, Cho Thuê Xe Du Lịch Đời Mới 7-45 Chỗ">
                        Dịch Vụ Vận Tải, Cho Thuê Xe Du Lịch Đời Mới 7-45 Chỗ
                      </option>
                      <option value="Du Lịch Trải Nghiệm & Thiện Nguyện Vì Cộng Đồng">
                        Du Lịch Trải Nghiệm & Thiện Nguyện Vì Cộng Đồng
                      </option>
                    </optgroup>
                  </select>
                </div>

                {/* Row 4: Budget & Expected Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Dự kiến ngân sách
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetRange: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="Dưới 20.000.000đ (Tiết kiệm)">Dưới 20.000.000đ (Tiết kiệm)</option>
                      <option value="20.000.000đ - 50.000.000đ">20.000.000đ - 50.000.000đ</option>
                      <option value="50.000.000đ - 100.000.000đ">50.000.000đ - 100.000.000đ</option>
                      <option value="100.000.000đ - 250.000.000đ">100.000.000đ - 250.000.000đ</option>
                      <option value="Trên 250.000.000đ (VIP Đẳng cấp)">Trên 250.000.000đ (VIP Đẳng cấp)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Thời gian dự kiến tổ chức
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) =>
                        setFormData({ ...formData, eventDate: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-white"
                    />
                  </div>
                </div>

                {/* Row 5: Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ghi chú thêm về địa điểm hoặc yêu cầu đặc biệt
                  </label>
                  <textarea
                    rows={3}
                    placeholder="VD: Cần thuê màn hình LED 20m², âm thanh ngoài trời tại Cầu Giấy Hà Nội, mong muốn kịch bản ấm cúng và tặng kèm múa lân..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#0A1E5E] focus:border-transparent outline-none transition bg-slate-50/50 hover:bg-white resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-[#D4AF37] via-[#f3d977] to-[#D4AF37] text-[#0A1E5E] shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#0A1E5E] border-t-transparent rounded-full animate-spin" />
                        Đang đồng bộ yêu cầu tới phòng dự án...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#0A1E5E]" />
                        <span>GỬI YÊU CẦU BÁO GIÁ & NHẬN BỘ QUÀ TẶNG</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Privacy note */}
            <div className="mt-4 text-center text-[11px] text-slate-400">
              * Cam kết không gửi thư rác. Thông tin của quý khách được sử dụng duy nhất cho mục đích lập dự toán chi phí.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
