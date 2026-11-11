"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PROJECTS_DATA,
  COMPANY_INFO,
  ProjectItem,
} from "@/lib/company-data";
import ProjectDetailModal from "@/components/ProjectDetailModal";
import { trackLandingLead } from "@/app/admin-radar/lead-tracker";
import {
  Sparkles,
  Phone,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Compass,
  Award,
  Building2,
  MapPin,
  Users,
  Search,
  Filter,
  Eye,
  Camera,
  Layers,
  ChevronRight,
  Send,
} from "lucide-react";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "su-kien" | "du-lich" | "thien-nguyen">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  // Quote form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formProject, setFormProject] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Auto handle URL hash on load (e.g. /du-an#proj-3)
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const found = PROJECTS_DATA.find((p) => p.id === hash);
        if (found) {
          setActiveProject(found);
          const el = document.getElementById(hash);
          if (el) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 200);
          }
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const filteredProjects = PROJECTS_DATA.filter((proj) => {
    const matchCategory =
      selectedCategory === "all" || proj.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proj.location && proj.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPhone.trim()) return;

    try {
      await trackLandingLead("GG_FORM", {
        fullName: formName || "Khách hàng trang Dự Án",
        phone: formPhone,
        eventType: formProject || "Tư vấn dự án tương tự",
        notes: formNote || "Yêu cầu từ trang Dự Án Tiêu Biểu",
      });
      setFormSubmitted(true);
    } catch {
      setFormSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* =========================================================================
          HERO BANNER
      ========================================================================= */}
      <section className="relative bg-[#050D26] text-white overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-[#D4AF37]/25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_#16327e_0%,_transparent_55%),radial-gradient(circle_at_80%_80%,_#0c215e_0%,_transparent_60%)] opacity-90" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 shadow-inner">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs sm:text-sm font-semibold text-[#D4AF37] tracking-wider uppercase">
              Hồ Sơ Dự Án Thực Tế • 500+ Sự Kiện Thành Công
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Dự Án Tiêu Biểu & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-400">
              Dấu Ấn Thành Công
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Khám phá các đại lễ quốc gia, lễ khánh thành nhà máy, khai trương chuỗi bán lẻ và chương trình Team Building quy mô do Trường Hải Event & Travel trực tiếp sản xuất & điều phối.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#danh-sach-du-an"
              className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#0A1E5E] font-black text-xs sm:text-sm hover:bg-amber-300 transition-all shadow-lg hover:scale-105"
            >
              Xem tất cả dự án ({PROJECTS_DATA.length})
            </a>
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
              className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>Hotline 24/7: {COMPANY_INFO.hotlineDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BỘ LỌC VÀ TÌM KIẾM DỰ ÁN
      ========================================================================= */}
      <section id="danh-sach-du-an" className="py-4 sm:py-6 bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#0A1E5E] text-white shadow-md shadow-[#0A1E5E]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tất Cả ({PROJECTS_DATA.length})
              </button>

              <button
                onClick={() => setSelectedCategory("su-kien")}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "su-kien"
                    ? "bg-[#0A1E5E] text-white shadow-md shadow-[#0A1E5E]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                🎪 Tổ Chức Sự Kiện
              </button>

              <button
                onClick={() => setSelectedCategory("du-lich")}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "du-lich"
                    ? "bg-[#0A1E5E] text-white shadow-md shadow-[#0A1E5E]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ✈️ Du Lịch & Team Building
              </button>

              <button
                onClick={() => setSelectedCategory("thien-nguyen")}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "thien-nguyen"
                    ? "bg-[#0A1E5E] text-white shadow-md shadow-[#0A1E5E]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                ❤️ Thiện Nguyện
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm dự án, khách hàng, tỉnh thành..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0A1E5E] bg-slate-50 focus:bg-white transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LƯỚI DỰ ÁN CHI TIẾT
      ========================================================================= */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Không tìm thấy dự án phù hợp</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Quý khách vui lòng thử tìm kiếm với từ khóa khác hoặc liên hệ hotline để nhận hồ sơ năng lực chi tiết.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#0A1E5E] text-white font-bold text-xs hover:bg-[#122868] transition"
              >
                Hiển thị tất cả dự án
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((proj) => {
                const photosCount = proj.gallery?.length || 1;
                return (
                  <div
                    key={proj.id}
                    id={proj.id}
                    className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col hover:-translate-y-1.5"
                  >
                    {/* Project Thumbnail Image */}
                    <div
                      onClick={() => setActiveProject(proj)}
                      className="h-56 relative overflow-hidden bg-slate-950 cursor-pointer"
                    >
                      <Image
                        src={proj.image_url}
                        alt={proj.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A1E5E]/90 backdrop-blur-md text-[11px] font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
                        {proj.category === "su-kien"
                          ? "Sự Kiện Trọng Điểm"
                          : proj.category === "du-lich"
                          ? "Du Lịch & Team Building"
                          : "Thiện Nguyện"}
                      </div>

                      {proj.scale && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          {proj.scale}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {proj.client_name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm font-bold flex items-center gap-1">
                          <Camera className="w-3 h-3 text-[#D4AF37]" />
                          {photosCount} ảnh
                        </span>
                      </div>
                    </div>

                    {/* Project Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-medium">
                          {proj.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                              {proj.location}
                            </span>
                          )}
                          {proj.year && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                              Năm {proj.year}
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => setActiveProject(proj)}
                          className="font-bold text-base sm:text-lg text-[#0A1E5E] group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug cursor-pointer mb-2"
                        >
                          {proj.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                          {proj.description}
                        </p>
                      </div>

                      {/* Highlights */}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                          {proj.highlights.slice(0, 2).map((h, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{h}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setActiveProject(proj)}
                          className="inline-flex items-center text-xs font-bold text-[#0A1E5E] hover:text-[#D4AF37] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                          <span>Xem ảnh thực tế ({photosCount})</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setFormProject(proj.title);
                            const el = document.getElementById("lien-he-bao-gia");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="text-xs text-slate-500 hover:text-[#0A1E5E] font-semibold"
                        >
                          Báo giá tương tự
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          FORM LIÊN HỆ TƯ VẤN DỰ ÁN
      ========================================================================= */}
      <section id="lien-he-bao-gia" className="py-16 bg-[#050D26] text-white relative overflow-hidden border-t border-[#D4AF37]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/30 inline-block">
              Đồng Hành Cùng Doanh Nghiệp
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Cần Tư Vấn & Báo Giá Sự Kiện / Dự Án?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
              Để lại thông tin, chuyên gia của Trường Hải Event & Travel sẽ gửi kịch bản độc bản và dự toán chi tiết trong vòng 30 phút.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl border border-[#D4AF37]/30">
            {formSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Gửi Yêu Cầu Thành Công!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Cảm ơn Quý khách! Đội ngũ Trường Hải Event & Travel sẽ liên hệ lại qua số điện thoại của Quý khách trong thời gian sớm nhất.
                </p>
                <div className="pt-2">
                  <a
                    href={`tel:${COMPANY_INFO.hotline}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1E5E] text-[#D4AF37] font-bold text-xs"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Cần gấp? Gọi ngay {COMPANY_INFO.hotlineDisplay}</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ tên / Đơn vị <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A - Tập đoàn ABC"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0A1E5E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại / Zalo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="VD: 0988xxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0A1E5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dự án hoặc dịch vụ Quý khách quan tâm
                  </label>
                  <input
                    type="text"
                    value={formProject}
                    onChange={(e) => setFormProject(e.target.value)}
                    placeholder="VD: Lễ khánh thành nhà máy, Tiệc tất niên Y.E.P, Khai trương showroom..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0A1E5E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú thêm (quy mô khách, thời gian dự kiến, địa điểm)
                  </label>
                  <textarea
                    rows={3}
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    placeholder="VD: Dự kiến tổ chức vào tháng tới cho khoảng 300 khách tại Hà Nội..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0A1E5E]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Báo giá minh bạch, cam kết không phát sinh chi phí.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0A1E5E] text-[#D4AF37] font-extrabold text-xs sm:text-sm hover:bg-[#122868] transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Báo Giá Nhanh</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODAL XEM CHI TIẾT DỰ ÁN
      ========================================================================= */}
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onSelectForQuote={(title) => {
          setActiveProject(null);
          setFormProject(title);
          const el = document.getElementById("lien-he-bao-gia");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}
