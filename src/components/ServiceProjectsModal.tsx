"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  SERVICES_DATA,
  COMPANY_INFO,
  ServiceProject,
  ServiceProjectImage,
} from "@/lib/company-data";
import {
  X,
  FolderOpen,
  MapPin,
  Calendar,
  Building2,
  Phone,
  Sparkles,
  ArrowRight,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ServiceProjectsModalProps {
  serviceSlug: string | null;
  onClose: () => void;
  onSelectForQuote?: (serviceTitle: string) => void;
}

export default function ServiceProjectsModal({
  serviceSlug,
  onClose,
  onSelectForQuote,
}: ServiceProjectsModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; caption: string } | null>(null);

  // Tìm dịch vụ theo slug hoặc id
  const service = SERVICES_DATA.find(
    (s) => s.slug === serviceSlug || s.id === serviceSlug
  );

  const projects = service?.projects || [];

  // Reset selected project khi đổi dịch vụ
  useEffect(() => {
    if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    } else {
      setSelectedProjectId(null);
    }
    setPreviewImage(null);
  }, [serviceSlug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewImage) {
          setPreviewImage(null);
        } else {
          onClose();
        }
      }
    };
    if (serviceSlug) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [serviceSlug, previewImage, onClose]);

  if (!serviceSlug || !service) return null;

  const currentProject: ServiceProject | undefined =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Nền đen đóng modal */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-[#D4AF37]/30">
        {/* Header Modal */}
        <div className="bg-[#0A1E5E] text-white p-4 sm:p-6 relative overflow-hidden shrink-0 border-b border-[#D4AF37]/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2 pr-10">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A1E5E] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <FolderOpen className="w-3.5 h-3.5" />
              Thư viện dự án thực tế
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {projects.length} Album dự án tiêu biểu
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
            {service.title}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl line-clamp-2">
            {service.description}
          </p>
        </div>

        {/* Modal Body: Danh sách thư mục dự án & hình ảnh */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {projects.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                <FolderOpen className="w-8 h-8" />
              </div>
              <p className="text-slate-600 font-bold text-lg">Đang cập nhật hình ảnh dự án</p>
              <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
                Quý khách vui lòng liên hệ hotline để nhận hồ sơ năng lực và hình ảnh thực tế mới nhất của hạng mục này.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Thanh cuộn ngang các Folder dự án (giống ảnh Google Drive của user) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A1E5E] flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-[#D4AF37]" />
                    Chọn dự án thực hiện:
                  </span>
                  <span className="text-xs text-slate-500">
                    Bấm để xem album ảnh chi tiết
                  </span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {projects.map((proj) => {
                    const isSelected = proj.id === (currentProject?.id || "");
                    return (
                      <button
                        key={proj.id}
                        onClick={() => setSelectedProjectId(proj.id)}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all text-xs font-bold ${
                          isSelected
                            ? "bg-[#0A1E5E] text-white border-[#0A1E5E] shadow-md shadow-[#0A1E5E]/20"
                            : "bg-white text-slate-700 border-slate-200 hover:border-[#D4AF37] hover:bg-slate-100"
                        }`}
                      >
                        <FolderOpen
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? "text-[#D4AF37]" : "text-slate-400"
                          }`}
                        />
                        <span className="truncate max-w-[220px]">{proj.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                            isSelected
                              ? "bg-white/20 text-[#D4AF37]"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {proj.images.length} ảnh
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thông tin dự án đang chọn */}
              {currentProject && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-[#0A1E5E]">
                        {currentProject.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                        {currentProject.client && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                            Khách hàng: <strong className="text-slate-700">{currentProject.client}</strong>
                          </span>
                        )}
                        {currentProject.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {currentProject.location}
                          </span>
                        )}
                        {currentProject.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {currentProject.date}
                          </span>
                        )}
                      </div>
                    </div>

                    {onSelectForQuote && (
                      <button
                        onClick={() => {
                          onSelectForQuote(service.title);
                          onClose();
                        }}
                        className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#0A1E5E] text-[#D4AF37] font-bold text-xs hover:bg-[#122868] transition flex items-center gap-1.5 shadow-sm shrink-0"
                      >
                        <span>Tư vấn dự án tương tự</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {currentProject.description && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {currentProject.description}
                    </p>
                  )}

                  {/* Lưới hình ảnh thực tế của dự án */}
                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center justify-between">
                      <span>Hình ảnh thực tế tại sự kiện ({currentProject.images.length} ảnh):</span>
                      <span className="text-[11px] text-slate-400 font-normal">Bấm vào ảnh để phóng to</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {currentProject.images.map((img: ServiceProjectImage, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => setPreviewImage(img)}
                          className="group relative h-48 sm:h-52 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
                        >
                          <Image
                            src={img.url}
                            alt={img.caption || currentProject.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                          <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="w-4 h-4" />
                          </div>

                          <div className="absolute bottom-2 left-2 right-2 text-white">
                            <p className="text-[11px] sm:text-xs font-semibold line-clamp-2 drop-shadow-sm leading-snug">
                              {img.caption || currentProject.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Modal: Gọi tư vấn & Báo giá */}
        <div className="bg-white p-3 sm:p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Hình ảnh được chụp trực tiếp từ các sự kiện Trường Hải Event & Travel đã triển khai.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`tel:${COMPANY_INFO.hotline}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold text-xs hover:border-[#D4AF37] transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Gọi: {COMPANY_INFO.hotlineDisplay}</span>
            </a>
            {onSelectForQuote && (
              <button
                onClick={() => {
                  onSelectForQuote(service.title);
                  onClose();
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0A1E5E] text-[#D4AF37] font-extrabold text-xs hover:bg-[#122868] transition shadow-md"
              >
                <span>Nhận báo giá</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox phóng to ảnh */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-10"
            aria-label="Đóng phóng to"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-4xl max-h-[80vh] w-full h-[65vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={previewImage.url}
              alt={previewImage.caption}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          {previewImage.caption && (
            <p className="text-white text-xs sm:text-sm mt-3 font-semibold text-center max-w-2xl px-4 drop-shadow">
              {previewImage.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
