import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
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

export const metadata: Metadata = {
  title: "Giới Thiệu Trường Hải Event & Travel | Tổ Chức Sự Kiện & Du Lịch Trọn Gói",
  description:
    "Công ty TNHH Sự kiện và Du lịch Trường Hải - Sự kiện chuyên nghiệp, Du lịch trải nghiệm, Kết nối thành công. Thông tin pháp lý minh bạch MST 0111601327, đối tác cơ quan nhà nước, trường học và tập đoàn hàng đầu.",
};

// Cột mốc lịch sử phát triển 10+ năm
const TIMELINE_MILESTONES = [
  {
    year: "2014",
    title: "Khởi Sự & Đam Mê Phụng Sự",
    desc: "Thành lập Trường Hải Event tại Hà Nội với đội ngũ sáng lập nòng cốt giàu nhiệt huyết. Khởi đầu từ việc tổ chức các hội nghị, hội thảo học thuật và sự kiện khánh thành vừa & nhỏ.",
    tag: "Khởi nghiệp",
    highlight: "100+ sự kiện đầu tiên",
  },
  {
    year: "2017",
    title: "Đột Phá Kho Thiết Bị Trực Tiếp",
    desc: "Đầu tư bài bản kho âm thanh Line Array công suất lớn và màn hình LED P3.91 nhập khẩu trực tiếp. Cắt giảm 100% khâu trung gian, giúp khách hàng tiết kiệm 20% - 30% ngân sách.",
    tag: "Kho thiết bị 100%",
    highlight: "Sở hữu trực tiếp",
  },
  {
    year: "2020",
    title: "Mở Rộng Khối Lữ Hành & Tour MICE",
    desc: "Chính thức bổ sung mảng Du Lịch & Vận Tải, đầu tư dàn xe 7 - 45 chỗ đời mới. Tiên phong mô hình kết hợp Hội nghị MICE và Team Building gắn kết quy mô trên 1.500 người.",
    tag: "MICE & Team Building",
    highlight: "Dàn xe đời mới",
  },
  {
    year: "2023",
    title: "Đối Tác Chiến Lược Cấp Cơ Quan & Tập Đoàn",
    desc: "Trở thành đối tác tin cậy thường niên của các Bộ ban ngành Trung ương, Trung tâm Tình nguyện Quốc gia, hơn 20 trường đại học và các tập đoàn lớn (Vingroup, LocknLock, Toyoky...).",
    tag: "Đối tác chiến lược",
    highlight: "Cơ quan Trung ương",
  },
  {
    year: "2025 - Nay",
    title: "Số Hóa Sự Kiện & Phủ Sóng Toàn Quốc",
    desc: "Ứng dụng công nghệ trình diễn ánh sáng 3D Mapping, Hologram và số hóa điều hành tour. Mở rộng mạng lưới đối tác khách sạn 4 - 5 sao và địa điểm tổ chức khắp 3 miền Bắc - Trung - Nam.",
    tag: "Đỉnh cao công nghệ",
    highlight: "Quy mô toàn quốc",
  },
];

// Đội ngũ nhân sự nòng cốt
const KEY_LEADERSHIP = [
  {
    name: "Nguyễn Trường Hải",
    role: "Giám Đốc Điều Hành (CEO & Founder)",
    exp: "12+ năm kinh nghiệm",
    desc: "Chỉ đạo chiến lược, trực tiếp hoạch định và đàm phán các sự kiện trọng điểm cấp cơ quan Trung ương và các đại dự án toàn quốc.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Trần Thu Hà",
    role: "Giám Đốc Nghệ Thuật (Creative Director)",
    exp: "10+ năm kinh nghiệm",
    desc: "Chuyên gia sáng tạo kịch bản, tổng đạo diễn sân khấu cho hơn 300+ đêm Gala Dinner, lễ kỷ niệm thành lập và festival nghệ thuật.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Lê Hoàng Nam",
    role: "Trưởng Khối Kỹ Thuật & Thiết Bị (Technical Lead)",
    exp: "9+ năm kinh nghiệm",
    desc: "Quản lý 100% kho thiết bị âm thanh ánh sáng, màn hình LED. Đảm bảo an toàn kỹ thuật và chất lượng vận hành hoàn hảo không sai sót.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Phạm Mai Linh",
    role: "Giám Đốc Khối Lữ Hành & Tour MICE (Tour Director)",
    exp: "8+ năm kinh nghiệm",
    desc: "Thiết kế và điều hành các tour du lịch trải nghiệm, hội nghị MICE và Team Building cao cấp cho các tập đoàn và trường đại học lớn.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
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
                        <div className="w-full h-full bg-[#0A1E5E] rounded-[9px] flex items-center justify-center font-bold text-[#D4AF37] text-sm">
                          TH
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
          2. TẦM NHÌN, SỨ MỆNH & 4 GIÁ TRỊ CỐT LÕI (ĐỊNH HƯỚNG CHIẾN LƯỢC)
      ========================================================================= */}
      <section className="py-14 sm:py-16 lg:py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200">
        {/* Soft luxury ambient background glow */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-gradient-to-b from-amber-200/20 via-amber-100/10 to-transparent blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* SECTION HEADER: Split Left (Title) & Right (Description with amber line) */}
          <Reveal delay={100} direction="up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
              {/* Left Column: Line accent + 2-line Heading */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-[2px] bg-amber-500 rounded-full" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">
                    Định Hướng Chiến Lược
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0A1E5E] tracking-tight leading-tight">
                  Tầm Nhìn, Sứ Mệnh <br />
                  <span className="text-[#0A1E5E]">&amp; </span>
                  <span className="text-[#D4AF37]">Giá Trị Cốt Lõi</span>
                </h2>
              </div>

              {/* Right Column: Amber vertical border + Paragraph */}
              <div className="max-w-md border-l-2 border-amber-400 pl-4 py-0.5">
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  Kim chỉ nam dẫn lối mọi hành động, chuẩn mực chất lượng và tâm huyết 
                  mà đội ngũ Trường Hải Event &amp; Travel cam kết phụng sự đối tác trong từng dự án.
                </p>
              </div>
            </div>
          </Reveal>

          {/* MAIN GRID: Asymmetrical 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            {/* ================= LEFT COLUMN: HERO CARD TẦM NHÌN (lg:col-span-5) ================= */}
            <div className="lg:col-span-5 flex flex-col">
              <Reveal delay={150} direction="left" className="h-full">
                <div className="relative h-full rounded-2xl bg-[#0A1E5E] p-6 sm:p-7 text-white shadow-xl overflow-hidden flex flex-col justify-between border border-blue-900/60 group hover:shadow-[0_20px_50px_rgba(10,30,94,0.35)] hover:-translate-y-1 transition-all duration-500">
                  {/* Watermark 01 */}
                  <span className="pointer-events-none absolute top-3 right-6 text-6xl sm:text-7xl font-bold text-white/[0.07] select-none font-mono group-hover:scale-105 transition-transform">
                    01
                  </span>

                  {/* Concentric decorative ring arcs at bottom */}
                  <div className="pointer-events-none absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-blue-400/10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 w-60 h-60 rounded-full border border-blue-400/15" />
                  <div className="pointer-events-none absolute -bottom-4 -left-4 w-60 h-60 rounded-full border border-blue-400/20" />

                  {/* Top Content */}
                  <div className="relative z-10">
                    {/* Icon container */}
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
                      <Eye className="w-5 h-5 text-amber-400 group-hover:text-slate-950 transition-colors" />
                    </div>

                    {/* Sub-label */}
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                      Khát Vọng Tương Lai
                    </span>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
                      Tầm Nhìn Chiến Lược
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-[13px] text-slate-200/90 leading-relaxed font-normal">
                      {COMPANY_INFO.vision}
                    </p>
                  </div>

                  {/* Bottom Divider & Tags */}
                  <div className="mt-6 pt-4 border-t border-white/15 relative z-10">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Tiên phong sáng tạo
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-white backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Đối tác uy tín số 1
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ================= RIGHT COLUMN: SỨ MỆNH + DIVIDER + 4 GIÁ TRỊ (lg:col-span-7) ================= */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              {/* Top: Sứ Mệnh Thương Hiệu Card */}
              <Reveal delay={150} direction="right">
                <div className="relative rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-amber-300/80 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
                  {/* Soft circular decorative warm glow in background */}
                  <div className="pointer-events-none absolute -top-8 -right-8 w-60 h-60 bg-gradient-to-br from-amber-100/40 to-transparent rounded-full blur-2xl" />

                  {/* Watermark 02 */}
                  <span className="pointer-events-none absolute top-2 right-6 text-5xl sm:text-6xl font-bold text-slate-200/60 select-none font-mono">
                    02
                  </span>

                  <div className="relative z-10">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1.5">
                      Trọng Trách Phụng Sự
                    </span>

                    <h3 className="text-lg sm:text-xl font-bold text-[#0A1E5E] tracking-tight mb-2 group-hover:text-amber-600 transition-colors">
                      Sứ Mệnh Thương Hiệu
                    </h3>

                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal mb-3.5 max-w-xl">
                      {COMPANY_INFO.mission}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 text-[11px] font-medium text-slate-700">
                        <span className="text-slate-400">✦</span> Trải nghiệm giàu giá trị
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 text-[11px] font-medium text-slate-700">
                        <span className="text-slate-400">✦</span> Kết nối bền vững
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Divider: 04 GIÁ TRỊ CỐT LÕI */}
              <Reveal delay={200} direction="up">
                <div className="flex items-center gap-2.5 py-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 whitespace-nowrap">
                    04 Giá Trị Cốt Lõi
                  </span>
                  <div className="flex-1 h-[1.5px] bg-amber-300/60" />
                </div>
              </Reveal>

              {/* Bottom: 2x2 Grid for 4 Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {COMPANY_INFO.coreValues.map((val, idx) => {
                  const icons = [ShieldCheck, Sparkles, Heart, Users];
                  const ValIcon = icons[idx] || Sparkles;

                  return (
                    <Reveal key={idx} delay={220 + idx * 70} direction="up" className="h-full">
                      <div
                        className="h-full rounded-xl bg-white p-4 border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-amber-400/90 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#0A1E5E] text-[#D4AF37] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-gradient-to-br group-hover:from-[#0A1E5E] group-hover:to-[#16358c] transition-all shadow-sm">
                              <ValIcon className="w-4 h-4 text-[#D4AF37]" />
                            </div>
                            <span className="text-[11px] font-mono font-bold text-slate-300 group-hover:text-amber-500 transition-colors">
                              0{idx + 1}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#0A1E5E] group-hover:text-amber-600 transition-colors mb-1">
                            {val.title}
                          </h4>

                          <p className="text-[11px] sm:text-xs text-slate-600 font-normal leading-relaxed">
                            {val.desc}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HÀNH TRÌNH LỊCH SỬ PHÁT TRIỂN (TIMELINE MILESTONES 10+ NĂM)
      ========================================================================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Reveal delay={100} direction="up">
          <div className="text-center max-w-4xl mx-auto mb-14 space-y-2.5">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Hành Trình Bền Bỉ 10+ Năm</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1E5E] tracking-tight">
              Lịch Sử Phát Triển &amp; <span className="whitespace-nowrap">Những Cột Mốc Vàng</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Từ một đội ngũ trẻ giàu đam mê, Trường Hải Event & Travel đã không ngừng bứt phá 
              để trở thành đơn vị tổ chức sự kiện & tour du lịch trọn gói uy tín hàng đầu.
            </p>
          </div>
        </Reveal>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Center Line for Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#D4AF37] via-[#0A1E5E]/30 to-[#D4AF37]" />

          <div className="space-y-8 sm:space-y-12">
            {TIMELINE_MILESTONES.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Card (Left or Right) */}
                  <div className="w-full lg:w-[46%]">
                    <Reveal delay={120 + (idx % 3) * 60} direction={isEven ? "right" : "left"} className="w-full">
                      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 hover:border-[#D4AF37] hover:-translate-y-1 group relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-[#0A1E5E] px-3 py-1 rounded-full bg-slate-100 group-hover:bg-[#0A1E5E] group-hover:text-white transition-colors duration-300">
                            {item.tag}
                          </span>
                          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {item.highlight}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-[#0A1E5E] mb-2 leading-snug group-hover:text-amber-600 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </Reveal>
                  </div>

                  {/* Center Node / Year Badge */}
                  <div className="my-4 lg:my-0 lg:w-[8%] flex flex-col items-center justify-center relative z-10 group">
                    <div className="w-14 h-14 rounded-full bg-[#0A1E5E] text-[#D4AF37] border-4 border-white shadow-xl flex items-center justify-center font-bold text-xs group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.7)] group-hover:border-[#D4AF37] transition-all duration-300">
                      {item.year.split(" ")[0]}
                    </div>
                  </div>

                  {/* Empty Spacer on opposite side */}
                  <div className="hidden lg:block lg:w-[46%]" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
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

                    <div className="pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-500 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                      <span>Cam kết chuẩn mực & đồng hành</span>
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
