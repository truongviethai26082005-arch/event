"use client";

import React, { useEffect } from "react";
import { ServiceDetail } from "../data/services-data";
import {
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  CalendarCheck,
} from "lucide-react";

interface ServiceModalProps {
  service: ServiceDetail | null;
  onClose: () => void;
  onSelectForQuote: (serviceTitle: string) => void;
}

export default function ServiceModal({
  service,
  onClose,
  onSelectForQuote,
}: ServiceModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (service) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-[#D4AF37]/30">
        {/* Modal Header */}
        <div className="bg-[#0A1E5E] text-white p-5 sm:p-6 md:p-7 relative overflow-hidden shrink-0 border-b border-[#D4AF37]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A1E5E] text-xs font-black uppercase tracking-wider">
              {service.tag}
            </span>
            {service.badge && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {service.badge}
              </span>
            )}
            <span className="text-xs text-slate-300 font-medium ml-auto pr-8 sm:pr-0">
              {service.priceNote}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white pr-6 leading-snug">
            {service.title}
          </h3>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto space-y-8 text-slate-700 custom-scrollbar">
          {/* Main Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0A1E5E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Tổng Quan & Cam Kết Năng Lực
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              {service.description}
            </p>
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Đối tượng phù hợp:</strong> {service.targetAudience}
              </span>
            </div>
          </div>

          {/* Key Highlights */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0A1E5E] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              Điểm Khác Biệt & Ưu Điểm Nổi Bật
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0A1E5E] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#D4AF37]" />
              Bóc Tách Hạng Mục & Trang Thiết Bị Cung Cấp
            </h4>
            <div className="space-y-3">
              {service.equipmentList.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <h5 className="font-bold text-xs sm:text-sm text-[#0A1E5E] mb-2 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {group.category}
                  </h5>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {group.items.map((it, iIdx) => (
                      <li key={iIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 6-Step Workflow */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0A1E5E] flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
              Quy Trình Triển Khai 6 Bước Chuẩn Quốc Tế
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {service.workflow.map((wf) => (
                <div
                  key={wf.step}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-[#D4AF37] bg-[#0A1E5E] px-2 py-0.5 rounded-md">
                      BƯỚC 0{wf.step}
                    </span>
                  </div>
                  <h6 className="font-bold text-xs text-[#0A1E5E] mb-1">
                    {wf.title}
                  </h6>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                    {wf.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span className="font-bold text-slate-700">Cam kết Trường Hải:</span>{" "}
            Khảo sát miễn phí trong 12h • Báo giá chuẩn trong 30 phút • Không phát sinh
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Đóng lại
            </button>
            <button
              onClick={() => {
                onSelectForQuote(service.title);
                onClose();
              }}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#c59c23] hover:brightness-105 text-[#0A1E5E] font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>Chọn Dịch Vụ Này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
