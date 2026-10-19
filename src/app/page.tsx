import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  COMPANY_INFO,
  PARTNER_GROUPS,
  PROJECTS_DATA,
  SERVICES_DATA,
} from "@/lib/company-data";
import {
  Sparkles,
  Phone,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Compass,
  Award,
  Users,
  ShieldCheck,
  Building2,
  GraduationCap,
  Heart,
  ChevronRight,
  ExternalLink,
  Target,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const eventServices = SERVICES_DATA.filter((s) => s.category === "su-kien");
  const travelServices = SERVICES_DATA.filter((s) => s.category === "du-lich");

  return (
    <div className="flex flex-col min-h-screen">
      {/* =========================================================================
          HERO SECTION (ĐẬM CHẤT SỰ KIỆN & DU LỊCH CAO CẤP)
      ========================================================================= */}
      <section className="relative bg-[#0A1E5E] text-white overflow-hidden py-20 lg:py-28 border-b border-[#D4AF37]/20">
        {/* Background glow & decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#132c82] via-[#0A1E5E] to-[#040c26] opacity-95" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/50 text-xs font-semibold text-[#D4AF37] shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span>Trường Hải Event & Travel • Uy Tín Khẳng Định Giá Trị</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                SỰ KIỆN <span className="text-[#D4AF37]">CHUYÊN NGHIỆP</span>
                <br />
                DU LỊCH <span className="text-amber-400">TRẢI NGHIỆM</span>
                <br />
                <span className="text-slate-100 text-2xl sm:text-3xl md:text-4xl font-bold">
                  KẾT NỐI THÀNH CÔNG
                </span>
              </h1>

              {/* Sub-description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                Đồng hành tổ chức thành công hơn 500+ đại lễ khánh thành, hội nghị, khai trương, tiệc tất niên Y.E.P và các hành trình du lịch Team Building bùng nổ cho các bộ ban ngành, đoàn thể và tập đoàn lớn trên toàn quốc.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/dich-vu#bao-gia"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] via-[#f3d368] to-[#D4AF37] text-[#0A1E5E] shadow-lg shadow-[#D4AF37]/30 hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  <span>Nhận Báo Giá Sự Kiện & Tour</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <a
                  href={`tel:${COMPANY_INFO.hotline}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-[#D4AF37] transition-all duration-200 flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 mr-2 text-[#D4AF37]" />
                  <span>Hotline: {COMPANY_INFO.hotlineDisplay}</span>
                </a>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Hệ thống thiết bị trực tiếp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Kịch bản sáng tạo độc bản</span>
                </div>
                <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Bảo đảm ngân sách tối ưu</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl p-1 bg-gradient-to-br from-[#D4AF37] via-white/20 to-blue-900 shadow-2xl">
                <div className="rounded-[15px] bg-[#06123B] p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                        Thông Tin Doanh Nghiệp
                      </p>
                      <h3 className="text-lg font-bold text-white">
                        {COMPANY_INFO.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <Target className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Tổ chức sự kiện trọn gói:</strong>
                        <span className="text-slate-300">
                          Khánh thành, mở bán BĐS, Hội nghị cấp cao, Year End Party, Lễ kỷ niệm.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Du lịch & Team Building:</strong>
                        <span className="text-slate-300">
                          Tour doanh nghiệp, trải nghiệm văn hóa, xe du lịch đời mới 7-45 chỗ.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Pháp lý & Năng lực:</strong>
                        <span className="text-slate-300">
                          MST 0111601327 - Giám đốc: Nguyễn Thị Thu Hằng. Hợp đồng & hóa đơn VAT đầy đủ.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Hà Nội & Các tỉnh phía Bắc</span>
                    <Link
                      href="/admin-radar"
                      className="text-[#D4AF37] hover:underline flex items-center font-medium"
                    >
                      Radar SEO AI
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KEY STATS / SỐ LIỆU UY TÍN
      ========================================================================= */}
      <section className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {COMPANY_INFO.stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#D4AF37]/50 hover:shadow-md transition-all group"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-800 mt-2">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          TẦM NHÌN & SỨ MỆNH
      ========================================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A1E5E] px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40">
              Định Hướng Chiến Lược
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1E5E]">
              Tầm Nhìn & Sứ Mệnh Kiến Tạo
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Trường Hải Event & Travel luôn kiên định với sứ mệnh mang đến trải nghiệm chất lượng, chạm tới cảm xúc và tối ưu ngân sách cho từng đối tác.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Vision Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
              <div className="w-2 h-full bg-[#0A1E5E] absolute left-0 top-0 group-hover:bg-[#D4AF37] transition-colors" />
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#0A1E5E] text-[#D4AF37] flex items-center justify-center font-bold">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0A1E5E]">Tầm Nhìn Doanh Nghiệp</h3>
                  <span className="text-xs text-slate-500">Khát vọng tiên phong</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {COMPANY_INFO.vision}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-[#0A1E5E]">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-1.5" />
                <span>Tiêu chuẩn dịch vụ chuyên nghiệp số 1 miền Bắc</span>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
              <div className="w-2 h-full bg-[#D4AF37] absolute left-0 top-0 group-hover:bg-[#0A1E5E] transition-colors" />
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#06123B] text-[#D4AF37] flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0A1E5E]">Sứ Mệnh Phục Vụ</h3>
                  <span className="text-xs text-slate-500">Giá trị thực tế & bền vững</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {COMPANY_INFO.mission}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-[#0A1E5E]">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-1.5" />
                <span>Không ngừng đổi mới ý tưởng – Gắn kết chân thành</span>
              </div>
            </div>
          </div>

          {/* 4 Core values badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {COMPANY_INFO.coreValues.map((val, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 text-center">
                <h4 className="font-bold text-[#0A1E5E] text-base mb-1">{val.title}</h4>
                <p className="text-xs text-slate-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2 LĨNH VỰC CỐT LÕI (SỰ KIỆN & DU LỊCH)
      ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A1E5E] px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              Giải Pháp Toàn Diện
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1E5E]">
              Hai Trụ Cột Năng Lực Cốt Lõi
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Sự kết hợp hoàn hảo giữa tổ chức sự kiện chuyên nghiệp và thiết kế tour du lịch trải nghiệm mang đến giải pháp trọn gói cho mọi tổ chức.
            </p>
          </div>

          {/* Module 1: Mảng Sự Kiện */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-8 border-b-2 border-[#0A1E5E]/20">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-10 h-10 rounded-lg bg-[#0A1E5E] text-[#D4AF37] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0A1E5E]">Mảng Tổ Chức Sự Kiện</h3>
                  <p className="text-xs text-slate-500">Khởi công, khánh thành, tiệc tất niên YEP, gala dinner, hội nghị</p>
                </div>
              </div>
              <Link
                href="/dich-vu#su-kien"
                className="text-xs font-bold text-[#0A1E5E] hover:text-[#D4AF37] flex items-center transition-colors"
              >
                Xem chi tiết dịch vụ sự kiện
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventServices.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0A1E5E]/80 backdrop-blur-sm text-[11px] font-bold text-[#D4AF37] border border-[#D4AF37]/30">
                      Sự Kiện
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-base text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2">
                        {service.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <Link
                      href="/dich-vu#bao-gia"
                      className="inline-flex items-center text-xs font-bold text-[#0A1E5E] hover:text-[#D4AF37] pt-3 border-t border-slate-100"
                    >
                      <span>Yêu cầu báo giá</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module 2: Mảng Du Lịch */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-8 border-b-2 border-amber-500/30">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37] text-[#0A1E5E] flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0A1E5E]">Mảng Du Lịch & Vận Tải</h3>
                  <p className="text-xs text-slate-500">Tour doanh nghiệp, Team Building, xe du lịch đời mới 7-45 chỗ</p>
                </div>
              </div>
              <Link
                href="/dich-vu#du-lich"
                className="text-xs font-bold text-[#0A1E5E] hover:text-[#D4AF37] flex items-center transition-colors"
              >
                Xem chi tiết dịch vụ du lịch
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {travelServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0A1E5E]/80 backdrop-blur-sm text-[11px] font-bold text-amber-400 border border-amber-400/30">
                      Du Lịch
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-base text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2">
                        {service.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <Link
                      href="/dich-vu#bao-gia"
                      className="inline-flex items-center text-xs font-bold text-[#0A1E5E] hover:text-[#D4AF37] pt-3 border-t border-slate-100"
                    >
                      <span>Tư vấn tour & xe</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DỰ ÁN TIÊU BIỂU ĐÃ THỰC HIỆN (GRID REAL PROJECTS)
      ========================================================================= */}
      <section className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40">
              Minh Chứng Năng Lực
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Các Dự Án & Đại Lễ Đã Thực Hiện
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Điểm qua các sự kiện trọng điểm cấp quốc gia, đại lễ khánh thành nhà máy và sự kiện thương hiệu lớn được Trường Hải Event đảm nhận tổ chức thành công.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS_DATA.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0A1E5E]/60 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                <div className="h-52 relative overflow-hidden bg-black">
                  <img
                    src={proj.image_url}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06123B] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#D4AF37] text-[#0A1E5E] text-[11px] font-bold">
                    {proj.client_name}
                  </div>
                  {proj.location && (
                    <div className="absolute bottom-3 right-3 text-[11px] text-slate-300 bg-black/60 px-2 py-0.5 rounded">
                      {proj.location} • {proj.year}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[#D4AF37]">Trường Hải Event bảo chứng</span>
                    <span className="flex items-center text-slate-300 group-hover:text-white">
                      Hoàn thành xuất sắc
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          ĐỐI TÁC TIÊU BIỂU (3 NHÓM)
      ========================================================================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A1E5E] px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40">
              Mạng Lưới Uy Tín
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1E5E]">
              Đối Tác & Khách Hàng Đồng Hành
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Trường Hải Event & Travel tự hào là đối tác chiến lược tin cậy của các cơ quan Trung ương, trường đại học hàng đầu và các tập đoàn kinh tế uy tín.
            </p>
          </div>

          <div className="space-y-10">
            {PARTNER_GROUPS.map((group, gIdx) => (
              <div
                key={gIdx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
                  {gIdx === 0 ? (
                    <ShieldCheck className="w-6 h-6 text-[#0A1E5E]" />
                  ) : gIdx === 1 ? (
                    <GraduationCap className="w-6 h-6 text-[#0A1E5E]" />
                  ) : (
                    <Building2 className="w-6 h-6 text-[#0A1E5E]" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-[#0A1E5E]">{group.category}</h3>
                    <p className="text-xs text-slate-500">{group.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {group.partners.map((partner, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#D4AF37] hover:bg-amber-50/20 transition-all text-center flex flex-col justify-center"
                    >
                      <span className="text-xs font-bold text-slate-800 line-clamp-2">
                        {partner.name}
                      </span>
                      {partner.sub && (
                        <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                          {partner.sub}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOẠT ĐỘNG PHÚC LỢI XÃ HỘI & THIỆN NGUYỆN (CSR)
      ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>Trách Nhiệm Cộng Đồng (CSR)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1E5E] leading-tight">
                Hoạt Động Thiện Nguyện & Phúc Lợi Xã Hội
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bên cạnh sứ mệnh kinh doanh, Trường Hải Event & Travel luôn tích cực khởi xướng và đồng hành cùng các chương trình thiện nguyện nhân văn, mang lại nụ cười và tương lai tươi sáng cho các em nhỏ vùng cao.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Chương trình "Chắp cánh ước mơ" (Yên Bái):</strong>
                    <span className="text-slate-600">Trao hàng trăm phần quà, học bổng và xây dựng tủ sách yêu thương cho học sinh khó khăn.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Hành trình "Hướng về Sìn Hồ" (Lai Châu):</strong>
                    <span className="text-slate-600">Áo ấm mùa đông, chăn ấm và nhu yếu phẩm thiết yếu trao tận tay bà con dân tộc biên giới.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start space-x-3">
                  <Award className="w-4 h-4 text-[#0A1E5E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Lễ tôn vinh "Tuổi trẻ cống hiến vì cộng đồng":</strong>
                    <span className="text-slate-600">Phối hợp cùng Thành Đoàn Hà Nội và Trung tâm Tình nguyện Quốc gia tôn vinh các thủ lĩnh thiện nguyện.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                    alt="Thiện nguyện vùng cao"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 bg-white text-xs">
                    <span className="font-bold text-[#0A1E5E] block">Lan tỏa yêu thương vùng cao Sìn Hồ</span>
                    <span className="text-slate-500">Trường Hải Event & Đoàn thiện nguyện</span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 sm:translate-y-6">
                  <img
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"
                    alt="Chắp cánh ước mơ Yên Bái"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4 bg-white text-xs">
                    <span className="font-bold text-[#0A1E5E] block">Chắp cánh ước mơ - Yên Bái</span>
                    <span className="text-slate-500">Điểm trường tiểu học khó khăn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAST CONSULTATION & CTA BANNER
      ========================================================================= */}
      <section className="bg-[#0A1E5E] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#132c82] opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tư Vấn & Khảo Sát Hiện Trường Miễn Phí</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
            Sẵn Sàng Cho Một Sự Kiện Thăng Hoa & Đẳng Cấp?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
            Liên hệ ngay với Trường Hải Event & Travel để nhận kịch bản độc quyền, báo giá chi tiết trong vòng 30 phút và phương án tối ưu ngân sách tốt nhất.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dich-vu#bao-gia"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] to-amber-400 text-[#0A1E5E] shadow-xl hover:scale-105 transition-all"
            >
              Gửi Yêu Cầu Báo Giá Trực Tuyến
            </Link>

            <a
              href={`tel:${COMPANY_INFO.hotline}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all"
            >
              <Phone className="w-4 h-4 mr-2 text-[#D4AF37]" />
              Hotline 24/7: {COMPANY_INFO.hotlineDisplay}
            </a>
          </div>

          <p className="text-xs text-slate-400 pt-4">
            Trụ sở chính: {COMPANY_INFO.address} • Hotline: {COMPANY_INFO.hotlineDisplay}
          </p>
        </div>
      </section>
    </div>
  );
}
