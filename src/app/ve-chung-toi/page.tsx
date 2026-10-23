import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import VisionMissionSection from "@/components/VisionMissionSection";
import TimelineMilestonesSection from "@/components/TimelineMilestonesSection";
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
  Heart,
  HeartHandshake,
  FileCheck,
  MapPin,
  Mail,
  Scale,
  Clock,
  ChevronRight,
  Layers,
  Zap,
  Download,
  ExternalLink,
  Newspaper,
  FileText,
  BadgeCheck,
  Tv,
} from "lucide-react";
import { TRAN_THU_HA_AVATAR } from "@/lib/tran-thu-ha-avatar";

export const metadata: Metadata = {
  title: "Giới Thiệu Trường Hải Event & Travel | Tổ Chức Sự Kiện & Du Lịch Trọn Gói",
  description:
    "Công ty TNHH Sự kiện và Du lịch Trường Hải - Sự kiện chuyên nghiệp, Du lịch trải nghiệm, Kết nối thành công. Thông tin pháp lý minh bạch MST 0111601327, đối tác cơ quan nhà nước, trường học và tập đoàn hàng đầu.",
};



// Đội ngũ nhân sự nòng cốt
const KEY_LEADERSHIP = [
  {
    name: "Nguyễn Thị Thu Hằng",
    role: "Giám Đốc Điều Hành (CEO & Founder)",
    exp: "12+ năm kinh nghiệm",
    desc: "Chỉ đạo chiến lược, trực tiếp hoạch định và đàm phán các sự kiện trọng điểm cấp cơ quan Trung ương và các đại dự án toàn quốc.",
    avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
    commitment: "🌟 Tận tâm dẫn dắt & Trao trọn giá trị",
  },
  {
    name: "Trần Thu Hà",
    role: "Giám Đốc Nghệ Thuật (Creative Director)",
    exp: "10+ năm kinh nghiệm",
    desc: "Chuyên gia sáng tạo kịch bản, tổng đạo diễn sân khấu cho hơn 300+ đêm Gala Dinner, lễ kỷ niệm thành lập và festival nghệ thuật.",
    avatar: TRAN_THU_HA_AVATAR,
    commitment: "💡 Sáng tạo đột phá & Cảm xúc trọn vẹn",
  },
  {
    name: "Lê Hoàng Nam",
    role: "Trưởng Khối Kỹ Thuật & Thiết Bị (Technical Lead)",
    exp: "9+ năm kinh nghiệm",
    desc: "Quản lý 100% kho thiết bị âm thanh ánh sáng, màn hình LED. Đảm bảo an toàn kỹ thuật và chất lượng vận hành hoàn hảo không sai sót.",
    avatar: "https://plus.unsplash.com/premium_photo-1661688797823-36e97735223e?auto=format&fit=crop&w=600&q=80",
    commitment: "⚡ Chuẩn xác 100% & An toàn tuyệt đối",
  },
  {
    name: "Phạm Mai Linh",
    role: "Giám Đốc Khối Lữ Hành & Tour MICE (Tour Director)",
    exp: "8+ năm kinh nghiệm",
    desc: "Thiết kế và điều hành các tour du lịch trải nghiệm, hội nghị MICE và Team Building cao cấp cho các tập đoàn và trường đại học lớn.",
    avatar: "https://plus.unsplash.com/premium_photo-1664474599379-d4f18f140067?auto=format&fit=crop&w=600&q=80",
    commitment: "🤝 Trải nghiệm gắn kết & Dịch vụ chỉn chu",
  },
];

// Báo chí & Truyền thông đưa tin
const MEDIA_PRESS_ITEMS = [
  {
    outlet: "Báo Dân Trí",
    category: "Góc Doanh Nghiệp",
    title: "Trường Hải Event: Dấu ấn khẳng định vị thế tổ chức sự kiện và du lịch chuyên nghiệp",
    snippet: "Với lợi thế làm chủ 100% kho thiết bị âm thanh ánh sáng và dàn xe trực tiếp, Trường Hải Event & Travel trở thành sự lựa chọn hàng đầu của các cơ quan và tập đoàn lớn.",
    date: "15/03/2024",
    linkText: "Đọc bài viết trên Báo Dân Trí",
  },
  {
    outlet: "VnExpress",
    category: "Kinh Doanh & Đời Sống",
    title: "Giải pháp tổ chức đại lễ kỷ niệm và tour MICE trọn gói tiết kiệm 30% ngân sách",
    snippet: "Quy trình vận hành khép kín từ khâu lên ý tưởng, thiết kế phối cảnh 3D, thi công sân khấu đến điều hành xe du lịch giúp tối ưu hóa chi phí cho khách hàng.",
    date: "28/08/2023",
    linkText: "Đọc bài viết trên VnExpress",
  },
  {
    outlet: "Báo Pháp Luật & Xã Hội",
    category: "Trách Nhiệm Xã Hội",
    title: "Hành trình thiện nguyện 'Chắp cánh ước mơ' mang hơi ấm đến học sinh vùng cao",
    snippet: "Không chỉ dừng lại ở hoạt động kinh doanh, Trường Hải Event & Travel thường niên trích một phần lợi nhuận để hỗ trợ xây dựng tủ sách và trao học bổng cho các em nhỏ khó khăn.",
    date: "12/01/2024",
    linkText: "Đọc bài viết trên PL&XH",
  },
];

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* =========================================================================
          1. HERO BANNER & TỔNG QUAN DOANH NGHIỆP
      ========================================================================= */}
      <section className="relative bg-[#0A1E5E] text-white py-16 sm:py-20 lg:py-24 overflow-hidden border-b border-[#D4AF37]/30">
        {/* Background Gradients & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#122b82] via-[#0A1E5E] to-[#040c24] opacity-95" />
        <div className="absolute top-12 left-10 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-300 mb-6 sm:mb-8">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#D4AF37] font-medium">Về chúng tôi</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading, Intro, CTAs */}
            <div className="lg:col-span-7 space-y-5">
              <Reveal delay={100} direction="up">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/50 text-xs font-semibold text-[#D4AF37] shadow-sm backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hồ Sơ Năng Lực & Bản Sắc Doanh Nghiệp</span>
                </div>

                <h1 className="font-bold text-white tracking-tight leading-tight mt-3">
                  <span className="block text-base sm:text-xl md:text-2xl font-bold text-slate-200 uppercase tracking-wide mb-1.5">
                    Công Ty TNHH Sự Kiện &amp; Du Lịch
                  </span>
                  <span className="block text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#D4AF37] tracking-tight">
                    TRƯỜNG HẢI
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={200} direction="up">
                <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl">
                  Tên thương mại: <strong className="text-white font-semibold">{COMPANY_INFO.brandName}</strong>. 
                  Là đơn vị tiên phong kết hợp hoàn hảo giữa năng lực tổ chức sự kiện quy mô lớn và chuỗi hành trình 
                  du lịch trải nghiệm cao cấp, tự hào đồng hành cùng hơn 100+ cơ quan Trung ương, 
                  trường đại học và các tập đoàn kinh tế hàng đầu toàn quốc.
                </p>
              </Reveal>

              {/* Slogan highlight box */}
              <Reveal delay={300} direction="up">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#06123B]/80 border border-[#D4AF37]/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[#D4AF37] transition-all duration-300">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                      Khẩu hiệu hành động & Cam kết thương hiệu
                    </div>
                    <div className="text-base sm:text-xl font-bold text-white">
                      &ldquo;<span className="text-[#D4AF37]">{COMPANY_INFO.slogan}</span>&rdquo;
                    </div>
                  </div>
                  <a
                    href={`tel:${COMPANY_INFO.hotline}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A1E5E] font-bold text-xs shadow-md transition-all shrink-0 hover:scale-105"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    <span>Hotline: {COMPANY_INFO.hotlineDisplay}</span>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Corporate Identity Card Preview */}
            <div className="lg:col-span-5">
              <Reveal delay={250} direction="left" className="animate-float-slow">
                <div className="p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md shadow-2xl relative overflow-hidden space-y-4 hover:border-[#D4AF37]/40 transition-colors duration-500">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#997A15] p-0.5">
                        <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center overflow-hidden">
                          <Image
                            src="/images/logo.png"
                            alt="Logo Trường Hải Event & Travel"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain scale-125"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Trường Hải Event & Travel</div>
                        <div className="text-[11px] text-slate-300">Pháp lý minh bạch • VAT đầy đủ</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-semibold">
                      Đã Xác Minh
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-slate-400">Mã số thuế:</span>
                      <span className="font-mono font-semibold text-[#D4AF37]">{COMPANY_INFO.taxId}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-slate-400">Đại diện pháp luật:</span>
                      <span className="font-semibold text-white">{COMPANY_INFO.director}</span>
                    </div>
                    <div className="flex justify-between items-start py-1 border-b border-white/5">
                      <span className="text-slate-400 shrink-0 mr-2">Trụ sở đăng ký:</span>
                      <span className="font-medium text-white text-right line-clamp-2">{COMPANY_INFO.address}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Cơ quan quản lý thuế:</span>
                      <span className="font-medium text-slate-200">{COMPANY_INFO.taxAuthority}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href="#phap-ly"
                      className="flex-1 text-center py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-all hover:scale-102"
                    >
                      Xem Giấy Phép & Pháp Lý
                    </a>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="flex-1 text-center py-2.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-102"
                    >
                      Yêu Cầu E-Profile
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TẦM NHÌN & SỨ MỆNH (ĐỊNH HƯỚNG CHIẾN LƯỢC THEO THIẾT KẾ MỚI)
      ========================================================================= */}
      <VisionMissionSection />

      {/* =========================================================================
          3. HÀNH TRÌNH LỊCH SỬ PHÁT TRIỂN & NHỮNG CỘT MỐC VÀNG
      ========================================================================= */}
      <TimelineMilestonesSection />

      {/* =========================================================================
          4. ĐỘI NGŨ NHÂN SỰ NÒNG CỐT & BAN LÃNH ĐẠO (KEY LEADERSHIP)
      ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={100} direction="up">
            <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-14 space-y-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0A1E5E] shadow-sm">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Con Người Là Trọng Tâm</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1E5E] tracking-tight">
                Đội Ngũ Nhân Sự Nòng Cốt &amp; <span className="whitespace-nowrap">Ban Lãnh Đạo</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Những chuyên gia tận tâm với hơn một thập kỷ kinh nghiệm trong ngành tổ chức sự kiện, 
                đạo diễn sân khấu nghệ thuật và vận hành tour du lịch lữ hành.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {KEY_LEADERSHIP.map((leader, lIdx) => (
              <Reveal key={lIdx} delay={120 + lIdx * 90} direction="up" className="h-full">
                <div
                  className="h-full rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    <img
                      src={leader.avatar}
                      alt={leader.name}
                      className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E5E]/90 via-[#0A1E5E]/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
                    
                    {/* Experience Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 font-medium">
                        {leader.exp}
                      </span>
                      <BadgeCheck className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors duration-300">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-600 mt-0.5">
                        {leader.role}
                      </p>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2.5">
                        {leader.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-700 font-medium">
                      <span>{leader.commitment}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BÁO CHÍ & TRUYỀN THÔNG ĐƯA TIN (PR & BRAND REPUTATION)
      ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Reveal delay={100} direction="up">
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-14 space-y-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              <Newspaper className="w-3.5 h-3.5 text-rose-600" />
              <span>Uy Tín Được Khẳng Định</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1E5E] tracking-tight">
              Góc Báo Chí &amp; <span className="whitespace-nowrap">Truyền Thông Đưa Tin</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Sự uy tín và chuyên nghiệp của Trường Hải Event & Travel thường xuyên được ghi nhận 
              trên các trang báo lớn và các kênh truyền hình chính thống.
            </p>
          </div>
        </Reveal>

        {/* Press Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {MEDIA_PRESS_ITEMS.map((press, pIdx) => (
            <Reveal key={pIdx} delay={120 + pIdx * 90} direction="up" className="h-full">
              <div
                className="h-full p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:border-[#D4AF37] hover:-translate-y-1.5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold group-hover:bg-[#0A1E5E] group-hover:text-white transition-colors">
                      {press.outlet}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {press.date}
                    </span>
                  </div>

                  <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
                    {press.category}
                  </div>

                  <h3 className="text-base font-bold text-[#0A1E5E] group-hover:text-amber-600 transition-colors leading-snug">
                    {press.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    {press.snippet}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors">
                  <span>{press.linkText}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* E-Profile Download CTA Banner */}
        <Reveal delay={200} direction="up">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#102466] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-300">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37]">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span>Tài Liệu Hồ Sơ Dự Thầu & Báo Giá</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Tải Xuống Bộ Hồ Sơ Năng Lực (E-Profile 2026)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl">
                Đầy đủ thông tin giấy phép kinh doanh, danh mục 100% kho thiết bị, hợp đồng mẫu và hình ảnh các đại dự án đã thực hiện.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]"
              >
                <Download className="w-4 h-4 mr-2" />
                <span>Tải E-Profile PDF</span>
              </a>
              <Link
                href="/dich-vu#bao-gia"
                className="inline-flex items-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all hover:scale-105"
              >
                <span>Nhận Báo Giá Nhanh</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          6. THÔNG TIN PHÁP LÝ MINH BẠCH (MÃ SỐ THUẾ & TƯ CÁCH PHÁP NHÂN)
      ========================================================================= */}
      <section id="phap-ly" className="py-16 sm:py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={100} direction="up">
            <div className="text-center max-w-4xl mx-auto mb-12 space-y-2.5">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#0A1E5E]">
                <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Pháp Lý Rõ Ràng – Hợp Đồng Minh Bạch</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1E5E] tracking-tight">
                Hồ Sơ Doanh Nghiệp &amp; <span className="whitespace-nowrap">Tư Cách Pháp Nhân</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Chúng tôi hiểu rằng với các cơ quan nhà nước, trường đại học và tập đoàn lớn, 
                tính chuẩn mực pháp lý và khả năng quyết toán tài chính là tiêu chí tiên quyết. 
                Trường Hải Event & Travel luôn công khai minh bạch mọi thông tin đăng ký doanh nghiệp.
              </p>
            </div>
          </Reveal>

          {/* Corporate Identity Certificate Box */}
          <Reveal delay={150} direction="up">
            <div className="bg-white rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl p-6 sm:p-10 lg:p-12 relative overflow-hidden hover:border-[#D4AF37] transition-colors duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Summary Badge */}
                <div className="lg:col-span-5 space-y-5 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#0A1E5E] text-[#D4AF37] flex items-center justify-center shadow-lg border border-[#D4AF37]/40">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold uppercase text-[#D4AF37] tracking-wider">
                      Đăng ký kinh doanh hợp pháp
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0A1E5E] leading-snug">
                      {COMPANY_INFO.name}
                    </h3>
                    <p className="text-xs text-slate-500 italic">
                      Tên giao dịch quốc tế: {COMPANY_INFO.englishName}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                    <div className="font-semibold flex items-center text-amber-900">
                      <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-600" />
                      Bảo đảm tài chính & Chứng từ:
                    </div>
                    <p className="font-normal text-[11px] leading-relaxed text-amber-800">
                      Xuất đầy đủ hóa đơn điện tử VAT, hợp đồng kinh tế song phương, biên bản nghiệm thu 
                      và thanh lý hợp đồng đúng chuẩn quy định của Bộ Tài chính.
                    </p>
                  </div>
                </div>

                {/* Right: Detailed Fields Grid */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Field 1: Đại diện pháp luật / Giám đốc */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1 hover:bg-blue-50/50 hover:border-[#D4AF37]/40 transition-all duration-300">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                      Người đại diện / Giám đốc
                    </div>
                    <div className="text-base font-bold text-[#0A1E5E]">
                      {COMPANY_INFO.director}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      Chịu trách nhiệm pháp lý cao nhất
                    </div>
                  </div>

                  {/* Field 2: Mã số thuế */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1 hover:bg-blue-50/50 hover:border-[#D4AF37]/40 transition-all duration-300">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <FileCheck className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                      Mã số doanh nghiệp (MST)
                    </div>
                    <div className="text-base font-bold text-[#0A1E5E] font-mono tracking-wide">
                      {COMPANY_INFO.taxId}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      Cấp bởi {COMPANY_INFO.taxAuthority}
                    </div>
                  </div>

                  {/* Field 3: Địa chỉ văn phòng trụ sở */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1 sm:col-span-2 hover:bg-blue-50/50 hover:border-[#D4AF37]/40 transition-all duration-300">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                      Địa chỉ văn phòng & Trụ sở đăng ký
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {COMPANY_INFO.address}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      Địa điểm tiếp nhận văn thư, giao dịch hợp đồng trực tiếp
                    </div>
                  </div>

                  {/* Field 4: Hotline */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1 hover:bg-blue-50/50 hover:border-[#D4AF37]/40 transition-all duration-300">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                      Đường dây nóng 24/7
                    </div>
                    <div className="text-base font-bold text-[#0A1E5E]">
                      <a href={`tel:${COMPANY_INFO.hotline}`} className="hover:text-[#D4AF37] transition-colors">
                        {COMPANY_INFO.hotlineDisplay}
                      </a>
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      Tiếp nhận khảo sát & báo giá khẩn cấp
                    </div>
                  </div>

                  {/* Field 5: Email & Hỗ trợ */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-1 hover:bg-blue-50/50 hover:border-[#D4AF37]/40 transition-all duration-300">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1.5 text-[#0A1E5E]" />
                      Hòm thư điện tử
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-[#0A1E5E] transition-colors">
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      Gửi hồ sơ dự thầu & báo giá chi tiết
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* =========================================================================
          7. ĐỐI TÁC TIÊU BIỂU (3 NHÓM CHIẾN LƯỢC)
      ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Reveal delay={100} direction="up">
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-14 space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0A1E5E]/10 border border-[#0A1E5E]/20 text-xs font-semibold text-[#0A1E5E]">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Minh Chứng Năng Lực Thực Chiến</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1E5E] tracking-tight">
              Khối Đối Tác Tiêu Biểu <span className="whitespace-nowrap">Đồng Hành</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Niềm tin của khách hàng không đến từ lời quảng cáo mà được khẳng định qua 
              danh sách các đối tác chính khách, học thuật và thương mại đã đồng hành cùng Trường Hải.
            </p>
          </div>
        </Reveal>

        {/* 3 Partner Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {PARTNER_GROUPS.map((group, gIdx) => {
            const GroupIcon =
              gIdx === 0 ? Landmark : gIdx === 1 ? GraduationCap : Briefcase;
            const groupBadge =
              gIdx === 0
                ? "Chuẩn mực an ninh & nghi thức ngoại giao"
                : gIdx === 1
                ? "Quy mô học thuật & đông người 1.000+"
                : "Thương hiệu lớn & chuyển đổi bán lẻ cao";

            return (
              <Reveal key={gIdx} delay={120 + gIdx * 100} direction="up" className="h-full">
                <div
                  className="h-full bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden group hover:border-[#D4AF37]/60"
                >
                  {/* Header card with distinct Navy styling */}
                  <div className="p-6 bg-[#0A1E5E] text-white border-b border-[#D4AF37]/30 space-y-2.5 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-white/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#0A1E5E] transition-all duration-300">
                        <GroupIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        Nhóm {gIdx + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{group.category}</h3>
                      <p className="text-xs text-slate-300 font-normal mt-1">
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
                          className="flex items-start space-x-3 p-2 rounded-xl hover:bg-blue-50/70 hover:translate-x-1 transition-all duration-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <div className="text-xs sm:text-sm font-semibold text-[#0A1E5E]">
                              {partner.name}
                            </div>
                            {partner.sub && (
                              <div className="text-[11px] text-slate-500 font-normal">
                                {partner.sub}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Footnote / Trust Badge */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center text-[11px] text-slate-500 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                      <span>{groupBadge}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8. VÌ SAO CHỌN TRƯỜNG HẢI? (KHO THIẾT BỊ & DÀN XE TRỰC TIẾP)
      ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-4xl mx-auto space-y-2.5">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Năng Lực Thực Tế
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1E5E] tracking-tight">
              Vì Sao Khách Hàng Luôn Yên Tâm <span className="whitespace-nowrap">Chọn Trường Hải?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A1E5E] flex items-center justify-center font-bold">
                <Layers className="w-6 h-6 text-[#0A1E5E]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A1E5E]">
                Sở hữu 100% kho thiết bị trực tiếp
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Hệ thống loa Line Array công suất lớn, màn hình LED P2.5 - P3.91, ánh sáng Moving Head Beam nhập khẩu trực tiếp, không qua trung gian, giúp tiết kiệm 20% - 30% ngân sách cho khách hàng.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A1E5E] flex items-center justify-center font-bold">
                <Zap className="w-6 h-6 text-[#0A1E5E]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A1E5E]">
                Đội xe du lịch đời mới & Vận hành khép kín
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Đội xe 7 đến 45 chỗ đời mới cùng dàn Limousine VIP, kết hợp hệ thống đối tác khách sạn 4 - 5 sao trên toàn quốc đảm bảo hành trình tour luôn tiện nghi, an toàn tuyệt đối.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A1E5E] flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6 text-[#0A1E5E]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A1E5E]">
                Kịch bản may đo & Trách nhiệm cộng đồng
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Không rập khuôn máy móc, kịch bản sự kiện được cá nhân hóa sâu sắc theo câu chuyện doanh nghiệp. Đồng thời chúng tôi luôn đồng hành cùng các chiến dịch thiện nguyện vì cộng đồng tại vùng cao.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CTA SANG TRỌNG
      ========================================================================= */}
      <section className="bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#122868] text-white py-16 sm:py-20 border-t border-[#D4AF37]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <Reveal delay={100} direction="up">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Đồng Hành Kiến Tạo Thành Công</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white max-w-3xl mx-auto leading-tight mt-3">
              Sẵn Sàng Kiến Tạo Sự Kiện Đẳng Cấp &amp; <span className="whitespace-nowrap">Chuyến Đi Khác Biệt?</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal leading-relaxed mt-3">
              Liên hệ ngay với Ban Giám đốc và Đội ngũ Chuyên viên tư vấn của Trường Hải Event & Travel để được khảo sát tận nơi và nhận báo giá ưu đãi nhất.
            </p>
          </Reveal>

          <Reveal delay={200} direction="up">
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0A1E5E] font-bold text-sm shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.7)]"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Gọi ngay: {COMPANY_INFO.hotlineDisplay}</span>
              </a>

              <Link
                href="/dich-vu"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all hover:-translate-y-1 hover:scale-105"
              >
                <span>Xem Dịch Vụ & Báo Giá</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
