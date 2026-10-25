import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import InteractiveProfileViewer from "./components/InteractiveProfileViewer";
import HashScrollHandler from "@/components/HashScrollHandler";
import Reveal from "@/components/Reveal";
import { COMPANY_INFO, PARTNER_GROUPS } from "@/lib/company-data";
import {
  FileText,
  ShieldCheck,
  Building2,
  Award,
  Calendar,
  CheckCircle2,
  Truck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Download,
  Users,
  ChevronRight,
  Printer,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hồ Sơ Năng Lực Trường Hải Event & Travel | Năng Lực Thiết Bị Kho 1.000m²",
  description:
    "Hồ sơ năng lực Công ty TNHH Sự kiện và Du lịch Trường Hải (MST 0111601327). 100% tự chủ 1.000m² kho thiết bị âm thanh Line Array, ánh sáng, màn hình LED, 25+ xe du lịch và hơn 500+ dự án cấp Bộ ngành, tập đoàn.",
  keywords: [
    "hồ sơ năng lực trường hải event",
    "profile công ty sự kiện trường hải",
    "năng lực thiết bị sự kiện hà nội",
    "hồ sơ đấu thầu sự kiện",
    "thuê âm thanh ánh sáng kho trực tiếp",
    "công ty sự kiện và du lịch trường hải",
  ],
  openGraph: {
    title: "Hồ Sơ Năng Lực Trường Hải Event & Travel | Năng Lực Thiết Bị Kho 1.000m²",
    description:
      "Tư cách pháp nhân minh bạch MST 0111601327, tự chủ 1.000m² kho thiết bị trực tiếp, đối tác của Trung ương Đoàn, Bộ GTVT, Vietcombank, CellphoneS.",
    type: "website",
    locale: "vi_VN",
    url: `${COMPANY_INFO.website}/ho-so-nang-luc`,
    images: [
      {
        url: "/images/blog/stage-setup.jpg",
        width: 1200,
        height: 630,
        alt: "Hồ sơ năng lực Trường Hải Event & Travel",
      },
    ],
  },
};

export default function HoSoNangLucPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <HashScrollHandler />

      {/* Hero Section: Hồ Sơ Năng Lực */}
      <section className="relative bg-gradient-to-b from-[#06123B] via-[#0A1E5E] to-[#0d2673] text-white pt-12 pb-16 sm:pb-20 overflow-hidden border-b border-[#D4AF37]/30">
        {/* Pattern chìm & hiệu ứng ánh sáng */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-300 no-print">
            <Link href="/" className="hover:text-[#F5E08B] transition">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/ve-chung-toi" className="hover:text-[#F5E08B] transition">
              Giới Thiệu
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#D4AF37] font-semibold">Hồ Sơ Năng Lực (E-Profile)</span>
          </nav>

          {/* Tiêu đề chính & Huy hiệu pháp lý */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5E08B] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Hồ Sơ Năng Lực Doanh Nghiệp Chính Thức (B2B E-Profile)</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                HỒ SƠ NĂNG LỰC <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5E08B] to-[#D4AF37]">
                  TRƯỜNG HẢI EVENT & TRAVEL
                </span>
              </h1>

              <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Cung cấp toàn diện thông tin tư cách pháp nhân (MST: <strong>0111601327</strong>), năng lực kho thiết bị <strong>1.000m²</strong>, đội xe du lịch <strong>25+ chiếc</strong>, cơ cấu tổ chức và minh chứng <strong>500+ đại lễ thành công</strong> phục vụ công tác thẩm định, đấu thầu và hợp tác chiến lược.
              </p>

              {/* Thông tin nhanh MST & Trụ sở */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Mã số thuế: <strong className="ml-1 text-white">{COMPANY_INFO.taxId}</strong>
                </span>
                <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
                  Cấp bởi: {COMPANY_INFO.taxAuthority}
                </span>
                <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <Truck className="w-3.5 h-3.5 mr-1.5 text-[#F5E08B]" />
                  100% Kho thiết bị trực tiếp
                </span>
              </div>
            </div>

            {/* Thẻ Chứng nhận tóm tắt */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-bold text-sm text-white uppercase tracking-wider">
                    Thẩm Định Năng Lực
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Chuẩn B2B
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Kinh nghiệm thực tế:</span>
                  <strong className="text-white">10+ Năm (500+ Dự án)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Quy mô kho bãi:</span>
                  <strong className="text-[#F5E08B]">1.000m² tại Hà Nội</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Đội xe du lịch:</span>
                  <strong className="text-white">25+ Xe Universe 45 chỗ & Limousine</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Chứng nhận an toàn:</span>
                  <strong className="text-emerald-400">Kiểm định TCVN & Bảo hiểm</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Quyết toán tài chính:</span>
                  <strong className="text-white">Xuất hóa đơn VAT điện tử</strong>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${COMPANY_INFO.hotline}`}
                  className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#f3db81] to-[#D4AF37] text-slate-950 font-black rounded-xl text-xs hover:brightness-105 transition shadow-lg flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4 text-slate-950" />
                  <span>Hotline Đấu Thầu: {COMPANY_INFO.hotlineDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cốt Lõi: Trình xem Hồ sơ năng lực tương tác đa chế độ */}
      <InteractiveProfileViewer />

      {/* Cam Kết Chất Lượng & Đối Tác Trọng Điểm */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#0A1E5E] uppercase tracking-wider">
              Khách Hàng Đã Thẩm Định & Hợp Tác
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Đối Tác Chiến Lược Của Trường Hải Event & Travel
            </h2>
            <p className="text-xs text-slate-600">
              Minh chứng uy tín qua các hợp đồng sự kiện, hội nghị và tour lữ hành phục vụ các đoàn thể Trung ương và các tập đoàn hàng đầu.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              "Trung ương Đoàn TNCS Hồ Chí Minh",
              "Thành Đoàn Hà Nội",
              "Công An TP Hà Nội (PA05)",
              "Tổng cục Đường bộ Việt Nam",
              "ĐH Bách Khoa Hà Nội",
              "ĐH Kinh tế Quốc dân (NEU)",
              "Vietcombank",
              "VPBank",
              "CellphoneS",
              "Digiworld",
              "LocknLock",
              "Công ty CP DAMSAN",
            ].map((partner, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#D4AF37] hover:bg-white hover:shadow-sm transition flex items-center justify-center min-h-[56px]"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Data JSON-LD cho SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Organization",
              name: COMPANY_INFO.name,
              alternateName: COMPANY_INFO.brandName,
              taxID: COMPANY_INFO.taxId,
              url: `${COMPANY_INFO.website}/ho-so-nang-luc`,
              telephone: COMPANY_INFO.hotline,
              email: COMPANY_INFO.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: COMPANY_INFO.address,
                addressLocality: "Hà Nội",
                addressCountry: "VN",
              },
              founder: {
                "@type": "Person",
                name: COMPANY_INFO.director,
              },
              description:
                "Hồ sơ năng lực tổ chức sự kiện chuyên nghiệp và lữ hành doanh nghiệp của Công ty TNHH Sự kiện và Du lịch Trường Hải.",
            },
          }),
        }}
      />
    </main>
  );
}
