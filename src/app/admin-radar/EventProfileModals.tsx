"use client";

import React, { useMemo, useState } from "react";
import {
  EventCategory,
  EventCostItem,
  EventProfile,
  getEventVenueType,
} from "./event-profiles-data";
import {
  formatVND,
  GeneratedCaseStudyResult,
} from "./event-case-study-generator";
import { CATEGORY_LABELS, getCategoryLabel } from "./radar-handoff";

export type DetailTabKey = "info" | "finance" | "gallery" | "docs";
export type MetricModalType = "total" | "revenue" | "guests" | "seo" | null;

const SAMPLE_COVER_OPTIONS: { label: string; url: string }[] = [
  { label: "Khai trương Showroom", url: "/images/blog/khai-truong-showroom.jpg" },
  { label: "Gala Dinner", url: "/images/blog/gala-dinner-fpt.jpg" },
  { label: "Hội nghị khách hàng", url: "/images/blog/hoi-nghi-lotte.jpg" },
  { label: "Teambuilding", url: "/images/blog/teambuilding-ha-long.jpg" },
  { label: "Bàn giao xe VinFast", url: "/images/blog/le-ban-giao-vinfast.jpg" },
];

const PHASE_LABELS: Record<string, string> = {
  setup: "Chuẩn bị & Lắp đặt",
  moment: "Khoảnh khắc chính",
  crowd: "Toàn cảnh khách mời",
  product: "Hạng mục & Sản phẩm",
  equipment: "Hệ thống thiết bị",
};

const DOC_TYPE_LABELS: Record<string, string> = {
  contract: "Hợp đồng kinh tế",
  script: "Kịch bản chương trình",
  budget: "Bảng dự toán chi phí",
  acceptance: "Biên bản nghiệm thu",
};

function ProfilePhoto({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-xs font-semibold text-slate-400 border border-slate-200 ${className || ""}`}
      >
        Chưa có ảnh hiện trường
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-xs font-semibold text-slate-900 break-words">
        {value || "Đang cập nhật"}
      </div>
    </div>
  );
}

/* ============================================================================
 * 1. MODAL CHI TIẾT HỒ SƠ SỰ KIỆN
 * ========================================================================== */
export function EventProfileDetailModal({
  profile,
  onClose,
  onEdit,
  onGenerateCaseStudy,
  onUseInRadarWriter,
  onOpenPostsArchive,
}: {
  profile: EventProfile;
  onClose: () => void;
  onEdit: (profile: EventProfile) => void;
  onGenerateCaseStudy: (profile: EventProfile) => void;
  onUseInRadarWriter: (profile: EventProfile) => void;
  onOpenPostsArchive: (profile: EventProfile) => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailTabKey>("info");
  const venueLabel =
    getEventVenueType(profile) === "indoor"
      ? "Trong nhà / Hội trường"
      : "Ngoài trời / Resort";
  const isSeoDone = Boolean(profile.seoMeta?.isGenerated);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                {getCategoryLabel(profile.category)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                {venueLabel}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full border ${
                  isSeoDone
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                {isSeoDone ? "Đã có bài SEO" : "Chưa có bài SEO"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                {profile.isAutoSynced ? "Nguồn CRM" : "Nhập thủ công"}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {profile.title}
            </h3>
            <p className="text-xs text-slate-600">
              {profile.client.company} · {profile.location.venue} ({profile.location.city}) · Ngày {profile.date} · {profile.guestCount.toLocaleString("vi-VN")} khách
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(profile)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => onUseInRadarWriter(profile)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer"
            >
              Đẩy sang AI viết bài
            </button>
            <button
              type="button"
              onClick={() => onGenerateCaseStudy(profile)}
              className="px-4 py-2 rounded-xl bg-[#0B1536] hover:bg-[#132252] text-white text-xs font-bold cursor-pointer"
            >
              {isSeoDone ? "Tạo lại Case Study" : "Tạo Case Study SEO"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="px-5 sm:px-6 pt-3 pb-0 border-b border-slate-200 bg-white flex flex-wrap items-center gap-2">
          {(
            [
              { id: "info", label: "Tổng quan & Minh chứng SEO" },
              {
                id: "finance",
                label: `Báo giá & Lợi nhuận (${profile.financials.items.length})`,
              },
              {
                id: "gallery",
                label: `Ảnh hiện trường (${profile.gallery.length})`,
              },
              {
                id: "docs",
                label: `Chứng từ hồ sơ (${profile.documents.length})`,
              },
            ] as { id: DetailTabKey; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#0B1536] text-[#0B1536] bg-slate-50"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeTab === "info" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5">
                  <ProfilePhoto
                    src={profile.coverImage}
                    alt={profile.title}
                    className="w-full h-56 object-cover rounded-xl border border-slate-200"
                  />
                </div>
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
                  <SpecItem
                    label="Doanh nghiệp / Khách hàng"
                    value={`${profile.client.company} (${profile.client.name})`}
                  />
                  <SpecItem
                    label="Liên hệ khách hàng"
                    value={`${profile.client.phone || "Chưa cập nhật"} · ${profile.client.email || "Không có email"}`}
                  />
                  <SpecItem
                    label="Địa điểm tổ chức"
                    value={`${profile.location.venue}${profile.location.hall ? ` - ${profile.location.hall}` : ""}, ${profile.location.city}`}
                  />
                  <SpecItem
                    label="Từ khóa SEO gợi ý"
                    value={profile.seoMeta?.suggestedKeyword || "Chưa gắn từ khóa"}
                  />
                  <SpecItem
                    label="Tổng giá trị hợp đồng"
                    value={formatVND(profile.financials.totalBudget)}
                  />
                  <SpecItem
                    label="Trạng thái thanh toán"
                    value={profile.financials.paymentStatusLabel}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Hạng mục điểm nhấn triển khai
                  </h4>
                  {profile.keyHighlights.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                      {profile.keyHighlights.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">Chưa ghi nhận điểm nhấn.</p>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Thiết bị kỹ thuật thực tế
                  </h4>
                  {profile.equipmentList.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                      {profile.equipmentList.map((eq, idx) => (
                        <li key={idx}>{eq}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">Chưa ghi nhận danh sách thiết bị.</p>
                  )}
                </div>
              </div>

              {profile.testimonial?.quote && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Phản hồi khách hàng (Social Proof · Đánh giá {profile.testimonial.rating}/5)
                  </div>
                  <p className="text-xs text-slate-800 italic">
                    &ldquo;{profile.testimonial.quote}&rdquo;
                  </p>
                  <div className="text-[11px] font-semibold text-slate-600">
                    {profile.testimonial.author} — {profile.testimonial.position},{" "}
                    {profile.testimonial.company}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Liên kết bài viết trên Radar SEO
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {isSeoDone
                      ? `Đã tạo bản thảo bài SEO với đường dẫn "${profile.seoMeta?.generatedPostSlug || profile.seoMeta?.suggestedSlug}".`
                      : "Hồ sơ này đã sẵn sàng làm nguồn dữ liệu thật cho bài viết Case Study hoặc đối chiếu bài đối thủ trên Radar SEO."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {isSeoDone && (
                    <button
                      type="button"
                      onClick={() => onOpenPostsArchive(profile)}
                      className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer"
                    >
                      Mở Kho bài viết
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onUseInRadarWriter(profile)}
                    className="px-3.5 py-2 rounded-xl bg-[#0B1536] hover:bg-[#132252] text-white text-xs font-bold cursor-pointer"
                  >
                    Gửi sang Viết bài mới
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "finance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SpecItem
                  label="Tổng doanh thu hợp đồng"
                  value={formatVND(profile.financials.totalBudget)}
                />
                <SpecItem
                  label="Chi phí triển khai thực tế"
                  value={formatVND(profile.financials.actualCost)}
                />
                <SpecItem
                  label="Lợi nhuận gộp ước tính"
                  value={`${formatVND(profile.financials.profit)} (${profile.financials.profitMargin}%)`}
                />
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3 font-bold">Hạng mục</th>
                      <th className="py-2.5 px-3 font-bold">Chi tiết kỹ thuật</th>
                      <th className="py-2.5 px-3 font-bold text-center">ĐVT</th>
                      <th className="py-2.5 px-3 font-bold text-center">SL</th>
                      <th className="py-2.5 px-3 font-bold text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {profile.financials.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.category}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{item.description}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{item.unit}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-900">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                          {formatVND(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.gallery.length > 0 ? (
                profile.gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white"
                  >
                    <ProfilePhoto
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-3 space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                        {PHASE_LABELS[photo.phase] || "Hiện trường"}
                      </span>
                      <p className="text-xs text-slate-700 leading-snug">{photo.caption}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-xs text-slate-500">
                  Chưa có ảnh thư viện hiện trường cho hồ sơ này.
                </div>
              )}
            </div>
          )}

          {activeTab === "docs" && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-2.5 px-3 font-bold">Tên tài liệu</th>
                    <th className="py-2.5 px-3 font-bold">Loại</th>
                    <th className="py-2.5 px-3 font-bold">Số chứng từ</th>
                    <th className="py-2.5 px-3 font-bold">Ngày lưu</th>
                    <th className="py-2.5 px-3 font-bold">Người ký</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.documents.length > 0 ? (
                    profile.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {doc.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {DOC_TYPE_LABELS[doc.type] || "Chứng từ"}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          {doc.docNumber}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{doc.uploadDate}</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {doc.signedBy || "Đang lưu nội bộ"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Chưa đính kèm chứng từ hồ sơ.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 2. MODAL XEM TRƯỚC & XUẤT BÀI CASE STUDY SANG RADAR SEO
 * ========================================================================== */
export function CaseStudyPreviewModal({
  profile,
  draft,
  isSaving,
  savedMessage,
  errorMessage,
  onClose,
  onSaveToCms,
  onOpenInRadarEditor,
}: {
  profile: EventProfile;
  draft: GeneratedCaseStudyResult;
  isSaving: boolean;
  savedMessage: string | null;
  errorMessage: string | null;
  onClose: () => void;
  onSaveToCms: (publishImmediately: boolean) => void;
  onOpenInRadarEditor: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(draft.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Bước 3 · Sinh bài Case Study E-E-A-T cho Radar SEO
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {draft.title}
            </h3>
            <p className="text-xs text-slate-600">
              Nguồn minh chứng: {profile.title} · Từ khóa:{" "}
              <span className="font-semibold text-slate-900">
                {draft.focus_keyword}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer shrink-0"
          >
            Đóng
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800">
              {errorMessage}
            </div>
          )}

          {savedMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
              {savedMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SpecItem label="Từ khóa chính (Focus)" value={draft.focus_keyword} />
            <SpecItem label="Đường dẫn (Slug)" value={`/tin-tuc/${draft.slug}`} />
            <SpecItem label="Thời gian đọc dự kiến" value={draft.reading_time} />
          </div>

          <SpecItem label="Meta Description chuẩn Google" value={draft.meta_description} />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800">
                Nội dung bài viết tạo từ dữ liệu thật (Markdown)
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                {copied ? "Đã sao chép" : "Sao chép nội dung"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-xs text-slate-700 leading-relaxed max-h-[340px] overflow-y-auto bg-white p-3.5 rounded-xl border border-slate-200 font-sans">
              {draft.content}
            </pre>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => onSaveToCms(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Đang lưu..." : "Lưu bản nháp vào Kho"}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => onSaveToCms(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Đang lưu..." : "Xuất bản vào Kho bài viết"}
            </button>
            <button
              type="button"
              onClick={onOpenInRadarEditor}
              className="px-4 py-2 rounded-xl bg-[#0B1536] hover:bg-[#132252] text-white text-xs font-bold cursor-pointer"
            >
              Mở trong Trình soạn thảo Radar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 3. MODAL THÊM MỚI HOẶC CHỈNH SỬA HỒ SƠ SỰ KIỆN
 * ========================================================================== */
interface EventFormState {
  title: string;
  category: EventCategory;
  status: "completed" | "ongoing" | "archived";
  venueType: "indoor" | "outdoor";
  date: string;
  guestCount: string;
  company: string;
  clientName: string;
  phone: string;
  email: string;
  venue: string;
  city: string;
  totalBudget: string;
  actualCost: string;
  suggestedKeyword: string;
  coverImage: string;
  highlightsText: string;
  equipmentText: string;
  testimonialQuote: string;
}

function buildInitialFormState(editingProfile?: EventProfile | null): EventFormState {
  if (!editingProfile) {
    return {
      title: "",
      category: "khai-truong",
      status: "completed",
      venueType: "indoor",
      date: "2026-10-23",
      guestCount: "200",
      company: "",
      clientName: "",
      phone: "",
      email: "",
      venue: "",
      city: "Hà Nội",
      totalBudget: "85000000",
      actualCost: "59500000",
      suggestedKeyword: "",
      coverImage: "/images/blog/khai-truong-showroom.jpg",
      highlightsText:
        "Sân khấu & màn hình LED chuẩn sự kiện doanh nghiệp\nĐiều phối kịch bản đúng giờ G không phát sinh lỗi kỹ thuật",
      equipmentText:
        "Hệ thống âm thanh Line Array chuyên nghiệp\nĐèn sân khấu Moving Beam & Par LED\nMàn hình LED P3 sắc nét",
      testimonialQuote: "",
    };
  }

  return {
    title: editingProfile.title,
    category: editingProfile.category,
    status: editingProfile.status,
    venueType: getEventVenueType(editingProfile),
    date: editingProfile.date,
    guestCount: String(editingProfile.guestCount || 150),
    company: editingProfile.client.company,
    clientName: editingProfile.client.name,
    phone: editingProfile.client.phone || "",
    email: editingProfile.client.email || "",
    venue: editingProfile.location.venue,
    city: editingProfile.location.city || "Hà Nội",
    totalBudget: String(editingProfile.financials.totalBudget || 0),
    actualCost: String(editingProfile.financials.actualCost || 0),
    suggestedKeyword: editingProfile.seoMeta?.suggestedKeyword || "",
    coverImage: editingProfile.coverImage || "/images/blog/khai-truong-showroom.jpg",
    highlightsText: (editingProfile.keyHighlights || []).join("\n"),
    equipmentText: (editingProfile.equipmentList || []).join("\n"),
    testimonialQuote: editingProfile.testimonial?.quote || "",
  };
}

export function EventProfileFormModal({
  editingProfile,
  onClose,
  onSave,
}: {
  editingProfile: EventProfile | null;
  onClose: () => void;
  onSave: (
    payload: Omit<EventProfile, "id" | "created_at">,
    existingId?: string
  ) => void;
}) {
  const isEditing = Boolean(editingProfile);
  const [form, setForm] = useState<EventFormState>(() =>
    buildInitialFormState(editingProfile)
  );
  const [formError, setFormError] = useState<string | null>(null);

  const parsedBudget = Math.max(0, Number(form.totalBudget) || 0);
  const parsedCost = Math.max(0, Number(form.actualCost) || 0);
  const previewMargin = useMemo(() => {
    if (parsedBudget <= 0) return 0;
    return Number((((parsedBudget - parsedCost) / parsedBudget) * 100).toFixed(1));
  }, [parsedBudget, parsedCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim() || !form.venue.trim()) {
      setFormError(
        "Vui lòng nhập đầy đủ Tên sự kiện, Công ty khách hàng và Địa điểm tổ chức."
      );
      return;
    }

    const totalBudget = parsedBudget || 75000000;
    const actualCost = parsedCost || Math.round(totalBudget * 0.7);
    const profit = totalBudget - actualCost;
    const profitMargin =
      totalBudget > 0 ? Number(((profit / totalBudget) * 100).toFixed(1)) : 0;

    const keyHighlights = form.highlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const equipmentList = form.equipmentText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const categoryLabel = getCategoryLabel(form.category);
    const statusLabel =
      form.status === "ongoing"
        ? "Đang diễn ra"
        : form.status === "archived"
          ? "Lưu trữ tham khảo"
          : "Đã tổ chức thành công";

    const existingItems: EventCostItem[] =
      editingProfile?.financials.items && editingProfile.financials.items.length > 0
        ? editingProfile.financials.items
        : [
            {
              id: "cost-main-1",
              category: "Trọn gói sân khấu, âm thanh, ánh sáng & điều phối",
              description: form.title.trim(),
              unit: "Gói",
              quantity: 1,
              unitPrice: totalBudget,
              totalPrice: totalBudget,
            },
          ];

    const payload: Omit<EventProfile, "id" | "created_at"> = {
      title: form.title.trim(),
      category: form.category,
      categoryLabel,
      status: form.status,
      statusLabel,
      venueType: form.venueType,
      date: form.date || "2026-10-23",
      client: {
        name: form.clientName.trim() || form.company.trim(),
        company: form.company.trim(),
        representative:
          editingProfile?.client.representative ||
          form.clientName.trim() ||
          "Đại diện Ban tổ chức",
        phone: form.phone.trim(),
        email: form.email.trim(),
        industry: editingProfile?.client.industry || "Khách hàng doanh nghiệp",
      },
      location: {
        venue: form.venue.trim(),
        hall: editingProfile?.location.hall || "",
        address: editingProfile?.location.address || form.venue.trim(),
        city: form.city.trim() || "Hà Nội",
      },
      guestCount: Math.max(10, Number(form.guestCount) || 150),
      financials: {
        totalBudget,
        actualCost,
        profit,
        profitMargin,
        paymentStatus: editingProfile?.financials.paymentStatus || "paid_full",
        paymentStatusLabel:
          editingProfile?.financials.paymentStatusLabel || "Đã tất toán 100%",
        items: existingItems,
      },
      team: editingProfile?.team || {
        director: "Trương Việt Hải",
        chiefEngineer: "Kỹ sư hiện trường Trường Hải",
        soundLightingLead: "Tổ kỹ thuật Âm thanh Ánh sáng",
        mc: "MC Chuyên nghiệp",
        coordinator: "Ekip điều phối Trường Hải Event",
      },
      keyHighlights,
      equipmentList,
      coverImage: form.coverImage.trim() || "/images/blog/khai-truong-showroom.jpg",
      gallery:
        editingProfile?.gallery && editingProfile.gallery.length > 0
          ? editingProfile.gallery
          : [
              {
                id: "gal-cover",
                url:
                  form.coverImage.trim() ||
                  "/images/blog/khai-truong-showroom.jpg",
                caption: form.title.trim(),
                phase: "moment",
              },
            ],
      documents: editingProfile?.documents || [],
      testimonial: form.testimonialQuote.trim()
        ? {
            author:
              form.clientName.trim() ||
              editingProfile?.testimonial?.author ||
              "Đại diện khách hàng",
            position:
              editingProfile?.testimonial?.position || "Đại diện Ban tổ chức",
            company: form.company.trim(),
            quote: form.testimonialQuote.trim(),
            rating: 5,
          }
        : editingProfile?.testimonial,
      seoMeta: {
        suggestedKeyword:
          form.suggestedKeyword.trim() ||
          `tổ chức ${categoryLabel.toLowerCase()} trọn gói`,
        suggestedSlug:
          editingProfile?.seoMeta?.suggestedSlug ||
          `ho-so-du-an-${form.category}`,
        generatedPostSlug: editingProfile?.seoMeta?.generatedPostSlug,
        isGenerated: editingProfile?.seoMeta?.isGenerated ?? false,
        lastGeneratedAt: editingProfile?.seoMeta?.lastGeneratedAt,
      },
      isAutoSynced: editingProfile?.isAutoSynced ?? false,
      sourceLeadId: editingProfile?.sourceLeadId,
      sourceChannel: editingProfile?.sourceChannel,
      rawLeadData: editingProfile?.rawLeadData,
    };

    onSave(payload, editingProfile?.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {isEditing ? "Chỉnh sửa hồ sơ sự kiện" : "Thêm hồ sơ sự kiện mới"}
            </h3>
            <p className="text-xs text-slate-600">
              Điền thông tin thật để dùng làm minh chứng khi Radar SEO viết bài.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {formError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 font-semibold text-rose-800">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Tên sự kiện thực tế (*)
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="VD: Lễ Khai Trương Chi Nhánh Tập Đoàn ABC - 300 Khách"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none focus:border-[#0B1536]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Phân loại sự kiện
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as EventCategory })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Không gian tổ chức
              </label>
              <select
                value={form.venueType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    venueType: e.target.value as "indoor" | "outdoor",
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              >
                <option value="indoor">Trong nhà / Hội trường / Ballroom</option>
                <option value="outdoor">Ngoài trời / Resort / Bãi biển</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Công ty / Đơn vị thuê (*)
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="VD: Công ty Cổ phần XYZ"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Người đại diện & SĐT
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="Tên đại diện"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
                />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Số điện thoại"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Địa điểm tổ chức (*)
              </label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="VD: Trung tâm Hội nghị Quốc gia"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tỉnh / Thành phố
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="VD: Hà Nội"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ngày diễn ra & Số khách
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
                />
                <input
                  type="number"
                  min={10}
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                  placeholder="Số khách"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tổng ngân sách & Chi phí (VNĐ)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={form.totalBudget}
                  onChange={(e) => setForm({ ...form, totalBudget: e.target.value })}
                  placeholder="Tổng thu"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
                />
                <input
                  type="number"
                  min={0}
                  value={form.actualCost}
                  onChange={(e) => setForm({ ...form, actualCost: e.target.value })}
                  placeholder="Chi phí vốn"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Biên lợi nhuận ước tính: {previewMargin}%
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Từ khóa SEO gợi ý (gắn trực tiếp với Radar SEO)
              </label>
              <input
                type="text"
                value={form.suggestedKeyword}
                onChange={(e) =>
                  setForm({ ...form, suggestedKeyword: e.target.value })
                }
                placeholder="VD: tổ chức lễ khai trương showroom ô tô trọn gói"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Đường dẫn ảnh bìa hiện trường
              </label>
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SAMPLE_COVER_OPTIONS.map((sample) => (
                  <button
                    key={sample.url}
                    type="button"
                    onClick={() => setForm({ ...form, coverImage: sample.url })}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Điểm nhấn sự kiện (mỗi dòng 1 ý)
              </label>
              <textarea
                rows={3}
                value={form.highlightsText}
                onChange={(e) =>
                  setForm({ ...form, highlightsText: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Thiết bị triển khai (mỗi dòng 1 mục)
              </label>
              <textarea
                rows={3}
                value={form.equipmentText}
                onChange={(e) =>
                  setForm({ ...form, equipmentText: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Phản hồi khách hàng (tùy chọn)
              </label>
              <input
                type="text"
                value={form.testimonialQuote}
                onChange={(e) =>
                  setForm({ ...form, testimonialQuote: e.target.value })
                }
                placeholder="Trích dẫn đánh giá thực tế sau sự kiện..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#0B1536] hover:bg-[#132252] text-white text-xs font-bold cursor-pointer"
          >
            {isEditing ? "Lưu cập nhật" : "Lưu hồ sơ sự kiện"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================================
 * 4. MODAL THỐNG KÊ NHANH KHI BẤM VÀO 4 THẺ CHỈ SỐ
 * ========================================================================== */
export function MetricBreakdownModal({
  metricType,
  profiles,
  onClose,
  onFilterPendingSeo,
}: {
  metricType: MetricModalType;
  profiles: EventProfile[];
  onClose: () => void;
  onFilterPendingSeo: () => void;
}) {
  if (!metricType) return null;

  const titles: Record<Exclude<MetricModalType, null>, string> = {
    total: "Chi tiết nguồn gốc hồ sơ sự kiện",
    revenue: "Chi tiết doanh thu hợp đồng theo dự án",
    guests: "Quy mô khách mời đã phục vụ",
    seo: "Tiến độ chuyển hóa hồ sơ thành bài viết SEO",
  };

  const pendingSeoCount = profiles.filter((p) => !p.seoMeta?.isGenerated).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[82vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <h3 className="text-base font-extrabold text-slate-900">
            {titles[metricType]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2 px-3 font-bold">Sự kiện</th>
                  <th className="py-2 px-3 font-bold">Khách mời</th>
                  <th className="py-2 px-3 font-bold">Ngân sách</th>
                  <th className="py-2 px-3 font-bold">Trạng thái SEO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      <div>{p.title}</div>
                      <div className="text-[11px] font-normal text-slate-500">
                        {p.client.company} · {p.isAutoSynced ? "Từ CRM" : "Thủ công"}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                      {p.guestCount.toLocaleString("vi-VN")} khách
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {formatVND(p.financials.totalBudget)}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.seoMeta?.isGenerated
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {p.seoMeta?.isGenerated ? "Đã có bài SEO" : "Chưa viết SEO"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-600">
            Còn {pendingSeoCount} hồ sơ chưa tạo bài viết SEO.
          </span>
          <div className="flex items-center gap-2">
            {metricType === "seo" && pendingSeoCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onFilterPendingSeo();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#0B1536] hover:bg-[#132252] text-white text-xs font-bold cursor-pointer"
              >
                Lọc hồ sơ chưa viết SEO
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

