"use client";

/**
 * =========================================================================
 * PHÂN HỆ DỊCH VỤ & BÁO GIÁ TRỰC TUYẾN - TRƯỜNG HẢI EVENT & TRAVEL
 * Dành cho Thành viên 2: Quản lý trọn bộ hệ thống Dịch vụ, Khuyến mãi & Form Báo giá
 * Tuân thủ nghiêm ngặt nguyên tắc: Chỉ chỉnh sửa bên trong src/app/dich-vu/
 * =========================================================================
 */

import React, { useState, useEffect } from "react";
import { COMPANY_INFO } from "@/lib/company-data";
import {
  CORE_SERVICES,
  ServiceDetail,
  PromotionCombo,
  PRICING_TIERS,
  SERVICE_FAQS,
} from "./data/services-data";
import ServiceModal from "./components/ServiceModal";
import PromotionSection from "./components/PromotionSection";
import LeadForm from "./components/LeadForm";
import LeItemPricing from "./components/LeItemPricing";
import {
  Calendar,
  Compass,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  HelpCircle,
  Flame,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Warehouse,
  Headphones,
  FileCheck,
  Clock,
} from "lucide-react";

export default function ServicesPage() {
  // Bộ lọc 2 mảng chính: Sự kiện vs Du lịch & Vận tải
  const [mainTab, setMainTab] = useState<"all" | "su-kien" | "du-lich">("all");
  const [selectedSubTag, setSelectedSubTag] = useState<string>("all");

  // State điều khiển modal xem chi tiết dịch vụ
  const [activeModalService, setActiveModalService] = useState<ServiceDetail | null>(null);

  // State điều khiển Form báo giá tự động
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string>(
    "Tổ chức Lễ Khai trương, Khánh thành & Khởi công"
  );
  const [selectedPromo, setSelectedPromo] = useState<PromotionCombo | null>(null);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Tự động nhận diện URL Hash khi chuyển hướng từ Header hoặc click danh mục
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      if (hash === "su-kien") {
        setMainTab("su-kien");
        setSelectedSubTag("all");
      } else if (hash === "du-lich") {
        setMainTab("du-lich");
        setSelectedSubTag("all");
      } else if (
        hash === "khai-truong-khanh-thanh" ||
        hash === "tiec-tat-nien-yep" ||
        hash === "hoi-nghi-hoi-thao-bds" ||
        hash === "cho-thue-trang-thiet-bi"
      ) {
        setMainTab("su-kien");
        setSelectedSubTag("all");
      } else if (hash === "team-building-tour-mice") {
        setMainTab("du-lich");
        setSelectedSubTag("all");
      }

      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Lọc danh sách dịch vụ theo tab
  const filteredServices = CORE_SERVICES.filter((item) => {
    const matchMain = mainTab === "all" ? true : item.category === mainTab;
    const matchSub = selectedSubTag === "all" ? true : item.tag === selectedSubTag;
    return matchMain && matchSub;
  });

  // Xử lý khi khách bấm "Nhận Báo Giá Gói Này" từ Card
  const handleSelectService = (serviceTitle: string) => {
    setSelectedServiceForQuote(serviceTitle);
    const formElement = document.getElementById("bao-gia");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Xử lý khi khách bấm "Áp Dụng Ưu Đãi" từ Promotion Section
  const handleSelectPromo = (promo: PromotionCombo) => {
    setSelectedPromo(promo);
    setSelectedServiceForQuote(promo.serviceGroup);
    const formElement = document.getElementById("bao-gia");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#D4AF37] selection:text-[#0A1E5E]">
      {/* =========================================================================
          1. HERO BANNER: ĐẲNG CẤP & UY TÍN DOANH NGHIỆP
      ========================================================================= */}
      <section className="relative bg-[#0A1E5E] text-white py-8 sm:py-10 border-b border-[#D4AF37]/30 overflow-hidden">
        {/* Visual background lights */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#142a6d] opacity-95" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
            <span>HỆ SINH THÁI TỔ CHỨC SỰ KIỆN & DU LỊCH TRỌN GÓI</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Giải Pháp Sự Kiện Độc Bản & Du Lịch Trải Nghiệm Đẳng Cấp
          </h1>

          <p className="text-[11px] sm:text-xs text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Trực tiếp sở hữu kho thiết bị hơn 1.000m² tại Hà Nội, dàn âm thanh Line Array công suất khủng, màn LED P2.5 siêu nét cùng đội ngũ đạo diễn chuyên nghiệp. Cam kết tối ưu <strong>20% - 25% ngân sách</strong> và không phát sinh chi phí.
          </p>

          {/* Key Value Badges */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-slate-200">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <Warehouse className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Kho Thiết Bị Giá Gốc 100%</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Báo Giá Nhanh Trong 30 Phút</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
              <FileCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ký Hợp Đồng & Xuất VAT Chuẩn</span>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById("khuyen-mai");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#b89528] text-[#0A1E5E] font-black text-xs shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-[#0A1E5E]" />
              <span>Săn Combo Ưu Đãi Mùa Này</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("bao-gia");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Nhận Dự Toán Báo Giá Nhanh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. BỘ LỌC 2 MẢNG: [SỰ KIỆN] | [DU LỊCH & VẬN TẢI]
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Main Filter Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => {
                setMainTab("all");
                setSelectedSubTag("all");
              }}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                mainTab === "all"
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow-md shadow-[#0A1E5E]/20"
                  : "bg-slate-100 text-slate-600 hover:text-[#0A1E5E]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Tất Cả Dịch Vụ ({CORE_SERVICES.length})</span>
            </button>

            <button
              onClick={() => {
                setMainTab("su-kien");
                setSelectedSubTag("all");
              }}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                mainTab === "su-kien"
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow-md shadow-[#0A1E5E]/20"
                  : "bg-slate-100 text-slate-600 hover:text-[#0A1E5E]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Mảng Sự Kiện ({CORE_SERVICES.filter((s) => s.category === "su-kien").length})</span>
            </button>

            <button
              onClick={() => {
                setMainTab("du-lich");
                setSelectedSubTag("all");
              }}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                mainTab === "du-lich"
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow-md shadow-[#0A1E5E]/20"
                  : "bg-slate-100 text-slate-600 hover:text-[#0A1E5E]"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Mảng Du Lịch & Vận Tải ({CORE_SERVICES.filter((s) => s.category === "du-lich").length})</span>
            </button>
          </div>

          {/* Quick Stats or Promo Jump */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Đang hiển thị: <strong className="text-[#0A1E5E]">{filteredServices.length} gói dịch vụ</strong></span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. DANH SÁCH 5 DỊCH VỤ ĐÓNG GÓI CHI TIẾT (SERVICES GRID)
      ========================================================================= */}
      <section id="su-kien" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div id="du-lich" className="absolute -top-28 left-0 pointer-events-none" />
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
              CHẤT LƯỢNG TIÊN PHONG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1E5E]">
              Chi Tiết Danh Mục Dịch Vụ Cung Cấp
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Mỗi gói dịch vụ đều được đóng gói đầy đủ nhân sự, trang thiết bị và kịch bản vận hành an toàn 100%.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Cam kết giá gốc trực tiếp tận kho
            </span>
          </div>
        </div>

        {/* Grid 5 dịch vụ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="scroll-mt-28 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Tag Header */}
              <div className="h-56 relative overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Badge top right */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-[#0A1E5E]/90 text-[#D4AF37] text-[11px] font-black uppercase tracking-wider border border-[#D4AF37]/30 backdrop-blur-sm">
                    {service.tag}
                  </span>
                </div>

              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-black text-lg text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Đặc Quyền Gói:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {service.highlights.slice(0, 3).map((item, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-[#0A1E5E] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem Bóc Tách</span>
                  </button>

                  <button
                    onClick={() => handleSelectService(service.title)}
                    className="py-2.5 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-[#D4AF37] to-[#c7a02b] hover:brightness-105 text-[#0A1E5E] shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Nhận Báo Giá</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3.5 BẢNG BÁO GIÁ DỊCH VỤ LẺ THEO HẠNG MỤC
      ========================================================================= */}
      <LeItemPricing onSelectItem={(itemName) => handleSelectService(itemName)} />

      {/* =========================================================================
          4. KHU VỰC KHUYẾN MÃI & COMBO ƯU ĐÃI (PROMOTION CORE - HÒA BÌNH GROUP STYLE)
      ========================================================================= */}
      <PromotionSection onSelectPromo={handleSelectPromo} />

      {/* =========================================================================
          5. BẢNG SO SÁNH CÁC GÓI DỊCH VỤ (PRICE ANCHORING - TIẾT KIỆM ĐẾN VIP)
      ========================================================================= */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              MINH BẠCH NGÂN SÁCH
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A1E5E]">
              Bảng So Sánh Các Gói Quy Mô Sự Kiện
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
              Dễ dàng cân đối tài chính cho công ty của bạn. Toàn bộ thiết bị đều là hàng nhập khẩu mới 100%, bảo dưỡng định kỳ và có kỹ thuật viên trực xuyên suốt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.isFeatured
                    ? "bg-[#0A1E5E] text-white shadow-2xl ring-4 ring-[#D4AF37]/50 scale-100 md:scale-105 z-10"
                    : "bg-slate-50 text-slate-800 border border-slate-200 shadow-md hover:shadow-xl"
                }`}
              >
                {tier.isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-[#D4AF37] text-[#0A1E5E] px-4 py-1 rounded-full text-xs font-black uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Lựa Chọn Nhiều Nhất (70%)
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-black text-xl ${tier.isFeatured ? "text-white" : "text-[#0A1E5E]"}`}>
                      {tier.name}
                    </h3>
                  </div>
                  <span className={`text-xs block font-semibold mb-6 ${tier.isFeatured ? "text-slate-300" : "text-slate-500"}`}>
                    {tier.scale}
                  </span>

                  {/* Included Features */}
                  <div className="space-y-3 mb-6">
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${tier.isFeatured ? "text-[#D4AF37]" : "text-slate-700"}`}>
                      Hạng mục bao gồm:
                    </span>
                    <ul className="space-y-2 text-xs">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.isFeatured ? "text-[#D4AF37]" : "text-emerald-600"}`} />
                          <span className={tier.isFeatured ? "text-slate-200" : "text-slate-700"}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tier CTA */}
                <div className="pt-4">
                  <button
                    onClick={() => handleSelectService(`Đăng ký: ${tier.name}`)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      tier.isFeatured
                        ? "bg-gradient-to-r from-[#D4AF37] to-[#c59c23] text-[#0A1E5E] shadow-lg hover:brightness-110"
                        : "bg-[#0A1E5E] text-[#D4AF37] hover:bg-[#142a6d]"
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FORM ĐĂNG KÝ BÁO GIÁ TRỰC TUYẾN (LEAD CONVERTER)
      ========================================================================= */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadForm
            initialService={selectedServiceForQuote}
            initialPromo={selectedPromo}
            onClearPromo={() => setSelectedPromo(null)}
          />
        </div>
      </section>

      {/* =========================================================================
          7. SOCIAL PROOF & 5 CAM KẾT VÀNG TỪ TRƯỜNG HẢI
      ========================================================================= */}
      <section className="py-16 bg-[#06123B] text-white border-t border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              AN TÂM TUYỆT ĐỐI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              5 Cam Kết Vàng Đồng Hành Cùng Doanh Nghiệp
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Trường Hải Event & Travel hoạt động với tôn chỉ: Đặt uy tín thương hiệu và sự an toàn của khách hàng lên hàng đầu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Warehouse className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Kho Thiết Bị Trực Tiếp</h4>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Không qua bất kỳ khâu trung gian nào, tiết kiệm 20% - 25% chi phí dự án.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Cam Kết Không Phát Sinh</h4>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Bảng dự toán chuẩn xác từng hạng mục, không phát sinh chi phí sau ký hợp đồng.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Setup Sớm Trước 12-24H</h4>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Lắp đặt hoàn thiện trước giờ G tối thiểu 12 giờ để chạy tổng duyệt chương trình.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Kịch Bản Độc Bản</h4>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Đạo diễn xây dựng concept riêng theo văn hóa và câu chuyện thương hiệu công ty.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Hợp Đồng & VAT Đầy Đủ</h4>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                Pháp nhân công ty minh bạch, hỗ trợ đầy đủ chứng từ thanh quyết toán tài chính.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FAQ: CÂU HỎI THƯỜNG GẶP
      ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              GIẢI ĐÁP THẮC MẮC
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1E5E]">
              Câu Hỏi Thường Gặp Về Dịch Vụ & Báo Giá
            </h2>
          </div>

          <div className="space-y-3">
            {SERVICE_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-[#0A1E5E] flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 transition"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaqIndex === idx ? "rotate-180 text-[#0A1E5E]" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-light border-t border-slate-200/60 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Hotline Box */}
          <div className="mt-10 p-6 rounded-3xl bg-amber-50/80 border border-[#D4AF37]/50 text-center space-y-3">
            <h4 className="font-black text-sm text-[#0A1E5E]">
              Bạn cần giải đáp phương án kỹ thuật ngay lập tức?
            </h4>
            <p className="text-xs text-slate-600">
              Đội ngũ chuyên gia của Trường Hải Event & Travel luôn sẵn sàng hỗ trợ 24/7 kể cả ngày nghỉ và lễ tết.
            </p>
            <div className="pt-1">
              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A1E5E] text-[#D4AF37] font-black text-xs shadow-md hover:bg-[#122868] transition"
              >
                <span>Gọi Hotline 24/7: {COMPANY_INFO.hotlineDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODAL XEM CHI TIẾT DỊCH VỤ & BÓC TÁCH THIẾT BỊ
      ========================================================================= */}
      <ServiceModal
        service={activeModalService}
        onClose={() => setActiveModalService(null)}
        onSelectForQuote={(title) => handleSelectService(title)}
      />
    </div>
  );
}
