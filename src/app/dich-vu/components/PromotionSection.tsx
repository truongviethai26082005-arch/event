"use client";

import React, { useState } from "react";
import { PROMOTION_COMBOS, PromotionCombo } from "../data/services-data";
import {
  Sparkles,
  Gift,
  Tag,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Percent,
  Flame,
} from "lucide-react";

interface PromotionSectionProps {
  onSelectPromo: (promo: PromotionCombo) => void;
}

export default function PromotionSection({ onSelectPromo }: PromotionSectionProps) {
  const [filterCategory, setFilterCategory] = useState<"all" | "su-kien" | "du-lich">("all");

  const filteredCombos = PROMOTION_COMBOS.filter((c) => {
    if (filterCategory === "all") return true;
    return c.category === filterCategory || c.category === "all";
  });

  return (
    <section id="khuyen-mai" className="py-16 bg-gradient-to-b from-white via-amber-50/30 to-slate-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-[#D4AF37]/40 text-[#0A1E5E] text-xs font-bold shadow-sm">
            <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>ĐỘC QUYỀN MÙA SỰ KIỆN & DU LỊCH 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A1E5E] tracking-tight">
            Gói Combo Ưu Đãi & Quà Tặng Đột Phá
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            Thiết kế theo mô hình tích hợp của các tập đoàn sự kiện hàng đầu (như Hòa Bình Group). 
            Tối ưu chi phí trực tiếp tận kho, tặng kèm thiết bị và quà tặng cao cấp giúp gia tăng tối đa trải nghiệm của khách mời.
          </p>

          {/* Filter Sub-Tabs for Promo */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/70 border border-slate-300/80 text-xs font-semibold">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterCategory === "all"
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow"
                  : "text-slate-600 hover:text-[#0A1E5E]"
              }`}
            >
              Tất Cả Ưu Đãi ({PROMOTION_COMBOS.length})
            </button>
            <button
              onClick={() => setFilterCategory("su-kien")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterCategory === "su-kien"
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow"
                  : "text-slate-600 hover:text-[#0A1E5E]"
              }`}
            >
              Combo Sự Kiện
            </button>
            <button
              onClick={() => setFilterCategory("du-lich")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterCategory === "du-lich"
                  ? "bg-[#0A1E5E] text-[#D4AF37] shadow"
                  : "text-slate-600 hover:text-[#0A1E5E]"
              }`}
            >
              Combo Tour & MICE
            </button>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCombos.map((combo) => (
            <div
              key={combo.id}
              className={`relative rounded-3xl bg-white border transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-2xl ${
                combo.isPopular
                  ? "border-[#D4AF37] shadow-xl shadow-amber-500/10 ring-2 ring-[#D4AF37]/30"
                  : "border-slate-200 shadow-md"
              }`}
            >
              {/* Badge top */}
              {combo.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-l from-amber-500 to-[#D4AF37] text-[#0A1E5E] text-[11px] font-black uppercase px-4 py-1 rounded-bl-2xl shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Bán Chạy Nhất
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div className="p-6 sm:p-7 border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-amber-50/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#0A1E5E] text-[#D4AF37] text-[11px] font-black uppercase tracking-wider">
                    {combo.code}
                  </span>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    {combo.discountBadge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0A1E5E] mb-1.5 leading-snug">
                  {combo.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {combo.subtitle}
                </p>

                {/* Price Display */}
                <div className="mt-5 p-4 rounded-2xl bg-[#0A1E5E] text-white flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-[11px] text-slate-300 block line-through">
                      Giá thị trường: {combo.originalPrice}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl sm:text-2xl font-black text-[#D4AF37]">
                        {combo.comboPrice}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      Tiết kiệm:
                    </span>
                    <span className="text-sm font-black text-emerald-300">
                      {combo.savings}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body - Gifts & Conditions */}
              <div className="p-6 sm:p-7 flex-1 space-y-5">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1E5E] mb-3 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-600" />
                    Quà Tặng Thêm & Đặc Quyền Đi Kèm:
                  </h4>
                  <ul className="space-y-2">
                    {combo.giftItems.map((gift, gIdx) => (
                      <li
                        key={gIdx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <span className="font-medium">{gift}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended audience */}
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <strong className="text-slate-700 font-semibold">Phù hợp: </strong>
                  <span>{combo.recommendedFor}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{combo.validUntil}</span>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => onSelectPromo(combo)}
                  className="w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#0A1E5E] via-[#122868] to-[#0A1E5E] text-[#D4AF37] hover:brightness-110 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Áp Dụng Ưu Đãi & Nhận Báo Giá</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Small Trust Note */}
        <div className="mt-10 p-4 rounded-2xl bg-white border border-slate-200/80 text-center max-w-2xl mx-auto shadow-sm flex items-center justify-center gap-2 text-xs text-slate-600">
          <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>
            Các chương trình ưu đãi được bảo lưu giá trị trong <strong>30 ngày</strong> kể từ khi gửi Form đăng ký. Cam kết giữ nguyên chất lượng thiết bị chuẩn quốc tế!
          </span>
        </div>
      </div>
    </section>
  );
}
