"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PROFILE_CHAPTERS,
  EQUIPMENT_SPECS,
  ORGANIZATION_ROLES,
  LEGAL_DOSSIER_ITEMS,
  DOWNLOADABLE_DOSSIERS,
  type EquipmentSpec,
} from "../data/profile-data";
import {
  COMPANY_INFO,
  PARTNER_GROUPS,
  PROJECTS_DATA,
} from "@/lib/company-data";
import {
  FileText,
  Printer,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Award,
  Sparkles,
  Layers,
  SlidersHorizontal,
  ExternalLink,
  Info,
  Calendar,
  Users,
  Eye,
  Truck,
  Volume2,
  Tv,
  Zap,
  Flame,
  Check,
  Compass,
} from "lucide-react";
import DossierRequestModal from "./DossierRequestModal";
import { TRAN_THU_HA_AVATAR } from "@/lib/tran-thu-ha-avatar";

type ViewMode = "deck" | "specs" | "legal" | "all";

export default function InteractiveProfileViewer() {
  const [activeMode, setActiveMode] = useState<ViewMode>("deck");
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Bộ lọc cho Specs Inspector
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedEquipment, setInspectedEquipment] = useState<EquipmentSpec | null>(null);

  // Modal yêu cầu hồ sơ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState<string>(
    "Hồ Sơ Năng Lực B2B Toàn Diện"
  );

  // Trạng thái sao chép link
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const currentChapter = PROFILE_CHAPTERS[currentChapterIndex];

  // Tự động đồng bộ URL Hash với chế độ xem E-Profile và chương tương ứng
  useEffect(() => {
    const handleHashSync = (overrideHash?: string) => {
      if (typeof window === "undefined") return;
      const rawHash = (
        overrideHash || window.location.hash.replace("#", "")
      ).toLowerCase();

      if (!rawHash) return;

      if (rawHash === "thiet-bi" || rawHash === "kho-thiet-bi") {
        setActiveMode("specs");
      } else if (rawHash === "phap-ly" || rawHash === "ho-so-thau") {
        setActiveMode("legal");
      } else if (rawHash === "nhan-su" || rawHash === "dao-dien") {
        setActiveMode("deck");
        setCurrentChapterIndex(2); // Chương 03: Cơ cấu nhân sự & Đạo diễn
      } else if (rawHash === "du-an" || rawHash === "doi-tac") {
        setActiveMode("deck");
        setCurrentChapterIndex(3); // Chương 04: Dự án tiêu biểu
      } else if (rawHash === "quy-trinh" || rawHash === "cam-ket") {
        setActiveMode("deck");
        setCurrentChapterIndex(4); // Chương 05: Quy trình & Cam kết
      } else if (rawHash === "tai-profile" || rawHash === "tai-lieu") {
        setActiveMode("legal");
      } else if (rawHash === "toan-bo" || rawHash === "slide") {
        setActiveMode("deck");
        setCurrentChapterIndex(0);
      }

      // Cuộn mượt đến phần tử hoặc profile-viewer-container
      setTimeout(() => {
        const target =
          document.getElementById(rawHash) ||
          document.getElementById("profile-viewer-container");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    };

    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      handleHashSync(customEvent.detail);
    };

    handleHashSync();
    const timer = setTimeout(() => handleHashSync(), 250);

    window.addEventListener("hashchange", () => handleHashSync());
    window.addEventListener("profile-navigate", handleCustomNav);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", () => handleHashSync());
      window.removeEventListener("profile-navigate", handleCustomNav);
    };
  }, []);

  // Lọc thiết bị theo category và từ khóa
  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_SPECS.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highlights.some((h) =>
          h.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleNextChapter = () => {
    if (currentChapterIndex < PROFILE_CHAPTERS.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleTriggerDownload = (title: string) => {
    setDownloadSuccessToast(title);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4500);
  };

  const openRequestModalWithPackage = (packageTitle: string) => {
    setSelectedPackageForModal(packageTitle);
    setIsModalOpen(true);
  };

  return (
    <div id="profile-viewer-container" className="w-full scroll-mt-24">
      {/* Toast thông báo tải hồ sơ */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-[#D4AF37]/50 flex items-start space-x-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold text-white text-sm">
              Đang xuất bản tài liệu:
            </h5>
            <p className="text-slate-300 mt-0.5 font-medium">
              {downloadSuccessToast}
            </p>
            <p className="text-[11px] text-amber-300 mt-1">
              Bạn có thể in ngay qua nút <strong>In Hồ Sơ</strong> hoặc đăng ký nhận bản in bìa cứng mạ vàng chuyển phát tận cơ quan.
            </p>
          </div>
        </div>
      )}

      {/* Control Bar: Chuyển đổi góc nhìn & Thao tác B2B */}
      <div className="no-print bg-white/95 backdrop-blur-md sticky top-16 z-30 shadow-md border-y border-slate-200/90 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tab Selector Chế độ xem */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveMode("deck")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeMode === "deck"
                  ? "bg-[#0A1E5E] text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Lật Trang E-Profile (Slide)</span>
            </button>

            <button
              onClick={() => setActiveMode("specs")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeMode === "specs"
                  ? "bg-[#0A1E5E] text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Tra Cứu Thiết Bị & Specs</span>
            </button>

            <button
              onClick={() => setActiveMode("legal")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeMode === "legal"
                  ? "bg-[#0A1E5E] text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hồ Sơ Dự Thầu & Pháp Lý</span>
            </button>

            <button
              onClick={() => setActiveMode("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                activeMode === "all"
                  ? "bg-[#0A1E5E] text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cuộn Toàn Diện (Full View)</span>
            </button>
          </div>

          {/* Quick Actions (Print, Download, Request dossier) */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <button
              onClick={handlePrint}
              title="In bản hồ sơ năng lực tiêu chuẩn A4"
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">In Hồ Sơ</span>
            </button>

            <button
              onClick={handleShareLink}
              title="Sao chép liên kết Hồ sơ năng lực"
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Đã Chép Link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Chia Sẻ</span>
                </>
              )}
            </button>

            <button
              onClick={() => openRequestModalWithPackage("Hồ Sơ Năng Lực B2B Toàn Diện")}
              className="px-3.5 py-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-[#D4AF37] via-[#f3db81] to-[#D4AF37] hover:brightness-105 rounded-lg flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Nhận Bản In / Song Ngữ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CHẾ ĐỘ A: LẬT TRANG E-PROFILE (INTERACTIVE SLIDE DECK)                  */}
      {/* ========================================================================= */}
      {activeMode === "deck" && (
        <section id="toan-bo" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-28">
          {/* Deck Header & Progress */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Thanh tiến trình các chương */}
            <div className="bg-[#06123B] p-4 sm:p-6 text-white border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>E-Profile Trường Hải Event & Travel</span>
                    <span className="text-slate-400">•</span>
                    <span>Chương {currentChapter.order} / 05</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {currentChapter.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {currentChapter.subtitle}
                  </p>
                </div>

                {/* Next / Prev Controls */}
                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={handlePrevChapter}
                    disabled={currentChapterIndex === 0}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition text-white border border-white/10 cursor-pointer"
                    aria-label="Chương trước"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-lg text-[#F5E08B] border border-white/10">
                    {currentChapterIndex + 1} / {PROFILE_CHAPTERS.length}
                  </span>

                  <button
                    onClick={handleNextChapter}
                    disabled={currentChapterIndex === PROFILE_CHAPTERS.length - 1}
                    className="p-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    aria-label="Chương tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Indicators */}
              <div className="grid grid-cols-5 gap-2 mt-5">
                {PROFILE_CHAPTERS.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => setCurrentChapterIndex(idx)}
                    className={`text-left p-2 rounded-lg transition-all text-xs border ${
                      idx === currentChapterIndex
                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white"
                        : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-[10px] font-bold text-[#F5E08B] uppercase">
                      Chương {ch.order}
                    </div>
                    <div className="font-semibold truncate text-[11px] hidden md:block">
                      {ch.badge}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nội dung chi tiết từng slide */}
            <div className="p-6 sm:p-10 bg-slate-50/50 min-h-[500px]">
              {/* SLIDE 1: THƯ NGỎ & PHÁP LÝ */}
              {currentChapterIndex === 0 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span>Lời Chào Trân Trọng Từ Ban Giám Đốc</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-[#0A1E5E] leading-snug">
                        Kính gửi Quý Khách Hàng, Quý Đối Tác Doanh Nghiệp & Các Cơ Quan Đoàn Thể!
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        Trải qua hơn một thập kỷ hình thành và phát triển bền bỉ, <strong>Công ty TNHH Sự kiện và Du lịch Trường Hải (Trường Hải Event & Travel)</strong> tự hào khẳng định vị thế là một trong những đơn vị uy tín hàng đầu tại Hà Nội và miền Bắc trong lĩnh vực tổ chức sự kiện chuyên nghiệp và lữ hành doanh nghiệp trọn gói.
                      </p>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                        Với triết lý hoạt động <em>&ldquo;Chất Lượng Tạo Niềm Tin – Chuyên Nghiệp Để Vững Bền&rdquo;</em>, chúng tôi hiểu rằng mỗi sự kiện, mỗi hành trình của quý đối tác đều mang ý nghĩa chiến lược đối với thương hiệu. Do đó, Trường Hải Event kiên định đầu tư <strong>100% hệ thống kho thiết bị âm thanh ánh sáng trực tiếp</strong>, không thông qua các cấp trung gian, giúp quý khách hàng tối ưu hóa từ <strong>25% - 30% ngân sách</strong> và hoàn toàn an tâm về tiến độ.
                      </p>

                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {COMPANY_INFO.director}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Giám Đốc Điều Hành (CEO & Founder)
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                            MST: {COMPANY_INFO.taxId}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {COMPANY_INFO.taxAuthority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 bg-gradient-to-br from-[#0A1E5E] to-[#06123B] text-white p-6 rounded-2xl shadow-lg border border-[#D4AF37]/30 space-y-4">
                      <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Hồ Sơ Năng Lực Pháp Lý</span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="pb-2 border-b border-white/10">
                          <div className="text-slate-400 text-[10px]">Tên doanh nghiệp</div>
                          <div className="font-bold text-white text-[12px]">{COMPANY_INFO.name}</div>
                        </div>

                        <div className="pb-2 border-b border-white/10">
                          <div className="text-slate-400 text-[10px]">Tên thương hiệu</div>
                          <div className="font-bold text-[#F5E08B] text-[13px]">{COMPANY_INFO.brandName}</div>
                        </div>

                        <div className="pb-2 border-b border-white/10">
                          <div className="text-slate-400 text-[10px]">Mã số thuế & ĐKKD</div>
                          <div className="font-bold text-emerald-400 text-sm tracking-wider font-mono">
                            {COMPANY_INFO.taxId}
                          </div>
                        </div>

                        <div className="pb-2 border-b border-white/10">
                          <div className="text-slate-400 text-[10px]">Tài khoản ngân hàng doanh nghiệp</div>
                          <div className="font-semibold text-slate-200">
                            Ngân hàng TMCP Đầu tư & Phát triển Việt Nam (BIDV)
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-400 text-[10px]">Địa chỉ trụ sở pháp lý</div>
                          <div className="text-slate-300 text-[11px] leading-relaxed">
                            {COMPANY_INFO.address}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => openRequestModalWithPackage("Hồ Sơ Pháp Lý & Năng Lực Tài Chính")}
                          className="w-full py-2 bg-[#D4AF37] text-slate-950 font-bold rounded-lg text-xs hover:brightness-105 transition shadow text-center cursor-pointer"
                        >
                          Tải Giấy Phép ĐKKD & Hồ Sơ Thuế
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: NĂNG LỰC THIẾT BỊ & KHO BÃI */}
              {currentChapterIndex === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        Hệ Thống Kho Bãi 1.000m² & Thiết Bị Nhập Khẩu Chính Hãng
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Trực tiếp sở hữu, kiểm định an toàn định kỳ và luôn sẵn sàng điều động trong 2 giờ
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveMode("specs")}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0A1E5E] text-white rounded-xl text-xs font-bold hover:bg-[#06123B] transition shadow cursor-pointer self-start"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Xem Bảng Thông Số Đầy Đủ</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Thẻ 1: Âm thanh Line Array */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Âm Thanh Line Array JBL / d&b
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        32 Module loa Array công suất lớn, Mixer Yamaha CL5 digital, micro Shure Axient chống trùng sóng, phục vụ đến 10.000 khán giả.
                      </p>
                      <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded w-fit">
                        Công suất: 50.000W RMS
                      </div>
                    </div>

                    {/* Thẻ 2: Ánh sáng Moving & Laser */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Ánh Sáng Sân Khấu Beam & Laser
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        60 Cây Moving Beam 480W, 120 đèn Par LED 54x3W, laser 20W RGB, máy khói lạnh y tế an toàn và bàn điều khiển GrandMA2.
                      </p>
                      <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded w-fit">
                        Đạt chuẩn truyền hình Full HD
                      </div>
                    </div>

                    {/* Thẻ 3: Màn hình LED P2.5 & P3.91 */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Tv className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Màn Hình LED Indoor & Outdoor
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Hơn 550m² màn hình LED P2.5 trong nhà siêu nét và P3.91 ngoài trời chuẩn IP65 chống nước, tần số quét 3840Hz chống sọc máy quay.
                      </p>
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded w-fit">
                        Sẵn sàng 550m² trong kho
                      </div>
                    </div>
                  </div>

                  {/* Banner nhà giàn và dàn xe */}
                  <div className="p-4 bg-gradient-to-r from-slate-900 to-[#0A1E5E] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase">
                        <Truck className="w-4 h-4" />
                        <span>Nhà Bạt Truss 3.000m² & Đội Xe Du Lịch 25+ Chiếc</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Khung hợp kim nhôm T6061 chịu bão cấp 8, dàn xe Universe 45 chỗ đời mới 2022-2024 phục vụ đưa đón trọn gói.
                      </p>
                    </div>

                    <button
                      onClick={() => openRequestModalWithPackage("Catalogue Thiết Bị & Rider Kỹ Thuật")}
                      className="px-4 py-2 bg-[#D4AF37] text-slate-950 rounded-xl text-xs font-bold hover:brightness-105 transition shrink-0 cursor-pointer"
                    >
                      Tải File Rider Kỹ Thuật
                    </button>
                  </div>
                </div>
              )}

              {/* SLIDE 3: NĂNG LỰC NHÂN SỰ & CƠ CẤU TỔ CHỨC */}
              {currentChapterIndex === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Sơ Đồ Cơ Cấu Tổ Chức & Ban Điều Hành Chuyên Môn
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Quy trình phân nhiệm chặt chẽ, kiểm soát rủi ro từ khâu ý tưởng kịch bản đến tổng duyệt hiện trường
                    </p>
                  </div>

                  {/* Grid các khối chức năng */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ORGANIZATION_ROLES.map((role, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                            {role.headcount}
                          </span>
                          <span className="text-[10px] text-blue-700 font-bold">
                            Khối {idx + 1}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                          {role.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">{role.department}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {role.description}
                        </p>

                        <ul className="space-y-1 pt-1 border-t border-slate-100">
                          {role.keyResponsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="text-[11px] text-slate-600 flex items-start">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1.5 shrink-0 mt-0.5" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Highlight Chuyên gia Nghệ thuật & Kỹ thuật */}
                  <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37] shrink-0">
                      <Image
                        src={TRAN_THU_HA_AVATAR}
                        alt="Đạo diễn Trần Thu Hà"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5 text-center sm:text-left">
                      <div className="text-xs font-bold text-amber-900">
                        Chỉ đạo nghệ thuật: Đạo diễn Trần Thu Hà (10+ năm kinh nghiệm)
                      </div>
                      <p className="text-xs text-amber-800">
                        Tổng đạo diễn hơn 300+ đêm Gala Dinner, lễ kỷ niệm và festival. Cam kết sáng tạo kịch bản độc bản, không rập khuôn theo mẫu cũ.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 4: DỰ ÁN TIÊU BIỂU & ĐỐI TÁC */}
              {currentChapterIndex === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        Bằng Chứng Năng Lực Qua 500+ Sự Kiện Thực Tế
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Tổ chức các đại lễ cấp Nhà nước, Bộ ngành, trường đại học danh tiếng và các tập đoàn hàng đầu
                      </p>
                    </div>
                    <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>Hơn 100+ Tập Đoàn Đối Tác</span>
                    </div>
                  </div>

                  {/* Grid 4 Case Studies điển hình */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PROJECTS_DATA.slice(0, 4).map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                      >
                        <div className="relative h-44 w-full bg-slate-900">
                          <Image
                            src={proj.image_url}
                            alt={proj.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute top-3 left-3 bg-[#0A1E5E]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm">
                            {proj.year || "Tiêu biểu"} • {proj.location || "Toàn quốc"}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="text-[11px] font-bold text-[#D4AF37] uppercase">
                              Đối tác: {proj.client_name}
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">
                              {proj.title}
                            </h4>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                              {proj.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="flex items-center text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Nghiệm thu 100% đạt chuẩn
                            </span>
                            <span className="text-slate-400">Trường Hải Event trực tiếp</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Banner Logo đối tác trọng điểm */}
                  <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider text-center">
                      Đối Tác Doanh Nghiệp & Đoàn Thể Trọng Điểm
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-xs">
                      {PARTNER_GROUPS[0].partners.slice(0, 4).map((p, idx) => (
                        <span key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-semibold text-[11px]">
                          🏛️ {p.name}
                        </span>
                      ))}
                      {PARTNER_GROUPS[2].partners.slice(0, 5).map((p, idx) => (
                        <span key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-semibold text-[11px]">
                          🏢 {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 5: QUY TRÌNH 6 BƯỚC & CAM KẾT VẬN HÀNH */}
              {currentChapterIndex === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Quy Trình Triển Khai 6 Bước Tiêu Chuẩn SOP & Cam Kết
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Cam kết chịu phạt hợp đồng nếu trễ tiến độ hoặc sai lệch thiết bị so với danh mục thầu
                    </p>
                  </div>

                  {/* 6 Bước quy trình */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        step: "01",
                        title: "Tiếp Nhận & Khảo Sát Hiện Trường",
                        desc: "Khảo sát mặt bằng trong vòng 24h, đo đạc cao độ trần, nguồn điện và tính toán khả năng chịu lực khung truss.",
                      },
                      {
                        step: "02",
                        title: "Lên Concept & Kịch Bản Độc Bản",
                        desc: "Đạo diễn biên soạn kịch bản chi tiết phút-phút, thiết kế phối cảnh 3D sân khấu và demo visual LED.",
                      },
                      {
                        step: "03",
                        title: "Ký Kết Hợp Đồng & Phương Án Bảo Hiểm",
                        desc: "Hợp đồng pháp lý minh bạch, cam kết thiết bị chính hãng và kích hoạt bảo hiểm trách nhiệm sự kiện.",
                      },
                      {
                        step: "04",
                        title: "Thi Công & Lắp Đặt Trước Giờ G",
                        desc: "Hoàn thiện toàn bộ âm thanh ánh sáng trước giờ khai mạc tối thiểu 4 - 6 tiếng để chạy thử kỹ thuật.",
                      },
                      {
                        step: "05",
                        title: "Điều Phối Trực Tiếp & Dự Phòng 1-1",
                        desc: "Kỹ sư âm thanh, ánh sáng, đạo diễn điều phối trực chiến 100%, sẵn sàng thiết bị dự phòng thay thế tức thì.",
                      },
                      {
                        step: "06",
                        title: "Nghiệm Thu, Quyết Toán & VAT",
                        desc: "Biên bản nghiệm thu minh bạch từng hạng mục, xuất hóa đơn VAT điện tử hợp lệ phục vụ kiểm toán thanh tra.",
                      },
                    ].map((stepItem, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden"
                      >
                        <div className="text-2xl font-black text-slate-200 absolute top-2 right-3 select-none">
                          {stepItem.step}
                        </div>
                        <div className="text-xs font-bold text-[#D4AF37] uppercase mb-1">
                          Bước {stepItem.step}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1.5">
                          {stepItem.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {stepItem.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 4 Cam kết vàng */}
                  <div className="p-5 bg-gradient-to-r from-emerald-900 to-[#0A1E5E] text-white rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Cam Kết Vàng Của Trường Hải Event & Travel</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                        <strong className="text-[#F5E08B] block mb-1">100% Đúng Tiến Độ</strong>
                        Bàn giao sân khấu trước giờ G tối thiểu 4 giờ để tổng duyệt.
                      </div>
                      <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                        <strong className="text-[#F5E08B] block mb-1">Không Phát Sinh Chi Phí</strong>
                        Báo giá trọn gói minh bạch, chốt đúng dự toán hợp đồng.
                      </div>
                      <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                        <strong className="text-[#F5E08B] block mb-1">Thiết Bị Đúng Hợp Đồng</strong>
                        Sử dụng 100% thương hiệu chính hãng cam kết trong hồ sơ thầu.
                      </div>
                      <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                        <strong className="text-[#F5E08B] block mb-1">Hóa Đơn VAT Điện Tử</strong>
                        Đầy đủ hợp đồng, thanh lý, hóa đơn VAT theo quy định Tổng cục Thuế.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Deck Điều hướng chương */}
            <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                Đang xem: <strong className="text-slate-800">{currentChapter.title}</strong>
              </div>

              <div className="flex items-center space-x-3">
                {currentChapterIndex > 0 && (
                  <button
                    onClick={handlePrevChapter}
                    className="text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Chương trước</span>
                  </button>
                )}

                {currentChapterIndex < PROFILE_CHAPTERS.length - 1 ? (
                  <button
                    onClick={handleNextChapter}
                    className="px-4 py-2 bg-[#0A1E5E] text-white rounded-xl font-bold flex items-center space-x-1.5 hover:bg-[#06123B] transition shadow cursor-pointer"
                  >
                    <span>Xem tiếp Chương 0{currentChapterIndex + 2}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => openRequestModalWithPackage("Hồ Sơ Năng Lực B2B Toàn Diện")}
                    className="px-4 py-2 bg-[#D4AF37] text-slate-950 font-black rounded-xl hover:brightness-105 transition shadow flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Đăng Ký Nhận Bản In Bìa Cứng</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. CHẾ ĐỘ B: TRA CỨU THIẾT BỊ & SPECS INSPECTOR                            */}
      {/* ========================================================================= */}
      {activeMode === "specs" && (
        <section id="thiet-bi" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn scroll-mt-28">
          {/* Header Specs Explorer */}
          <div className="bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#142A75] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#D4AF37]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Tra Cứu Thông Số Kỹ Thuật Trực Tuyến</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  Kho Thiết Bị Sự Kiện & Đội Xe Du Lịch Trường Hải
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Trực quan hóa toàn bộ trang thiết bị âm thanh, ánh sáng, màn hình LED, nhà bạt không gian và xe du lịch đời mới. Đầy đủ chứng chỉ CO/CQ và kiểm định an toàn kỹ thuật.
                </p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 shrink-0 text-center">
                <div className="text-2xl font-black text-[#F5E08B]">1.000m²</div>
                <div className="text-[11px] text-slate-300">Kho bãi trực tiếp tại Hà Nội</div>
              </div>
            </div>

            {/* Thanh Tìm Kiếm & Lọc Category */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {[
                  { id: "all", label: "Tất Cả Thiết Bị" },
                  { id: "am-thanh", label: "Âm Thanh" },
                  { id: "anh-sang", label: "Ánh Sáng" },
                  { id: "man-led", label: "Màn Hình LED" },
                  { id: "san-khau-truss", label: "Sân Khấu & Truss" },
                  { id: "xe-du-lich", label: "Xe Du Lịch" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-[#D4AF37] text-slate-950 shadow"
                        : "bg-white/10 text-slate-200 hover:bg-white/20"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Input tìm kiếm */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm model, thương hiệu (JBL, Beam, P2.5...)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white/20 transition"
                />
              </div>
            </div>
          </div>

          {/* Grid Thiết Bị */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((eq) => (
              <div
                key={eq.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={eq.image}
                      alt={eq.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-[#0A1E5E]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
                      {eq.categoryLabel}
                    </div>

                    {eq.badge && (
                      <div className="absolute top-3 right-3 bg-[#D4AF37] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                        {eq.badge}
                      </div>
                    )}

                    <div className="absolute bottom-2.5 left-3 right-3">
                      <div className="text-[11px] text-[#F5E08B] font-semibold">
                        {eq.brand}
                      </div>
                      <h4 className="text-white font-bold text-sm leading-snug line-clamp-1">
                        {eq.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Số lượng sẵn có:</span>
                      <strong className="text-slate-900 font-bold">{eq.quantity}</strong>
                    </div>

                    <div className="text-xs pb-2 border-b border-slate-100">
                      <span className="text-slate-500 block text-[11px]">Thông số / Công suất:</span>
                      <span className="text-[#0A1E5E] font-bold text-[12px]">{eq.powerOrSpec}</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold text-slate-700 uppercase">
                        Đặc tính nổi bật:
                      </div>
                      <ul className="space-y-1">
                        {eq.highlights.slice(0, 3).map((hl, hlIdx) => (
                          <li key={hlIdx} className="text-xs text-slate-600 flex items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {eq.safetyCert && (
                      <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-[11px] flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{eq.safetyCert}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setInspectedEquipment(eq)}
                    className="w-full py-2 bg-slate-100 hover:bg-[#0A1E5E] text-slate-800 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Xem Chi Tiết Kỹ Thuật (Inspect)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">
                Không tìm thấy thiết bị phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;
              </h4>
              <p className="text-xs text-slate-500">
                Vui lòng thử tìm từ khóa khác như JBL, Beam, LED, Truss, Universe hoặc chọn danh mục Tất cả.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#0A1E5E] text-white rounded-lg text-xs font-bold hover:bg-[#06123B] transition"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}

          {/* Modal Inspect Thiết bị chi tiết */}
          {inspectedEquipment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
              <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
                <div className="relative h-56 w-full bg-slate-900">
                  <Image
                    src={inspectedEquipment.image}
                    alt={inspectedEquipment.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  
                  <button
                    onClick={() => setInspectedEquipment(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
                  >
                    ✕
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold text-[#F5E08B] uppercase">
                      {inspectedEquipment.categoryLabel} • {inspectedEquipment.brand}
                    </span>
                    <h3 className="text-lg font-black text-white leading-tight">
                      {inspectedEquipment.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="text-[11px] text-slate-500">Xuất xứ / Thương hiệu</div>
                      <div className="font-bold text-slate-900">{inspectedEquipment.origin}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Quy mô kho sẵn có</div>
                      <div className="font-bold text-emerald-700">{inspectedEquipment.quantity}</div>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200">
                      <div className="text-[11px] text-slate-500">Công suất & Đặc tả kỹ thuật</div>
                      <div className="font-bold text-[#0A1E5E]">{inspectedEquipment.powerOrSpec}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase mb-2">
                      Đặc tính kỹ thuật & Ứng dụng thực tế:
                    </h4>
                    <ul className="space-y-2">
                      {inspectedEquipment.highlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {inspectedEquipment.safetyCert && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{inspectedEquipment.safetyCert}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-200">
                    <button
                      onClick={() => setInspectedEquipment(null)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => {
                        setInspectedEquipment(null);
                        openRequestModalWithPackage(`Dự toán thiết bị: ${inspectedEquipment.name}`);
                      }}
                      className="px-4 py-2 bg-[#0A1E5E] text-white rounded-xl text-xs font-bold hover:bg-[#06123B] transition"
                    >
                      Yêu Cầu Báo Giá Thiết Bị Này
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. CHẾ ĐỘ C: HỒ SƠ DỰ THẦU & PHÁP LÝ (B2B COMPLIANCE)                      */}
      {/* ========================================================================= */}
      {activeMode === "legal" && (
        <section id="phap-ly" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn scroll-mt-28">
          {/* Header Pháp Lý */}
          <div className="bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#142A75] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#D4AF37]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Năng Lực Pháp Lý & Thẩm Định Đấu Thầu</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  Tư Cách Pháp Nhân & Thẩm Định Doanh Nghiệp
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Công ty TNHH Sự kiện và Du lịch Trường Hải cam kết tính pháp lý minh bạch 100%, bảo hiểm trách nhiệm công cộng hàng tỷ đồng và đầy đủ điều kiện tham gia đấu thầu các gói sự kiện cơ quan Nhà nước, trường đại học và tập đoàn.
                </p>
              </div>

              <button
                onClick={() => openRequestModalWithPackage("Trọn Gói Hồ Sơ Dự Thầu (Bidding Dossier)")}
                className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#b39023] text-slate-950 font-black rounded-xl text-xs hover:brightness-105 transition shadow-lg shrink-0 cursor-pointer"
              >
                Yêu Cầu Trọn Bộ Hồ Sơ Thầu
              </button>
            </div>
          </div>

          {/* Grid Hồ sơ pháp lý chứng chỉ */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#0A1E5E]" />
              Danh Mục Chứng Chỉ, Giấy Phép & Thẩm Định An Toàn
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LEGAL_DOSSIER_ITEMS.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#D4AF37] transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0A1E5E] bg-blue-50 px-2 py-0.5 rounded">
                      {doc.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      {doc.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {doc.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Cơ quan cấp: <strong>{doc.issuedBy}</strong></span>
                    <span className="text-blue-700 font-semibold cursor-pointer" onClick={() => openRequestModalWithPackage(doc.name)}>
                      Trích xuất hồ sơ →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Các gói tài liệu E-Profile sẵn sàng xuất bản */}
          <div id="tai-profile" className="space-y-4 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-black text-slate-900 flex items-center">
                <Download className="w-5 h-5 mr-2 text-[#0A1E5E]" />
                Các Bộ Hồ Sơ Năng Lực Sẵn Sàng Bàn Giao
              </h3>
              <span className="text-xs text-slate-500">
                Hỗ trợ định dạng PDF 300DPI in offset hoặc chuyển phát bản in bìa cứng mạ vàng
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DOWNLOADABLE_DOSSIERS.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500">{pkg.format}</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {pkg.pages}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 text-base leading-tight">
                      {pkg.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Phù hợp cho:</strong> {pkg.suitableFor}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-700 uppercase">
                        Nội dung tài liệu:
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {pkg.features.map((f, fIdx) => (
                          <li key={fIdx} className="flex items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => handleTriggerDownload(pkg.title)}
                      className="w-full py-2 bg-[#0A1E5E] text-white font-bold rounded-xl text-xs hover:bg-[#06123B] transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải Xuất Bản File Tóm Tắt ({pkg.size})</span>
                    </button>

                    <button
                      onClick={() => openRequestModalWithPackage(pkg.title)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition text-center cursor-pointer"
                    >
                      Đăng Ký Nhận Bản In Chuyển Phát Hỏa Tốc
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. CHẾ ĐỘ D: CUỘN TOÀN DIỆN (FULL EXECUTIVE DOSSIER VIEW)                  */}
      {/* ========================================================================= */}
      {activeMode === "all" && (
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          {/* Executive Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Hồ Sơ Năng Lực Toàn Diện – Trường Hải Event & Travel</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1E5E] leading-tight">
              Báo Cáo Tổng Thể Về Năng Lực Vận Hành & Khả Năng Cung Ứng Dịch Vụ
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              Được thành lập với mục tiêu trở thành đối tác chiến lược trong các đại lễ, hội nghị và tour du lịch doanh nghiệp, Trường Hải Event & Travel đã và đang đồng hành cùng các tổ chức Đoàn thể Trung ương, các trường đại học hàng đầu và hàng trăm doanh nghiệp trên toàn quốc. Chúng tôi tự chủ 100% về kho thiết bị 1.000m² tại Hà Nội, đội xe 25+ chiếc, cùng đội ngũ đạo diễn và chuyên gia kỹ thuật thực chiến 10+ năm.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="text-xl sm:text-2xl font-black text-[#0A1E5E]">10+ Năm</div>
                <div className="text-[11px] text-slate-600">Kinh nghiệm thực chiến</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="text-xl sm:text-2xl font-black text-[#0A1E5E]">1.000m²</div>
                <div className="text-[11px] text-slate-600">Kho thiết bị trực tiếp</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="text-xl sm:text-2xl font-black text-[#0A1E5E]">500+</div>
                <div className="text-[11px] text-slate-600">Đại lễ thành công</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <div className="text-xl sm:text-2xl font-black text-emerald-600">0111601327</div>
                <div className="text-[11px] text-slate-600">Mã số thuế pháp lý</div>
              </div>
            </div>
          </div>

          {/* Section 1: Pháp lý & Thư ngỏ */}
          <div className="space-y-6">
            <div className="border-l-4 border-[#0A1E5E] pl-4">
              <span className="text-xs font-bold text-[#D4AF37] uppercase">Chương 01</span>
              <h3 className="text-xl font-black text-slate-900">
                Thư Ngỏ & Năng Lực Pháp Lý Doanh Nghiệp
              </h3>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed text-justify space-y-3">
              <p>
                <strong>Trường Hải Event & Travel</strong> cam kết cung ứng dịch vụ với tư cách pháp nhân độc lập, minh bạch và có đầy đủ điều kiện pháp lý để ký kết hợp đồng, bảo lãnh thực hiện hợp đồng và xuất hóa đơn giá trị gia tăng theo quy định của pháp luật Việt Nam.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-slate-400 text-[10px]">Đại diện pháp luật</div>
                  <div className="font-bold text-slate-900">{COMPANY_INFO.director}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-slate-400 text-[10px]">Cơ quan cấp phép</div>
                  <div className="font-bold text-slate-900">{COMPANY_INFO.taxAuthority}</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="text-slate-400 text-[10px]">Tư cách quyết toán</div>
                  <div className="font-bold text-emerald-700">Hóa đơn điện tử VAT đầy đủ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Kho bãi & Rider Tech */}
          <div className="space-y-6">
            <div className="border-l-4 border-[#0A1E5E] pl-4">
              <span className="text-xs font-bold text-[#D4AF37] uppercase">Chương 02</span>
              <h3 className="text-xl font-black text-slate-900">
                Hệ Thống Kho Bãi 1.000m² & Thông Số Kỹ Thuật
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {EQUIPMENT_SPECS.slice(0, 8).map((eq) => (
                <div key={eq.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-[#0A1E5E] bg-blue-50 px-2 py-0.5 rounded">
                    {eq.categoryLabel}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{eq.name}</h4>
                  <p className="text-[11px] text-slate-500">Số lượng: <strong>{eq.quantity}</strong></p>
                  <p className="text-[11px] text-[#0A1E5E] font-semibold">{eq.powerOrSpec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Nhân sự & Tổ chức */}
          <div className="space-y-6">
            <div className="border-l-4 border-[#0A1E5E] pl-4">
              <span className="text-xs font-bold text-[#D4AF37] uppercase">Chương 03</span>
              <h3 className="text-xl font-black text-slate-900">
                Cơ Cấu Nhân Sự & Quy Trình Vận Hành
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ORGANIZATION_ROLES.slice(0, 3).map((r, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {r.headcount}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{r.title}</h4>
                  <p className="text-xs text-slate-600">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Dự án tiêu biểu */}
          <div className="space-y-6">
            <div className="border-l-4 border-[#0A1E5E] pl-4">
              <span className="text-xs font-bold text-[#D4AF37] uppercase">Chương 04</span>
              <h3 className="text-xl font-black text-slate-900">
                Hồ Sơ Dự Án Thực Tế & Đối Tác Chiến Lược
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS_DATA.slice(0, 2).map((proj) => (
                <div key={proj.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col sm:flex-row">
                  <div className="relative h-40 sm:h-auto sm:w-44 bg-slate-900 shrink-0">
                    <Image src={proj.image_url} alt={proj.title} fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-1.5 flex-1">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase">
                      Đối tác: {proj.client_name}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{proj.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3">{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to action cuối trang */}
          <div className="bg-gradient-to-r from-[#06123B] via-[#0A1E5E] to-[#142A75] text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Cần Bản In Hồ Sơ Năng Lực Hoặc File Song Ngữ Cho Cuộc Họp?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Chuyên viên tư vấn đấu thầu của Trường Hải Event & Travel sẽ liên hệ hỗ trợ gửi tài liệu tận nơi hoàn toàn miễn phí.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href={`tel:${COMPANY_INFO.hotline}`}
                className="px-5 py-2.5 bg-white text-slate-900 font-bold rounded-xl text-xs hover:bg-slate-100 transition shadow flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>Hotline: {COMPANY_INFO.hotlineDisplay}</span>
              </a>

              <button
                onClick={() => openRequestModalWithPackage("Hồ Sơ Năng Lực B2B Toàn Diện")}
                className="px-5 py-2.5 bg-[#D4AF37] text-slate-950 font-black rounded-xl text-xs hover:brightness-105 transition shadow flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Đăng Ký Nhận Hồ Sơ</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Modal Đăng ký nhận hồ sơ */}
      <DossierRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultPackageTitle={selectedPackageForModal}
      />
    </div>
  );
}
