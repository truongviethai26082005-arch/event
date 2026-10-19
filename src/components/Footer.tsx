"use client";

import React from "react";
import Link from "next/link";
import { COMPANY_INFO } from "@/lib/company-data";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
  Radar,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#06123B] text-slate-300 border-t-2 border-[#D4AF37]/40 relative overflow-hidden">
      {/* Subtle gold glow effect in background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0A1E5E]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Legal Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F5E08B] to-[#997A15] p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#0A1E5E] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-lg text-[#D4AF37]">TH</span>
                </div>
              </div>
              <div>
                <h3 className="font-black text-white text-base tracking-tight leading-tight">
                  TRƯỜNG HẢI EVENT
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Sự kiện & Du lịch Trọn gói
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              <span className="font-semibold text-white">{COMPANY_INFO.name}</span>
              <br />
              <span className="text-slate-400 italic">({COMPANY_INFO.englishName})</span>
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
              <p className="flex items-center text-[#D4AF37] font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
                "{COMPANY_INFO.slogan}"
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Giám đốc:</span>{" "}
                <span className="font-semibold text-white">{COMPANY_INFO.director}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Mã số thuế:</span>{" "}
                <span className="font-mono font-semibold text-[#D4AF37]">{COMPANY_INFO.taxId}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Cấp bởi {COMPANY_INFO.taxAuthority}
              </p>
            </div>
          </div>

          {/* Column 2: Core Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/30 flex items-center">
              <Award className="w-4 h-4 mr-2 text-[#D4AF37]" />
              Dịch Vụ Cốt Lõi
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/dich-vu#su-kien"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Lễ kỷ niệm, khánh thành, khai trương
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#su-kien"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Tiệc tất niên Y.E.P & Gala Dinner
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#su-kien"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Lễ mở bán BĐS, Hội nghị, Hội thảo
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#su-kien"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Âm thanh, Ánh sáng, Màn hình LED
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#du-lich"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Tour Doanh nghiệp kết hợp Team Building
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#du-lich"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Vận tải & Cho thuê xe du lịch 7-45 chỗ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & SEO Radar */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/30 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-[#D4AF37]" />
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                  Trang chủ & Dự án tiêu biểu
                </Link>
              </li>
              <li>
                <Link href="/dich-vu" className="hover:text-[#D4AF37] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                  Bảng giá & Đăng ký tư vấn
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="hover:text-[#D4AF37] transition-colors flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                  Cẩm nang sự kiện & Du lịch
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin-radar"
                  className="inline-flex items-center px-3 py-2 rounded-lg bg-[#0A1E5E] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all font-semibold text-xs"
                >
                  <Radar className="w-3.5 h-3.5 mr-1.5" />
                  Radar SEO Admin
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-lg bg-gradient-to-r from-[#0A1E5E] to-transparent border border-white/5 text-xs">
              <span className="text-[#D4AF37] font-semibold block mb-1">
                Tầm nhìn Trường Hải:
              </span>
              <p className="text-[11px] text-slate-400 line-clamp-3">
                {COMPANY_INFO.vision}
              </p>
            </div>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/30 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#D4AF37]" />
              Thông Tin Liên Hệ
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <a
                    href={`tel:${COMPANY_INFO.hotline}`}
                    className="font-bold text-base text-[#D4AF37] hover:underline"
                  >
                    {COMPANY_INFO.hotlineDisplay}
                  </a>
                  <span className="block text-[11px] text-slate-400">Hỗ trợ khẩn cấp 24/7</span>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="hover:text-white transition-colors text-slate-300"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-slate-400">{COMPANY_INFO.workingHours}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center space-x-2">
              <a
                href={COMPANY_INFO.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all flex items-center justify-center text-xs font-bold"
                title="Facebook"
              >
                FB
              </a>
              <a
                href={COMPANY_INFO.socials.zalo}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all flex items-center justify-center text-xs font-bold"
                title="Zalo"
              >
                Zalo
              </a>
              <a
                href={COMPANY_INFO.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all flex items-center justify-center text-xs font-bold"
                title="YouTube"
              >
                YT
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 {COMPANY_INFO.name}. Bản quyền thuộc về Trường Hải Event & Travel.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>MST: {COMPANY_INFO.taxId}</span>
            <span>•</span>
            <span className="text-[#D4AF37]">Chất Lượng Tạo Niềm Tin</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
