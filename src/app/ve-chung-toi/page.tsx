import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  COMPANY_INFO,
  PARTNER_GROUPS,
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
  Landmark,
  Briefcase,
  Target,
  Eye,
  HeartHandshake,
  FileCheck,
  MapPin,
  Mail,
  Scale,
  Clock,
  ChevronRight,
  Layers,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Giới Thiệu Trường Hải Event & Travel | Tổ Chức Sự Kiện & Du Lịch Trọn Gói",
  description:
    "Công ty TNHH Sự kiện và Du lịch Trường Hải - Sự kiện chuyên nghiệp, Du lịch trải nghiệm, Kết nối thành công. Thông tin pháp lý minh bạch MST 0111601327, đối tác cơ quan nhà nước, trường học và tập đoàn hàng đầu.",
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* =========================================================================
          1. HERO BANNER & TỔNG QUAN DOANH NGHIỆP
      ========================================================================= */}
      <section className="relative bg-[#0A1E5E] text-white py-20 lg:py-28 overflow-hidden border-b border-[#D4AF37]/30">
        {/* Background Gradients & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#122b82] via-[#0A1E5E] to-[#040c24] opacity-95" />
        <div className="absolute top-12 left-10 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-300 mb-8">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#D4AF37] font-medium">Về chúng tôi</span>
          </nav>

          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/50 text-xs font-semibold text-[#D4AF37] shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Hồ Sơ Năng Lực & Bản Sắc Doanh Nghiệp</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH <br className="hidden sm:inline" />
              <span className="text-[#D4AF37] drop-shadow-sm">TRƯỜNG HẢI</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed max-w-3xl">
              Tên thương hiệu: <strong className="text-white font-semibold">{COMPANY_INFO.brandName}</strong>. 
              Là đơn vị tiên phong kết hợp hoàn hảo giữa năng lực tổ chức sự kiện quy mô lớn và chuỗi hành trình 
              du lịch trải nghiệm cao cấp, chúng tôi tự hào đồng hành cùng hơn 100+ cơ quan ban ngành, 
              trường học và tập đoàn kinh tế hàng đầu trên toàn quốc.
            </p>

            {/* Slogan Card Highlight */}
            <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#06123B]/90 via-[#0A1E5E]/90 to-[#102466]/90 border border-[#D4AF37]/50 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1">
                    Khẩu hiệu hành động & Cam kết thương hiệu
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white tracking-wide">
                    &ldquo;<span className="text-[#D4AF37]">{COMPANY_INFO.slogan}</span>&rdquo;
                  </div>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <a
                    href={`tel:${COMPANY_INFO.hotline}`}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A1E5E] font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span>Hotline: {COMPANY_INFO.hotlineDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THƯỚC ĐO NĂNG LỰC THỰC CHIẾN (STATS)
      ========================================================================= */}
      <section className="bg-white border-b border-slate-200 relative z-20 -mt-8 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {COMPANY_INFO.stats.map((stat, idx) => (
            <div key={idx} className="p-6 sm:p-8 text-center space-y-1 hover:bg-slate-50/80 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-[#0A1E5E] tracking-tight">
                <span className="text-[#0A1E5E]">{stat.value}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">{stat.label}</div>
              <div className="text-[11px] text-slate-500 font-light">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3. THÔNG TIN PHÁP LÝ MINH BẠCH - NỀN TẢNG BẢO CHỨNG NIỀM TIN
      ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0A1E5E]">
            <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Pháp Lý Rõ Ràng – Hợp Đồng Minh Bạch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A1E5E]">
            Hồ Sơ Doanh Nghiệp & Tư Cách Pháp Nhân
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            Chúng tôi hiểu rằng với các cơ quan nhà nước, trường đại học và tập đoàn lớn, 
            tính chuẩn mực pháp lý và khả năng quyết toán tài chính là tiêu chí tiên quyết. 
            Trường Hải Event & Travel luôn công khai minh bạch mọi thông tin đăng ký doanh nghiệp.
          </p>
        </div>

        {/* Corporate Identity Certificate Box */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {/* Decorative Corner Watermark */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-6 right-6 hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0A1E5E] text-[#D4AF37] text-xs font-bold shadow-md">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>Pháp Nhân Được Chứng Nhận</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Summary Badge */}
            <div className="lg:col-span-5 space-y-5 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0">
              <div className="w-16 h-16 rounded-2xl bg-[#0A1E5E] text-[#D4AF37] flex items-center justify-center shadow-lg border border-[#D4AF37]/40">
                <FileCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-[#D4AF37] tracking-wider">
                  Đăng ký kinh doanh hợp pháp
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0A1E5E] leading-snug">
                  {COMPANY_INFO.name}
                </h3>
                <p className="text-xs text-slate-500 italic">
                  Tên giao dịch quốc tế: {COMPANY_INFO.englishName}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center text-amber-900">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-600" />
                  Bảo đảm tài chính & Chứng từ:
                </div>
                <p className="font-light text-[11px] leading-relaxed">
                  Xuất đầy đủ hóa đơn điện tử VAT, hợp đồng kinh tế song phương, biên bản nghiệm thu 
                  và thanh lý hợp đồng đúng chuẩn quy định của Bộ Tài chính.
                </p>
              </div>
            </div>

            {/* Right: Detailed Fields Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Field 1: Đại diện pháp luật / Giám đốc */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                  Người đại diện / Giám đốc
                </div>
                <div className="text-base font-black text-[#0A1E5E]">
                  {COMPANY_INFO.director}
                </div>
                <div className="text-[11px] text-slate-500 font-light">
                  Chịu trách nhiệm pháp lý cao nhất
                </div>
              </div>

              {/* Field 2: Mã số thuế */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <FileCheck className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                  Mã số doanh nghiệp (MST)
                </div>
                <div className="text-base font-black text-[#0A1E5E] font-mono tracking-wide">
                  {COMPANY_INFO.taxId}
                </div>
                <div className="text-[11px] text-slate-500 font-light">
                  Cấp bởi {COMPANY_INFO.taxAuthority}
                </div>
              </div>

              {/* Field 3: Địa chỉ văn phòng trụ sở */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 sm:col-span-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                  Địa chỉ văn phòng & Trụ sở đăng ký
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  {COMPANY_INFO.address}
                </div>
                <div className="text-[11px] text-slate-500 font-light">
                  Địa điểm tiếp nhận văn thư, giao dịch hợp đồng trực tiếp
                </div>
              </div>

              {/* Field 4: Hotline */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                  Đường dây nóng 24/7
                </div>
                <div className="text-base font-black text-[#0A1E5E]">
                  <a href={`tel:${COMPANY_INFO.hotline}`} className="hover:text-[#D4AF37] transition-colors">
                    {COMPANY_INFO.hotlineDisplay}
                  </a>
                </div>
                <div className="text-[11px] text-slate-500 font-light">
                  Tiếp nhận khảo sát & báo giá khẩn cấp
                </div>
              </div>

              {/* Field 5: Email & Hỗ trợ */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                  Hòm thư điện tử
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-[#0A1E5E] transition-colors">
                    {COMPANY_INFO.email}
                  </a>
                </div>
                <div className="text-[11px] text-slate-500 font-light">
                  Gửi hồ sơ dự thầu & báo giá chi tiết
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. TẦM NHÌN, SỨ MỆNH & GIÁ TRỊ CỐT LÕI
      ========================================================================= */}
      <section className="py-16 bg-[#0A1E5E] text-white relative overflow-hidden border-y border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#06123B] via-[#0A1E5E] to-[#06123B] opacity-95" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/40">
              <Compass className="w-3.5 h-3.5" />
              <span>Định Hướng Chiến Lược Phát Triển</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Tầm Nhìn & Sứ Mệnh Doanh Nghiệp
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Kim chỉ nam dẫn lối mọi hành động, chuẩn mực chất lượng và tâm huyết 
              mà đội ngũ Trường Hải Event & Travel phụng sự đối tác trong từng dự án.
            </p>
          </div>

          {/* Vision & Mission Split Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tầm nhìn Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/40 shadow-inner">
                  <Eye className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Khát vọng tương lai
                </div>
                <h3 className="text-2xl font-black text-white">Tầm Nhìn Chiến Lược</h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                  {COMPANY_INFO.vision}
                </p>
              </div>
            </div>

            {/* Sứ mệnh Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/40 shadow-inner">
                  <Target className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Trọng trách phụng sự
                </div>
                <h3 className="text-2xl font-black text-white">Sứ Mệnh Thương Hiệu</h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                  {COMPANY_INFO.mission}
                </p>
              </div>
            </div>
          </div>

          {/* 4 Giá trị cốt lõi */}
          <div className="pt-6 space-y-6">
            <div className="text-center">
              <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                Nền tảng văn hóa
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                4 Trụ Cột Giá Trị Cốt Lõi
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMPANY_INFO.coreValues.map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/60 hover:bg-white/10 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold flex items-center justify-center border border-[#D4AF37]/40">
                      0{idx + 1}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{val.title}</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. MOFU TRUST MATRIX: LƯỚI 3 NHÓM ĐỐI TÁC TIÊU BIỂU
      ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0A1E5E]/10 border border-[#0A1E5E]/20 text-xs font-bold text-[#0A1E5E]">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>MOFU Trust Factor • Khẳng Định Năng Lực Thực Chiến</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A1E5E]">
            Đối Tác Tiêu Biểu Đồng Hành Cùng Chúng Tôi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            Niềm tin của khách hàng không đến từ lời quảng cáo mà được khẳng định qua 
            danh sách các đối tác chính khách, học thuật và thương mại đã đồng hành cùng Trường Hải.
          </p>
        </div>

        {/* 3 Partner Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PARTNER_GROUPS.map((group, gIdx) => {
            // Icon mapping per category
            const GroupIcon =
              gIdx === 0 ? Landmark : gIdx === 1 ? GraduationCap : Briefcase;
            const groupBadge =
              gIdx === 0
                ? "Chuẩn mực an ninh & nghi thức ngoại giao"
                : gIdx === 1
                ? "Quy mô học thuật & đông người 1.000+"
                : "Thương hiệu lớn & chuyển đổi bán lẻ cao";

            return (
              <div
                key={gIdx}
                className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-[#D4AF37]/50"
              >
                {/* Header card with distinct Navy styling */}
                <div className="p-6 bg-[#0A1E5E] text-white border-b border-[#D4AF37]/30 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30 shadow-inner">
                      <GroupIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      Nhóm {gIdx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{group.category}</h3>
                    <p className="text-xs text-slate-300 font-light mt-1">
                      {group.description}
                    </p>
                  </div>
                </div>

                {/* Body: Partner List */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <ul className="space-y-3">
                    {group.partners.map((partner, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <div className="text-xs sm:text-sm font-bold text-[#0A1E5E]">
                            {partner.name}
                          </div>
                          {partner.sub && (
                            <div className="text-[11px] text-slate-500 font-light">
                              {partner.sub}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Footnote / Trust Badge */}
                  <div className="pt-4 border-t border-slate-100 flex items-center text-[11px] text-slate-500 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                    <span>{groupBadge}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          6. TẠI SAO CHỌN TRƯỜNG HẢI? (LỢI THẾ CẠNH TRANH ĐỘC BẢN)
      ========================================================================= */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Thế mạnh trực tiếp
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1E5E]">
              Vì Sao Khách Hàng Luôn Yên Tâm Chọn Trường Hải?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A1E5E] flex items-center justify-center font-bold">
                <Layers className="w-6 h-6 text-[#0A1E5E]" />
              </div>
              <h3 className="text-base font-bold text-[#0A1E5E]">
                Sở hữu 100% kho thiết bị trực tiếp
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Hệ thống loa Line Array công suất khủng, màn hình LED P2.5 - P3.91, ánh sáng Moving Head Beam nhập khẩu trực tiếp, không qua đơn vị trung gian, giúp tiết kiệm 20% - 30% ngân sách cho khách hàng.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A1E5E] flex items-center justify-center font-bold">
                <Zap className="w-6 h-6 text-[#0A1E5E]" />
              </div>
              <h3 className="text-base font-bold text-[#0A1E5E]">
                Đội xe du lịch đời mới & Vận hành khép kín
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Đội xe 7 đến 45 chỗ đời mới cùng dàn Limousine VIP, kết hợp hệ thống đối tác khách sạn 4 - 5 sao trên toàn quốc đảm bảo hành trình tour luôn tiện nghi, an toàn tuyệt đối.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A1E5E] flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6 text-[#0A1E5E]" />
              </div>
              <h3 className="text-base font-bold text-[#0A1E5E]">
                Kịch bản may đo & Trách nhiệm cộng đồng
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                Không rập khuôn máy móc, kịch bản sự kiện được cá nhân hóa sâu sắc theo câu chuyện doanh nghiệp. Đồng thời chúng tôi luôn đồng hành cùng các chiến dịch thiện nguyện vì cộng đồng tại vùng cao.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CTA SECTION SANG TRỌNG
      ========================================================================= */}
      <section className="bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#122868] text-white py-16 border-t border-[#D4AF37]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đồng Hành Kiến Tạo Thành Công</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white max-w-2xl mx-auto leading-tight">
            Sẵn Sàng Kiến Tạo Sự Kiện Đẳng Cấp & Chuyến Đi Khác Biệt Cùng Chúng Tôi?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
            Liên hệ ngay với Ban Giám đốc và Đội ngũ Chuyên viên tư vấn của Trường Hải Event & Travel để được khảo sát tận nơi và nhận báo giá ưu đãi nhất.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A1E5E] font-black text-sm shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>Gọi ngay: {COMPANY_INFO.hotlineDisplay}</span>
            </a>

            <Link
              href="/dich-vu"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>Xem Dịch Vụ & Báo Giá</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
