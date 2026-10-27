"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { COMPANY_INFO } from "@/lib/company-data";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Lock,
} from "lucide-react";
import { trackLandingLead } from "@/app/admin-radar/lead-tracker";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#06123B] via-[#050e2e] to-[#03091e] text-slate-300 border-t border-[#D4AF37]/30 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0A1E5E]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Thương hiệu & Giới thiệu */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group w-fit">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F5E08B] to-[#997A15] p-0.5 shadow-lg shadow-[#D4AF37]/10 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Logo Trường Hải Event & Travel"
                    width={88}
                    height={88}
                    className="w-full h-full object-contain scale-110"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight leading-tight group-hover:text-[#F5E08B] transition-colors">
                  TRƯỜNG HẢI EVENT
                </h3>
                <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                  Sự kiện & Du lịch Trọn gói
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              Đơn vị tiên phong cung cấp giải pháp tổ chức sự kiện chuyên nghiệp và tour du lịch doanh nghiệp trọn gói, mang lại trải nghiệm độc bản và gắn kết bền vững.
            </p>

            <div className="inline-flex items-center text-xs text-[#D4AF37] font-medium bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#D4AF37]" />
              <span>Chất Lượng Tạo Niềm Tin</span>
            </div>
          </div>

          {/* Column 2: Dịch Vụ Cốt Lõi */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/30 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-[#D4AF37]" />
              Dịch Vụ Cốt Lõi
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/dich-vu#su-kien"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Lễ kỷ niệm, khánh thành, khai trương
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#su-kien"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Tiệc tất niên Y.E.P & Gala Dinner
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#su-kien"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Hội nghị, hội thảo & Mở bán BĐS
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#su-kien"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Âm thanh, ánh sáng, màn hình LED
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#du-lich"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Tour doanh nghiệp & Team Building
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu#du-lich"
                  className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Cho thuê xe du lịch 7 - 45 chỗ đời mới
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Thông Tin & Liên Kết */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/30 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-[#D4AF37]" />
              Về Chúng Tôi
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Trang chủ & Dự án tiêu biểu
                </Link>
              </li>
              <li>
                <Link href="/ve-chung-toi" className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Về chúng tôi & Ban lãnh đạo
                </Link>
              </li>
              <li>
                <Link href="/ho-so-nang-luc" className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5 font-bold text-[#F5E08B]">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Hồ sơ năng lực (Kho 1.000m²)
                </Link>
              </li>
              <li>
                <Link href="/dich-vu" className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Báo giá & Đăng ký tư vấn
                </Link>
              </li>
              <li>
                <Link href="/tin-tuc" className="hover:text-[#D4AF37] transition-colors flex items-center group py-0.5">
                  <ChevronRight className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  Cẩm nang sự kiện & Du lịch
                </Link>
              </li>
            </ul>

            <div className="mt-5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <p className="text-slate-400 leading-relaxed text-[11px]">
                <strong className="text-slate-200">Cam kết dịch vụ:</strong> 100% đúng tiến độ, thiết bị chính hãng, kịch bản sáng tạo và đội ngũ tận tâm đồng hành suốt sự kiện.
              </p>
            </div>
          </div>

          {/* Column 4: Liên Hệ & Hỗ Trợ */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#D4AF37]/30 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#D4AF37]" />
              Thông Tin Liên Hệ
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-300">{COMPANY_INFO.address}</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div>
                  <a
                    href={`tel:${COMPANY_INFO.hotline}`}
                    onClick={() => trackLandingLead("HOTLINE")}
                    className="font-extrabold text-base text-[#D4AF37] hover:underline tracking-wide"
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
                  className="hover:text-white transition-colors text-slate-300 truncate"
                >
                  {COMPANY_INFO.email}
                </a>
              </div>

              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-slate-400">{COMPANY_INFO.workingHours}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center space-x-3">
              {/* Facebook */}
              <a
                href={COMPANY_INFO.socials.facebook}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackLandingLead("FACEBOOK")}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all flex items-center justify-center text-slate-300 shadow-sm"
                title="Facebook Trường Hải Event"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Zalo */}
              <a
                href={COMPANY_INFO.socials.zalo}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackLandingLead("ZALO")}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all flex items-center justify-center text-slate-300 shadow-sm text-xs font-black tracking-tight"
                title="Zalo Trường Hải Event"
                aria-label="Zalo"
              >
                <span className="font-sans font-black text-xs">Zalo</span>
              </a>

              {/* YouTube */}
              <a
                href={COMPANY_INFO.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37] hover:text-[#0A1E5E] transition-all flex items-center justify-center text-slate-300 shadow-sm"
                title="YouTube Channel"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Legal / Admin Link */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p>© 2026 {COMPANY_INFO.name}. Bản quyền thuộc về Trường Hải Event & Travel.</p>
            <p className="text-[11px] text-slate-500">
              MST: <span className="text-slate-400 font-mono">{COMPANY_INFO.taxId}</span> • Đại diện pháp luật: <span className="text-slate-400">{COMPANY_INFO.director}</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="text-[#D4AF37] font-medium hidden sm:inline">
              "{COMPANY_INFO.slogan}"
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            {/* Discrete Admin Link */}
            <Link
              href="/login"
              className="text-slate-500 hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
              title="Cổng quản trị nội bộ"
            >
              <Lock className="w-3 h-3" />
              <span className="text-[11px]">Quản trị</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
