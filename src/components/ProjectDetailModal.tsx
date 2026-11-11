"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectItem, COMPANY_INFO } from "@/lib/company-data";
import {
  X,
  MapPin,
  Calendar,
  Building2,
  Sparkles,
  Phone,
  ArrowRight,
  ZoomIn,
  Users,
  CheckCircle2,
  Share2,
} from "lucide-react";

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSelectForQuote?: (projectTitle: string) => void;
}

export default function ProjectDetailModal({
  project,
  onClose,
  onSelectForQuote,
}: ProjectDetailModalProps) {
  const [previewImage, setPreviewImage] = useState<{ url: string; caption: string } | null>(null);

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
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, previewImage, onClose]);

  if (!project) return null;

  const gallery = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [{ url: project.image_url, caption: project.title }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-[#D4AF37]/30">
        {/* Header */}
        <div className="bg-[#0A1E5E] text-white p-5 sm:p-6 relative overflow-hidden shrink-0 border-b border-[#D4AF37]/30">
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
              <Sparkles className="w-3.5 h-3.5" />
              {project.category === "su-kien"
                ? "Sự Kiện Trọng Điểm"
                : project.category === "du-lich"
                ? "Du Lịch & Team Building"
                : "Hoạt Động Thiện Nguyện"}
            </span>

            {project.scale && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-[#D4AF37]" />
                {project.scale}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
            {project.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-200 font-medium">
            {project.client_name && (
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                Đối tác: <strong className="text-white">{project.client_name}</strong>
              </span>
            )}
            {project.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                {project.location}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                Năm thực hiện: {project.year}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
          {/* Main Description */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1E5E] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Giới thiệu dự án & Quy mô tổ chức:
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {project.description}
            </p>

            {project.highlights && project.highlights.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-800">Điểm nhấn hạng mục triển khai:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Photo Gallery Grid */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1E5E] flex items-center gap-1.5">
                <span>Album hình ảnh thực tế ({gallery.length} ảnh):</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-normal">Bấm ảnh để phóng to</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setPreviewImage(img)}
                  className="group relative h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
                >
                  <Image
                    src={img.url}
                    alt={img.caption || project.title}
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
                      {img.caption || project.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-3 sm:p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Hình ảnh thực tế do Trường Hải Event & Travel ghi lại trực tiếp tại hiện trường.</span>
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
                  onSelectForQuote(project.title);
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

      {/* Lightbox Zoom */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-fadeIn"
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
            className="relative max-w-4xl max-h-[82vh] w-full h-[68vh] rounded-2xl overflow-hidden shadow-2xl"
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

